#!/usr/bin/env node
/**
 * build-zh-hant.js
 *
 * 从 docs/ 下的中文（简体）源生成 docs/zh-Hant/ 平行目录。
 *
 * 规则：
 *   1. 只处理 HTML；其他资产（JS/CSS/图片/数据）保持共享（zh-Hant 页面回引 ../assets/）。
 *   2. 用 opencc-js 的 cn→tw 规则做 s2t 字形转换（不改词汇）。
 *      —— 用户明确选择的方案（见 plans/）。
 *   3. 只转"文本节点"和少数用户可见属性（title / alt / aria-label / placeholder / content=<meta desc>）。
 *   4. 绝不动 <script> / <style> / <code> / <pre> 内部（会破坏代码 / JS 逻辑）。
 *   5. 把 <html lang="zh-CN"> 改为 <html lang="zh-Hant">。
 *   6. 删除旧的 hreflang 链接标签 —— 由 scripts/inject-hreflang.js 统一重新注入三语版本。
 *   7. 相对链接（../assets/、../articles/qXX.html、../index.html）保持原样，
 *      同层级引用会自然指向 docs/zh-Hant/ 下的对应文件。
 *   8. 把 assets/data/questions.js 的引用改成 questions-zh-Hant.js
 *      （问题文案是数据而非页面内容，需要平行的繁体数据文件）。
 *
 * 幂等：整个 docs/zh-Hant/ 每次都被清空重建。
 *
 * 用法：
 *   node scripts/build-zh-hant.js
 */

const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

const REPO_ROOT = path.resolve(__dirname, '..');
const SRC = path.join(REPO_ROOT, 'docs');
const OUT = path.join(REPO_ROOT, 'docs', 'zh-Hant');

// 用户选择：字形转换（s2t），不做词汇本地化
const convert = OpenCC.Converter({ from: 'cn', to: 'tw' });

// 这些子目录里的 HTML 是"内容页"，要拷贝并转换
const CONTENT_DIRS = ['', 'articles', 'questions'];

// 这些属性里的值会被用户看到 —— 转换
const TRANSLATABLE_ATTRS = new Set(['title', 'alt', 'aria-label', 'placeholder']);

// 不能转换内部内容的标签（原样保留）
const OPAQUE_TAGS = new Set(['script', 'style', 'code', 'pre']);

// ----------------------------------------------------------------------
// 一个非常朴素的 HTML 分段器：把文档切成
//   { kind: 'opaque', text }   —— <script>...</script> 之类，原样输出
//   { kind: 'html',   text }   —— 其它 HTML 片段，再做 text-node / 属性 转换
// 也把 hreflang <link> 单独识别并丢弃（由 inject-hreflang.js 重建）
// ----------------------------------------------------------------------

function splitByOpaqueTags(src) {
    const segments = [];
    let i = 0;
    const openRe = /<(script|style|code|pre)\b[^>]*>/i;

    while (i < src.length) {
        const rest = src.slice(i);
        const m = rest.match(openRe);
        if (!m) {
            segments.push({ kind: 'html', text: rest });
            break;
        }
        // 前面这一段是可处理的 HTML
        if (m.index > 0) {
            segments.push({ kind: 'html', text: rest.slice(0, m.index) });
        }
        const tag = m[1].toLowerCase();
        const openStart = m.index;
        const openEnd = m.index + m[0].length;
        // 找对应的 </tag>
        const closeRe = new RegExp('</' + tag + '\\s*>', 'i');
        const closeM = rest.slice(openEnd).match(closeRe);
        if (!closeM) {
            // 没闭合，剩余全丢进 opaque，保守起见
            segments.push({ kind: 'opaque', text: rest.slice(openStart), tag });
            break;
        }
        const closeEnd = openEnd + closeM.index + closeM[0].length;
        segments.push({ kind: 'opaque', text: rest.slice(openStart, closeEnd), tag });
        i += closeEnd;
    }
    return segments;
}

