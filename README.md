# 线性代数习题精选精解 · 刷题版（吉米多维奇）

基于《线性代数习题精选精解》制作的纯静态刷题网站。全书六章、题目与解析完整收录，
原书目录 1:1 还原，数学公式使用 KaTeX 精确排版。

## 在线访问

**https://jlshdsdk.github.io/jimidovich-linear-algebra/**

## 功能

- **目录 1:1**：章、节层级与原书完全一致，节内按【章.题】编号顺序排列
- **题目+解析**：每题完整题干与逐步解答，最终答案绿色高亮
- **知识点+题型**：原书知识要点、题型方法技巧同步收录
- **刷题进度**：每题可"标记已做"，进度保存在浏览器本地存储（localStorage），刷新不丢失
- **夜间模式**：一键切换深色护眼主题
- **快速定位**：左侧栏小节导航 + 题号九宫格；键盘 ←/→ 切换上一题/下一题
- **公式渲染**：KaTeX 本地化加载，视口外懒渲染，长章节页面依旧流畅
- **纯静态**：无框架、无后端、无追踪，原生 HTML/CSS/JS

## 文件结构

```
├── index.html            # 首页：全书总目录 + 进度总览
├── assets/
│   ├── style.css         # 全局样式（浅色/深色主题）
│   ├── script.js         # 公共交互（进度、折叠、懒渲染、导航）
│   └── vendor/katex/     # KaTeX 0.16 本地化（css + js + 字体）
└── chapters/
    ├── chapter-01.html   # 第一章 行列式
    ├── chapter-02.html   # 第二章 矩阵
    ├── chapter-03.html   # 第三章 向量
    ├── chapter-04.html   # 第四章 线性方程组
    ├── chapter-05.html   # 第五章 矩阵的特征值与特征向量
    └── chapter-06.html   # 第六章 二次型
```

## 章节题量

| 章 | 名称 | 节数 |
|---|---|---|
| 一 | 行列式 | 6 节 |
| 二 | 矩阵 | 7 节 |
| 三 | 向量 | 5 节 |
| 四 | 线性方程组 | 4 节 |
| 五 | 矩阵的特征值与特征向量 | 4 节 |
| 六 | 二次型 | 4 节 |

（总题数见首页统计）

## 本地运行

无需构建，任意静态服务器即可：

```bash
# Python
python -m http.server 8000
# 然后访问 http://localhost:8000
```

直接双击 index.html 也能浏览，但建议用本地服务器以保证字体加载。

## GitHub Pages 部署步骤（零基础版）

1. **注册/登录 GitHub**：打开 https://github.com 登录账号
2. **创建仓库**：点右上角 `+` → New repository
   - Repository name 填 `jimidovich-linear-algebra`（或任意名字）
   - 选择 **Public**（免费账户 Pages 需要 Public）
   - 不要勾选 "Add a README"（本目录已自带）
   - 点 **Create repository**
3. **上传文件**（两种方式任选）：
   - **网页上传**：在新建的空仓库页点 "uploading an existing file"，把本目录内所有文件和文件夹拖进去（注意：chapters、assets 是文件夹，网页端会自动保留结构），点 **Commit changes**
   - **命令行上传**（已装 git 时）：
     ```bash
     cd 本目录
     git init
     git add -A
     git commit -m "init: 线代刷题站"
     git branch -M main
     git remote add origin https://github.com/<你的用户名>/jimidovich-linear-algebra.git
     git push -u origin main
     ```
4. **开启 Pages**：仓库页 → **Settings** → 左侧 **Pages**
   - Source 选 **Deploy from a branch**
   - Branch 选 `main`，文件夹选 `/(root)`，点 **Save**
5. **等待生效**：1–3 分钟后刷新该页面，顶部会出现
   `Your site is live at https://<用户名>.github.io/jimidovich-linear-algebra/`
6. **手机访问**：把这个网址发到手机浏览器打开即可，建议"添加到主屏幕"当 App 用

### 更新内容

改完文件后重新上传（网页端直接拖拽覆盖；命令端 `git add -A && git commit -m "update" && git push`），Pages 会在 1 分钟左右自动更新。

## 技术说明

- 纯静态 MPA：按章拆分页面，首屏只加载当前章
- KaTeX 0.16 全量本地化（含字体），无外部 CDN 依赖，离线可用
- 视口懒渲染：IntersectionObserver 只渲染即将进入视野的公式块
- 适配手机/平板/桌面，支持打印（打印时自动隐藏导航）

## 版权说明

本站为个人学习用途的数字化转录，内容版权归原书所有。请勿用于商业用途。
