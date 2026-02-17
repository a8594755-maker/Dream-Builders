/* ═══════════════════════════════════════════════════════
   Dream Builders – main script
   Modular IIFE architecture, accessible, progressive
   ═══════════════════════════════════════════════════════ */

document.documentElement.classList.add('js');
document.body.classList.add('has-js');

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────
       1. MODAL SYSTEM
       Open  → [data-open-modal="id"]
       Close → [data-close-modal]  or  .modal__close
       Backdrop click closes, ESC closes
       body.modal-open locks scroll
       aria-hidden toggled, focus managed
    ────────────────────────────────────── */
    const ModalSystem = (() => {
        const openStack = [];

        function open(id) {
            const modal = document.getElementById(id);
            if (!modal || !modal.classList.contains('modal')) return;

            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            openStack.push(modal);

            const focusTarget = modal.querySelector(
                'input, button:not(.modal__close), [tabindex]:not([tabindex="-1"])'
            ) || modal.querySelector('.modal__close');
            if (focusTarget) focusTarget.focus();
        }

        function close(modal) {
            if (!modal) return;
            modal.setAttribute('aria-hidden', 'true');
            const idx = openStack.indexOf(modal);
            if (idx > -1) openStack.splice(idx, 1);
            if (openStack.length === 0) {
                document.body.classList.remove('modal-open');
            }
        }

        function closeCurrent() {
            if (openStack.length) close(openStack[openStack.length - 1]);
        }

        // Delegated listeners
        document.addEventListener('click', (e) => {
            const opener = e.target.closest('[data-open-modal]');
            if (opener) {
                e.preventDefault();
                open(opener.dataset.openModal);
                return;
            }

            const closer = e.target.closest('[data-close-modal]');
            if (closer) {
                e.preventDefault();
                close(closer.closest('.modal'));
                return;
            }

            // Backdrop click
            if (e.target.classList.contains('modal') && e.target.getAttribute('aria-hidden') === 'false') {
                close(e.target);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCurrent();
        });

        return { open, close, closeCurrent };
    })();

    /* ──────────────────────────────────────
       2. DOCS LAUNCHER
       Loads manifest.json → renders tiles → opens viewer modal
    ────────────────────────────────────── */
    const DocsLauncher = (() => {
        const GLYPH_MAP = {
            pdf:   '\u{1F4C4}',   // 📄
            doc:   '\u{1F4DD}',   // 📝
            docx:  '\u{1F4DD}',
            sheet: '\u{1F4CA}',   // 📊
            xlsx:  '\u{1F4CA}',
            slide: '\u{1F4C8}',   // 📈
            pptx:  '\u{1F4C8}',
            default: '\u{1F4CE}'  // 📎
        };

        function inferType(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            if (ext === 'pdf') return 'pdf';
            if (ext === 'doc' || ext === 'docx') return 'doc';
            if (ext === 'xls' || ext === 'xlsx') return 'sheet';
            if (ext === 'ppt' || ext === 'pptx') return 'slide';
            return 'default';
        }

        function glyphFor(type) {
            return GLYPH_MAP[type] || GLYPH_MAP.default;
        }

        async function init() {
            const grid = document.getElementById('docs-launcher-grid');
            if (!grid) return;

            // Determine base path for manifest
            const scriptSrc = document.querySelector('script[src*="script.js"]');
            const isSubdir = scriptSrc && scriptSrc.getAttribute('src').startsWith('..');
            const basePath = isSubdir ? '../' : '';

            try {
                const resp = await fetch(basePath + 'docs/manifest.json');
                if (!resp.ok) return;
                const docs = await resp.json();
                renderTiles(grid, docs, basePath);
            } catch (_) {
                // manifest not found – silently degrade
            }
        }

        function renderTiles(grid, docs, basePath) {
            grid.innerHTML = '';
            docs.forEach((doc) => {
                const type = inferType(doc.file);
                const tile = document.createElement('div');
                tile.className = 'docs-tile';
                tile.setAttribute('role', 'button');
                tile.setAttribute('tabindex', '0');
                tile.innerHTML =
                    '<span class="docs-tile__glyph">' + glyphFor(type) + '</span>' +
                    '<span class="docs-tile__name">' + escHtml(doc.name) + '</span>' +
                    '<span class="docs-tile__type">' + type.toUpperCase() + '</span>';

                const filePath = basePath + doc.file;

                tile.addEventListener('click', () => openViewer(doc.name, filePath, type));
                tile.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openViewer(doc.name, filePath, type);
                    }
                });

                grid.appendChild(tile);
            });
        }

        function openViewer(name, path, type) {
            const viewer = document.getElementById('docs-viewer-modal');
            if (!viewer) return;

            const title = viewer.querySelector('.modal__viewer-title');
            const frame = viewer.querySelector('.modal__viewer-frame');
            const openLink = viewer.querySelector('.modal__viewer-open');

            if (title) title.textContent = name;
            if (openLink) openLink.href = path;

                if (frame) {
                    if (type === 'pdf') {
                        frame.src = path;
                    } else {
                        const absoluteDocUrl = new URL(path, window.location.href);
                        frame.src = 'https://view.officeapps.live.com/op/embed.aspx?src=' +
                            encodeURIComponent(absoluteDocUrl.href);
                    }
                }

            ModalSystem.open('docs-viewer-modal');
        }

        function escHtml(str) {
            const d = document.createElement('div');
            d.textContent = str;
            return d.innerHTML;
        }

        init();
        return { init };
    })();

    /* ──────────────────────────────────────
       3. GALLERY ALBUM TABS
    ────────────────────────────────────── */
    const albumBtns = document.querySelectorAll('.album-btn');
    const albums    = document.querySelectorAll('.album');

    albumBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.album;
            albumBtns.forEach(b => b.classList.remove('active'));
            albums.forEach(a => a.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(id);
            if (target) target.classList.add('active');
        });
    });

    /* ──────────────────────────────────────
       4. SCROLL REVEAL + STAGGER
       Progressive enhancement:
       Content visible by default;
       only hidden when body.has-js is active
    ────────────────────────────────────── */
    const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsIO = 'IntersectionObserver' in window;
    const revealItems = document.querySelectorAll('.reveal');

    // Stagger children
    document.querySelectorAll('[data-stagger="children"]').forEach(group => {
        const children = Array.from(group.children).filter(c => c.classList.contains('reveal'));
        children.forEach((child, idx) => {
            child.style.transitionDelay = idx * 80 + 'ms';
        });
    });

    if (prefersReducedMotion || !supportsIO) {
        revealItems.forEach(item => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

        revealItems.forEach(item => revealObserver.observe(item));
    }

    /* ──────────────────────────────────────
       5. BROKEN-IMAGE FALLBACK
    ────────────────────────────────────── */
    document.querySelectorAll('.image-placeholder img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.display = 'none';
            const ph = this.nextElementSibling;
            if (ph && ph.classList.contains('placeholder-content')) ph.style.display = 'flex';
        });
        if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
    });

    /* ──────────────────────────────────────
       6. EXTERNAL LINKS → NEW TAB
    ────────────────────────────────────── */
    document.querySelectorAll('a[href^="http"]').forEach(a => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
    });

    /* ──────────────────────────────────────
       7. QUILT PROGRESS – "Color the Quilt"
       Creates 40 tile divs (8×5) over the
       full image. Each tile shows the color
       image cropped to its grid cell.
    ────────────────────────────────────── */
    const QuiltProgress = (() => {
        const COLS = 8;
        const ROWS = 5;
        const TOTAL = COLS * ROWS; // 40
        const REVEAL_SEED = 'dream-builders-quilt-2026';

        const container = document.getElementById('quiltTiles');
        const countEl   = document.getElementById('beddingCount');
        const progressTextEl = document.getElementById('beddingProgressText');
        const progressBarFillEl = document.getElementById('beddingProgressBarFill');
        const progressBarEl = document.getElementById('beddingProgressBar');
        if (!container) return { update: function() {} };

        const tiles = [];
        let currentCount = 0;
        let lastValidCount = 0;
        let popTimeout = null;
        let isProgrammaticUpdate = false;
        let clearProgrammaticUpdateTimer = null;
        let isSyncingProgressUI = false;

        function clampCount(rawValue, fallback) {
            const parsed = parseFloat(rawValue);
            if (!Number.isFinite(parsed)) return fallback;
            return Math.max(0, Math.min(TOTAL, Math.round(parsed)));
        }

        function xmur3(str) {
            let h = 1779033703 ^ str.length;
            for (let i = 0; i < str.length; i++) {
                h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
                h = (h << 13) | (h >>> 19);
            }
            return function() {
                h = Math.imul(h ^ (h >>> 16), 2246822507);
                h = Math.imul(h ^ (h >>> 13), 3266489909);
                return (h ^= h >>> 16) >>> 0;
            };
        }

        function mulberry32(a) {
            return function() {
                let t = (a += 0x6D2B79F5);
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        }

        function createDeterministicOrder(total, seed) {
            const order = Array.from({ length: total }, function(_, idx) { return idx; });
            const seedFn = xmur3(seed);
            const rand = mulberry32(seedFn());
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                const temp = order[i];
                order[i] = order[j];
                order[j] = temp;
            }
            return order;
        }

        function markProgrammaticUpdate() {
            isProgrammaticUpdate = true;
            if (clearProgrammaticUpdateTimer) clearTimeout(clearProgrammaticUpdateTimer);
            clearProgrammaticUpdateTimer = setTimeout(function() {
                isProgrammaticUpdate = false;
                clearProgrammaticUpdateTimer = null;
            }, 0);
        }

        function syncProgressUI(count) {
            if (isSyncingProgressUI) return;
            isSyncingProgressUI = true;
            try {
                var safeCount = clampCount(count, lastValidCount);
                var percent = (safeCount / TOTAL) * 100;
                var nextText = safeCount + ' / ' + TOTAL;
                var nextWidth = percent.toFixed(2).replace(/\.00$/, '') + '%';

                if (progressTextEl && progressTextEl.textContent !== nextText) {
                    progressTextEl.textContent = nextText;
                }
                if (progressBarFillEl && progressBarFillEl.style.width !== nextWidth) {
                    progressBarFillEl.style.width = nextWidth;
                }
                if (progressBarEl && progressBarEl.getAttribute('aria-valuenow') !== String(safeCount)) {
                    progressBarEl.setAttribute('aria-valuenow', String(safeCount));
                }
            } finally {
                isSyncingProgressUI = false;
            }
        }

        // Create 40 tile divs
        for (let i = 0; i < TOTAL; i++) {
            const row = Math.floor(i / COLS);
            const col = i % COLS;

            const tile = document.createElement('div');
            tile.className = 'quilt-tile';

            const bgX = (col / (COLS - 1)) * 100;
            const bgY = (row / (ROWS - 1)) * 100;

            tile.style.setProperty('--bg-x', `${bgX}%`);
            tile.style.setProperty('--bg-y', `${bgY}%`);

            container.appendChild(tile);
            tiles.push(tile);
        }

        const first = tiles[0];
        if (first) {
            console.log('[quilt] first tile bg:', getComputedStyle(first).backgroundImage);
        }

        const order = createDeterministicOrder(TOTAL, REVEAL_SEED);

        /**
         * updateBeddingQuilt(count)
         * - Clamps count to 0..40
         * - Updates #beddingCount text and data attribute
         * - Toggles .is-filled on tiles 0..(count-1)
         * - Adds .pop on the newest filled tile briefly
         */
        function update(count, options) {
            const opts = options || {};
            const shouldPop = opts.pop !== false;
            const nextCount = clampCount(count, lastValidCount);
            const previousCount = currentCount;
            lastValidCount = nextCount;

            // Update the count element
            if (countEl) {
                const nextText = String(nextCount);
                markProgrammaticUpdate();
                if (countEl.textContent !== nextText) countEl.textContent = nextText;
                if (countEl.getAttribute('data-bedding-count') !== nextText) {
                    countEl.setAttribute('data-bedding-count', nextText);
                }
            }
            syncProgressUI(nextCount);

            const revealSet = new Set(order.slice(0, nextCount));
            tiles.forEach((tile, idx) => {
                const isFilled = revealSet.has(idx);
                tile.classList.toggle('is-filled', isFilled);
                if (!isFilled) tile.classList.remove('pop');
            });
            currentCount = nextCount;

            console.log('[quilt] count=', nextCount, 'filled=', container.querySelectorAll('.quilt-tile.is-filled').length);

            // Pop animation only on explicit/final updates
            if (popTimeout) {
                clearTimeout(popTimeout);
                popTimeout = null;
            }
            if (shouldPop && nextCount > previousCount && nextCount > 0 && nextCount <= TOTAL) {
                const newestIndex = order[nextCount - 1];
                const newest = tiles[newestIndex];
                if (!newest) return;
                newest.classList.remove('pop');
                // Force reflow to restart animation
                void newest.offsetWidth;
                newest.classList.add('pop');

                // Remove pop class after animation ends
                popTimeout = setTimeout(function() {
                    newest.classList.remove('pop');
                    popTimeout = null;
                }, 400);
            }
        }

        // Expose globally
        window.updateBeddingQuilt = update;

        // Read initial count from the element
        if (countEl) {
            var initial = clampCount(countEl.getAttribute('data-bedding-count'), 0);
            update(initial, { pop: false });
        }

        // MutationObserver: watch for external changes to #beddingCount
        if (countEl && 'MutationObserver' in window) {
            var observer = new MutationObserver(function(mutations) {
                if (isProgrammaticUpdate) return;

                var nextRaw = null;
                for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type === 'attributes' && m.attributeName === 'data-bedding-count') {
                        nextRaw = countEl.getAttribute('data-bedding-count');
                    } else if (m.type === 'childList' || m.type === 'characterData') {
                        nextRaw = countEl.textContent;
                    }
                }

                if (nextRaw == null) return;
                update(nextRaw, { pop: false });
            });
            observer.observe(countEl, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        return { update: update };
    })();

    /* ──────────────────────────────────────
       8. SHEETS CSV SYNC (hero + quilt)
    ────────────────────────────────────── */
    const SheetData = (() => {
        const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJQ-lyj8CQzPw7zZQ3IV-wRzD89AZCKfPRpLW_qhB6VWlbtQr3Bg7FHD98st2cyGb7K8BBnMCzSdy4/pub?gid=0&single=true&output=csv';
        const TOTAL = 40;
        const POLL_MS = 60000;

        const statusRowEl = document.querySelector('.home-status-row');
        const lastUpdatedEl = document.getElementById('heroLastUpdated');
        const countEl = document.getElementById('beddingCount');
        const progressTextEl = document.getElementById('beddingProgressText');
        const progressFillEl = document.getElementById('beddingProgressBarFill');
        const progressBarEl = document.getElementById('beddingProgressBar');

        if (!statusRowEl && !countEl && !lastUpdatedEl) {
            return {
                fetchNow: function() {
                    return Promise.resolve();
                },
                stop: function() {}
            };
        }

        let moneyValueEl = null;
        let statusValueEl = null;
        let beddingValueEl = null;
        let pollTimerId = null;
        let lastSnapshot = '';
        let isApplying = false;

        function clampCount(rawValue, fallback) {
            var fallbackParsed = parseFloat(fallback);
            var fallbackSafe = Number.isFinite(fallbackParsed) ? fallbackParsed : 0;
            var parsed = parseFloat(rawValue);
            if (!Number.isFinite(parsed)) parsed = fallbackSafe;
            return Math.max(0, Math.min(TOTAL, Math.round(parsed)));
        }

        function cleanCell(raw) {
            var str = String(raw == null ? '' : raw).trim();
            if (str.length >= 2 && str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') {
                str = str.slice(1, -1);
            }
            return str.trim();
        }

        function splitCsvLine(line) {
            var cells = [];
            var current = '';
            var inQuotes = false;

            for (var i = 0; i < line.length; i++) {
                var ch = line.charAt(i);
                if (ch === '"') {
                    if (inQuotes && line.charAt(i + 1) === '"') {
                        current += '"';
                        i += 1;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === ',' && !inQuotes) {
                    cells.push(current);
                    current = '';
                } else {
                    current += ch;
                }
            }
            cells.push(current);
            return cells;
        }

        function parseKeyValueCsv(csvText) {
            if (typeof csvText !== 'string') return null;

            var lines = csvText
                .replace(/^\uFEFF/, '')
                .split(/\r\n|\n|\r/)
                .filter(function(line) { return line.trim().length > 0; });
            if (!lines.length) return null;

            var headerCells = splitCsvLine(lines[0]).map(function(cell) {
                return cleanCell(cell).toLowerCase();
            });
            var hasHeader = headerCells.length >= 2 && headerCells[0] === 'key' && headerCells[1] === 'value';
            var rowStart = hasHeader ? 1 : 0;
            var data = {};

            for (var i = rowStart; i < lines.length; i++) {
                var rowCells = splitCsvLine(lines[i]);
                if (!rowCells.length) continue;
                var key = cleanCell(rowCells[0]).toLowerCase();
                if (!key) continue;
                var value = rowCells.length > 1 ? cleanCell(rowCells.slice(1).join(',')) : '';
                data[key] = value;
            }

            return Object.keys(data).length ? data : null;
        }

        function parseNumber(rawValue) {
            if (rawValue == null) return NaN;
            var cleaned = String(rawValue)
                .trim()
                .replace(/[$,\s]/g, '')
                .replace(/[^\d.-]/g, '');
            if (!cleaned) return NaN;
            return parseFloat(cleaned);
        }

        function formatMoney(amount) {
            return '$' + Math.round(amount).toLocaleString('en-US');
        }

        function findPillByLabel(label) {
            if (!statusRowEl) return null;
            var pills = statusRowEl.querySelectorAll('.status-pill');
            for (var i = 0; i < pills.length; i++) {
                var labelEl = pills[i].querySelector('.pill-label');
                if (!labelEl) continue;
                if (labelEl.textContent.trim().toLowerCase() === label.toLowerCase()) {
                    return pills[i];
                }
            }
            return null;
        }

        function ensureHeroPillElements() {
            if (!statusRowEl) return;

            var moneyPill = findPillByLabel('Money Raised');
            var statusPill = findPillByLabel('Project Status');

            if (moneyPill) moneyValueEl = moneyPill.querySelector('strong');
            if (statusPill) statusValueEl = statusPill.querySelector('strong');

            var beddingPill = document.getElementById('heroBeddingPill');
            if (!beddingPill) {
                beddingPill = document.createElement('div');
                beddingPill.className = 'status-pill';
                beddingPill.id = 'heroBeddingPill';
                beddingPill.innerHTML =
                    '<span class="pill-label">Bedding Count</span>' +
                    '<strong id="heroBeddingCountValue">0 / ' + TOTAL + '</strong>';

                if (moneyPill) {
                    moneyPill.insertAdjacentElement('afterend', beddingPill);
                } else if (statusPill) {
                    statusPill.insertAdjacentElement('beforebegin', beddingPill);
                } else {
                    statusRowEl.appendChild(beddingPill);
                }
            }

            beddingValueEl = beddingPill.querySelector('strong');
        }

        function getCurrentCountFallback() {
            if (!countEl) return 0;
            var raw = countEl.getAttribute('data-bedding-count');
            if (raw == null || raw === '') raw = countEl.textContent;
            return clampCount(raw, 0);
        }

        function applyBeddingUi(rawCount) {
            var safeCount = clampCount(rawCount, getCurrentCountFallback());
            var countText = String(safeCount);
            var progressText = safeCount + ' / ' + TOTAL;
            var widthText = ((safeCount / TOTAL) * 100).toFixed(2).replace(/\.00$/, '') + '%';

            if (typeof window.updateBeddingQuilt === 'function') {
                window.updateBeddingQuilt(safeCount, { pop: false });
            }

            if (countEl) {
                if (countEl.textContent !== countText) countEl.textContent = countText;
                if (countEl.getAttribute('data-bedding-count') !== countText) {
                    countEl.setAttribute('data-bedding-count', countText);
                }
            }
            if (progressTextEl && progressTextEl.textContent !== progressText) {
                progressTextEl.textContent = progressText;
            }
            if (progressFillEl && progressFillEl.style.width !== widthText) {
                progressFillEl.style.width = widthText;
            }
            if (progressBarEl && progressBarEl.getAttribute('aria-valuenow') !== countText) {
                progressBarEl.setAttribute('aria-valuenow', countText);
            }
            if (beddingValueEl && beddingValueEl.textContent !== progressText) {
                beddingValueEl.textContent = progressText;
            }
        }

        function applyData(data) {
            if (!data || isApplying) return;
            isApplying = true;
            try {
                ensureHeroPillElements();

                var moneyRaw = data.money_raised;
                if (moneyValueEl && moneyRaw != null && String(moneyRaw).trim() !== '') {
                    var moneyNumber = parseNumber(moneyRaw);
                    if (Number.isFinite(moneyNumber)) {
                        var moneyText = formatMoney(moneyNumber);
                        if (moneyValueEl.textContent !== moneyText) moneyValueEl.textContent = moneyText;
                    }
                }

                var projectStatus = data.project_status;
                if (statusValueEl && projectStatus != null) {
                    var statusText = String(projectStatus).trim();
                    if (statusText && statusValueEl.textContent !== statusText) {
                        statusValueEl.textContent = statusText;
                    }
                }

                if (lastUpdatedEl) {
                    var lastUpdatedValue = data.last_updated == null ? '' : String(data.last_updated).trim();
                    if (lastUpdatedValue) {
                        var lastUpdatedText = 'Last updated: ' + lastUpdatedValue;
                        if (lastUpdatedEl.textContent !== lastUpdatedText) {
                            lastUpdatedEl.textContent = lastUpdatedText;
                        }
                        if (lastUpdatedEl.hidden) lastUpdatedEl.hidden = false;
                    } else if (!lastUpdatedEl.hidden) {
                        lastUpdatedEl.hidden = true;
                    }
                }

                var beddingCount = data.bedding_count;
                if (beddingCount == null && data.beddingcount != null) beddingCount = data.beddingcount;
                if (beddingCount != null && String(beddingCount).trim() !== '') {
                    applyBeddingUi(beddingCount);
                }
            } finally {
                isApplying = false;
            }
        }

        async function fetchAndApply() {
            try {
                var response = await fetch(CSV_URL + '&t=' + Date.now(), { cache: 'no-store' });
                if (!response.ok) return;
                var csvText = await response.text();
                var data = parseKeyValueCsv(csvText);
                if (!data) return;

                var snapshot = JSON.stringify({
                    money_raised: data.money_raised || '',
                    project_status: data.project_status || '',
                    bedding_count: data.bedding_count || data.beddingcount || '',
                    last_updated: data.last_updated || ''
                });
                if (snapshot === lastSnapshot) return;

                applyData(data);
                lastSnapshot = snapshot;
            } catch (_) {
                // Keep current UI values when network or parsing fails.
            }
        }

        function init() {
            ensureHeroPillElements();
            applyBeddingUi(getCurrentCountFallback());
            fetchAndApply();
            pollTimerId = setInterval(fetchAndApply, POLL_MS);
        }

        init();
        return {
            fetchNow: fetchAndApply,
            stop: function() {
                if (pollTimerId) clearInterval(pollTimerId);
                pollTimerId = null;
            }
        };
    })();

});
