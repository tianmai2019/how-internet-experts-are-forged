#!/usr/bin/env node
/*
 * 构建全文搜索索引
 * ------------------------------
 * 扫描 docs/articles/qNN.html，抽取标题 + 正文文本，输出
 * docs/assets/data/search-index.json。
 *
 * 前端 (enhance.js 的 Search 模块) 加载这份 JSON 到 MiniSearch 里。
 *
 * 用法：
 *   node scripts/build-search-index.js
 *
 * 依赖：无（只用 Node 内置 fs / path）。刻意不用 cheerio 之类的重库，
 * 因为 HTML 结构很稳定，正则足够。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'docs', 'articles');
const QUESTIONS_JS = path.join(ROOT, 'docs', 'assets', 'data', 'questions.js');
const OUT_PATH = path.join(ROOT, 'docs', 'assets', 'data', 'search-index.json');

// 从 questions.js 读取问题元信息（编号 → text/level）
function loadQuestions() {
    const src = fs.readFileSync(QUESTIONS_JS, 'utf-8');
    // 匹配 `N: { text: "...", level: X },` 形式
    const map = {};
    const re = /(\d+):\s*\{\s*text:\s*"([^"]+)"\s*,\s*level:\s*(\d+)\s*\}/g;
    let m;
    while ((m = re.exec(src))) {
        map[m[1]] = { text: m[2], level: Number(m[3]) };
    }
    return map;
}

// 从一个 HTML 文件里抽取正文纯文本
function extractText(html) {
    // 1) 去掉 <script> 和 <style> 内容
    let s = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');

    // 2) 只保留 <div class="article-content">…</div> 或 <div class="content">…</div>
    //    如果没匹配到就 fallback 用整个 body（老文章可能没有 article-content）
    const contentMatch = s.match(/<div class="(?:article-content|content)"[^>]*>([\s\S]*?)<\/div>\s*<footer/i)
        || s.match(/<div class="(?:article-content|content)"[^>]*>([\s\S]*)/i);
    if (contentMatch) {
        s = contentMatch[1];
    }

    // 3) 去掉所有 HTML 标签
    s = s.replace(/<[^>]+>/g, ' ');

    // 4) 解 HTML 实体
    s = s.replace(/&nbsp;/g, ' ')
         .replace(/&amp;/g, '&')
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .replace(/&quot;/g, '"')
         .replace(/&#39;/g, "'");

    // 5) 压缩空白
    s = s.replace(/\s+/g, ' ').trim();

    return s;
}

function extractTitle(html) {
    const m = html.match(/<title>([^<]+)<\/title>/i);
    if (!m) return null;
    let t = m[1].trim();
    // 去掉 "Q1：" / "Q42:" 之类前缀
    t = t.replace(/^Q\d+[：:]\s*/i, '');
    return t;
}

function main() {
    const questions = loadQuestions();
    const files = fs.readdirSync(ARTICLES_DIR).filter(f => /^q\d+\.html$/i.test(f)).sort();

    if (files.length === 0) {
        console.error('[build-search-index] 没找到任何 qNN.html');
        process.exit(1);
    }

    const docs = [];
    for (const file of files) {
        const qid = Number(file.match(/q(\d+)\.html/i)[1]);
        const full = path.join(ARTICLES_DIR, file);
        const html = fs.readFileSync(full, 'utf-8');
        const title = extractTitle(html) || (questions[qid]?.text ?? `Q${qid}`);
        const text = extractText(html);
        const level = questions[qid]?.level ?? 0;

        docs.push({
            id: qid,
            qid,
            title,
            text,
            level,
            url: `articles/${file}`
        });
    }

    // 主文章也进索引
    const mainFile = path.join(ARTICLES_DIR, '01-how-internet-experts-are-forged.html');
    if (fs.existsSync(mainFile)) {
        const html = fs.readFileSync(mainFile, 'utf-8');
        docs.push({
            id: 0,
            qid: 0,
            title: '互联网大帝是如何炼成的（主文章）',
            text: extractText(html),
            level: 0,
            url: 'articles/01-how-internet-experts-are-forged.html'
        });
    }

    fs.writeFileSync(OUT_PATH, JSON.stringify(docs, null, 0), 'utf-8');

    const totalChars = docs.reduce((s, d) => s + d.text.length, 0);
    console.log(`[build-search-index] ✅ 索引 ${docs.length} 篇文章，共 ${totalChars.toLocaleString()} 字符`);
    console.log(`[build-search-index] 输出 → ${path.relative(ROOT, OUT_PATH)}`);
    const size = fs.statSync(OUT_PATH).size;
    console.log(`[build-search-index] 文件大小: ${(size / 1024).toFixed(1)} KB`);
}

main();
