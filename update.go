package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"reflect"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
)

type Region struct {
	Abbr string
	Name string
}

type ChaziyuResponse struct {
	Status bool   `json:"status"`
	Code   int    `json:"code"`
	Msg    string `json:"msg"`
	Data   struct {
		Result []string `json:"result"`
	} `json:"data"`
}

type DnsDetectResponse struct {
	Status int    `json:"status"`
	Error  string `json:"error"`
	Data   struct {
		Subdomains []string `json:"subdomains"`
	} `json:"data"`
}

var (
	cdnHostPattern   = regexp.MustCompile(`^[a-zA-Z0-9-]+\.(?:bilivideo\.(?:com|cn)|akamaized\.net)$`)
	regionPatternMap = []Region{
		{Abbr: "-bj", Name: "北京"},
		{Abbr: "-sh-", Name: "上海"},
		{Abbr: "-gd", Name: "广东"},
		{Abbr: "-sz-", Name: "深圳"},
		{Abbr: "-fj", Name: "福建"},
		{Abbr: "-hbsjz-", Name: "河北"},
		{Abbr: "-hblf-", Name: "河北"},
		{Abbr: "-hlj", Name: "黑省"},
		{Abbr: "-hnzz-", Name: "河南"},
		{Abbr: "-hbwh-", Name: "湖北"},
		{Abbr: "-hbyc-", Name: "湖北"},
		{Abbr: "-hncs-", Name: "湖南"},
		{Abbr: "-jsnj-", Name: "江苏"},
		{Abbr: "-jssz-", Name: "江苏"},
		{Abbr: "-jx", Name: "江西"},
		{Abbr: "-ln", Name: "辽宁"},
		{Abbr: "-nmg", Name: "内蒙"},
		{Abbr: "-sd", Name: "山东"},
		{Abbr: "-sxty-", Name: "山西"},
		{Abbr: "-sxxa-", Name: "陕西"},
		{Abbr: "-sc", Name: "四川"},
		{Abbr: "-cq", Name: "重庆"},
		{Abbr: "-tj-", Name: "天津"},
		{Abbr: "-xj-", Name: "新疆"},
		{Abbr: "-zj", Name: "浙江"},
		{Abbr: "-gotcha", Name: "外建"},
		{Abbr: "-hk-", Name: "香港"},
		{Abbr: "-kaigai-", Name: "海外"},
	}

	kaigaiCdnList = []string{
		"upos-hz-mirrorakam.akamaized.net",
		"upos-sz-mirroraliov.bilivideo.com",
		"upos-sz-mirrorcosov.bilivideo.com",
		"upos-sz-mirror08h.bilivideo.com",
	}

	fuzhouCdnList = []string{
		"cn-fjfz-fx-01-01.bilivideo.com",
		"cn-fjfz-fx-01-02.bilivideo.com",
		"cn-fjfz-fx-01-03.bilivideo.com",
		"cn-fjfz-fx-01-04.bilivideo.com",
		"cn-fjfz-fx-01-05.bilivideo.com",
		"cn-fjfz-fx-01-06.bilivideo.com",
	}

	cdnMap = make(map[string][]string)
)

func normalizeSubdomain(subDomain string) string {
	subDomain = strings.TrimSpace(subDomain)
	if subDomain == "" || strings.Contains(subDomain, ".") {
		return subDomain
	}
	return subDomain + ".bilivideo.com"
}

func isUnsafeCdnNode(subDomain string) bool {
	subDomain = strings.ToLower(subDomain)
	return strings.Contains(subDomain, "origin") || strings.Contains(subDomain, "all")
}

func addCdnNode(region string, subDomain string) bool {
	if !validCdnHost(subDomain) {
		return false
	}
	if isUnsafeCdnNode(subDomain) {
		return false
	}
	for _, existing := range cdnMap[region] {
		if existing == subDomain {
			return false
		}
	}
	cdnMap[region] = append(cdnMap[region], subDomain)
	return true
}

// 只接收合法媒体域名，外部抓取结果不能写入任意地址。
func validCdnHost(host string) bool {
	return cdnHostPattern.MatchString(host) && !isUnsafeCdnNode(host)
}

func mergeCdnData(data map[string][]string) int {
	allowed := make(map[string]bool)
	for _, region := range regionPatternMap {
		allowed[region.Name] = true
	}
	added := 0
	for region, nodes := range data {
		if allowed[region] {
			added += addCdnNodes(region, nodes)
		}
	}
	return added
}

