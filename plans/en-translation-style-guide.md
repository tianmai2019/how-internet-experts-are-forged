# English Translation Style Guide

> Canonical reference for translating《互联网大帝是如何炼成的》into the English site **How Internet Grandmasters Are Forged**.
> Every translator (human or agent) working on any of the 50+ articles must follow this document. QA scripts will check both the terminology and the HTML rules below.

---

## 1. Official English Names

### Site title & tagline

| Slot | Chinese | English (canonical) |
|------|---------|---------------------|
| Site name | 互联网大帝是如何炼成的 | **How Internet Grandmasters Are Forged** |
| Site tagline | 互联小白如何渡劫飞升成帝 | **From clueless clicker to internet grandmaster — one ascension at a time** |
| Sub-tagline (on main article) | 从使用互联网,到理解互联网,再到看见互联网背后的世界 | **From using the internet, to understanding it, to seeing the world behind it** |

Notes on the tagline:
- "渡劫飞升成帝" is a cultivation-novel trope (a mortal survives heavenly tribulations, ascends, and becomes an emperor). We keep the drama with **"ascension"** and the outcome word **"grandmaster"**, but drop the literal 渡劫 imagery because it would need a paragraph of footnotes for an English reader.
- "clueless clicker" preserves the affectionate self-deprecation of 互联小白 (a "newbie who only knows how to click things"). We do **not** use "novice" — too neutral, kills the humor.

### The six cognitive layers (LOCKED — do not paraphrase per article)

These names must be used verbatim on every page. Emojis are part of the name.

| # | Chinese | Official English | One-line description (for `<h3>` subtitles) |
|---|---------|------------------|---------------------------------------------|
| 1 | 🎯 用户视角 | **🎯 The User's View** | The internet as a world that responds to you |
| 2 | 🔨 程序员入门视角 | **🔨 The Beginner Coder's View** | The internet as something people build |
| 3 | 🌊 工程师视角 | **🌊 The Engineer's View** | The internet as a system in motion |
| 4 | ⚖️ 高级工程师视角 | **⚖️ The Senior Engineer's View** | The internet as a system of trade-offs |
| 5 | 👑 大帝视角 | **👑 The Grandmaster's View** | The internet as a system that shapes reality |
| 6 | 💬 AI 时代视角 | **💬 The AI-Era View** | The internet as a system you can talk to |

Rejected alternatives (do **not** use):
- "Layer 1 / Layer 2 …" alone — loses the character of each stage
- "Newbie's View" for layer 1 — the whole point is the user *isn't* a newbie, they're a normal person
- "Master's View" for layer 5 — too karate-dojo; the Chinese 大帝 is closer to "emperor / grandmaster of the domain"
- "Junior Developer's View" for layer 2 — 程序员入门 is *before* the "developer" identity solidifies. "Beginner Coder" captures that.

Level badge text template (used on every Q-page header):
```
🎯 Layer 1 · The User's View
🔨 Layer 2 · The Beginner Coder's View
🌊 Layer 3 · The Engineer's View
⚖️ Layer 4 · The Senior Engineer's View
👑 Layer 5 · The Grandmaster's View
💬 Layer 6 · The AI-Era View
```

---

## 2. Core Terminology (canonical Chinese → English)

This table is the source of truth. If you're tempted to invent a new translation, add it here in a PR instead of using it locally.

