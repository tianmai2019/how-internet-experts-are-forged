
# 发布指南

本项目的静态站点部署到 **Cloudflare Pages**（国内可直达，免费无限流量），代码同时备份到 **GitHub** 和 **Gitee**。

- **🌐 生产站点**：https://how-internet-experts-are-forged.pages.dev

---

## 🚀 部署方案概览

| 目标 | 用途 | 状态 |
|------|------|------|
| **Cloudflare Pages** | 生产站点，自动从 GitHub 部署 | ✅ 已上线 |
| **GitHub** | 主代码仓库 + Cloudflare 触发源 | ✅ `tianmai2019/how-internet-experts-are-forged` |
| **Gitee** | 国内代码备份 | ✅ `xiaolinye/how-internet-experts-are-forged` |

> ⚠️ **Gitee Pages 已下线**（2024 年起）：仓库仍作为国内代码备份用，但网页托管改用 Cloudflare Pages。

---

## 📦 首次部署：Cloudflare Pages（已完成，供未来参考）

### 1. 注册 Cloudflare 账号

- 访问 https://dash.cloudflare.com/sign-up 用邮箱注册
- 不需要备案、不需要信用卡

### 2. 创建 Pages 项目

- 左侧 **Compute** → **Workers & Pages** → 右上 **Create application**
- 页面推的是 Workers；**点最下方小字 "Looking to deploy Pages? Get started"** 进入 Pages 分支
- **Connect to Git** → 授权 GitHub → 选中仓库

### 3. 构建配置

| 字段 | 填 |
|------|------|
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **留空** |
| Build output directory | **`docs`** ← 关键 |
| Root directory (advanced) | 留空 |
| Environment variables | 不需要 |

**Save and Deploy**，1-2 分钟后拿到 `*.pages.dev` 域名。

---

## 🔄 日常更新流程

因为 Cloudflare 已经连了 GitHub，你**只要 push 到 GitHub 就自动部署**：

```bash
git add .
git commit -m "..."
git push          # 推到 Gitee (origin)
git push github   # 推到 GitHub，触发 Cloudflare 部署
```

**Cloudflare Pages 观察面板**：
- 到 Workers & Pages → 你的项目 → **Deployments**
- 每次 push 会自动创建 deployment，可以看构建日志和历史版本
- 每个 PR / feature 分支还会自动生成预览域名

**回滚**：某次部署坏了？在 Deployments 页面找到旧的成功版本，点 **Rollback** 即可。

---

## 🔍 新增/修改文章后：重建搜索索引

**如果动了 `docs/articles/qNN.html` 里的正文或标题**，提交前先跑一次索引构建脚本：

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
git push
git push github
```

---

## 💬 Giscus 评论

已接入（2026-07-23）。仓库指向 `tianmai2019/how-internet-experts-are-forged` 的 Discussions。

Cloudflare Pages 上 Giscus 会正常工作，无需额外配置。如果哪天想换仓库：编辑 `docs/assets/js/enhance.js` 里 `Comments = { REPO / REPO_ID / CATEGORY / CATEGORY_ID }` 的 4 个值。

---

## 🌐 自定义域名（可选）

想用自己的域名（比如 `book.example.com`）？

1. Cloudflare Pages → 你的项目 → **Custom domains** → **Set up a custom domain**
2. 输入你的域名，跟着提示添加 CNAME 记录到你的 DNS 提供商
3. HTTPS 证书 Cloudflare 自动签发

---

## 🔧 Gitee 仓库（代码备份）

即使不再托管站点，Gitee 仓库仍然有价值：
- **国内网络快** —— 拉代码不用翻墙
- **多平台备份** —— GitHub 若不可访问时可从这里恢复

保持双推的流程见"日常更新"段。

---

## 📚 参考仓库

- **GitHub 主仓库**：https://github.com/tianmai2019/how-internet-experts-are-forged
- **Gitee 备份仓库**：https://gitee.com/xiaolinye/how-internet-experts-are-forged
- **生产站点**：https://how-internet-experts-are-forged.pages.dev
