(function() {
    const doc = document;
    
    // Elements ရယူခြင်း
    const viewpager = doc.getElementById('viewpager');
    const seebar = doc.getElementById('seebar');
    const seebarProgress = doc.getElementById('seebarProgress');
    const pages = doc.querySelectorAll('.page');
    const pageIndicatorCircle = doc.getElementById('pageIndicatorCircle');
    const searchInput = doc.getElementById('searchInput');
    const searchResults = doc.getElementById('searchResults');
    const searchStatus = doc.getElementById('searchStatus');
    const starBtn = doc.getElementById('starBtn');
    const fontSizeSlider = doc.getElementById('fontSizeSlider');
    const previewText = doc.getElementById('previewText');
    const lineBreakToggle = doc.getElementById('lineBreakToggle');

    const totalPages = pages.length;
    const originalContents = Array.from(pages).map(p => p.innerHTML);
    const originalTexts = Array.from(pages).map(p => p.textContent.trim());
    const myMM = (n) => n.toString().replace(/\d/g, d => ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'][d]);

    // Book 1 အတွက် သီးသန့် Bookmark
    const BOOK_KEY = 'bookmarks_book2';
    let bookmarks = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];
    let isDragging = false;

    // --- ၁။ UI & NAVIGATION ---
    function updateUI() {
        const idx = Math.round(viewpager.scrollLeft / viewpager.clientWidth);
        const progress = (idx / (totalPages - 1)) * 100;
        if (seebarProgress) seebarProgress.style.width = progress + '%';
        
        const isBookmarked = bookmarks.some(b => b.index === idx);
        if (starBtn) starBtn.classList.toggle('active', isBookmarked);
    }

    window.navigateTo = (idx) => {
        viewpager.scrollLeft = viewpager.clientWidth * idx;
        updateUI();
    };

    // --- ၂။ SLIDER & CHECKBOX (အသစ်ပြင်ဆင်ချက်) ---
    if (fontSizeSlider) {
        fontSizeSlider.oninput = (e) => {
            const val = e.target.value + "rem";
            pages.forEach(p => p.style.fontSize = val);
            if (previewText) previewText.style.fontSize = val;
            localStorage.setItem('saved_fontsize', e.target.value);
        };
    }

    if (lineBreakToggle) {
        lineBreakToggle.onchange = () => {
            const isChecked = lineBreakToggle.checked;
            pages.forEach(p => p.style.wordBreak = isChecked ? "break-all" : "normal");
            localStorage.setItem('saved_fix', isChecked);
        };
    }

    // --- ၃။ SEARCH (စာရှာခြင်း) ---
    window.performSearch = () => {
        const term = searchInput.value.trim();
        searchResults.innerHTML = ''; searchStatus.style.display = 'none';
        if (!term) return;

        let count = 0;
        originalTexts.forEach((text, idx) => {
            if (text.includes(term)) {
                count++;
                const li = doc.createElement('li');
                const start = Math.max(0, text.indexOf(term) - 20);
                const snippet = text.substring(start, text.indexOf(term) + 40);
                li.innerHTML = `<div>...${snippet.replace(new RegExp(term, 'g'), `<span class="list-highlight">${term}</span>`)}...</div>
                                <small>စာမျက်နှာ - ${myMM(idx + 1)}</small>`;
                li.onclick = () => {
                    window.navigateTo(idx);
                    pages[idx].innerHTML = originalContents[idx].replace(new RegExp(`(${term})`, 'gi'), '<span class="text-highlight">$1</span>');
                    window.closeSearch();
                };
                searchResults.appendChild(li);
            }
        });
        if (count > 0) {
            searchStatus.textContent = `${myMM(count)} ခု တွေ့ရှိသည်`;
            searchStatus.style.display = 'block';
        }
    };

    // --- ၄။ BOOKMARK (မှတ်သားချက်) ---
    window.toggleBookmark = () => {
        const idx = Math.round(viewpager.scrollLeft / viewpager.clientWidth);
        const bIdx = bookmarks.findIndex(b => b.index === idx);
        if (bIdx > -1) bookmarks.splice(bIdx, 1);
        else bookmarks.push({ index: idx, snippet: originalTexts[idx].substring(0, 45) + "..." });
        
        localStorage.setItem(BOOK_KEY, JSON.stringify(bookmarks));
        updateUI();
    };

    window.renderBookmarks = () => {
        const list = doc.getElementById('bookmarkList');
        list.innerHTML = bookmarks.length ? '' : '<li style="text-align:center; padding:20px;">မှတ်သားချက်မရှိပါ။</li>';
        bookmarks.sort((a,b) => a.index - b.index).forEach(b => {
            const li = doc.createElement('li');
            li.innerHTML = `<strong>စာမျက်နှာ ${myMM(b.index + 1)}</strong><br><span class="bookmark-text">${b.snippet}</span>`;
            li.onclick = () => { window.navigateTo(b.index); window.closeBookmark(); };
            list.appendChild(li);
        });
    };

    // --- ၅။ DIALOG CONTROLS ---
    window.openAbout = () => { window.closeAll(); doc.getElementById('aboutDialog').style.display = 'flex'; };
    window.closeAbout = () => doc.getElementById('aboutDialog').style.display = 'none';
    window.openSettings = () => { window.closeAll(); doc.getElementById('settingsDialog').style.display = 'flex'; };
    window.closeSettings = () => doc.getElementById('settingsDialog').style.display = 'none';
    window.openBookmark = () => { window.closeAll(); window.renderBookmarks(); doc.getElementById('bookmarkDialog').style.display = 'flex'; };
    window.closeBookmark = () => doc.getElementById('bookmarkDialog').style.display = 'none';
    window.openMenu = () => { window.closeAll(); doc.getElementById('menuDialog').style.display = 'flex'; };
    window.closeMenu = () => doc.getElementById('menuDialog').style.display = 'none';
    window.openSearch = () => { window.closeAll(); doc.getElementById('searchDialog').style.display = 'flex'; searchInput.focus(); };
    window.closeSearch = () => doc.getElementById('searchDialog').style.display = 'none';
    window.closeAll = () => doc.getElementById('photoBottomSheet').classList.remove('active');
    window.toggleFeatureSheet = () => doc.getElementById('photoBottomSheet').classList.toggle('active');
    window.setTheme = (m) => { doc.body.classList.toggle('night-mode', m === 'night'); localStorage.setItem('saved_theme', m); };
    window.setFont = (f) => { doc.body.classList.toggle('font-zawgyi', f === 'zawgyi'); localStorage.setItem('saved_font', f); };
    window.exitNow = () => window.Android ? window.Android.exitApp() : history.back();

    // --- ၆။ SEEDAR (PROGRESS BAR) DRAG ---
    function handleSeebar(e) {
        const rect = seebar.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const progress = Math.min(Math.max(x / rect.width, 0), 1);
        const idx = Math.round(progress * (totalPages - 1));
        if (pageIndicatorCircle) {
            pageIndicatorCircle.textContent = myMM(idx + 1);
            pageIndicatorCircle.style.display = 'flex';
        }
        window.navigateTo(idx);
    }

    if (seebar) {
        seebar.onmousedown = seebar.ontouchstart = (e) => { isDragging = true; handleSeebar(e); };
        doc.onmousemove = doc.ontouchmove = (e) => { if (isDragging) handleSeebar(e); };
        doc.onmouseup = doc.ontouchend = () => { isDragging = false; if(pageIndicatorCircle) pageIndicatorCircle.style.display = 'none'; };
    }

    // --- ၇။ INITIAL LOAD ---
    window.onload = () => {
        const theme = localStorage.getItem('saved_theme') || 'day';
        const font = localStorage.getItem('saved_font') || 'unicode';
        const size = localStorage.getItem('saved_fontsize') || '1.1';
        const fix = localStorage.getItem('saved_fix') === 'true';

        window.setTheme(theme); window.setFont(font);
        if (fontSizeSlider) fontSizeSlider.value = size;
        pages.forEach(p => { 
            p.style.fontSize = size + "rem";
            p.style.wordBreak = fix ? "break-all" : "normal";
        });
        if (previewText) previewText.style.fontSize = size + "rem";
        if (lineBreakToggle) lineBreakToggle.checked = fix;

        searchInput.oninput = window.performSearch;
        doc.querySelectorAll('#menuList li').forEach(li => {
            li.onclick = () => { window.navigateTo(parseInt(li.dataset.pageIndex)); window.closeMenu(); };
        });
        
        setTimeout(() => window.navigateTo(0), 300);
    };

    viewpager.onscroll = () => { if (!isDragging) updateUI(); window.closeAll(); };
})();



