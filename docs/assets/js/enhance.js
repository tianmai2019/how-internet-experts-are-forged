/* ============================================
   全局UI增强脚本
   - 主题切换（亮色/暗色）
   - 回到顶部按钮
   - 阅读进度条
   - 已阅读文章标记
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
    // 6. 键盘快捷键
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