func fetchUpstreamData() (map[string][]string, error) {
	url := os.Getenv("CCB_UPSTREAM_URL")
	if url == "" {
		url = "https://raw.githubusercontent.com/Kanda-Akihito-Kun/ccb/main/data/cdn.json"
	}
	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("上游返回 HTTP %d", resp.StatusCode)
	}
	var data map[string][]string
	if err := json.NewDecoder(io.LimitReader(resp.Body, 2<<20)).Decode(&data); err != nil {
		return nil, err
	}
	count := 0
	for _, nodes := range data {
		for _, node := range nodes {
			if !validCdnHost(node) {
				return nil, fmt.Errorf("上游包含无效节点: %s", node)
			}
			count++
		}
	}
	if count < 50 {
		return nil, fmt.Errorf("上游有效节点数量过少: %d", count)
	}
	return data, nil
}

func addCdnNodes(region string, subDomains []string) int {
	added := 0
	for _, subDomain := range subDomains {
		if addCdnNode(region, subDomain) {
			added++
		}
	}
	return added
}

func removeUnsafeCdnNodes() int {
	removed := 0
	for region, nodes := range cdnMap {
		kept := nodes[:0]
		for _, node := range nodes {
			if isUnsafeCdnNode(node) {
				removed++
				continue
			}
			kept = append(kept, node)
		}
		cdnMap[region] = kept
	}
	return removed
}

func matchSubDomainsToRegion(subDomains []string) int {
	added := 0
	for _, rawSubDomain := range subDomains {
		subDomain := normalizeSubdomain(rawSubDomain)
		for _, v := range regionPatternMap {
			if strings.Contains(subDomain, v.Abbr) {
				if addCdnNode(v.Name, subDomain) {
					added++
				}
				break
			}
		}
	}
	return added
}

func fetchChaziyuSubDomains() ([]string, error) {
	var subDomains []string

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	ctx, cancel = context.WithTimeout(ctx, 120*time.Second)
	defer cancel()

	for i := 0; i < 20; i++ {
		if i > 0 {
			time.Sleep(2 * time.Second)
		}

		url := fmt.Sprintf("https://chaziyu.com/ipchaxun.do?domain=bilivideo.com&page=%d", i)
		var rawJSON string

		err := chromedp.Run(ctx,
			chromedp.Navigate(url),
			chromedp.WaitVisible("body", chromedp.ByQuery),
			chromedp.Sleep(3*time.Second),
			chromedp.Evaluate(`document.body.innerText`, &rawJSON),
		)
		if err != nil {
			log.Printf("chaziyu 浏览器请求失败 [%d]: %v", i, err)
			continue
		}

		rawJSON = strings.TrimSpace(rawJSON)
		if rawJSON == "" {
			log.Printf("chaziyu 页面内容为空 [%d]", i)
			continue
		}

		var response ChaziyuResponse
		if err := json.Unmarshal([]byte(rawJSON), &response); err != nil {
			log.Printf("解析 chaziyu JSON 失败 [%d]: %v", i, err)
			continue
		}
		if !response.Status && response.Code != 0 {
			log.Printf("chaziyu 接口返回异常 [%d]: code=%d msg=%s", i, response.Code, response.Msg)
			continue
		}

		subDomains = append(subDomains, response.Data.Result...)
		log.Printf("chaziyu 第 %d 页获取 %d 个子域", i, len(response.Data.Result))
	}

	if len(subDomains) < 50 {
		return nil, fmt.Errorf("chaziyu 子域数量过少: %d", len(subDomains))
	}
	return subDomains, nil
}

