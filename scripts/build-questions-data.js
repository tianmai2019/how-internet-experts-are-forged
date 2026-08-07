#!/usr/bin/env node
/**
 * build-questions-data.js
 *
 * 从简体源 docs/assets/data/questions.js 生成繁体版
 * docs/assets/data/questions-zh-Hant.js。
 *
 * 背景：questions.js 里的 QUESTIONS / LEVEL_NAMES / LEVEL_ICONS 被
 * knowledge-graph.html 与 articles/question.html 共用。繁体页如果直接引用简体版，
 * 节点 tooltip 和问题标题就会显示简体 —— 所以要生成一份平行的繁体数据文件。
 *
 * 英文版数据 (questions-en.js) 是人工翻译的，不由本脚本生成，只做存在性校验。
 *
 * 转换策略与 build-zh-hant.js 保持一致：OpenCC cn→tw（s2t 字形转换）。
 * 只转 CJK 字符串字面量，不动 identifier / 数字 / emoji。
 *
 * 幂等：每次全量重写输出文件。
 *
 * 用法：
 *   node scripts/build-questions-data.js
 */

const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

const REPO_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(REPO_ROOT, 'docs', 'assets', 'data');
const SRC = path.join(DATA_DIR, 'questions.js');
const OUT_HANT = path.join(DATA_DIR, 'questions-zh-Hant.js');
const OUT_EN = path.join(DATA_DIR, 'questions-en.js');

const convert = OpenCC.Converter({ from: 'cn', to: 'tw' });

// 只转含 CJK 的字符串字面量，与 build-zh-hant.js 同源逻辑
const CJK_RE = /[㐀-鿿豈-﫿]/;

function convertCjkStringLiterals(js) {
    let out = '';
    let i = 0;
    const n = js.length;

    while (i < n) {
        const ch = js[i];

        // 注释原样保留（不转，避免注释里的说明文字被改动带来无谓 diff）
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
            out += quote;   // 立即输出起始引号
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
                if (c === quote) {
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

const HEADER = `// ⚠️ 本文件由 scripts/build-questions-data.js 从 questions.js 自动生成，请勿手改。
// 重建：node scripts/build-questions-data.js
`;

function main() {
    if (!fs.existsSync(SRC)) {
        console.error('[build-questions-data] 找不到源文件: %s', SRC);
        process.exit(1);
    }

    const raw = fs.readFileSync(SRC, 'utf8');
    const converted = convertCjkStringLiterals(raw);

    // 保险：生成物必须是合法 JS，否则宁可失败也不要写出坏文件
    try {
        new (require('vm').Script)(converted, { filename: 'questions-zh-Hant.js' });
    } catch (err) {
        console.error('[build-questions-data] 生成结果语法错误，已中止写入: %s', err.message);
        process.exit(1);
    }

    fs.writeFileSync(OUT_HANT, HEADER + converted, 'utf8');
    console.log('[build-questions-data] ✅ 写入 docs/assets/data/questions-zh-Hant.js');

    // 英文数据是人工翻译，只校验存在性并提醒
    if (!fs.existsSync(OUT_EN)) {
        console.warn(
            '[build-questions-data] ⚠️  缺少 questions-en.js（人工维护，不自动生成）'
        );
    }
}

main();