// 在 <script> 段内做"仅 CJK 字符串字面量"转换。
// - 只转 '...'、"..." 和模板串 `...` 里包含 CJK 字符的段
// - 不动 identifier / CSS class / URL / localStorage key（这些不含 CJK）
// - 模板串内的 ${...} 表达式部分保持不变（表达式里的字符串再走一遍单/双引号规则也依然安全）
const CJK_RE = /[\u3400-\u9FFF\uF900-\uFAFF]/;
function convertCjkStringLiteralsInJs(js) {
    // 处理单引号、双引号、反引号 三种字符串
    // 反斜杠转义: \\、\'、\"、\` 都要跳过
    let out = '';
    let i = 0;
    const n = js.length;
    while (i < n) {
        const ch = js[i];

        // 跳过单行 //... 和块注释 /* ... */（避免把注释里的字符也当字符串处理，此处保守：不转注释）
        if (ch === '/' && i + 1 < n) {
            const nx = js[i + 1];
            if (nx === '/') {
                const end = js.indexOf('\n', i);
                const stop = end === -1 ? n : end;
                out += js.slice(i, stop);
                i = stop;
                continue;
            }
            if (nx === '*') {
                const end = js.indexOf('*/', i + 2);
                const stop = end === -1 ? n : end + 2;
                out += js.slice(i, stop);
                i = stop;
                continue;
            }
        }

        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            // 立即输出起始 quote —— 之前的 bug：等到闭合再一次性 quote+buf+quote，
            // 但模板串遇到 ${...} 会提前 flush buf 而没输出起始 `，最终 renderGraph 之类的
            // 带插值模板串会缺 ` 导致 JS 语法错误（知识地图页因此白屏）。
            out += quote;
            i++;
            let buf = '';
            let closed = false;
            while (i < n) {
                const c = js[i];
                if (c === '\\' && i + 1 < n) {
                    buf += js[i] + js[i + 1];
                    i += 2;
                    continue;
                }
                if (quote === '`' && c === '$' && js[i + 1] === '{') {
                    // 模板串内插值：flush 当前 buf（不带引号，起始 quote 已输出）
                    if (CJK_RE.test(buf)) buf = convert(buf);
                    out += buf;
                    buf = '';
                    // 找到匹配的 }
                    let depth = 1;
                    let j = i + 2;
                    while (j < n && depth > 0) {
                        const cc = js[j];
                        if (cc === '{') depth++;
                        else if (cc === '}') depth--;
                        j++;
                    }
                    // 递归转换 ${...} 内部
                    const innerStart = i + 2;
                    const innerEnd = j - 1; // 指向 }
                    const inner = js.slice(innerStart, innerEnd);
                    out += '${' + convertCjkStringLiteralsInJs(inner) + '}';
                    i = j;
                    continue;
                }
                if (c === quote) {
                    // 字符串结束：只补末尾 quote（起始 quote 早已输出）
                    if (CJK_RE.test(buf)) buf = convert(buf);
                    out += buf + quote;
                    i++;
                    closed = true;
                    break;
                }
                buf += c;
                i++;
            }
            if (!closed) {
                // 字符串未闭合：起始 quote 已输出，剩余内容原样追加
                if (CJK_RE.test(buf)) buf = convert(buf);
                out += buf;
            }
            continue;
        }

        out += ch;
        i++;
    }
    return out;
}

// 对 opaque 段做"选择性"处理
function transformOpaqueSegment(seg) {
    if (seg.tag !== 'script') return seg.text; // style / code / pre 完全不动
    // 提取 <script ...> 与 </script>，只对中间的 JS 做转换
    const openM = seg.text.match(/^<script\b[^>]*>/i);
    if (!openM) return seg.text;
    const openLen = openM[0].length;
    const closeRe = /<\/script\s*>$/i;
    const closeM = seg.text.match(closeRe);
    if (!closeM) return seg.text;
    const closeLen = closeM[0].length;
    const body = seg.text.slice(openLen, seg.text.length - closeLen);
    const converted = convertCjkStringLiteralsInJs(body);
    return openM[0] + converted + closeM[0];
}

// 在 html 段里做文本节点转换 + 属性转换
function transformHtmlSegment(text) {
    // 用 <...> 拆分：偶数 chunk 是文本，奇数 chunk 是标签
    // 注意：注释 <!-- ... -->、doctype 也会落进"标签"槽，我们不动它们
    const parts = text.split(/(<[^>]*>)/);
    for (let k = 0; k < parts.length; k++) {
        if (k % 2 === 0) {
            // 纯文本节点
            if (parts[k]) parts[k] = convert(parts[k]);
        } else {
            // 标签：处理 title / alt / aria-label / placeholder / <meta ... content="..."> / <title>
            parts[k] = transformTag(parts[k]);
        }
    }
    return parts.join('');
}

