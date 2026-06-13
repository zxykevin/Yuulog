---
title: "YuuComments v0.1.5：标记垃圾并封禁来源"
published: 2026-06-13
tags:
  - YuuComments
  - Cloudflare Workers
  - Cloudflare D1
  - 静态博客
  - 评论系统
category: 技术笔记
---

YuuComments v0.1.5 已经发布。这次更新聚焦于后台审核流程：管理员发现垃圾评论后，不仅可以将评论标记为垃圾，还可以直接封禁它的来源，阻止同一来源继续提交新评论。

相比单纯删除或隐藏评论，v0.1.5 补齐了从“发现垃圾内容”到“阻止来源再次提交”的审核闭环，同时保持了 YuuComments 轻量、无复杂依赖的设计。

## 标记垃圾并封禁来源

Admin 评论管理新增了 **Mark spam & ban / 标记垃圾并封禁** 操作。点击后会打开按钮式确认对话框，管理员可以选择封禁目标：

- **Device fingerprint**：封禁同一浏览器或设备，默认推荐选项。
- **IP hash**：封禁对应 IP hash，可能影响同一网络中的其他用户。
- **Both**：同时封禁设备指纹和 IP hash，适合明显的垃圾广告或机器人滥用。

封禁原因提供 Spam、Ads、Bot、Abuse、Offensive 和 Other 等预设，不再需要手动输入固定格式的内容。确认后，评论会被标记为 `spam`，可用的来源信息会写入封禁记录。

对于没有设备指纹的旧评论，后台仍然可以正常将其标记为垃圾，并清楚提示无法完成的封禁部分。

## 提交评论前检查封禁

v0.1.5 新增了 `comment_bans` 表，并为评论增加 `device_fingerprint` 字段。新评论提交前，Worker 会检查：

- 当前请求的 IP hash 是否处于有效封禁中；
- 前端提交的设备指纹 hash 是否处于有效封禁中。

命中任一有效封禁时，后端会在创建评论前返回 `403`，避免垃圾评论进入数据库。

设备指纹由浏览器端使用用户代理、语言、屏幕信息和时区等基础信息组合后进行 SHA-256 计算。后端只接收最终 hash，不接收原始设备信息，也没有引入第三方追踪库。

## 独立的封禁来源管理

Admin 后台新增了 **Bans / 封禁来源** 页面，用于查看和解除已有封禁。每条记录会显示类型、短 hash、原因、来源评论、创建时间、过期时间和当前状态。

当同一次操作选择 **Both** 时，相关的 IP 与设备封禁会在界面中合并为一张卡片，减少重复信息。管理员也可以通过卡片上的 Unban 操作解除对应封禁。

本次新增的 Admin API：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/api/admin/comments/:id/spam-ban` | 标记评论为垃圾并封禁来源 |
| `GET` | `/api/admin/bans` | 获取封禁来源列表 |
| `DELETE` | `/api/admin/bans/:id` | 解除封禁 |

## Admin 中英文切换

后台新增了中文和英文界面，并提供语言切换按钮。语言偏好会保存在浏览器本地，评论管理、举报管理、封禁管理和 Spam & Ban 对话框均会使用所选语言。

## 安全边界

来源封禁是实用的审核工具，但并不是完整的身份识别系统：

- 设备指纹可能被伪造、清除或省略；
- IP hash 封禁可能影响共享同一出口网络的用户；
- 未加盐的 IP hash 不能视为匿名数据；
- 项目仍保留原始 IP 字段以兼容现有部署。

因此，建议管理员优先使用设备指纹封禁，并只在明确的垃圾广告或机器人滥用场景下使用 IP 封禁或 Both。

## 升级与部署

已有部署在使用 Spam & Ban 前，需要先应用新的 D1 migration：

```bash
pnpm db:migrate:remote
pnpm deploy:backend
```

随后重新发布 `dist/frontend` 和 `dist/admin`。新部署通过最新 schema 创建数据库时，会直接包含封禁表和设备指纹字段。

本次更新没有改变公开评论列表只返回 `approved` 评论的逻辑，也没有影响举报、五次举报转回 pending、Turnstile、Markdown、LaTeX、回复和点赞等现有功能。

YuuComments v0.1.5 已发布，完整变更与升级说明可查看 [GitHub Release v0.1.5](https://github.com/zxykevin/YuuComments/releases/tag/v0.1.5)。
