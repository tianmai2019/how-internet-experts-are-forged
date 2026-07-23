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

## 黑暗模式 ✅ 已上线

暗色配色由 `docs/assets/css/shared.css` 里 `[data-theme="dark"]` 变量组接管，🌙 按钮切换（`docs/assets/js/enhance.js` Theme 模块），保存到 localStorage。SVG 图解通过 CSS 变量自动跟随，无需单独适配。

---

## SVG 图解设计规范

Phase B 期间为 5 篇 P0 文章升级了核心图解。以下是这套图解语言的固化规范，未来新图请照这套走。

### 何时用 SVG，何时用 HTML div

| 场景 | 推荐方式 | 理由 |
|------|----------|------|
| 3 个以内的方框 + 箭头 | HTML div + CSS | 语义清晰、便于 SEO、维护成本低 |
| 4-8 个组件的**流程 / 拓扑 / 循环** | inline SVG | HTML 拼不出斜投影、弧形箭头、雷达对比这些形状 |
| 大表格 / 时间线 | HTML | grid / flex 就够了 |
| **对比性图形**（多形状叠加） | inline SVG | 半透明填充、叠加对比是 HTML 做不到的 |

**不要引入外部图形库**（如 D3、Mermaid）。项目定位是零依赖静态站点，一切都是手写 inline SVG。

---

### 5 种图型模板

已有 5 种图型可复用，选型指南：

| 图型 | 适用主题 | 参考文件 |
|------|----------|----------|
| **水平流程图** | 「A → B → C → D → E」这种线性阶段推进 | [q01.html](../docs/articles/q01.html) 中段 |
| **拓扑分叉图** | 请求穿越多层基础设施，有分支（缓存/DB） | [q13.html](../docs/articles/q13.html) 步骤 5 |
| **堆叠透明片** | 「A + B + C = 组合结果」的叠加关系 | [q07.html](../docs/articles/q07.html) |
| **多轴雷达对比** | 多方案在多维度上的权衡 | [q26.html](../docs/articles/q26.html) 权衡层 |
| **闭环跑道** | 起点回到起点的循环链路（上 3 下 3 布局） | [q46.html](../docs/articles/q46.html) |

**别再发明新样式** —— 想画图时先问自己"这属于以上哪一种"。5 种覆盖了 90% 的教学图需求。

---

### 通用样板结构

每张 SVG 图都遵循同一个外壳：

```html
<div class="diagram-box diagram-svg-wrap">
    <svg viewBox="0 0 W H" class="XXX-svg" role="img"
         aria-label="一句话概括图内容（用给屏幕阅读器）">
        <defs>
            <!-- gradient / marker / filter -->
        </defs>
        <!-- 图形主体 -->
    </svg>

    <!-- 移动端 fallback：< 640px 时切换到垂直卡片列表 -->
    <ol class="XXX-mobile" aria-hidden="true">
        <li>...</li>
    </ol>

    <p class="diagram-caption">图 X：一句话说明这张图讲了什么</p>
</div>
```

**必须三件套**：
1. `viewBox` + `width: 100%` 保证响应式
2. `role="img"` + `aria-label` 保证可访问
3. **移动端 fallback**（`< 640px` 时 SVG display: none，切换到垂直卡片）—— **不能只靠 SVG 缩放**，宽度小于 640 时 SVG 内的字会小到看不清

---

### 配色约定

**主色**跟着 6 层认知系统走 —— 参考 `docs/assets/css/shared.css` 的 `--color-level-N`：

| 用途 | 变量 | 参考色 |
|------|------|--------|
| 用户 / 主流程 | `--color-level-1` | 蓝 `#3B82F6` |
| 前端 / 客户端 | `--color-level-2` | 绿 `#10B981` |
| 网络 / 传输 | `--color-level-3` | 青 `#06B6D4` |
| 服务 / 权衡 | `--color-level-4` | 紫 `#8B5CF6` |
| 数据 / 存储 | `--color-level-5` | 橙 `#F59E0B` |
| AI / 交互 | `--color-level-6` | 粉 `#EC4899` |

**渐变而非纯色**：每个节点都用 `linearGradient` 从浅到深，视觉更精致：
```xml
<linearGradient id="node-blue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#60A5FA"/>
    <stop offset="100%" stop-color="#2563EB"/>
</linearGradient>
```

**多组件同框时用不同色区分类型**（如 Q46 里紫色是"业务服务"、橙色是"数据存储"），别让读者看到 6 个一模一样的方框。

---

### hover 反馈的正确写法（避坑）

**❌ 错的**（会引起抖动）：
```css
.node {
    transition: transform 0.2s;
    transform-box: fill-box;
}
.node:hover {
    transform: scale(1.05);
}
```
理由：`<g>` 上的 `fill-box` 会包住所有子元素，scale 让子元素占的视觉空间变大 → fill-box 边界跟着扩 → 中心点漂移 → 触发新一轮补偿 → 抖动循环。

**✅ 对的**：
```css
.node rect {
    transition: transform 0.2s ease, filter 0.2s ease;
    transform-origin: center;
    transform-box: fill-box;
}
.node:hover rect {
    transform: translateY(-2px);
    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
}
```
两条规则：
1. hover 只作用于 `<rect>`（尺寸固定），不作用于 `<g>`（会包住 text 抖动）
2. 用 `translateY` + `drop-shadow`，不用 `scale`

---

### 暗色模式适配

只需要外壳做适配即可，SVG 主体因为用了渐变，本身在暗色模式下也很好看：

```css
[data-theme="dark"] .diagram-svg-wrap {
    background: rgba(59, 130, 246, 0.06);
    border-color: rgba(148, 163, 184, 0.3);
}
```

**要小心的**：SVG 里凡是要"读"的文字（轴标签、图例、caption），用 `fill="var(--text-primary, #1F2937)"` 或 `fill="var(--text-muted, #6B7280)"`，别写死颜色。方框上的白色文字直接 `fill="#fff"` 就行（渐变背景本身够深）。

---

### 移动端 fallback 的三种范式

Phase B 5 张图都验证过的方案，直接抄：

**范式 1：等价垂直流**（水平流程图 / 拓扑图 / 闭环 都用这个）
- SVG 内 N 个节点 → 移动端变成 N 张垂直卡片
- 卡片间用 `↓` 或 `+` 或 `=` 连接
- 卡片颜色跟 SVG 内节点颜色一致

**范式 2：横向进度条**（雷达图用这个）
- SVG 多轴 → 移动端每个方案变成一张卡片
- 卡片内每根轴变成一根横向进度条
- 颜色跟雷达内多边形一致

**范式 3：单张示意图**（堆叠透明片用这个）
- SVG 内 N 层叠加 → 移动端垂直 N 张卡片
- 最后加一张"= 组合结果"卡片强调关系

---

### 触发 Phase C 的条件

**文章总数 > 100 篇** 时启动 Phase C：把 SVG 图解抽成通用 JS 组件 / CSS 类，批量替换。

目前（50 篇 P0 + P1）继续保持"手工逐篇升级"—— 每张图仍然值得单独设计，工具化反而会让所有图变一个样。

---

## 设计原则

1. **可读性第一** - 永远不要为了美观牺牲可读性
2. **层级清晰** - 6层体系要有明显的视觉区分
3. **渐进增强** - 核心内容在纯HTML下也能阅读
4. **性能优先** - 保持轻量，快速加载

---

*最后更新：2026-07-23（Phase B 完成，追加 SVG 图解设计规范；黑暗模式转为已上线）*
