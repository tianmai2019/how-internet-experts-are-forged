# 设计系统

《互联网大帝是如何炼成的》视觉规范和色彩体系。

---

## 6层认知配色系统

| 层级 | 名称 | 主色 | 辅助色 | 图标 | 情感基调 |
|------|------|------|--------|------|----------|
| 1 | 用户视角 | 🔵 #3B82F6 | #93C5FD | 🎯 | 好奇、探索 |
| 2 | 程序员入门 | 🟢 #10B981 | #6EE7B7 | 🔨 | 兴奋、创造 |
| 3 | 工程师 | 🌊 #06B6D4 | #67E8F9 | 🌊 | 流动、系统 |
| 4 | 高级工程师 | ⚖️ #8B5CF6 | #C4B5FD | ⚖️ | 权衡、成熟 |
| 5 | 大帝 | 👑 #F59E0B | #FCD34D | 👑 | 全局、塑造 |
| 6 | AI时代 | 🤖 #EC4899 | #F9A8D4 | 💬 | 对话、未来 |

---

## 色彩使用规则

### 主色调
- 页面整体保持当前的紫色渐变背景（#667eea → #764ba2）
- 各层级专题页面用对应层级的主色
- 重要信息用主色，次要信息用辅助色

### 中性色
```css
--color-text-primary: #1F2937;   /* 深灰 - 主文本 */
--color-text-secondary: #6B7280; /* 中灰 - 辅助文本 */
--color-text-muted: #9CA3AF;    /* 浅灰 - 提示文本 */
--color-background: #FFFFFF;     /* 白 - 卡片背景 */
--color-border: #E5E7EB;         /* 边框 */
```

---

## CSS 变量建议

建议在 `docs/assets/css/styles.css` 中定义：

```css
:root {
  /* 层级色彩 */
  --color-level-1: #3B82F6;
  --color-level-1-light: #93C5FD;
  --color-level-2: #10B981;
  --color-level-2-light: #6EE7B7;
  --color-level-3: #06B6D4;
  --color-level-3-light: #67E8F9;
  --color-level-4: #8B5CF6;
  --color-level-4-light: #C4B5FD;
  --color-level-5: #F59E0B;
  --color-level-5-light: #FCD34D;
  --color-level-6: #EC4899;
  --color-level-6-light: #F9A8D4;

  /* 中性色 */
  --color-text-primary: #1F2937;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-background: #FFFFFF;
  --color-border: #E5E7EB;

  /* 间距 */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* 圆角 */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

---

## 层级卡片样式

### 层级指示条
每篇文章顶部用一个彩色条显示当前层级：

```html
<div class="level-indicator level-1">
  <span class="icon">🎯</span>
  <span class="text">第1层认知 · 用户视角</span>
</div>
```

对应的CSS：
```css
.level-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
}

.level-indicator.level-1 { background: var(--color-level-1-light); color: #1E40AF; }
.level-indicator.level-2 { background: var(--color-level-2-light); color: #065F46; }
.level-indicator.level-3 { background: var(--color-level-3-light); color: #164E63; }
.level-indicator.level-4 { background: var(--color-level-4-light); color: #5B21B6; }
.level-indicator.level-5 { background: var(--color-level-5-light); color: #92400E; }
.level-indicator.level-6 { background: var(--color-level-6-light); color: #9D174D; }
```

---

## 问题卡片样式

### 静息态
```
┌─────────────────────────────┐
│  ❓  问题？                 │
│                            │
└─────────────────────────────┘
```

### 悬停态
```
┌─────────────────────────────┐
│  🎯  问题？                │  ← 图标变化
│  点击探索 →                │  ← 显示引导文字
│                            │
└─────────────────────────────┘
```

### 已完成态
```
┌─────────────────────────────┐
│  ✅  问题？                │
│  已完成 →                  │
└─────────────────────────────┘
```

---

## 知识图谱可视化

### 6层结构SVG设计
```
       ┌─────────────────────────────────────────┐
       │         👑 塑造现实的系统               │ ← 大帝视角
       └─────────────────────────────────────────┘
                    ↑
       ┌─────────────────────────────────────────┐
       │         ⚖️  权衡的系统                  │ ← 高级工程师
       └─────────────────────────────────────────┘
                    ↑
       ┌─────────────────────────────────────────┐
       │         🌊 流动的系统                   │ ← 工程师
       └─────────────────────────────────────────┘
                    ↑
       ┌─────────────────────────────────────────┐
       │         🔨 被构建的世界                 │ ← 程序员入门
       └─────────────────────────────────────────┘
                    ↑
       ┌─────────────────────────────────────────┐
       │         🎯 会回应的世界                 │ ← 用户
       └─────────────────────────────────────────┘
                    ↑
       ┌─────────────────────────────────────────┐
       │         💬 会对话的系统                 │ ← AI时代
       └─────────────────────────────────────────┘
```

### 可交互性
- 点击每个层级可以展开该层的问题锚点
- 高亮显示当前正在阅读的层级
- 显示层级之间的关联

---

## 阅读进度指示器

在页面顶部或侧边栏，用一个垂直进度条显示：

```
  👑 第5层 ────┐
              │
  ⚖️  第4层 ──┤  ◀ 当前在这里
              │
  🌊  第3层 ──┤
              │
  🔨  第2层 ──┤
              │
  🎯  第1层 ──┘
```

---

## 代码块样式

保持简洁，但要有层级色区分：

```css
.code-block {
  border-left: 4px solid var(--color-level-2); /* 程序员层是绿色 */
  background: #F9FAFB;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  overflow-x: auto;
}
```

---

## 引用块样式

引用、金句、重点提示：

```css
.quote {
  border-left: 4px solid var(--color-level-4); /* 权衡层是紫色 */
  background: linear-gradient(to right, #F5F3FF, transparent);
  padding: var(--space-md) var(--space-lg);
  margin: var(--space-lg) 0;
  font-style: italic;
  font-size: 1.125rem;
}
```

---

## 图示占位符

当还没有画图时，用一个友好的占位符：

```html
<div class="diagram-placeholder">
  <div class="icon">📊</div>
  <div class="text">图解待绘制</div>
  <div class="hint">（如果你愿意帮忙画图，欢迎贡献！）</div>
</div>
```

---

## 响应式断点

| 断点 | 设备类型 | 调整 |
|------|----------|------|
| < 640px | 手机 | 单列、文字放大、触摸友好 |
| 640-1024px | 平板 | 适度调整 |
| > 1024px | 桌面 | 侧边栏目录、双列布局 |

---

## 动画和过渡

- 悬停效果：0.2s ease
- 页面滚动：0.3s ease
- 卡片进入：0.4s ease-out
- 不要过度动画，保持阅读的专注感

---

## 黑暗模式（计划中）

为夜间阅读设计的配色方案，后续实现。

---

## 设计原则

1. **可读性第一** - 永远不要为了美观牺牲可读性
2. **层级清晰** - 6层体系要有明显的视觉区分
3. **渐进增强** - 核心内容在纯HTML下也能阅读
4. **性能优先** - 保持轻量，快速加载

---

*最后更新：2024年*
