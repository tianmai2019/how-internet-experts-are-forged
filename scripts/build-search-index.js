#!/usr/bin/env node
/*
 * 构建全文搜索索引
 * ------------------------------
 * 扫描 docs/articles/qNN.html（zh-Hans / zh-Hant / en 三种目录），
 * 抽取标题 + 正文文本，输出：
 *   - docs/assets/data/search-index.json        （简体中文索引）
 *   - docs/assets/data/search-index-zh-Hant.json（繁体中文索引）
 *   - docs/assets/data/search-index-en.json     （英文索引）
 *
 * 前端 (enhance.js 的 Search 模块) 根据当前 <html lang> 加载对应索引。
 *
 * 用法：
 *   node scripts/build-search-index.js               # 三个索引都构建
 *   node scripts/build-search-index.js zh            # 只构建简体
 *   node scripts/build-search-index.js zh-Hant       # 只构建繁体
 *   node scripts/build-search-index.js en            # 只构建英文
 *
 * 依赖：无（只用 Node 内置 fs / path）。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUESTIONS_JS = path.join(ROOT, 'docs', 'assets', 'data', 'questions.js');

// 语言配置：目录 + 输出文件 + 主文章标题
const LOCALES = {
    zh: {
        articlesDir: path.join(ROOT, 'docs', 'articles'),
        outPath: path.join(ROOT, 'docs', 'assets', 'data', 'search-index.json'),
        urlPrefix: 'articles/',
        mainTitle: '互联网大帝是如何炼成的（主文章）',
    },
    'zh-Hant': {
        articlesDir: path.join(ROOT, 'docs', 'zh-Hant', 'articles'),
        outPath: path.join(ROOT, 'docs', 'assets', 'data', 'search-index-zh-Hant.json'),
        urlPrefix: 'zh-Hant/articles/',
        mainTitle: '互聯網大帝是如何煉成的（主文章）',
    },
    en: {
        articlesDir: path.join(ROOT, 'docs', 'en', 'articles'),
        outPath: path.join(ROOT, 'docs', 'assets', 'data', 'search-index-en.json'),
        urlPrefix: 'en/articles/',
        mainTitle: 'How Internet Grandmasters Are Forged (main article)',
    },
};

// 从 questions.js 读取问题元信息（编号 → text/level）
function loadQuestions() {
    const src = fs.readFileSync(QUESTIONS_JS, 'utf-8');
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
    let s = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');

    const contentMatch = s.match(/<div class="(?:article-content|content)"[^>]*>([\s\S]*?)<\/div>\s*<footer/i)
        || s.match(/<div class="(?:article-content|content)"[^>]*>([\s\S]*)/i);
    if (contentMatch) {
        s = contentMatch[1];
    }

    s = s.replace(/<[^>]+>/g, ' ');

    s = s.replace(/&nbsp;/g, ' ')
         .replace(/&amp;/g, '&')
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .replace(/&quot;/g, '"')
         .replace(/&#39;/g, "'");

    s = s.replace(/\s+/g, ' ').trim();

    return s;
}

function extractTitle(html) {
    const m = html.match(/<title>([^<]+)<\/title>/i);
    if (!m) return null;
    let t = m[1].trim();
    // 去掉 "Q1：" / "Q42:" / "Q13. " 之类前缀
    t = t.replace(/^Q\d+\s*[:：\.\s]\s*/i, '');
    return t;
}

function buildLocale(locale, questions) {
    const cfg = LOCALES[locale];
    if (!fs.existsSync(cfg.articlesDir)) {
        console.warn(`[build-search-index:${locale}] 目录不存在，跳过: ${path.relative(ROOT, cfg.articlesDir)}`);
        return;
    }

    const files = fs.readdirSync(cfg.articlesDir)
        .filter(f => /^q\d+\.html$/i.test(f))
        .sort();

    if (files.length === 0) {
        console.warn(`[build-search-index:${locale}] 没找到 qNN.html，跳过`);
        return;
    }

    const docs = [];
    for (const file of files) {
        const qid = Number(file.match(/q(\d+)\.html/i)[1]);
        const full = path.join(cfg.articlesDir, file);
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
            url: cfg.urlPrefix + file,
        });
    }

    // 主文章也进索引
    const mainFile = path.join(cfg.articlesDir, '01-how-internet-experts-are-forged.html');
    if (fs.existsSync(mainFile)) {
        const html = fs.readFileSync(mainFile, 'utf-8');
        docs.push({
            id: 0,
            qid: 0,
            title: cfg.mainTitle,
            text: extractText(html),
            level: 0,
            url: cfg.urlPrefix + '01-how-internet-experts-are-forged.html',
        });
    }

    fs.writeFileSync(cfg.outPath, JSON.stringify(docs, null, 0), 'utf-8');

    const totalChars = docs.reduce((s, d) => s + d.text.length, 0);
    const size = fs.statSync(cfg.outPath).size;
    console.log(`[build-search-index:${locale}] ✅ ${docs.length} 篇文章，${totalChars.toLocaleString()} 字符，${(size / 1024).toFixed(1)} KB → ${path.relative(ROOT, cfg.outPath)}`);
}

function main() {
    const arg = process.argv[2];
    const locales = arg && LOCALES[arg] ? [arg] : Object.keys(LOCALES);

    const questions = loadQuestions();
    for (const locale of locales) {
        buildLocale(locale, questions);
    }
}

main();
