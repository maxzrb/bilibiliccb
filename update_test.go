package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func setupUpdate(t *testing.T) []byte {
	t.Helper()
	t.Chdir(t.TempDir())
	t.Setenv("CCB_DISCOVER", "0")
	t.Setenv("CCB_OFFLINE", "0")
	if err := os.Mkdir("data", 0755); err != nil {
		t.Fatal(err)
	}
	initial := []byte(`{"深圳":["upos-sz-mirrorali.bilivideo.com"]}`)
	if err := os.WriteFile(filepath.Join("data", "cdn.json"), initial, 0644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join("data", "info.json"), []byte(`{"lastSuccessTime":"2026-01-01T00:00:00Z"}`), 0644); err != nil {
		t.Fatal(err)
	}
	return initial
}

func TestAllSourcesFailPreservesSnapshot(t *testing.T) {
	initial := setupUpdate(t)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(503) }))
	defer server.Close()
	t.Setenv("CCB_UPSTREAM_URL", server.URL)
	if status := runUpdate(); status != "preserved" {
		t.Fatalf("来源失败却报告 %s", status)
	}
	got, err := os.ReadFile("data/cdn.json")
	if err != nil || string(got) != string(initial) {
		t.Fatal("来源失败改写了已有节点")
	}
	info, _ := os.ReadFile("data/info.json")
	if string(info) != `{"lastSuccessTime":"2026-01-01T00:00:00Z"}` {
		t.Fatal("来源失败伪造了成功时间")
	}
}

func TestUpdateAndNoChange(t *testing.T) {
	setupUpdate(t)
	data := map[string][]string{"深圳": {"upos-sz-mirrorali.bilivideo.com"}}
	for i := 0; i < 50; i++ {
		data["深圳"] = append(data["深圳"], fmt.Sprintf("cn-sz-ct-%02d.bilivideo.com", i))
	}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { json.NewEncoder(w).Encode(data) }))
	defer server.Close()
	t.Setenv("CCB_UPSTREAM_URL", server.URL)
	if status := runUpdate(); status != "updated" {
		t.Fatalf("首次更新结果 %s", status)
	}
	info, _ := os.ReadFile("data/info.json")
	if status := runUpdate(); status != "unchanged" {
		t.Fatalf("无变化时结果 %s", status)
	}
	after, _ := os.ReadFile("data/info.json")
	if string(info) != string(after) {
		t.Fatal("无变化时重写成功时间")
	}
}

func TestMalformedSourceIsNotSuccess(t *testing.T) {
	setupUpdate(t)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, `{"深圳":["evil.example"]}`) }))
	defer server.Close()
	t.Setenv("CCB_UPSTREAM_URL", server.URL)
	if status := runUpdate(); status != "preserved" {
		t.Fatalf("无效来源报告 %s", status)
	}
}

func TestMaintainedMirrorsWorkOffline(t *testing.T) {
	setupUpdate(t)
	t.Setenv("CCB_OFFLINE", "1")
	if err := os.WriteFile("data/mirrors.json", []byte(`{"深圳":["upos-sz-mirrorcos.bilivideo.com","evil.example"]}`), 0644); err != nil {
		t.Fatal(err)
	}
	if status := runUpdate(); status != "updated" {
		t.Fatalf("维护节点未合并: %s", status)
	}
	if len(cdnMap["深圳"]) != 2 {
		t.Fatal("无效域名被写入快照")
	}
}
