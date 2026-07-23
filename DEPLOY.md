
# 发布指南

本项目可以同时发布到 **GitHub Pages** 和 **Gitee Pages**。

---

## 📦 第一步：首次提交

```bash
# 在项目目录下执行
git add .
git commit -m "Initial commit: 互联网大帝是如何炼成的"
```

---

## 🚀 方式一：发布到 GitHub Pages

### 1. 创建 GitHub 仓库

- 访问 https://github.com/new
- 仓库名：`HowInternetExpertsAreForged`
- 选择 **Public** 或 **Private**（Public 推荐）
- **不要**初始化 README、.gitignore 或 LICENSE（我们已经有了）
- 点击 "Create repository"

### 2. 推送到 GitHub

按照 GitHub 页面上的提示操作：

```bash
git remote add origin https://github.com/你的用户名/HowInternetExpertsAreForged.git
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages

- 进入仓库的 **Settings**
- 左侧菜单找到 **Pages**
- 在 **Build and deployment** 下：
  - Source: 选择 `Deploy from a branch` 或 `GitHub Actions`（推荐用 Actions）
  - 如果用 Actions，我们已经配置好了 `.github/workflows/deploy.yml`
- 稍等几分钟，你的网站就会上线：

`https://你的用户名.github.io/HowInternetExpertsAreForged/`

---

## 🚀 方式二：发布到 Gitee Pages（国内速度快）

### 1. 创建 Gitee 仓库

- 访问 https://gitee.com/projects/new
- 仓库名：`HowInternetExpertsAreForged`
- 选择 **公开** 或 **私有**（公开推荐）
- **不要**初始化任何东西
- 点击 "创建"

### 2. 推送到 Gitee

```bash
# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/你的用户名/HowInternetExpertsAreForged.git

# 推送到 Gitee
git push -u gitee main
```

### 3. 启用 Gitee Pages

- 进入仓库的 **服务** → **Gitee Pages**
- 部署目录：填写 `docs`（不是 public）
- 点击 "启动"
- 稍等几分钟，你的网站就会上线：

`https://你的用户名.gitee.io/HowInternetExpertsAreForged/`

---

## 🔄 同时使用 GitHub 和 Gitee

你可以把代码同时推送到两个平台：

```bash
# 推送到 GitHub
git push origin main

# 推送到 Gitee
git push gitee main
```

这样你就有两个备份，而且国内用户访问 Gitee Pages 速度更快。

---

## 📝 更新内容后

修改内容后，只需要：

```bash
git add .
git commit -m "Update: 更新内容"
git push origin main
git push gitee main  # 如果也用 Gitee
```

GitHub Pages 会自动通过 Actions 部署，Gitee Pages 可能需要手动去点一下"更新"。

---

## 🔍 新增/修改文章后：重建搜索索引

**如果动了 `docs/articles/qNN.html` 里的正文或标题**，提交前先跑一次索引构建脚本，让站内搜索能索引到最新内容：

```bash
node scripts/build-search-index.js
```

脚本会扫描 `docs/articles/` 下所有 `qNN.html` + 主文章，抽取标题和正文写入 `docs/assets/data/search-index.json`（约 350 KB，跟代码一起提交）。

**什么时候需要跑？**

- ✅ 新增了一篇 `qNN.html`
- ✅ 大幅改写了某篇文章的正文
- ❌ 只改了 CSS / JS / 排版：**不用**

**忘了跑会怎样？** 网站正常运行，只是搜索里搜不到新增/新改的内容。

建议在提交时把索引一起 commit：

```bash
node scripts/build-search-index.js
git add docs/articles/ docs/assets/data/search-index.json
git commit -m "content: 新增 QNN + 重建搜索索引"
git push origin main
```

---

## 💬 启用 Giscus 评论

评论功能默认没开（`enhance.js` 里的 ID 是 placeholder）。启用：

1. GitHub 仓库 → **Settings → General → Features** → 勾选 **Discussions**
2. 仓库 → **Discussions → Categories → New category**：Name `Comments`，Type **Announcement**
3. 到 [giscus.app](https://giscus.app) 输入仓库名，页面会给你 `data-repo-id` 和 `data-category-id`
4. 编辑 `docs/assets/js/enhance.js`，找到 `const Comments = {`，把 `REPO_ID` / `CATEGORY_ID` 里的 `PLACEHOLDER_*` 换成拿到的 ID
5. 提交推送即生效