function transformTag(tag) {
    // <!-- ... --> 不动
    if (tag.startsWith('<!')) return tag;

    // 特殊：<meta name="description|keywords|og:*|twitter:*" content="...">  ——  content 内值转换
    if (/^<meta\b/i.test(tag)) {
        const m = tag.match(/name\s*=\s*"([^"]+)"/i) || tag.match(/property\s*=\s*"([^"]+)"/i);
        if (m) {
            const n = m[1].toLowerCase();
            const shouldTranslate =
                n === 'description' ||
                n === 'keywords' ||
                n.startsWith('og:') ||
                n.startsWith('twitter:');
            if (shouldTranslate) {
                tag = tag.replace(/(content\s*=\s*")([^"]*)(")/i, (_, a, v, b) => a + convert(v) + b);
            }
        }
        return tag;
    }

    // 常规属性
    for (const attr of TRANSLATABLE_ATTRS) {
        const re = new RegExp('(' + attr + '\\s*=\\s*")([^"]*)(")', 'gi');
        tag = tag.replace(re, (_, a, v, b) => a + convert(v) + b);
        const re2 = new RegExp("(" + attr + "\\s*=\\s*')([^']*)(')", 'gi');
        tag = tag.replace(re2, (_, a, v, b) => a + convert(v) + b);
    }

    return tag;
}

// 处理整份 HTML 文档
function transformDocument(src) {
    // 1. 删除旧的三条 hreflang <link>（会由 inject-hreflang.js 重建，避免残留只指向 en/zh-CN 的旧标签）
    src = src.replace(
        /^[ \t]*<link\s+rel=["']alternate["'][^>]*hreflang=["'](?:en|zh-CN|zh-Hans|zh-Hant|x-default)["'][^>]*>\s*\r?\n/gim,
        ''
    );

    // 2. <html lang="zh-CN">  ->  <html lang="zh-Hant">
    src = src.replace(/(<html\b[^>]*\blang\s*=\s*")zh-CN(")/i, '$1zh-Hant$2');
    // 兜底：没写 lang 的强制补一个
    if (!/<html\b[^>]*\blang\s*=/i.test(src)) {
        src = src.replace(/<html\b/i, '<html lang="zh-Hant"');
    }

    // 3. 修正指向 assets/ 的相对路径（因为 zh-Hant/ 多一层目录深度）
    //   docs/index.html          用  "assets/..."          -> zh-Hant/index.html 需要 "../assets/..."
    //   docs/articles/qXX.html   用  "../assets/..."       -> zh-Hant/articles/qXX.html 需要 "../../assets/..."
    //   docs/questions/xxx.html  用  "../assets/..."       -> zh-Hant/questions/xxx.html 需要 "../../assets/..."
    // 精确匹配 href="..." / src="..." 里以 (../)*assets/ 起头的路径，前缀添一层 ../
    src = src.replace(
        /(\b(?:href|src)\s*=\s*["'])((?:\.\.\/)*)(assets\/)/gi,
        (_, attr, upDots, tail) => attr + '../' + upDots + tail
    );

    // 3b. 问题数据换成繁体版：questions.js -> questions-zh-Hant.js
    //  QUESTIONS / LEVEL_NAMES / LEVEL_ICONS 是简体文案，繁体页直接引用会显示简体
    //  （知识图谱节点 tooltip、question.html 的问题标题）。
    //  繁体数据由 scripts/build-questions-data.js 生成。
    src = src.replace(
        /(\bsrc\s*=\s*["'][^"']*assets\/data\/)questions\.js(["'])/gi,
        '$1questions-zh-Hant.js$2'
    );

    // 4. 分段 s2t 转换
    const segs = splitByOpaqueTags(src);
    return segs
        .map(s => (s.kind === 'opaque' ? transformOpaqueSegment(s) : transformHtmlSegment(s.text)))
        .join('');
}

// ----------------------------------------------------------------------
// 文件系统操作
// ----------------------------------------------------------------------

function rmDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.rmSync(dir, { recursive: true, force: true });
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function walkHtml(subdir) {
    const abs = path.join(SRC, subdir);
    if (!fs.existsSync(abs)) return [];
    return fs
        .readdirSync(abs)
        .filter(f => f.toLowerCase().endsWith('.html'))
        .map(f => path.join(subdir, f)); // 相对 docs/ 的路径
}

function main() {
    // 保护：不要意外把自己（zh-Hant 目录）当源
    if (path.resolve(SRC) === path.resolve(OUT)) {
        console.error('SRC and OUT are same, abort');
        process.exit(1);
    }

    rmDir(OUT);
    ensureDir(OUT);

    let total = 0;
    for (const sub of CONTENT_DIRS) {
        const files = walkHtml(sub);
        if (files.length === 0) continue;
        const outSub = path.join(OUT, sub);
        ensureDir(outSub);
        for (const relPath of files) {
            const srcAbs = path.join(SRC, relPath);
            const outAbs = path.join(OUT, relPath);
            const raw = fs.readFileSync(srcAbs, 'utf8');
            const converted = transformDocument(raw);
            fs.writeFileSync(outAbs, converted, 'utf8');
            total++;
        }
    }

    console.log('[build-zh-hant] wrote %d HTML files to docs/zh-Hant/', total);
}

main();
