#!/usr/bin/env node
/**
 * inject-hreflang.js
 *
 * 给站内所有 HTML 页面在 <head> 里注入 hreflang 交替链接标签：
 *   <link rel="alternate" hreflang="en"    href="/en/PATH">
 *   <link rel="alternate" hreflang="zh-CN" href="/PATH">
 *
 * 中英对应关系：docs/xxx.html <=> docs/en/xxx.html
 * 即 hreflang 的 PATH 用 "去掉 /en/ 前缀" 后的相对根路径。
 *
 * 幂等：若文件里已经有 rel="alternate" hreflang="en" 就跳过。
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(REPO_ROOT, 'docs');

// 收集所有目标 HTML
function collectFiles() {
    const dirs = [
        path.join(DOCS),
        path.join(DOCS, 'articles'),
        path.join(DOCS, 'questions'),
        path.join(DOCS, 'en'),
        path.join(DOCS, 'en', 'articles'),
        path.join(DOCS, 'en', 'questions'),
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

// docs 根下 relative path -> "无 /en 前缀" 的 hreflang PATH
function toLogicalPath(absPath) {
    const rel = path.relative(DOCS, absPath).split(path.sep).join('/');
    // rel 举例：
    //   index.html
    //   articles/q13.html
    //   en/articles/q13.html
    //   en/index.html
    let logical = rel;
    if (logical.startsWith('en/')) logical = logical.slice(3);
    else if (logical === 'en') logical = '';
    return '/' + logical;
}

function build(absPath) {
    const logical = toLogicalPath(absPath);
    const enUrl = '/en' + logical;
    const zhUrl = logical;
    return (
        '    <link rel="alternate" hreflang="en" href="' + enUrl + '">\n' +
        '    <link rel="alternate" hreflang="zh-CN" href="' + zhUrl + '">\n' +
        '    <link rel="alternate" hreflang="x-default" href="' + zhUrl + '">\n'
    );
}

function processFile(absPath) {
    const src = fs.readFileSync(absPath, 'utf8');

    if (/rel=["']alternate["']\s+hreflang=["']en["']/.test(src)) {
        return { file: absPath, skipped: true, linksAdded: 0 };
    }

    const headEndIdx = src.indexOf('</head>');
    if (headEndIdx === -1) {
        return { file: absPath, skipped: true, reason: 'no </head>', linksAdded: 0 };
    }

    const block = build(absPath);
    const out = src.slice(0, headEndIdx) + block + src.slice(headEndIdx);
    fs.writeFileSync(absPath, out, 'utf8');
    // 我们注入的 <link> 标签行数（不含 x-default 也是 alternate 链接）
    return { file: absPath, skipped: false, linksAdded: 3 };
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
    console.log('[inject-hreflang] scanned=%d, injected=%d, skipped=%d, linkTagsAdded=%d',
        files.length, processed, skipped, totalLinks);
}

main();