func fetchSrcLabSubDomains() ([]string, error) {
	url := "https://srclab.cn/api/server/dnsDetect/?domain=bilivideo.com"
	client := &http.Client{Timeout: 15 * time.Second}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("srclab 响应状态异常: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response DnsDetectResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}
	if response.Status != 1 {
		if response.Error != "" {
			return nil, errors.New(response.Error)
		}
		return nil, fmt.Errorf("srclab 状态异常: %d", response.Status)
	}
	if len(response.Data.Subdomains) < 50 {
		return nil, fmt.Errorf("srclab 子域数量过少: %d", len(response.Data.Subdomains))
	}

	return response.Data.Subdomains, nil
}

func fetchSubDomains() ([]string, error) {
	if subDomains, err := fetchChaziyuSubDomains(); err == nil {
		return subDomains, nil
	} else {
		log.Printf("chaziyu 更新失败，尝试 srclab: %v", err)
	}

	if subDomains, err := fetchSrcLabSubDomains(); err == nil {
		return subDomains, nil
	} else {
		return nil, err
	}
}

func readExistingCdnData() error {
	body, err := os.ReadFile("data/cdn.json")
	if err != nil {
		return err
	}
	if len(strings.TrimSpace(string(body))) == 0 {
		return nil
	}
	return json.Unmarshal(body, &cdnMap)
}

func writeJson(path string, data interface{}) {
	body, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		log.Fatalf("序列化 %s 失败: %v", path, err)
	}
	body = append(body, '\n')
	if err := os.WriteFile(path, body, 0644); err != nil {
		log.Fatalf("保存 %s 失败: %v", path, err)
	}
}

func runUpdate() string {
	cdnMap = make(map[string][]string)
	if err := readExistingCdnData(); err != nil {
		log.Printf("读取现有 data/cdn.json 失败，将仅在接口成功时生成新数据: %v", err)
	}
	before := make(map[string][]string)
	for region, nodes := range cdnMap {
		before[region] = append([]string(nil), nodes...)
	}
	if removed := removeUnsafeCdnNodes(); removed > 0 {
		log.Printf("已移除 %d 个包含 origin/all 的危险节点", removed)
	}

	fetchSucceeded := false
	if os.Getenv("CCB_OFFLINE") != "1" {
		if data, err := fetchUpstreamData(); err == nil {
			fetchSucceeded = true
			log.Printf("已取得有效上游数据，新增 %d 个节点", mergeCdnData(data))
		} else {
			log.Printf("上游数据不可用，保留本地快照: %v", err)
		}
	}
	// 维护的镜像列表可离线使用，不依赖子域查询网站或 Chrome。
	if body, err := os.ReadFile("data/mirrors.json"); err == nil {
		var maintained map[string][]string
		if json.Unmarshal(body, &maintained) == nil {
			log.Printf("合并维护镜像列表，新增 %d 个节点", mergeCdnData(maintained))
		}
	}
	// 第三方发现仅在手动明确开启时使用，失败不阻塞正常更新。
	if os.Getenv("CCB_DISCOVER") == "1" && os.Getenv("CCB_OFFLINE") != "1" {
		if subDomains, err := fetchSubDomains(); err == nil {
			fetchSucceeded = true
			log.Printf("补充发现新增 %d 个节点", matchSubDomainsToRegion(subDomains))
		} else {
			log.Printf("补充发现失败，保留已有节点: %v", err)
		}
	}

	if len(cdnMap) == 0 {
		log.Fatal("没有可用节点快照")
	}

	for region := range cdnMap {
		sort.Strings(cdnMap[region])
	}

	var regionList []string
	seenRegions := make(map[string]bool)
	for _, v := range regionPatternMap {
		if seenRegions[v.Name] {
			continue
		}
		regionList = append(regionList, v.Name)
		seenRegions[v.Name] = true
	}

	changed := !reflect.DeepEqual(before, cdnMap)
	if !changed {
		if fetchSucceeded {
			log.Print("有效来源检查成功，节点无变化，不重写数据或成功时间")
			return "unchanged"
		}
		log.Print("未取得新的有效外部数据，保留已有快照及成功时间")
		return "preserved"
	}
	if err := os.MkdirAll("data", 0755); err != nil {
		log.Fatal(err)
	}
	writeJson("data/cdn.json", cdnMap)
	writeJson("data/region.json", regionList)

	if fetchSucceeded {
		info := map[string]interface{}{
			"lastSuccessTime": time.Now().Format(time.RFC3339),
		}
		writeJson("data/info.json", info)
	}
	return "updated"
}

func main() {
	status := runUpdate()
	if path := os.Getenv("GITHUB_OUTPUT"); path != "" {
		f, err := os.OpenFile(path, os.O_APPEND|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal(err)
		}
		defer f.Close()
		fmt.Fprintf(f, "status=%s\n", status)
	}
	log.Printf("更新结果: %s", status)
}
