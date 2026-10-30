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

构建结果位于 `dist/`。资源使用相对路径，可部署到静态托管服务或 GitHub Pages 的项目路径。上传源码到 GitHub 不会自动发布网站。

## 文件说明

- `index.html`：首页定位和经历导航。
- `main.js`：物品布局、介绍文案、交互与动效。
- `data.js`：详细经历与项目资料。
- `assets.js`、`assets/`：物品图像与裁切配置。
- `style.css`、`continuous.css`、`approved.css`：基础布局、连续展览和图像展示。
- `hover-story.css`、`about.css`、`archive.css`：经历详情、About Me 和详细资料样式。

## 交互

- 首页包内物品及经历导航定位到对应的独立物品。
- 悬停或键盘聚焦时，X-ray 图像切换为真实材质，并显示经历详情。
- 物品与日期基线保持固定，详情根据实际文字高度预留空间。
- About Me 介绍与联系邮箱常驻显示。
- 支持窄屏展示及减少动态效果的系统偏好。
