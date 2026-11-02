# KK Portfolio

孔令楠（KK）的 AI 产品经理个人网站。通过 X-ray 旅行包与横向物品展览，展示教育、产品实践、模型研究与创业经历。

## 本地运行

需要 Node.js 20.19 或更新版本及 npm。首次安装：

```sh
npm ci
npm run dev
```

按终端输出的本地地址打开页面。

## 构建与预览

```sh
npm run build
npm run preview
```

构建结果位于 `dist/`，资源使用相对路径。

## 图片优化

页面使用 `assets/optimized/` 中预先裁切、去白底并压缩的 WebP 图片。首屏优先加载 X-ray 图，真实材质在首屏图片解码后预加载；后续展览接近可视区域时加载。

修改原始素材或 `artwork-source.js` 中的裁切范围后，运行：

```sh
npm run optimize:assets
```

将生成的 WebP 和 `artwork-manifest.js` 一并保存。320 / 940 尺寸由浏览器根据展示宽度与屏幕像素密度选择，旅行包另提供 640 / 1254 尺寸。原始素材保留用于重新生成，访客浏览时无需进行 Canvas 裁切或逐像素去白底。

## GitHub Pages 部署

启用并成功部署后的地址：https://kkkong6.github.io/kkportfolio/

首次配置：

1. 将 `.github/workflows/deploy-pages.yml` 提交并推送到 GitHub。
2. 在仓库的 **Settings → Pages → Build and deployment** 中，将 **Source** 设置为 **GitHub Actions**。
3. 在 **Actions → Deploy GitHub Pages → Run workflow** 中选择 `main`，运行部署。

之后每次推送到 `main` 都会自动构建并更新 GitHub Pages，也可以在 Actions 页面手动运行。工作流将 Vite 构建生成的 `dist/` 发布到 Pages；相对资源路径兼容 `/kkportfolio/` 子路径。

## Vercel 手动部署

线上地址：https://kkprofile.vercel.app

已断开 Vercel 的 GitHub 自动部署连接。推送到 GitHub 不会更新 Vercel 网站。只有明确确认「发布上线」后，才执行 Vercel 手动部署：

```sh
npx vercel deploy --prod --project kkprofile
```

部署使用 Vite，构建命令为 `npm run build`，输出目录为 `dist/`。

## 检查

```sh
npm test
```

覆盖外围白底透明化、内部白色保留和边缘彩色物体保护。

## 文件说明

- `index.html`：首页定位和经历导航。
- `main.js`：物品布局、介绍文案、交互与动效。
- `data.js`：详细经历与项目资料。
- `assets.js`、`assets/`：物品图像与裁切配置。
- `asset-renderer.js`：完整解码后按像素裁切图像，清除与外边缘连通的白底，并缓存裁切结果。
- `style.css`、`continuous.css`、`approved.css`：基础布局、连续展览和图像展示。
- `hover-story.css`、`about.css`、`archive.css`：经历详情、About Me 和详细资料样式。

## 交互

- 首页包内物品及经历导航定位到对应的独立物品。
- 悬停或键盘聚焦时，X-ray 图像切换为真实材质，并显示经历详情。
- 物品与日期基线保持固定，详情根据实际文字高度预留空间。
- About Me 介绍与联系邮箱常驻显示。
- 支持窄屏展示及减少动态效果的系统偏好。
