#!/usr/bin/env node
/**
 * inject-hreflang.js
 *
 * 给站内所有 HTML 页面在 <head> 里注入 hreflang 交替链接标签（三语）：
 *   <link rel="alternate" hreflang="zh-Hans" href="/PATH">
 *   <link rel="alternate" hreflang="zh-Hant" href="/zh-Hant/PATH">
 *   <link rel="alternate" hreflang="en"      href="/en/PATH">
 *   <link rel="alternate" hreflang="x-default" href="/PATH">
 *
 * 映射：
 *   docs/PATH              <=>  hreflang PATH="/PATH"      (zh-Hans)
 *   docs/zh-Hant/PATH      <=>  hreflang PATH="/PATH"      (zh-Hant)
 *   docs/en/PATH           <=>  hreflang PATH="/PATH"      (en)
 *
 * 幂等：脚本会先删除已有的 rel="alternate" hreflang="..." 行（含旧的 zh-CN），
 * 再注入最新的三语版本。
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(REPO_ROOT, 'docs');

function collectFiles() {
    const dirs = [
        path.join(DOCS),
        path.join(DOCS, 'articles'),
        path.join(DOCS, 'questions'),
        path.join(DOCS, 'en'),
        path.join(DOCS, 'en', 'articles'),
        path.join(DOCS, 'en', 'questions'),
        path.join(DOCS, 'zh-Hant'),
        path.join(DOCS, 'zh-Hant', 'articles'),
        path.join(DOCS, 'zh-Hant', 'questions'),
    ];
    const files = [];
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        for (const entry of fs.readdirSync(dir)) {
            if (!entry.endsWith('.html')) continue;
            files.push(path.join(dir, entry));
        }
    }
    return files;
}

// 把 docs/... 下的任意物理路径 -> "去掉语言前缀"后的逻辑路径
//   docs/index.html                            -> /index.html
//   docs/articles/q02.html                     -> /articles/q02.html
//   docs/en/index.html                         -> /index.html
//   docs/en/articles/q02.html                  -> /articles/q02.html
//   docs/zh-Hant/index.html                    -> /index.html
//   docs/zh-Hant/articles/q02.html             -> /articles/q02.html
function toLogicalPath(absPath) {
    const rel = path.relative(DOCS, absPath).split(path.sep).join('/');
    let logical = rel;
    if (logical.startsWith('en/')) logical = logical.slice(3);
    else if (logical === 'en') logical = '';
    else if (logical.startsWith('zh-Hant/')) logical = logical.slice('zh-Hant/'.length);
    else if (logical === 'zh-Hant') logical = '';
    return '/' + logical;
}

function build(absPath) {
    const logical = toLogicalPath(absPath);
    const zhHans = logical;
    const zhHant = '/zh-Hant' + logical;
    const en = '/en' + logical;
    return (
        '    <link rel="alternate" hreflang="zh-Hans" href="' + zhHans + '">\n' +
        '    <link rel="alternate" hreflang="zh-Hant" href="' + zhHant + '">\n' +
        '    <link rel="alternate" hreflang="en" href="' + en + '">\n' +
        '    <link rel="alternate" hreflang="x-default" href="' + zhHans + '">\n'
    );
}

// 匹配所有既有的 hreflang <link> 标签行（含前导缩进和行末换行）
const HREFLANG_LINE_RE =
    /^[ \t]*<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*\r?\n/gim;

function processFile(absPath) {
    const src = fs.readFileSync(absPath, 'utf8');

    // 1. 先剥离所有旧的 hreflang 行（zh-CN / en / x-default / 也许 zh-Hans 之类）
    let out = src.replace(HREFLANG_LINE_RE, '');

    // 2. 在 </head> 前注入新的四行
    const headEndIdx = out.indexOf('</head>');
    if (headEndIdx === -1) {
        return { file: absPath, skipped: true, reason: 'no </head>', linksAdded: 0 };
    }
    const block = build(absPath);
    out = out.slice(0, headEndIdx) + block + out.slice(headEndIdx);

    // 只有内容真的变了才写盘（保持 mtime 稳定）
    if (out === src) {
        return { file: absPath, skipped: true, reason: 'no change', linksAdded: 0 };
    }
    fs.writeFileSync(absPath, out, 'utf8');
    return { file: absPath, skipped: false, linksAdded: 4 };
}

function main() {
    const files = collectFiles();
    let totalLinks = 0;
    let processed = 0;
    let skipped = 0;
    for (const f of files) {
        const res = processFile(f);
        if (res.skipped) {
            skipped++;
        } else {
            processed++;
            totalLinks += res.linksAdded;
        }
    }
    console.log(
        '[inject-hreflang] scanned=%d, injected=%d, skipped=%d, linkTagsAdded=%d',
        files.length,
        processed,
        skipped,
        totalLinks
    );
}

main();
