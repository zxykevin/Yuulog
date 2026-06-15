# R2 图库工作流

图库使用 Cloudflare R2 存放大部分照片，避免在 Git 仓库中提交大量原图和处理后的图片。站点仅在 `src/data/galleries.ts` 中维护相册资料和公开图片 URL。

## R2 配置

- 推荐 Bucket：`yuulog-gallery`
- 推荐公开域名：`img.yuulog.org`
- 推荐路径结构：

```text
gallery/<album-slug>/001.webp
gallery/<album-slug>/002.webp
gallery/<album-slug>/003.webp
```

不要创建 `full/` 或 `thumb/` 目录。

## 准备图片

将相册原图放入：

```text
photos/raw/<album-slug>/
```

运行批量压缩：

```sh
pnpm gallery:prepare <album-slug>
```

脚本会自动校正照片方向，将最长边限制为 1200px，以 WebP quality 82 输出到 `photos/processed/<album-slug>/`，并统一命名为 `001.webp`、`002.webp` 等。

## 上传到 R2

使用配置好的 rclone remote 上传：

```sh
rclone copy photos/processed/<album-slug> r2:yuulog-gallery/gallery/<album-slug> --progress
```

## 在站点中引用

在 `src/data/galleries.ts` 中使用统一 helper：

```ts
r2GalleryImage("2026-japan-numazu", "001.webp")
```

相册的 `cover` 和每张照片的 `src` 都可以使用该 helper。每张图片必须填写 `alt`，并建议填写便于后续修改的 `caption`。

## 安全与版本控制

不要提交 `photos/raw/` 中的原图，不要提交 `photos/processed/` 中的批量处理图片，也不要提交任何 Cloudflare Access Key、Secret Key 或 API Token。
