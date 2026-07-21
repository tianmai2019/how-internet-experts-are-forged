
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