| # | 中文 | English (canonical) | Why this choice |
|---|------|---------------------|-----------------|
| 1 | 大帝 | **grandmaster** (site title), **internet grandmaster** (in prose) | "Emperor" reads as authoritarian in English; the Chinese 大帝 here is playful "top-of-the-mountain" mastery. "Grandmaster" (chess / martial arts) carries the same admiration without the political baggage. |
| 2 | 渡劫飞升 | **ascension** (noun) / **ascend** (verb) | The full cultivation metaphor doesn't travel. "Ascension" keeps a whiff of the mystical without needing a glossary. Use it sparingly — reserve for the tagline and section transitions. |
| 3 | 互联小白 | **clueless clicker** (title register) / **an ordinary user** (in body prose) | 小白 in Chinese is affectionate self-mockery, not a slur. "Newbie" is close but stale; "clueless clicker" is affectionate and alliterative, matching the drama of the tagline. Inside articles, drop to "ordinary user" so it doesn't get campy. |
| 4 | 权衡 | **trade-off** (noun), **trading off** (gerund) | "Weighing" is technically correct but empty. In engineering English, **trade-off** is the term of art (Fowler, Brooks, Hennessy & Patterson all use it). Layer 4 is literally "the trade-off view." |
| 5 | 认知 | **the way you see it** / **a view** / **a mental model** (context-dependent) | Do **not** default to "cognition" — sounds like a psych paper. 认知 in the source is closer to *"what you perceive when you look at the internet"*. Prefer plain English. |
| 6 | 一层一层看 | **peel it back, layer by layer** | The original evokes onion-peeling. "Look at it layer by layer" is flat; the verb **peel** carries the reveal. |
| 7 | 界面世界 | **the interface world** | Literal here is right — 界面 = interface, and the concept is important enough to earn a proper noun feel. Capitalize when used as a paired concept with "the flow world" (e.g., in the layer-3 pivot sentence). |
| 8 | 流动世界 | **the flow world** | Pairs with "interface world". "Flowing world" reads as adjective + noun; **flow world** reads as compound noun, which is what we want. |
| 9 | 链路 | **request path** (in explanations) / **the full path** (in prose) | 链路 in Chinese engineering means "the whole chain a request travels." "Link" is wrong (that's a network segment). "Chain" is close but overloaded (supply chain, blockchain). **Path** matches how English SREs talk. |
| 10 | 链路意识 | **path awareness** / **thinking in paths** | Same reasoning — path is the anchor word. |
| 11 | 上下文 | **context** | Straight loan; already the term of art for both HTTP requests and LLM prompts. Do not localize as "背景" style. |
| 12 | 银弹 | **silver bullet** | Direct match — this is Fred Brooks's essay, already in English. Keep it. |
| 13 | 塑造现实 | **shaping reality** (gerund) / **shape reality** (verb) | Layer 5's core claim. Chosen over "define reality" (too philosophical) or "influence reality" (too weak). |
| 14 | 削峰填谷 | **shaving peaks and filling troughs** (with parenthetical *load smoothing* on first mention) | The vivid image (peaks/troughs) is half the point; keep it. On first appearance in any article, add "*(load smoothing)*" so English readers get the technical anchor. |
| 15 | 限流 / 降级 / 熔断 | **rate limiting / graceful degradation / circuit breaking** | Standard SRE terms. Do not invent new phrasing. |
| 16 | 一致性 | **consistency** (never "consistency-ness" or "uniformity") | This is the C in CAP. Same term, same meaning. |
| 17 | 幻觉 | **hallucination** | Established LLM term. Keep it; do not soften to "made-up answers." |
| 18 | 对齐 | **alignment** | AI-safety term of art. Same reasoning. |
| 19 | 后端 / 前端 | **backend / frontend** (one word, lowercase) | Not "back-end" — the industry has settled on the closed form. |
| 20 | 世界观 | **worldview** (for a person's) / **mental map of the internet** (in article prose) | 世界观 in this book is very specific — it's "how you picture the internet as a whole." "Worldview" is right for headlines; in the body, prefer the more descriptive **mental map**. |

---

## 3. Voice & Tone

The Chinese source has a very particular voice: short sentences, conversational, heavy on metaphor, em-dash connections, and rhythm-per-line (每句一行, 像口白). The English must preserve that rhythm — not the literary tone of, say, a McKinsey report.

Six concrete rules:

1. **Short sentences, one idea each.** Match the source's line breaks. If the Chinese does `<br>`-separated lines to build rhythm, keep the `<br>` — do not merge into a paragraph.
   - CN: `你点一下,它就有反应。<br>你搜一下,它就给结果。`
   - EN: `You tap — it reacts.<br>You search — it returns a result.`

2. **Prefer em-dashes over subordinate clauses.** The source loves comma-connected beats; English gets that same texture from em-dashes ( — with spaces around it, not the tight "—" style ).
   - Bad: `Because your account can log in, the backend validated your credentials.`
   - Good: `An account can log in — not because the system "recognizes" you, but because the backend ran a check.`

3. **Present tense by default.** The source describes how the world *is*, not how it once was. Reserve past tense for actual anecdotes ("I wrote my first webpage and…").

4. **No literary register.** Do not translate `很奇妙` as *"wondrous"* or *"marvelous"*. Say **"kind of magical"**, **"a strange moment"**, **"weirdly special"**. The Chinese narrator is a friend at a coffee shop, not a professor.

5. **Keep the rhetorical repetition.** The source repeats sentence starters on purpose (`你不再只是点击。你不再只是搜索关键词。你不再只是去找资料。`). Preserve the anaphora:
   - `You're not just clicking anymore.`
   - `You're not just searching for keywords anymore.`
   - `You're not just going to look things up anymore.`

6. **Keep every emoji.** 🎯 🔨 🌊 ⚖️ 👑 💬 are part of the layer identity — they are load-bearing UI, not decoration. Same for section markers 🤔 🧩 🎯 in Q-pages. Never drop, never swap.

Bonus micro-rules:
- Use contractions freely (*it's*, *you'll*, *don't*). Blocked-form English feels stiff.
- Rhetorical questions end with `?` — do not convert them into statements. The whole book is 50 questions; the interrogative voice *is* the book.
- Two-space sentence gaps: **no.** One space.
- Chinese comma "，" becomes English comma ", " with a following space; Chinese period "。" becomes ". " with a following space. Watch for full-width punctuation leaking through.
- Line ending as `<br>` in HTML must stay `<br>`. Do not "clean it up" into a `<p>` wrap.

---

## 4. HTML Preservation Rules (checked by QA)

Every English article HTML must satisfy all of the following. A CI script (planned) will flag violations.

1. **CSS class names are frozen.** `.diagram-box`, `.highlight-box`, `.flow-step`, `.step-box`, `.arrow`, `.article-header`, `.article-content`, `.level-badge`, `.emperor-box`, `.try-box`, `.nav-footer`, `.related-questions`, `.button-demo`, `.demo-button`, `.diagram-svg-wrap`, `.flow-svg`, `.flow-stage`, `.flow-mobile`, `.diagram-caption` — none of these get renamed. Layout depends on them.
2. **SVG bodies are copied verbatim.** All `<defs>`, `<linearGradient>`, `<marker>`, `<g>`, `<rect>`, `<path>`, `<line>` elements — preserve exactly as in the Chinese source. The only content you translate inside an SVG is the human-readable copy inside `<text>` elements (labels like "URL 解析" → "URL parsing", captions like "拆分协议 / 域名 / 路径" → "protocol / domain / path"). Emoji `<text>` elements (📝 📖 📤 📥 🎨 etc.) stay as-is.
3. **The `role="img"` and `aria-label` on SVGs get translated.** The `aria-label` is user-facing; translate it. Everything else in the `<svg>` opening tag stays.
4. **Internal HTML links get retargeted to `/en/`, but only where the target has been translated.** See section 5 for exact rules.
5. **Asset paths (`../assets/...`) become `../../assets/...`** because English pages live one directory deeper. See section 5.
6. **Emojis are preserved 1:1.** Do not replace 🎯 with `:target:` or with the word "target". Emojis in `<div class="section-divider">🎯 第1层认知</div>` become `<div class="section-divider">🎯 Layer 1</div>` — emoji stays, only the CJK text is translated.
7. **Numbers, unit strings, code identifiers, and code blocks are untouched.** `google.com`, `HTTP`, `DNS`, `TCP`, `HTML/CSS/JS`, `<code>curl</code>` — none of these change.
8. **`<title>` and `<h1>` are always translated.** The rest of `<head>` (meta, link, style) is copied without changes except any Chinese comments.
9. **`lang="zh-CN"` → `lang="en"`** on the `<html>` element.
10. **Chinese in HTML comments (`<!-- ... -->`) may be dropped or translated at translator's discretion**, but must not be left in Chinese in the final English file. Comments referring to CSS class purpose ("阶段方框：悬停微上浮") can be translated as short English notes, or removed entirely.

---

## 5. URL & File Path Rules

### Directory mapping

| Chinese path | English path |
|--------------|--------------|
| `docs/index.html` | `docs/en/index.html` |
| `docs/articles/01-how-internet-experts-are-forged.html` | `docs/en/articles/01-how-internet-experts-are-forged.html` |
| `docs/articles/q01.html` | `docs/en/articles/q01.html` |
| `docs/articles/question.html` | `docs/en/articles/question.html` |
| `docs/questions/00-question-map.html` | `docs/en/questions/00-question-map.html` |
| `docs/assets/...` | **`docs/assets/...`** (unchanged — assets are shared) |

### Path rewrites inside English HTML files

Because English pages are one directory deeper (`docs/en/articles/qXX.html` vs `docs/articles/qXX.html`), every `../assets/` in the source becomes `../../assets/` in the translation.

| Element | Chinese source | English target |
|---------|----------------|----------------|
| CSS `<link>` | `href="../assets/css/shared.css"` | `href="../../assets/css/shared.css"` |
| JS `<script>` | `src="../assets/js/enhance.js"` | `src="../../assets/js/enhance.js"` |
| Back-to-home button | `href="../index.html"` | `href="../index.html"` (still one level up — the English index is `docs/en/index.html`) |
| Sibling article link | `href="q01.html"` | `href="q01.html"` (unchanged — same directory) |
| Question map link | `href="../questions/00-question-map.html"` | `href="../questions/00-question-map.html"` (unchanged — parallel structure) |
| Question dispatcher | `href="question.html?q=1"` | `href="question.html?q=1"` (unchanged) |

### Cross-language links (future — do not add yet)

A language-switcher UI is planned but not yet spec'd. Do **not** add hardcoded `../../articles/qXX.html` "switch to Chinese" links inside English pages during translation. That will be handled by a global JS component, added in one pass across all pages.

### File encoding

- UTF-8, no BOM.
- LF line endings (not CRLF).
- Trailing newline at end of file.

---

## 6. Reference Translations (the yardstick)

Five representative source sentences and their canonical English rendering. Use these as calibration when you're unsure whether your draft is "too literal" or "too creative."

### Example 1 — the rhetorical anchor question

**CN:**
> 为什么系统设计里没有银弹?

**EN (canonical):**
> Why is there no silver bullet in system design?

Notes: Direct, keeps the interrogative, keeps Brooks's phrase. Do **not** expand to "Why is there no universal solution…" — the whole point is the reference.

### Example 2 — the layer-3 pivot

**CN:**
> 这时候,互联网在一个工程师眼中,就开始从"界面世界"变成"流动世界"。

**EN (canonical):**
> At this point, in the engineer's eyes, the internet stops being an "interface world" and starts becoming a "flow world."

Notes: Keep the paired-noun tension (interface world ↔ flow world). Keep the quote marks — they mark these as terms of art.

### Example 3 — the rhythm-per-line beat

**CN:**
> 先看到按钮。<br>
> 再看到代码。<br>
> 再看到链路。<br>
> 再看到架构。<br>
> 最后看到世界。

**EN (canonical):**
> First you see buttons.<br>
> Then you see code.<br>
> Then you see the request path.<br>
> Then you see architecture.<br>
> And finally, you see the world.

Notes: Preserve line breaks exactly. Match the escalating cadence. "The world" (not "a world") — it's the shared reality the book keeps returning to.

### Example 4 — the layer-1 sensory list

**CN:**
> 你点一下,它就有反应。<br>
> 你搜一下,它就给结果。<br>
> 你发出去,对方就能收到。

**EN (canonical):**
> You tap — it reacts.<br>
> You search — it returns a result.<br>
> You send — someone receives.

Notes: Em-dash instead of "and then". Compression matters — every extra word breaks the beat.

### Example 5 — the closing manifesto

**CN:**
> 真正的答案是:<br>
> 他不再满足于结果。<br>
> 他开始不断追问为什么。

**EN (canonical):**
> The real answer is this:<br>
> They stop being satisfied with results.<br>
> They start asking why, over and over.

Notes:
- Use **they/them** for the ungendered 他 in this book. Chinese 他 in an abstract "a person who…" context is gender-neutral; singular *they* is the natural English match, and it's inclusive by default.
- "over and over" catches the 不断 iteration; a flat "keep asking why" is technically accurate but loses the persistence.

---

## 7. Quick QA checklist (paste this into your PR description)

Before submitting a translated file, confirm:

- [ ] `<html lang="en">` — not `zh-CN`
- [ ] `<title>` translated
- [ ] `<h1>` translated
- [ ] All CSS/JS `href`/`src` use `../../assets/...`
- [ ] Level badge uses the exact canonical string from section 1
- [ ] All 6 layer names, wherever they appear, match section 1 verbatim
- [ ] Every core term in section 2 is rendered using the canonical English
- [ ] All `<br>` from source retained
- [ ] All emojis retained
- [ ] SVG structure untouched; only `<text>` content and `aria-label` translated
- [ ] Sibling `qXX.html` links kept as-is (no `en/` prefix)
- [ ] File is UTF-8, LF, trailing newline
- [ ] No Chinese punctuation (， 。 " " ： — ！ ？) leaked into English body

---

*Owner: translation working group. Change the terminology tables via PR; do not shadow them in individual articles.*
