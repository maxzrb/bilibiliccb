# Custom CDN of Bilibili (CCB) - 修改哔哩哔哩的网页视频、直播、番剧的播放源

> **这是 [原项目](https://github.com/Kanda-Akihito-Kun/ccb) 的 Fork 版本。**
>
> 原作者：[鼠鼠今天吃嘉然](https://space.bilibili.com/3220012)（[Kanda-Akihito-Kun](https://github.com/Kanda-Akihito-Kun)）
> Fork 作者：AreithDream（[maxzrb](https://github.com/maxzrb)）
>
> **Fork 版主要改进见下方「Fork 更新」章节。**

## 项目介绍

**支持自定义切换 B 站的播放源地址。**

**注意: 安装后请点击插件设置面板, 进行节点配置操作**

---

## Fork 更新 (v2.2.0)

相比原版 v2.0.2，本 Fork 做了以下改进：

### 1. 数据内嵌，摆脱 GitHub Pages 依赖
- 502 个 CDN 节点 + 25 个地区数据直接编译进脚本
- 原版依赖 `kanda-akihito-kun.github.io`，国内部分地区（福建、河南等）无法访问
- 启动即用，无需等待网络请求，后台静默从 jsDelivr / GitHub Pages 增量更新

### 2. 智能运营商匹配
- 自动识别 CDN 节点名中的运营商标记（`ct`=电信、`cu`=联通、`cm`=移动）
- 面板新增运营商筛选下拉框
- 节点列表按运营商排序，同运营商优先

### 3. CDN 节点测速
- 每个地区面板自带 `⚡ 测速` 按钮，并发测试所有节点延迟
- `🌐 测试全部地区` 全局测速，每个地区抽代表节点，结果按延迟排名
- 测速时实时显示每个节点的延迟，测完自动同步到下拉框选项
- 自动选中延迟最低的节点

### 4. 视频内容验活
- 拦截 B 站 playurl 响应，提取真实视频分片路径
- 对测速最快的节点发 GET 请求验证是否真的缓存了该视频
- 下拉框显示 `✅ 有内容` / `🚫 无内容` 标记
- 优先选择延迟低且确认有内容的节点

### 5. 备份节点多样化（修复强力模式致命缺陷）
- 原版强力模式把所有 `backup_url` 替换为同一个节点 → 该节点无内容就彻底失败
- 修复后：`base_url` 用首选节点，`backup_url` 用同地区不同节点做容灾
- 保留 B 站原有的多 CDN 故障转移能力

### 6. 节点失败追踪
- 选中节点后出现 `🚫` 拉黑按钮
- 播放失败时点击标记，失败 ≥2 次的节点自动跳过
- 下拉框显示失败计数 `×2`

### 7. 构建系统
- `python script/build.py` 一键构建，把 `data/*.json` 内嵌进脚本
- 输出 `script/ccb.bundle.user.js`，直接安装到 Tampermonkey

---

## 快速说明

1. 适用范围：网页端 B 站的 **[普通视频、充电视频、直播间、番剧、稍后再看、测速]**；
2. 使用方法：浏览器右上角 → 油猴插件设置 → 点击 `📺CCB` 打开设置面板；
3. 开关说明：
    - **强力替换模式（建议开启）**：强制切换播放源，保留 `backup_url` 多样性做容灾；
    - **适用直播和番剧**：开启后对直播间及番剧生效；
4. 番剧页面：需要在油猴设置中关闭"只适用于 top 框架"，详见原版文档；
5. **改完记得点"应用并刷新"**；

---

## 关于番剧页面

同原版文档。

---

## 关于测速

本 Fork 版内置了 CDN 节点测速和视频内容验活功能，详见「Fork 更新」章节。

测速使用 `fetch` no-cors 模式测量 TCP+TLS 连接延迟，对 B 站服务器产生的额外流量极小。

---

## 构建方式

```bash
# 安装依赖：Python 3

# 构建脚本
python script/build.py

# 输出文件
script/ccb.bundle.user.js   # 直接拖入 Tampermonkey 安装
```

---

## 项目结构

1. `script/` — 前端脚本（ccb.js 模板 + build.py 构建脚本）
2. `server/` — 后端服务（原作者提供，Fork 未改动）
3. `data/` — CDN 节点和地区数据（由 GitHub Actions 定时更新）
4. `.github/` — CI/CD workflow

---

## 原项目地址

https://github.com/Kanda-Akihito-Kun/ccb

## Fork 地址

https://github.com/maxzrb/ccb

---

## 致谢

感谢原作者 [鼠鼠今天吃嘉然](https://space.bilibili.com/3220012) 的开源贡献。
