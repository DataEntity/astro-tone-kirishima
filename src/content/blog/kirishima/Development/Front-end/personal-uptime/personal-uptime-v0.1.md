---
title: "Personal-Uptime v0.1: Wallpaper Engine 運維 HUD"
pubDate: 2026-06-17
author: Kirishima
category: Development
# tags:
#   - development
#   - front-end
#   - Personal-Uptime
#   - Wallpaper-Engine
#   - devops
#   - open-source
---

算是這個博客第一篇正式開發日志. 我開了個新項目 [Personal-Uptime](https://github.com/DataEntity/Personal-Uptime), 基於 Wallpaper Engine 的個人運維 HUD 壁紙 - 在桌面右下角以 ASCII 終端風格展示服務器的 CPU, 内存, SSD 與運行時間. 目前是 v0.1 階段, 如果有興趣請移步 GitHub repo.

## v0.1 已完成

- ASCII 進度條 HUD 面板 (█░ 字符繪製)
- 四象限壁紙畫布布局 (當前僅啟用右下象限)
- 階段一數據契約: `cpu` / `memory` / `disk` / `uptime` / `updatedAt`
- 數據層與 UI 徹底解耦 (可插拔 `StatusLoader`)
- `mock` / `live` / `auto` 三種數據模式
- 靜態導出 (`out/`), 可導入 Wallpaper Engine

## 後續版本

- 服務列表 (Docker / Node 等) - 階段二
- Git 開發活動 - 階段三
- 日誌聚合 / AI 日報 - 階段四, 五
- 壁紙背景圖, 動效
- systemd 常駐, 多機配置化
