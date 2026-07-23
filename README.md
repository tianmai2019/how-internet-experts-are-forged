
# 互联网大帝是如何炼成的

> 互联小白如何渡劫飞升成帝——从使用互联网，到理解互联网，再到看见互联网背后的世界。

一个分层展开的互联网世界观知识库。50 个问题，6 层认知递进，从「按一下按钮」到「一个平台如何塑造现实」。

---

## ✨ 项目状态

- 📖 **50 篇深度文章**（P0 + P1）全部发布，每篇 1500-2500 字
- 🎨 **响应式 + 深浅主题**，含侧边目录、阅读进度、已读记录
- 🗺️ **知识图谱**：按层级可视化 50 个问题的关系
- 🔍 **全文搜索**：右下角浮动按钮 or 快捷键 `/`
- 💬 **Giscus 评论**（需要仓库主填 Discussions ID 后生效，详见下文）

---

## 项目结构

```
HowInternetExpertsAreForged/
├── README.md                           # 项目说明
├── DEPLOY.md                           # 发布指南
├── docs/                               # 网站内容（GitHub Pages 从这里部署）
│   ├── index.html                      # 首页
│   ├── articles/
│   │   ├── 01-how-internet-experts-are-forged.html   # 主文章
│   │   ├── q01.html … q50.html                       # 50 篇深度文章
│   │   └── question.html                             # 未发布问题的占位页
│   ├── questions/
│   │   ├── 00-question-map.html        # 问题地图
│   │   └── knowledge-graph.html        # 知识图谱
│   └── assets/
│       ├── css/                        # 样式（shared.css / article.css / side-toc.css）
│       ├── js/enhance.js               # 主题/搜索/评论/侧边导航/键盘快捷键
│       └── data/
│           ├── questions.js            # 50 个问题元数据
│           └── search-index.json       # 全文搜索索引（由脚本生成）
├── scripts/
│   └── build-search-index.js           # 搜索索引构建脚本
├── plans/                              # 内部规划文档
├── archive/                            # 原始文件归档
└── .github/                            # GitHub 配置
```

---

## 6 层认知递进

| 层级 | 视角 | 关键词 | 问题范围 |
|------|------|--------|---------|
| 1 | 🎯 用户视角 | 会回应的世界 | Q1-Q6 |
| 2 | 🔨 程序员入门 | 被构建的世界 | Q7-Q12 |
| 3 | 🌊 工程师视角 | 流动的系统 | Q13-Q25 |
| 4 | ⚖️ 高级工程师 | 权衡的系统 | Q26-Q32 |
| 5 | 👑 大帝视角 | 塑造现实的系统 | Q33-Q39 |
| 6 | 💬 AI 时代 | 会对话的系统 | Q40-Q45 |
| 0 | 🌟 总结 | 连接一切 | Q46-Q50 |

---

## 快捷键

| 键 | 作用 |
|---|---|
| `T` | 切换深/浅主题 |
| `H` | 回到首页 |
| `Ctrl/Cmd + K` | 打开知识地图 |
| `/` | 打开全文搜索 |
| `↑ ↓ Enter` | 在搜索结果中导航 |
| `Esc` | 关闭搜索 |

---

## 🔧 维护指南

### 新增或修改文章后，重建搜索索引

搜索用的是预生成的 `docs/assets/data/search-index.json`，改文章后需要跑：

```bash
node scripts/build-search-index.js
```

这个脚本会扫描 `docs/articles/qNN.html`，提取标题和正文重新生成索引。约 350KB，会随代码一起提交。

**什么时候需要跑？**

- ✅ 新增了一篇 `qNN.html`
- ✅ 大幅改写了某篇文章的正文
- ❌ 只改了 CSS 或 JS 不用
- ❌ 只改了排版细节可以不跑

**忘了跑会怎样？** 网站还能用，但搜索结果不包含新内容。

### 启用 Giscus 评论

评论功能默认关闭（`enhance.js` 里的 `data-repo-id` 是 placeholder）。启用步骤：

1. GitHub 仓库 → **Settings → General → Features** → 勾选 **Discussions**
2. 仓库 → **Discussions → Categories → New category**
   - Name: `Comments`
   - Type: **Announcement**
3. 到 [giscus.app](https://giscus.app) → 输入仓库名 → 页面底部会给你两个 ID
4. 编辑 `docs/assets/js/enhance.js`，找到 `const Comments = {`，把两个 `PLACEHOLDER_*` 换成你拿到的 ID
5. 提交推送，文章页底部就会出现讨论区

---

## 网站发布

支持 **GitHub Pages** 和 **Gitee Pages**，详见 [DEPLOY.md](DEPLOY.md)。

---

## 📚 参考起点

- 从主文章开始：[互联网大帝是如何炼成的](docs/articles/01-how-internet-experts-are-forged.html)
- 快速浏览：[50 个问句锚点](docs/questions/00-question-map.html)
- 鸟瞰全局：[知识图谱](docs/questions/knowledge-graph.html)

---

## License

MIT
