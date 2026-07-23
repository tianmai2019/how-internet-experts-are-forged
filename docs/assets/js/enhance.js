/* ============================================
   全局UI增强脚本
   - 主题切换（亮色/暗色）
   - 回到顶部按钮
   - 阅读进度条
   - 已阅读文章标记
   - 侧边导航目录
   - 键盘快捷键
   - Giscus 评论（文章页自动注入）
   - 全文搜索（浮动按钮 + 模态框）
   ============================================ */

(function() {
    'use strict';

    // ==========================================
    // 1. 主题管理
    // ==========================================
    const ThemeManager = {
        THEME_KEY: 'ihef-theme',

        init: function() {
            // 加载保存的主题
            const savedTheme = localStorage.getItem(this.THEME_KEY);
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (systemDark ? 'dark' : 'light');
            this.setTheme(theme);
            this.createToggleButton();
        },

        setTheme: function(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(this.THEME_KEY, theme);
            this.updateButtonIcon(theme);
            // 通知其他模块（如 Giscus）主题变了
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
        },

        toggle: function() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'light' ? 'dark' : 'light';
            this.setTheme(next);
        },

        updateButtonIcon: function(theme) {
            const btn = document.getElementById('theme-toggle-btn');
            if (btn) {
                btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
                btn.title = theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式';
            }
        },

        createToggleButton: function() {
            const btn = document.createElement('button');
            btn.id = 'theme-toggle-btn';
            btn.className = 'theme-toggle';
            btn.setAttribute('aria-label', '切换主题');
            btn.onclick = () => this.toggle();
            document.body.appendChild(btn);

            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            this.updateButtonIcon(currentTheme);
        }
    };

    // ==========================================
    // 2. 回到顶部
    // ==========================================
    const BackToTop = {
        init: function() {
            this.createButton();
            window.addEventListener('scroll', () => this.onScroll());
        },

        createButton: function() {
            const btn = document.createElement('button');
            btn.id = 'back-to-top-btn';
            btn.className = 'back-to-top';
            btn.innerHTML = '⬆';
            btn.setAttribute('aria-label', '回到顶部');
            btn.onclick = () => this.scrollToTop();
            document.body.appendChild(btn);
        },

        onScroll: function() {
            const btn = document.getElementById('back-to-top-btn');
            if (!btn) return;
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        },

        scrollToTop: function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ==========================================
    // 3. 阅读进度条
    // ==========================================
    const ReadingProgress = {
        init: function() {
            // 只在文章页显示
            const isArticle = document.querySelector('.article-content, .content');
            if (!isArticle) return;

            this.createProgressBar();
            window.addEventListener('scroll', () => this.updateProgress());
        },

        createProgressBar: function() {
            const bar = document.createElement('div');
            bar.id = 'reading-progress-bar';
            bar.className = 'reading-progress';
            document.body.appendChild(bar);
        },

        updateProgress: function() {
            const bar = document.getElementById('reading-progress-bar');
            if (!bar) return;
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = percentage + '%';
        }
    };

    // ==========================================
    // 4. 已阅读文章追踪
    // ==========================================
    const ReadHistory = {
        STORAGE_KEY: 'ihef-read-articles',

        getReadArticles: function() {
            try {
                return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
            } catch (e) {
                return [];
            }
        },

        markAsRead: function(id) {
            const list = this.getReadArticles();
            if (!list.includes(id)) {
                list.push(id);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
            }
        },

        isRead: function(id) {
            return this.getReadArticles().includes(id);
        },

        init: function() {
            // 检测当前是否是文章页
            const path = window.location.pathname;
            const match = path.match(/q(\d+)\.html$/);
            if (match) {
                const id = parseInt(match[1]);
                // 用户在这个页面停留超过5秒就标记为已读
                setTimeout(() => this.markAsRead(id), 5000);
            }

            // 在问题地图页显示已读标记
            this.addReadBadges();
        },

        addReadBadges: function() {
            const readList = this.getReadArticles();
            document.querySelectorAll('a[href*="question.html?q="], a[href*="q0"], a[href*="q1"], a[href*="q2"], a[href*="q3"], a[href*="q4"], a[href*="q5"]').forEach(link => {
                // 知识图谱页的小方格节点自己会用 CSS ::after 角标表达"已读"，
                // 不要再往里塞文字标签，否则会撑坏 60x60 的正方形。
                if (link.classList.contains('question-node')) return;

                const href = link.getAttribute('href');
                let id = null;
                const paramMatch = href.match(/[?&]q=(\d+)/);
                const fileMatch = href.match(/q(\d+)\.html/);

                if (paramMatch) id = parseInt(paramMatch[1]);
                else if (fileMatch) id = parseInt(fileMatch[1]);

                if (id && readList.includes(id) && !link.querySelector('.question-read-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'question-read-badge';
                    badge.textContent = '✓ 已读';
                    link.appendChild(badge);
                }
            });
        }
    };

    // ==========================================
    // 5. 侧边导航（TOC）
    // ==========================================
    const SideTOC = {
        init: function() {
            const articleContent = document.querySelector('.article-content, .content');
            if (!articleContent) return;

            // 找到所有 h2 标题
            const headings = articleContent.querySelectorAll('h2');
            if (headings.length < 3) return; // 少于3个标题就不显示

            this.buildTOC(headings);
            this.setupScrollSpy(headings);
        },

        buildTOC: function(headings) {
            // 给每个 h2 加 id
            headings.forEach((h, i) => {
                if (!h.id) h.id = 'toc-heading-' + i;
            });

            const toc = document.createElement('nav');
            toc.className = 'side-toc';
            toc.innerHTML = '<h3>📖 目录</h3><ul></ul>';
            const ul = toc.querySelector('ul');

            headings.forEach(h => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + h.id;
                a.textContent = h.textContent.replace(/^[^一-龥a-zA-Z]+/, '').trim();
                a.dataset.target = h.id;
                a.onclick = (e) => {
                    e.preventDefault();
                    h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                };
                li.appendChild(a);
                ul.appendChild(li);
            });

            document.body.appendChild(toc);
        },

        setupScrollSpy: function(headings) {
            const links = document.querySelectorAll('.side-toc a');
            window.addEventListener('scroll', () => {
                let current = null;
                headings.forEach(h => {
                    const rect = h.getBoundingClientRect();
                    if (rect.top < 200) {
                        current = h.id;
                    }
                });
                links.forEach(l => {
                    if (l.dataset.target === current) {
                        l.classList.add('active');
                    } else {
                        l.classList.remove('active');
                    }
                });
            });
        }
    };

    // ==========================================
    // 6. Giscus 评论（文章页自动注入）
    // ==========================================
    const Comments = {
        // Giscus 配置（从 https://giscus.app 生成，2026-07-23 接入）
        REPO: 'tianmai2019/how-internet-experts-are-forged',   // 格式：owner/repo
        REPO_ID: 'R_kgDOTe0CdQ',
        CATEGORY: 'Announcements',
        CATEGORY_ID: 'DIC_kwDOTe0Cdc4DBziK',

        init: function() {
            // 仅在文章页注入：q01-q50.html 或主文章 01-how-internet-experts-are-forged.html
            const path = window.location.pathname;
            const isArticle = /q\d+\.html$/.test(path) || /01-how-internet-experts-are-forged\.html$/.test(path);
            if (!isArticle) return;

            // 未配置时不注入，避免 Giscus 抛错
            if (this.REPO_ID.startsWith('PLACEHOLDER') || this.CATEGORY_ID.startsWith('PLACEHOLDER')) {
                console.info('[Comments] Giscus 未配置，跳过注入。到 giscus.app 拿 repo-id / category-id 后填入 enhance.js 的 Comments 模块。');
                return;
            }

            const container = this.buildContainer();
            if (!container) return;

            this.loadGiscus(container);

            // 主题跟随
            window.addEventListener('themechange', () => {
                this.updateTheme();
            });
        },

        buildContainer: function() {
            // 优先插到 .article-content 或 .content 卡片内部末尾，保持视觉一致
            const contentEl = document.querySelector('.article-content') || document.querySelector('.content');
            if (!contentEl) return null;

            const wrap = document.createElement('div');
            wrap.className = 'comments-section';
            wrap.innerHTML = `
                <h2 style="margin-top: 40px;">💬 讨论区</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">用 GitHub 账号登录即可评论。点赞、追问都能看见。</p>
                <div class="giscus" id="giscus-container"></div>
            `;
            contentEl.appendChild(wrap);
            return document.getElementById('giscus-container');
        },

        loadGiscus: function(container) {
            const script = document.createElement('script');
            script.src = 'https://giscus.app/client.js';
            script.async = true;
            script.crossOrigin = 'anonymous';

            const attrs = {
                'data-repo': this.REPO,
                'data-repo-id': this.REPO_ID,
                'data-category': this.CATEGORY,
                'data-category-id': this.CATEGORY_ID,
                'data-mapping': 'pathname',
                'data-strict': '0',
                'data-reactions-enabled': '1',
                'data-emit-metadata': '0',
                'data-input-position': 'top',
                'data-theme': this.currentTheme(),
                'data-lang': 'zh-CN',
                'data-loading': 'lazy'
            };
            Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));

            container.appendChild(script);
        },

        currentTheme: function() {
            return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        },

        // 主题切换时通知 Giscus iframe
        updateTheme: function() {
            const frame = document.querySelector('iframe.giscus-frame');
            if (!frame) return;
            frame.contentWindow.postMessage(
                { giscus: { setConfig: { theme: this.currentTheme() } } },
                'https://giscus.app'
            );
        }
    };

    // ==========================================
    // 7. 键盘快捷键
    // ==========================================
    const KeyboardShortcuts = {
        init: function() {
            document.addEventListener('keydown', (e) => {
                // 忽略在输入框中的按键
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                // Ctrl/Cmd + K : 打开知识地图
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.goToMap();
                }

                // T : 切换主题
                if (e.key === 't' || e.key === 'T') {
                    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                        ThemeManager.toggle();
                    }
                }

                // H : 回到首页
                if (e.key === 'h' || e.key === 'H') {
                    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                        this.goToHome();
                    }
                }
            });
        },

        goToMap: function() {
            const path = window.location.pathname;
            if (path.includes('/articles/')) {
                window.location.href = '../questions/00-question-map.html';
            } else if (path.includes('/questions/')) {
                // 已经在地图
            } else {
                window.location.href = 'questions/00-question-map.html';
            }
        },

        goToHome: function() {
            const path = window.location.pathname;
            if (path.includes('/articles/') || path.includes('/questions/')) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    };

    // ==========================================
    // 7. 全文搜索（浮动按钮 + 模态框）
    // ==========================================
    const Search = {
        INDEX_URL_HINT: 'assets/data/search-index.json',  // 相对于 docs/ 根

        docs: null,          // 索引数据（延迟加载）
        loading: false,
        modalOpen: false,

        init: function() {
            this.buildButton();
            this.buildModal();
            this.bindKeyboard();
        },

        // 计算 search-index.json 的相对路径
        resolveIndexUrl: function() {
            const path = window.location.pathname;
            if (/\/articles\//.test(path) || /\/questions\//.test(path)) {
                return '../assets/data/search-index.json';
            }
            return 'assets/data/search-index.json';
        },

        buildButton: function() {
            const btn = document.createElement('button');
            btn.id = 'search-toggle';
            btn.className = 'search-toggle';
            btn.setAttribute('aria-label', '搜索文章 (快捷键 /)');
            btn.title = '搜索文章 (/)';
            btn.innerHTML = '🔍';
            btn.addEventListener('click', () => this.open());
            document.body.appendChild(btn);
        },

        buildModal: function() {
            const modal = document.createElement('div');
            modal.id = 'search-modal';
            modal.className = 'search-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.innerHTML = `
                <div class="search-modal-backdrop" data-close></div>
                <div class="search-modal-panel">
                    <div class="search-input-wrap">
                        <span class="search-input-icon">🔍</span>
                        <input type="search" id="search-input" class="search-input"
                               placeholder="搜索 50 篇文章…（比如：缓存、幻觉、CAP、推荐系统）"
                               autocomplete="off" spellcheck="false">
                        <button class="search-close" data-close aria-label="关闭">✕</button>
                    </div>
                    <div class="search-status" id="search-status">请输入至少 2 个字符</div>
                    <ul class="search-results" id="search-results"></ul>
                    <div class="search-hint">
                        <kbd>↑</kbd><kbd>↓</kbd> 选择 &nbsp; <kbd>Enter</kbd> 打开 &nbsp; <kbd>Esc</kbd> 关闭
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 关闭：点击遮罩或叉号
            modal.querySelectorAll('[data-close]').forEach(el => {
                el.addEventListener('click', () => this.close());
            });

            // 输入框事件
            const input = modal.querySelector('#search-input');
            input.addEventListener('input', () => this.query(input.value));
            input.addEventListener('keydown', (e) => this.handleInputKey(e));
        },

        bindKeyboard: function() {
            document.addEventListener('keydown', (e) => {
                // 不拦截输入框里的按键
                const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
                if (inInput && !this.modalOpen) return;

                // / 打开搜索（非输入框场景）
                if (!inInput && e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    this.open();
                }

                // Esc 关闭
                if (e.key === 'Escape' && this.modalOpen) {
                    e.preventDefault();
                    this.close();
                }
            });
        },

        open: function() {
            document.getElementById('search-modal').classList.add('open');
            this.modalOpen = true;
            document.body.style.overflow = 'hidden';
            const input = document.getElementById('search-input');
            setTimeout(() => input.focus(), 50);

            // 首次打开时加载索引
            if (!this.docs && !this.loading) {
                this.loadIndex();
            }
        },

        close: function() {
            document.getElementById('search-modal').classList.remove('open');
            this.modalOpen = false;
            document.body.style.overflow = '';
        },

        loadIndex: function() {
            this.loading = true;
            const status = document.getElementById('search-status');
            status.textContent = '正在加载索引…';

            fetch(this.resolveIndexUrl())
                .then(r => {
                    if (!r.ok) throw new Error(r.status);
                    return r.json();
                })
                .then(data => {
                    this.docs = data;
                    this.loading = false;
                    const cur = document.getElementById('search-input').value.trim();
                    if (cur.length >= 2) {
                        this.query(cur);
                    } else {
                        status.textContent = `已加载 ${data.length} 篇文章。输入关键词开始搜索。`;
                    }
                })
                .catch(err => {
                    console.error('[Search] 加载索引失败:', err);
                    this.loading = false;
                    status.textContent = '⚠️ 加载索引失败，请刷新页面重试';
                });
        },

        query: function(q) {
            const status = document.getElementById('search-status');
            const results = document.getElementById('search-results');
            const term = q.trim().toLowerCase();

            if (term.length < 2) {
                status.textContent = '请输入至少 2 个字符';
                results.innerHTML = '';
                return;
            }
            if (!this.docs) {
                status.textContent = this.loading ? '正在加载索引…' : '索引未就绪';
                return;
            }

            const matches = this.rank(term);
            if (matches.length === 0) {
                status.textContent = `未找到与 "${q}" 相关的文章`;
                results.innerHTML = '';
                return;
            }

            status.textContent = `找到 ${matches.length} 篇 (显示前 ${Math.min(20, matches.length)} 条)`;
            results.innerHTML = matches.slice(0, 20).map((m, i) => this.renderItem(m, term, i)).join('');
            this.activeIndex = 0;
            this.highlightActive();
        },

        // 简易评分：标题命中 x5，正文命中 x1，多次出现累加
        rank: function(term) {
            const scored = [];
            for (const doc of this.docs) {
                const titleLower = doc.title.toLowerCase();
                const textLower = doc.text.toLowerCase();

                // 标题命中
                let titleHits = 0;
                let idx = titleLower.indexOf(term);
                while (idx !== -1) {
                    titleHits++;
                    idx = titleLower.indexOf(term, idx + term.length);
                }

                // 正文命中
                let textHits = 0;
                idx = textLower.indexOf(term);
                while (idx !== -1) {
                    textHits++;
                    idx = textLower.indexOf(term, idx + term.length);
                    if (textHits > 50) break; // 上限避免超长字符
                }

                const score = titleHits * 5 + textHits;
                if (score > 0) {
                    scored.push({ doc, score, titleHits, textHits });
                }
            }
            scored.sort((a, b) => b.score - a.score);
            return scored;
        },

        renderItem: function(match, term, i) {
            const { doc, titleHits, textHits } = match;
            const levelIcon = ['🌟','🎯','🔨','🌊','⚖️','👑','💬'][doc.level] || '📄';
            const titleHtml = this.highlight(doc.title, term);
            const snippetHtml = this.buildSnippet(doc.text, term);
            const url = this.resolveArticleUrl(doc.url);
            const badge = titleHits > 0 ? '<span class="search-badge">标题命中</span>' : '';

            return `
                <li class="search-item" data-index="${i}" data-url="${url}">
                    <a href="${url}">
                        <div class="search-item-title">
                            <span class="search-item-icon">${levelIcon}</span>
                            ${doc.qid > 0 ? `<span class="search-item-qid">Q${doc.qid}</span>` : ''}
                            <span class="search-item-name">${titleHtml}</span>
                            ${badge}
                        </div>
                        <div class="search-item-snippet">${snippetHtml}</div>
                    </a>
                </li>
            `;
        },

        resolveArticleUrl: function(relUrl) {
            const path = window.location.pathname;
            if (/\/articles\//.test(path) || /\/questions\//.test(path)) {
                return '../' + relUrl;
            }
            return relUrl;
        },

        // 从正文里挖第一个命中的上下文片段
        buildSnippet: function(text, term) {
            const idx = text.toLowerCase().indexOf(term);
            if (idx === -1) return text.slice(0, 120) + '…';

            const start = Math.max(0, idx - 40);
            const end = Math.min(text.length, idx + term.length + 80);
            let snippet = text.slice(start, end);
            if (start > 0) snippet = '…' + snippet;
            if (end < text.length) snippet = snippet + '…';
            return this.highlight(snippet, term);
        },

        highlight: function(text, term) {
            const escaped = this.escapeHtml(text);
            const re = new RegExp(this.escapeRegex(term), 'gi');
            return escaped.replace(re, m => `<mark>${m}</mark>`);
        },

        escapeHtml: function(s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        escapeRegex: function(s) {
            return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        activeIndex: 0,

        handleInputKey: function(e) {
            const items = document.querySelectorAll('.search-item');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.activeIndex = Math.min(items.length - 1, this.activeIndex + 1);
                this.highlightActive();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.activeIndex = Math.max(0, this.activeIndex - 1);
                this.highlightActive();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const active = items[this.activeIndex];
                if (active) {
                    window.location.href = active.dataset.url;
                }
            }
        },

        highlightActive: function() {
            const items = document.querySelectorAll('.search-item');
            items.forEach((item, i) => {
                item.classList.toggle('active', i === this.activeIndex);
                if (i === this.activeIndex) {
                    item.scrollIntoView({ block: 'nearest' });
                }
            });
        }
    };

    // ==========================================
    // 初始化所有模块
    // ==========================================
    function init() {
        // 动态注入 side-toc.css
        injectSideTocCSS();

        ThemeManager.init();
        BackToTop.init();
        ReadingProgress.init();
        ReadHistory.init();
        SideTOC.init();
        Comments.init();
        Search.init();
        KeyboardShortcuts.init();
    }

    function injectSideTocCSS() {
        // 查找当前脚本所在的目录，推断出CSS路径
        const scriptSrc = document.querySelector('script[src*="enhance.js"]')?.src || '';
        const cssPath = scriptSrc.replace(/js\/enhance\.js.*$/, 'css/side-toc.css');
        if (cssPath && !document.querySelector('link[href*="side-toc.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
