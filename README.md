# KK Profile

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

## 自动部署

线上地址：https://kkprofile.vercel.app

GitHub 仓库已关联 Vercel。将修改提交并推送到 `main` 分支后，Vercel 会自动构建并更新线上网站。仅在本地修改不会影响线上内容。

部署使用 Vite，构建命令为 `npm run build`，输出目录为 `dist/`。

提交作者需使用关联 GitHub 账号的邮箱，否则 Vercel 会阻止私有仓库的自动部署。当前账号可使用 GitHub 隐私邮箱 `267855816+kkkong6@users.noreply.github.com`。

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
