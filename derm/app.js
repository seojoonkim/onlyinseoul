// ===== App State =====
let currentView = 'consult';
let currentCategory = 'all';
let currentConcern = null;
let currentBudget = 'all';
let treatments = [];
let tableSort = { column: 'name', direction: 'asc' };
let selectedTableCategories = [];

// ===== Concern Map (MECE) =====
const concernMap = {
    '처진피부': ['리프팅', '타이트닝', 'HIFU', '실리프팅', '울쎄라', '슈링크', '올리지오'],
    '주름': ['주름', '보톡스', '리프팅', '타이트닝'],
    '탄력저하': ['탄력', 'RF', '콜라겐', '스킨부스터', '리쥬란', '쥬베룩', '엑소좀'],
    '모공': ['모공', 'MRF', '피지', '모공축소', '포텐자', '시크릿'],
    '기미/잡티': ['기미', '색소', '미백', '토닝', '피코', '잡티', 'IPL', '브라이트닝'],
    '여드름': ['여드름', '트러블', 'PDT', '압출', '아크네'],
    '볼륨손실': ['볼륨', '필러', '스컬트라', '엘란쎄', 'HA필러', '지방이식'],
    '흉터': ['흉터', '프랙셔널', '재생', '여드름흉터', '패인흉터'],
    '제모': ['제모', '레이저제모'],
    '바디': ['바디', '지방', '셀룰라이트', '엠스컬프', '지방분해', '윤곽', '냉각'],
    '탈모': ['탈모', '모발', '두피', 'PRP', '엑소좀'],
    '점/사마귀': ['점', '사마귀', '검버섯', '쥐젖', '한관종'],
    '다한증/액취': ['다한증', '액취', '땀'],
    '필링': ['필링', '화학필링', '각질', '피부결'],
    '스킨케어': ['스킨케어', '관리', '클렌징', '영양', '수분', '진정', '재생관리']
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    treatments = DB_EXTENDED.treatments;
    
    // Update DB count
    document.getElementById('dbCount').textContent = `${treatments.length}개 시술`;
    
    // Update all tab counts
    updateTabCounts();
    updateConcernCounts();
    
    // Setup views
    setupViewTabs();
    setupSearch();
    setupConcernView();
    setupFilterView();
    setupTableView();
    setupModal();
    setupConsultation();
});

// ===== Update Tab Counts =====
function updateTabCounts() {
    // 상단 탭에서는 숫자 표시 안함
}

// ===== Update Concern Counts =====
function updateConcernCounts() {
    Object.keys(concernMap).forEach(concern => {
        const keywords = concernMap[concern];
        const count = treatments.filter(t => {
            const searchText = `${t.category} ${t.subcategory} ${t.tags.join(' ')} ${t.effects.primary.join(' ')}`.toLowerCase();
            return keywords.some(k => searchText.includes(k.toLowerCase()));
        }).length;
        
        const countEl = document.querySelector(`[data-concern-count="${concern}"]`);
        if (countEl) countEl.textContent = `${count}개`;
    });
}

// ===== View Tabs =====
function setupViewTabs() {
    const tabs = document.querySelectorAll('.view-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            
            // Update tab active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update view panel
            document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`view-${view}`).classList.add('active');
            
            currentView = view;
        });
    });
}

// ===== Search =====
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            if (currentView === 'cards') renderCardsView(currentCategory);
            if (currentView === 'table') renderTableView();
            if (currentView === 'filter') applyFilters();
            return;
        }
        
        const results = treatments.filter(t => 
            t.name.toLowerCase().includes(query) ||
            t.nameEn.toLowerCase().includes(query) ||
            t.brand.toLowerCase().includes(query) ||
            (t.review && t.review.summary.includes(query)) ||
            t.tags.some(tag => tag.includes(query)) ||
            t.effects.primary.some(e => e.includes(query))
        );
        
        // Switch to cards view and show results
        document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-view="cards"]').classList.add('active');
        document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('view-cards').classList.add('active');
        
        renderTreatmentCards(results, 'cardsGrid');
    });
}

// ===== View 1: 고민별 찾기 =====
function setupConcernView() {
    const concernCards = document.querySelectorAll('.concern-card');
    const concernResult = document.getElementById('concernResult');
    const concernGrid = document.querySelector('.concern-grid');
    const backBtn = document.getElementById('backBtn');
    const concernBudgetMin = document.getElementById('concernBudgetMin');
    const concernBudgetMax = document.getElementById('concernBudgetMax');
    
    concernCards.forEach(card => {
        card.addEventListener('click', () => {
            const concern = card.dataset.concern;
            currentConcern = concern;
            
            concernGrid.classList.add('hidden');
            concernResult.classList.remove('hidden');
            document.getElementById('concernTitle').textContent = card.querySelector('.concern-title').textContent + ' 고민 해결';
            
            // Reset budget sliders
            concernBudgetMin.value = 0;
            concernBudgetMax.value = 200;
            document.getElementById('concernBudgetMinValue').textContent = '0';
            document.getElementById('concernBudgetMaxValue').textContent = '200+';
            
            renderConcernTreatments();
        });
    });
    
    backBtn.addEventListener('click', () => {
        concernGrid.classList.remove('hidden');
        concernResult.classList.add('hidden');
        currentConcern = null;
    });
    
    // Budget dual range for concern view
    function updateConcernBudget() {
        let minVal = parseInt(concernBudgetMin.value);
        let maxVal = parseInt(concernBudgetMax.value);
        
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            concernBudgetMin.value = minVal;
            concernBudgetMax.value = maxVal;
        }
        
        document.getElementById('concernBudgetMinValue').textContent = minVal;
        document.getElementById('concernBudgetMaxValue').textContent = maxVal >= 200 ? '200+' : maxVal;
        renderConcernTreatments();
    }
    
    concernBudgetMin.addEventListener('input', updateConcernBudget);
    concernBudgetMax.addEventListener('input', updateConcernBudget);
}

function renderConcernTreatments() {
    const keywords = concernMap[currentConcern] || [];
    const budgetMin = parseInt(document.getElementById('concernBudgetMin').value);
    const budgetMax = parseInt(document.getElementById('concernBudgetMax').value);
    
    let filtered = treatments.filter(t => {
        const searchText = `${t.category} ${t.subcategory} ${t.tags.join(' ')} ${t.effects.primary.join(' ')}`.toLowerCase();
        return keywords.some(k => searchText.includes(k.toLowerCase()));
    });
    
    // Budget filter
    filtered = filtered.filter(t => {
        const price = extractPrice(t.pricing.average);
        if (price < budgetMin) return false;
        if (budgetMax < 200 && price > budgetMax) return false;
        return true;
    });
    
    renderTreatmentCards(filtered, 'concernTreatments');
}

// ===== View 2: 맞춤 필터 =====
function setupFilterView() {
    const budgetMin = document.getElementById('budgetMin');
    const budgetMax = document.getElementById('budgetMax');
    const downtimeRange = document.getElementById('downtimeRange');
    const painRange = document.getElementById('painRange');
    const checkboxList = document.getElementById('categoryCheckboxList');
    const resetBtn = document.getElementById('resetFilters');
    
    // Populate category checkboxes
    const categories = [...new Set(treatments.map(t => t.category))];
    categories.forEach(cat => {
        const count = treatments.filter(t => t.category === cat).length;
        const item = document.createElement('label');
        item.className = 'category-checkbox-item';
        item.innerHTML = `
            <span><input type="checkbox" name="filterCategory" value="${cat}" checked> ${cat}</span>
            <span class="cat-count">${count}</span>
        `;
        checkboxList.appendChild(item);
    });
    
    // Budget dual range
    function updateBudgetDisplay() {
        let minVal = parseInt(budgetMin.value);
        let maxVal = parseInt(budgetMax.value);
        
        // Prevent overlap
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            budgetMin.value = minVal;
            budgetMax.value = maxVal;
        }
        
        const display = document.getElementById('budgetDisplay');
        if (minVal === 0 && maxVal >= 200) {
            display.textContent = '전체';
        } else if (minVal === 0) {
            display.textContent = `~${maxVal}만`;
        } else if (maxVal >= 200) {
            display.textContent = `${minVal}만~`;
        } else {
            display.textContent = `${minVal}~${maxVal}만`;
        }
        applyFilters();
    }
    
    budgetMin.addEventListener('input', updateBudgetDisplay);
    budgetMax.addEventListener('input', updateBudgetDisplay);
    
    // Downtime slider
    const downtimeLabels = ['없음', '~3일', '전체'];
    downtimeRange.addEventListener('input', () => {
        document.getElementById('downtimeValue').textContent = downtimeLabels[downtimeRange.value];
        applyFilters();
    });
    
    painRange.addEventListener('input', () => {
        document.getElementById('painValue').textContent = painRange.value;
        applyFilters();
    });
    
    checkboxList.addEventListener('change', applyFilters);
    
    // Select All / Deselect All buttons
    document.getElementById('filterSelectAll').addEventListener('click', () => {
        document.querySelectorAll('input[name="filterCategory"]').forEach(cb => cb.checked = true);
        applyFilters();
    });
    
    document.getElementById('filterDeselectAll').addEventListener('click', () => {
        document.querySelectorAll('input[name="filterCategory"]').forEach(cb => cb.checked = false);
        applyFilters();
    });
    
    resetBtn.addEventListener('click', () => {
        budgetMin.value = 0;
        budgetMax.value = 200;
        downtimeRange.value = 2;
        painRange.value = 5;
        document.getElementById('budgetDisplay').textContent = '전체';
        document.getElementById('downtimeValue').textContent = '전체';
        document.getElementById('painValue').textContent = '5';
        document.querySelectorAll('input[name="filterCategory"]').forEach(cb => cb.checked = true);
        applyFilters();
    });
    
    applyFilters();
}

function applyFilters() {
    const budgetMin = parseInt(document.getElementById('budgetMin').value);
    const budgetMax = parseInt(document.getElementById('budgetMax').value);
    const downtimeLevel = parseInt(document.getElementById('downtimeRange').value);
    const pain = parseFloat(document.getElementById('painRange').value);
    const selectedCategories = [...document.querySelectorAll('input[name="filterCategory"]:checked')].map(cb => cb.value);
    
    let filtered = treatments.filter(t => {
        // Budget (min ~ max)
        const price = extractPrice(t.pricing.average);
        if (price < budgetMin) return false;
        if (budgetMax < 200 && price > budgetMax) return false;
        
        // Pain
        if (t.recovery.painLevel > pain) return false;
        
        // Category
        if (!selectedCategories.includes(t.category)) return false;
        
        // Downtime (0: 없음만, 1: ~3일까지, 2: 전체)
        const downtime = t.recovery.downtime.toLowerCase();
        if (downtimeLevel === 0) {
            if (!(downtime.includes('없음') || downtime === '')) return false;
        } else if (downtimeLevel === 1) {
            if (downtime.includes('주') || downtime.includes('7') || downtime.includes('14')) return false;
        }
        // downtimeLevel === 2는 전체이므로 필터링 안함
        
        return true;
    });
    
    renderTreatmentCards(filtered, 'filterResults');
}

// ===== View 3: 테이블 뷰 =====
function setupTableView() {
    const categoryList = document.getElementById('tableCategoryList');
    const categories = [...new Set(treatments.map(t => t.category))];
    const tableBudgetMin = document.getElementById('tableBudgetMin');
    const tableBudgetMax = document.getElementById('tableBudgetMax');
    const tableDowntimeRange = document.getElementById('tableDowntimeRange');
    const tablePainRange = document.getElementById('tablePainRange');
    
    // Initialize selected categories
    selectedTableCategories = [...categories];
    
    // Create category checkboxes
    categories.forEach(cat => {
        const count = treatments.filter(t => t.category === cat).length;
        const item = document.createElement('label');
        item.className = 'category-checkbox-item';
        item.innerHTML = `
            <span><input type="checkbox" name="tableCategory" value="${cat}" checked> ${cat}</span>
            <span class="cat-count">${count}</span>
        `;
        categoryList.appendChild(item);
    });
    
    // Category change listener
    categoryList.addEventListener('change', () => {
        selectedTableCategories = [...document.querySelectorAll('input[name="tableCategory"]:checked')].map(cb => cb.value);
        renderTableView();
    });
    
    // Budget dual range
    function updateTableBudget() {
        let minVal = parseInt(tableBudgetMin.value);
        let maxVal = parseInt(tableBudgetMax.value);
        
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            tableBudgetMin.value = minVal;
            tableBudgetMax.value = maxVal;
        }
        
        const display = document.getElementById('tableBudgetDisplay');
        if (minVal === 0 && maxVal >= 200) {
            display.textContent = '전체';
        } else if (minVal === 0) {
            display.textContent = `~${maxVal}만`;
        } else if (maxVal >= 200) {
            display.textContent = `${minVal}만~`;
        } else {
            display.textContent = `${minVal}~${maxVal}만`;
        }
        renderTableView();
    }
    
    tableBudgetMin.addEventListener('input', updateTableBudget);
    tableBudgetMax.addEventListener('input', updateTableBudget);
    
    // Downtime slider
    const downtimeLabels = ['없음', '~3일', '전체'];
    tableDowntimeRange.addEventListener('input', () => {
        document.getElementById('tableDowntimeValue').textContent = downtimeLabels[tableDowntimeRange.value];
        renderTableView();
    });
    
    // Pain range
    tablePainRange.addEventListener('input', () => {
        document.getElementById('tablePainValue').textContent = tablePainRange.value;
        renderTableView();
    });
    
    // Select All / Deselect All buttons
    document.getElementById('tableSelectAll').addEventListener('click', () => {
        document.querySelectorAll('input[name="tableCategory"]').forEach(cb => cb.checked = true);
        selectedTableCategories = [...categories];
        renderTableView();
    });
    
    document.getElementById('tableDeselectAll').addEventListener('click', () => {
        document.querySelectorAll('input[name="tableCategory"]').forEach(cb => cb.checked = false);
        selectedTableCategories = [];
        renderTableView();
    });
    
    // Reset button
    document.getElementById('resetTableFilters').addEventListener('click', () => {
        tableBudgetMin.value = 0;
        tableBudgetMax.value = 200;
        tableDowntimeRange.value = 2;
        tablePainRange.value = 5;
        document.getElementById('tableBudgetDisplay').textContent = '전체';
        document.getElementById('tableDowntimeValue').textContent = '전체';
        document.getElementById('tablePainValue').textContent = '5';
        document.querySelectorAll('input[name="tableCategory"]').forEach(cb => cb.checked = true);
        selectedTableCategories = [...categories];
        renderTableView();
    });
    
    // Column sort listeners
    document.querySelectorAll('.data-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.sort;
            
            // Toggle direction
            if (tableSort.column === column) {
                tableSort.direction = tableSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                tableSort.column = column;
                tableSort.direction = 'asc';
            }
            
            // Update header styles
            document.querySelectorAll('.data-table th.sortable').forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            th.classList.add(tableSort.direction);
            
            renderTableView();
        });
    });
    
    renderTableView();
}

function renderTableView() {
    const budgetMin = parseInt(document.getElementById('tableBudgetMin').value);
    const budgetMax = parseInt(document.getElementById('tableBudgetMax').value);
    const downtimeLevel = parseInt(document.getElementById('tableDowntimeRange').value);
    const pain = parseFloat(document.getElementById('tablePainRange').value);
    
    let filtered = treatments.filter(t => {
        // Category
        if (!selectedTableCategories.includes(t.category)) return false;
        
        // Budget
        const price = extractPrice(t.pricing.average);
        if (price < budgetMin) return false;
        if (budgetMax < 200 && price > budgetMax) return false;
        
        // Pain
        if (t.recovery.painLevel > pain) return false;
        
        // Downtime (0: 없음만, 1: ~3일까지, 2: 전체)
        const downtime = t.recovery.downtime.toLowerCase();
        if (downtimeLevel === 0) {
            if (!(downtime.includes('없음') || downtime === '')) return false;
        } else if (downtimeLevel === 1) {
            if (downtime.includes('주') || downtime.includes('7') || downtime.includes('14')) return false;
        }
        
        return true;
    });
    
    // Sort
    filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch (tableSort.column) {
            case 'name':
                aVal = a.name;
                bVal = b.name;
                break;
            case 'brand':
                aVal = a.brand;
                bVal = b.brand;
                break;
            case 'category':
                aVal = a.category;
                bVal = b.category;
                break;
            case 'duration':
                aVal = a.effects.duration || '';
                bVal = b.effects.duration || '';
                break;
            case 'pain':
                aVal = a.recovery.painLevel;
                bVal = b.recovery.painLevel;
                return tableSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
            case 'downtime':
                aVal = a.recovery.downtime || '';
                bVal = b.recovery.downtime || '';
                break;
            case 'price':
                aVal = extractPrice(a.pricing.average);
                bVal = extractPrice(b.pricing.average);
                return tableSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
            default:
                aVal = a.name;
                bVal = b.name;
        }
        
        if (typeof aVal === 'string') {
            const compare = aVal.localeCompare(bVal);
            return tableSort.direction === 'asc' ? compare : -compare;
        }
        return 0;
    });
    
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = filtered.map(t => `
        <tr data-id="${t.id}">
            <td><span class="table-name">${t.name}</span></td>
            <td>${t.brand}</td>
            <td>${t.category}</td>
            <td>
                <div class="table-effects">
                    ${t.effects.primary.slice(0, 3).map(e => `<span class="table-effect-tag">${e}</span>`).join('')}
                </div>
            </td>
            <td>${t.effects.duration || '-'}</td>
            <td>
                <div class="pain-bar">
                    ${[1,2,3,4,5].map(i => `<span class="pain-dot ${i <= Math.round(t.recovery.painLevel) ? 'filled' : ''}"></span>`).join('')}
                </div>
            </td>
            <td>${t.recovery.downtime || '없음'}</td>
            <td>${t.pricing.average}</td>
        </tr>
    `).join('');
    
    // Click handlers
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
            const treatment = treatments.find(t => t.id === row.dataset.id);
            if (treatment) showModal(treatment);
        });
    });
}

// ===== Render Treatment Cards =====
function renderTreatmentCards(items, containerId) {
    const container = document.getElementById(containerId);
    
    if (items.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-tertiary);">
                조건에 맞는 시술이 없습니다.
            </div>
        `;
        return;
    }
    
    container.innerHTML = items.map(t => `
        <div class="treatment-card" data-id="${t.id}">
            <div class="card-header">
                <div>
                    <div class="card-title">${t.name}</div>
                    <div class="card-brand">${t.brand}</div>
                </div>
                <span class="card-badge">${t.subcategory || t.category}</span>
            </div>
            <div class="card-desc">${t.review ? t.review.summary : t.mechanism.detailed}</div>
            <div class="card-tags">
                ${t.effects.primary.slice(0, 3).map(e => `<span class="card-tag">${e}</span>`).join('')}
            </div>
            <div class="card-stats">
                <div class="stat-item">
                    <div class="stat-row">
                        <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg></div>
                        <div class="stat-label">가격</div>
                    </div>
                    <div class="stat-value">${t.pricing.average}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-row">
                        <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                        <div class="stat-label">지속</div>
                    </div>
                    <div class="stat-value">${t.effects.duration || '-'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-row">
                        <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
                        <div class="stat-label">통증</div>
                    </div>
                    <div class="stat-value">${t.recovery.painLevel}/5</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Click handlers
    container.querySelectorAll('.treatment-card').forEach(card => {
        card.addEventListener('click', () => {
            const treatment = treatments.find(t => t.id === card.dataset.id);
            if (treatment) showModal(treatment);
        });
    });
}

// ===== Modal =====
function setupModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    
    const closeModal = () => {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function showModal(t) {
    document.body.style.overflow = 'hidden';
    const content = document.getElementById('modalContent');
    
    // 검색 URL 생성
    const searchName = encodeURIComponent(t.name + ' 후기');
    const searchNameEn = encodeURIComponent(t.nameEn + ' review');
    const naverBlogUrl = `https://search.naver.com/search.naver?ssc=tab.blog.all&query=${searchName}`;
    const naverBlogEnUrl = `https://search-naver-com.translate.goog/search.naver?ssc=tab.blog.all&query=${searchName}&_x_tr_sl=ko&_x_tr_tl=en&_x_tr_hl=en`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${searchName}`;
    const youtubeEnUrl = `https://www.youtube.com/results?search_query=${searchNameEn}`;
    const googleUrl = `https://www.google.com/search?q=${searchNameEn}`;
    
    content.innerHTML = `
        <!-- 1. 헤더 -->
        <div class="modal-header">
            <h2 class="modal-title">${t.name}</h2>
            <p class="modal-subtitle">${t.nameEn} · ${t.brand}</p>
            <span class="modal-badge">${t.category} / ${t.subcategory}</span>
        </div>
        
        <!-- 2. 한줄 요약 -->
        ${t.review ? `
        <div class="modal-section">
            <div class="review-summary">${t.review.summary}</div>
        </div>
        
        <!-- 3. 총평 -->
        <div class="modal-section">
            <div class="review-overall">
                <strong>💬 총평:</strong> ${t.review.overall}
            </div>
        </div>
        ` : ''}
        
        <!-- 4. 기대 효과 -->
        <div class="modal-section">
            <div class="modal-section-header-with-legend">
                <h3 class="modal-section-title">기대 효과</h3>
                <div class="effects-legend">
                    <span class="legend-item"><span class="legend-dot primary"></span>주요 효과</span>
                    <span class="legend-item"><span class="legend-dot secondary"></span>부가 효과</span>
                </div>
            </div>
            <div class="effects-tags-inline">
                ${t.effects.primary.map(e => `<span class="modal-effect-tag primary">${e}</span>`).join('')}
                ${t.effects.secondary.map(e => `<span class="modal-effect-tag secondary">${e}</span>`).join('')}
            </div>
        </div>
        
        <!-- 5. 핵심 정보 (빠른 판단용) -->
        <div class="modal-section">
            <h3 class="modal-section-title">핵심 정보</h3>
            <div class="modal-stats-grid modal-key-stats">
                <div class="modal-stat highlight">
                    <div class="modal-stat-label">💰 가격</div>
                    <div class="modal-stat-value">${t.pricing.range}</div>
                </div>
                <div class="modal-stat highlight">
                    <div class="modal-stat-label">⏱️ 효과 지속</div>
                    <div class="modal-stat-value">${t.effects.duration}</div>
                </div>
                <div class="modal-stat highlight">
                    <div class="modal-stat-label">🩹 다운타임</div>
                    <div class="modal-stat-value">${t.recovery.downtime || '없음'}</div>
                </div>
                <div class="modal-stat highlight">
                    <div class="modal-stat-label">😣 통증</div>
                    <div class="modal-stat-value">${t.recovery.painLevel}/5</div>
                </div>
            </div>
        </div>
        
        <!-- 6. 팁 및 후기 분석 (3분할: 팁, 좋아요, 아쉬워요) -->
        ${t.review ? `
        <div class="modal-section">
            <h3 class="modal-section-title">팁 및 후기 분석</h3>
            <div class="review-grid-3col">
                <div class="review-tips-box">
                    <h4>💡 시술 팁</h4>
                    <ul>${t.review.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>
                </div>
                <div class="review-likes">
                    <h4>👍 이런 점이 좋아요</h4>
                    <ul>${t.review.likes.map(l => `<li>${l}</li>`).join('')}</ul>
                </div>
                <div class="review-dislikes">
                    <h4>👎 이런 점은 아쉬워요</h4>
                    <ul>${t.review.dislikes.map(d => `<li>${d}</li>`).join('')}</ul>
                </div>
            </div>
        </div>
        ` : ''}
        
        <!-- 7. 이런 분께 추천 -->
        <div class="modal-section">
            <h3 class="modal-section-title">이런 분께 추천해요</h3>
            <div class="modal-suitability">
                <div class="suitability-age-box">
                    <h4>👤 적정 연령대</h4>
                    <p>${t.suitability.idealAge}</p>
                </div>
                <div class="suitability-recommend">
                    <h4>✅ 추천</h4>
                    <ul>${t.suitability.bestFor.map(b => `<li>${b}</li>`).join('')}</ul>
                </div>
                ${t.suitability.notRecommended.length ? `
                <div class="suitability-caution">
                    <h4>⚠️ 비추천</h4>
                    <ul>${t.suitability.notRecommended.map(n => `<li>${n}</li>`).join('')}</ul>
                </div>
                ` : ''}
            </div>
        </div>
        
        <!-- 7. 장단점 (키워드 요약) -->
        ${t.pros.length || t.cons.length ? `
        <div class="modal-section">
            <h3 class="modal-section-title">한눈에 보는 장단점</h3>
            <div class="modal-pros-cons">
                <div class="modal-pros">
                    <h4>👍 장점</h4>
                    <ul class="modal-list">
                        ${t.pros.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-cons">
                    <h4>👎 단점</h4>
                    <ul class="modal-list">
                        ${t.cons.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
        ` : ''}
        
        <!-- 8. 상세 시술 정보 -->
        <div class="modal-section">
            <h3 class="modal-section-title">상세 시술 정보</h3>
            <div class="modal-stats-grid">
                <div class="modal-stat">
                    <div class="modal-stat-label">시술 시간</div>
                    <div class="modal-stat-value">${t.procedure.duration}</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-label">권장 횟수</div>
                    <div class="modal-stat-value">${t.procedure.sessions}</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-label">시술 간격</div>
                    <div class="modal-stat-value">${t.procedure.interval}</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-label">마취</div>
                    <div class="modal-stat-value">${t.procedure.anesthesia}</div>
                </div>
            </div>
        </div>
        
        <!-- 10. 시술 원리 -->
        <div class="modal-section">
            <h3 class="modal-section-title">시술 원리</h3>
            <div class="modal-mechanism">
                ${t.mechanism.detailed}
            </div>
        </div>
        
        <!-- 11. 비교 & 조합 -->
        ${Object.keys(t.comparison.vs).length || t.comparison.bestWith.length ? `
        <div class="modal-section">
            <h3 class="modal-section-title">비교 & 함께 하면 좋은 시술</h3>
            <div class="modal-comparison">
                ${Object.entries(t.comparison.vs).map(([k, v]) => `<p><strong>vs ${k}:</strong> ${v}</p>`).join('')}
                ${t.comparison.bestWith.length ? `<p class="best-with">🤝 <strong>추천 조합:</strong> ${t.comparison.bestWith.join(', ')}</p>` : ''}
            </div>
        </div>
        ` : ''}
        
        <!-- 12. 외부 링크 (더 알아보기) -->
        <div class="modal-section">
            <h3 class="modal-section-title">더 많은 후기 보기</h3>
            <div class="modal-external-links">
                <a href="${youtubeUrl}" target="_blank" class="external-link youtube">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    YouTube 후기
                </a>
                <a href="${youtubeEnUrl}" target="_blank" class="external-link youtube-en">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    YouTube (EN)
                </a>
                <a href="${naverBlogUrl}" target="_blank" class="external-link naver">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/></svg>
                    네이버 블로그
                </a>
                <a href="${naverBlogEnUrl}" target="_blank" class="external-link naver-en">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/></svg>
                    Naver (EN)
                </a>
                <a href="${googleUrl}" target="_blank" class="external-link google">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google (EN)
                </a>
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.remove('hidden');
}

// ===== Utilities =====
function extractPrice(priceStr) {
    if (!priceStr) return 0;
    const match = priceStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
}


// ===== AI Consultation =====
let consultState = {
    currentStep: 1,
    totalSteps: 6,
    data: {
        age: null,
        experience: null,
        concerns: [],
        concernsExtra: '',
        areas: [],
        budget: null,
        downtime: null,
        pain: null,
        event: '',
        extra: ''
    }
};

function setupConsultation() {
    // Option buttons (single select)
    document.querySelectorAll('.option-btn[data-field]').forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.dataset.field;
            const value = btn.dataset.value;
            
            btn.closest('.option-grid').querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            consultState.data[field] = value;
        });
    });
    
    // Multi-select option buttons
    document.querySelectorAll('.option-grid.multi-select').forEach(grid => {
        const field = grid.dataset.field;
        grid.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                const selectedValues = [];
                grid.querySelectorAll('.option-btn.selected').forEach(b => {
                    selectedValues.push(b.dataset.value);
                });
                consultState.data[field] = selectedValues;
            });
        });
    });
    
    // Budget presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('budgetInput').value = btn.dataset.amount;
            consultState.data.budget = parseInt(btn.dataset.amount);
        });
    });
    
    // Budget input
    document.getElementById('budgetInput')?.addEventListener('input', (e) => {
        consultState.data.budget = parseInt(e.target.value) || null;
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
    });
    
    // Navigation
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (consultState.currentStep > 1) {
            goToStep(consultState.currentStep - 1);
        }
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (consultState.currentStep < consultState.totalSteps) {
            goToStep(consultState.currentStep + 1);
        }
    });
    
    document.getElementById('submitBtn').addEventListener('click', submitConsultation);
    document.getElementById('backToConsult').addEventListener('click', resetConsultation);
    
    // Admin
    setupAdmin();
}

function setupAdmin() {
    const adminLink = document.getElementById('adminLink');
    const adminModal = document.getElementById('adminModal');
    const adminSave = document.getElementById('adminSave');
    const adminCancel = document.getElementById('adminCancel');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const adminStatus = document.getElementById('adminStatus');
    
    // Check existing key
    const existingKey = localStorage.getItem('claude_api_key');
    if (existingKey) {
        apiKeyInput.value = existingKey;
    }
    
    adminLink.addEventListener('click', () => {
        adminModal.classList.remove('hidden');
        updateAdminStatus();
    });
    
    adminCancel.addEventListener('click', () => {
        adminModal.classList.add('hidden');
    });
    
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.add('hidden');
        }
    });
    
    adminSave.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('claude_api_key', key);
            updateAdminStatus();
            setTimeout(() => {
                adminModal.classList.add('hidden');
            }, 1000);
        }
    });
    
    function updateAdminStatus() {
        const key = localStorage.getItem('claude_api_key');
        adminStatus.classList.remove('hidden', 'success', 'empty');
        if (key) {
            adminStatus.classList.add('success');
            adminStatus.textContent = '✓ API 키가 설정되어 있습니다.';
        } else {
            adminStatus.classList.add('empty');
            adminStatus.textContent = '⚠ API 키가 설정되지 않았습니다.';
        }
    }
}

function goToStep(step) {
    // 다음으로 넘어갈 때만 검증 (이전 버튼은 검증 안함)
    if (step > consultState.currentStep) {
        const isValid = validateCurrentStep();
        if (!isValid) {
            return;
        }
    }
    
    // Save inputs
    if (consultState.currentStep === 2) {
        consultState.data.concernsExtra = document.getElementById('concernsExtra')?.value || '';
    }
    if (consultState.currentStep === 4) {
        consultState.data.budget = parseInt(document.getElementById('budgetInput')?.value) || null;
    }
    if (consultState.currentStep === 6) {
        consultState.data.event = document.getElementById('eventInput')?.value || '';
        consultState.data.extra = document.getElementById('extraInput')?.value || '';
    }
    
    consultState.currentStep = step;
    
    // 모든 스텝 숨기기 (잔상 방지)
    document.querySelectorAll('.consult-step').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    // 현재 스텝만 보이기
    const currentStepEl = document.querySelector(`.consult-step[data-step="${step}"]`);
    currentStepEl.style.display = 'block';
    // 약간의 딜레이 후 active 추가 (애니메이션용)
    setTimeout(() => {
        currentStepEl.classList.add('active');
    }, 10);
    
    document.getElementById('progressFill').style.width = `${(step / consultState.totalSteps) * 100}%`;
    document.getElementById('progressText').textContent = `${step} / ${consultState.totalSteps}`;
    
    document.getElementById('prevBtn').disabled = step === 1;
    
    if (step === consultState.totalSteps) {
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('submitBtn').classList.remove('hidden');
    } else {
        document.getElementById('nextBtn').classList.remove('hidden');
        document.getElementById('submitBtn').classList.add('hidden');
    }
}

function validateCurrentStep() {
    const step = consultState.currentStep;
    let isValid = true;
    let message = '';
    
    switch(step) {
        case 1:
            if (!consultState.data.age) {
                message = '연령대를 선택해주세요.';
                isValid = false;
            } else if (!consultState.data.experience) {
                message = '시술 경험을 선택해주세요.';
                isValid = false;
            }
            break;
        case 2:
            if (!consultState.data.concerns || consultState.data.concerns.length === 0) {
                message = '고민을 최소 1개 이상 선택해주세요.';
                isValid = false;
            }
            break;
        case 3:
            if (!consultState.data.areas || consultState.data.areas.length === 0) {
                message = '관심 부위를 최소 1개 이상 선택해주세요.';
                isValid = false;
            }
            break;
        case 4:
            const budget = parseInt(document.getElementById('budgetInput')?.value);
            if (!budget || budget < 10) {
                message = '예산을 입력해주세요. (최소 10만원)';
                isValid = false;
            }
            break;
        case 5:
            if (!consultState.data.downtime) {
                message = '다운타임 허용 범위를 선택해주세요.';
                isValid = false;
            } else if (!consultState.data.pain) {
                message = '통증 민감도를 선택해주세요.';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showValidationMessage(message);
    }
    
    return isValid;
}

function showValidationMessage(message) {
    // 기존 메시지 제거
    const existingMsg = document.querySelector('.validation-message');
    if (existingMsg) existingMsg.remove();
    
    // 새 메시지 생성
    const msgEl = document.createElement('div');
    msgEl.className = 'validation-message';
    msgEl.textContent = message;
    
    // 현재 스텝에 추가
    const currentStep = document.querySelector(`.consult-step[data-step="${consultState.currentStep}"]`);
    currentStep.appendChild(msgEl);
    
    // 3초 후 제거
    setTimeout(() => {
        msgEl.remove();
    }, 3000);
}

async function submitConsultation() {
    consultState.data.event = document.getElementById('eventInput')?.value || '';
    consultState.data.extra = document.getElementById('extraInput')?.value || '';
    consultState.data.budget = parseInt(document.getElementById('budgetInput')?.value) || null;
    
    document.getElementById('consultWizard').classList.add('hidden');
    document.getElementById('consultLoading').classList.remove('hidden');
    
    try {
        const response = await callClaudeAPI(consultState.data);
        displayResult(response);
    } catch (error) {
        console.error('API Error:', error);
        displayResult(getFallbackResponse(consultState.data));
    }
}

async function callClaudeAPI(userData) {
    const SUPABASE_URL = 'https://iausfassbdmpieinhaba.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdXNmYXNzYmRtcGllaW5oYWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTg1ODQsImV4cCI6MjA4MjMzNDU4NH0.E6zhK_NvH8MMjAbGU9yJruJPytwtL8TeJm-pqWhIduc';
    
    const treatmentSummary = treatments.map(t => ({
        name: t.name,
        brand: t.brand || '',
        category: t.category,
        effects: t.effects?.primary?.join(', ') || '',
        priceMin: extractMinPrice(t.pricing?.range),
        priceRange: t.pricing?.range || '',
        downtime: t.recovery?.downtime || '없음',
        pain: t.recovery?.painLevel || 0,
        sessions: t.procedure?.sessions || ''
    }));
    
    const systemPrompt = `당신은 10년 경력의 피부과 전문 상담사입니다. 마치 오프라인에서 1:1로 상담하듯 따뜻하고 친절하게 설명해주세요.

핵심 규칙:
1. 고객의 총 예산(${userData.budget}만원)을 최대한 활용하세요. 예산의 80% 이상을 사용하는 조합을 제안하세요.
2. 3가지 조합을 제안하되, 각 조합은 예산 범위 내에서 최대한 많은 시술을 포함하세요.
3. 조합별로 다른 컨셉으로 구성하세요:
   - 조합1: 예산의 90-100% 활용, 프리미엄 시술 중심
   - 조합2: 예산의 80-90% 활용, 균형잡힌 조합
   - 조합3: 예산의 70-80% 활용, 가성비 중심 다양한 시술
4. 각 조합에 최소 3-5개의 시술을 포함하세요.
5. 가격은 병원마다 다르므로 최소 가격 기준으로 계산하세요.

응답 형식 (반드시 이 JSON 형식으로):
{
    "greeting": "고객 맞춤 인사말 (3-4문장, 고민에 공감하며 따뜻하게)",
    "analysis": "피부 상태 분석 및 접근 방향 (3-4문장, 왜 이런 시술들이 필요한지 설명)",
    "skinType": "고객의 예상 피부 타입 및 특징 분석 (2-3문장)",
    "combinations": [
        {
            "name": "조합 이름",
            "concept": "이 조합의 컨셉과 어떤 분께 추천하는지 (2문장)",
            "totalPrice": "총 예상 비용",
            "expectedResult": "이 조합으로 기대할 수 있는 결과 (2문장)",
            "treatments": [
                {
                    "name": "시술명",
                    "reason": "선택 이유와 효과 (1-2문장)",
                    "price": "가격",
                    "sessions": "횟수",
                    "painLevel": "통증 정도 (예: 거의 없음/약간 따끔/중간/아픔)",
                    "downtime": "회복 기간"
                }
            ],
            "order": "시술 순서와 간격, 왜 이 순서인지 설명 (2-3문장)",
            "maintenancePlan": "유지 관리 방법 (1-2문장)"
        }
    ],
    "recommendation": "3가지 조합 중 가장 추천하는 것과 상세한 이유 (3-4문장)",
    "precautions": {
        "before": ["시술 전 주의사항 5가지 (구체적으로)"],
        "after": ["시술 후 관리법 5가지 (구체적으로)"],
        "avoid": ["피해야 할 것들 3가지"]
    },
    "checkList": ["병원 방문 전 꼭 확인할 것 5가지 (질문할 내용 포함)"],
    "timeline": "전체 시술 플랜의 예상 기간과 타임라인 (2-3문장)",
    "tips": ["전문가로서 드리는 꿀팁 5가지 (실용적인 조언)"],
    "closing": "따뜻한 마무리 인사와 응원 (2-3문장)"
}

시술 데이터:
${JSON.stringify(treatmentSummary, null, 2)}`;

    const userMessage = `고객 정보:
- 연령대: ${userData.age || '미입력'}
- 시술 경험: ${userData.experience || '미입력'}  
- 주요 고민: ${userData.concerns?.join(', ') || '미입력'}
- 추가 고민: ${userData.concernsExtra || '없음'}
- 관심 부위: ${userData.areas?.join(', ') || '미입력'}
- 총 예산: ${userData.budget || '미입력'}만원
- 다운타임 허용: ${userData.downtime || '미입력'}
- 통증 민감도: ${userData.pain || '미입력'}
- 중요 일정: ${userData.event || '없음'}
- 추가 요청: ${userData.extra || '없음'}

위 정보를 바탕으로 예산 내에서 3가지 시술 조합을 추천해주세요. 최대한 자세하고 친절하게 설명해주세요.`;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/claude-proxy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
            messages: [
                { role: 'user', content: systemPrompt + '\n\n' + userMessage }
            ]
        })
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
    const content = data.content[0].text;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
}

function extractMinPrice(priceRange) {
    if (!priceRange) return 0;
    const match = priceRange.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

function getFallbackResponse(userData) {
    const concerns = userData.concerns || [];
    const budget = userData.budget || 100;
    
    return {
        greeting: `${userData.age || ''} 고객님, 안녕하세요! ${concerns.join(', ')} 고민으로 상담 주셨군요. 많은 분들이 비슷한 고민을 갖고 계세요. 제가 ${budget}만원 예산 내에서 최적의 시술 조합을 찾아드릴게요.`,
        analysis: `말씀하신 고민들을 종합해보면, 피부 탄력과 결 개선이 함께 필요한 상태로 보여요. 한 가지 시술보다는 여러 시술을 조합하면 시너지 효과를 얻을 수 있습니다.`,
        combinations: [
            {
                name: "기본 탄력 케어",
                concept: "부담 없이 시작할 수 있는 기본 조합이에요. 스킨부스터로 피부 기초 체력을 키우는 것부터 시작합니다.",
                totalPrice: `약 ${Math.min(budget, 50)}만원`,
                treatments: [
                    { name: "리쥬란 힐러", reason: "피부 재생과 탄력 개선의 기본", price: "20~30만원", sessions: "3회 권장" },
                    { name: "보톡스", reason: "표정 주름 예방 및 개선", price: "10~20만원", sessions: "3-6개월마다" }
                ],
                order: "리쥬란 3회 완료 후 보톡스 시술 권장"
            },
            {
                name: "집중 개선 코스",
                concept: "좀 더 확실한 효과를 원하시는 분께 추천드려요. 레이저와 부스터를 함께 진행합니다.",
                totalPrice: `약 ${Math.min(budget, 80)}만원`,
                treatments: [
                    { name: "포텐자", reason: "모공과 탄력을 동시에", price: "30~50만원", sessions: "3회 권장" },
                    { name: "쥬베룩", reason: "콜라겐 재생 촉진", price: "25~35만원", sessions: "3회 권장" }
                ],
                order: "포텐자 먼저 2회 → 2주 후 쥬베룩 시작"
            },
            {
                name: "프리미엄 리프팅",
                concept: "확실한 리프팅 효과를 원하시는 분께. 고출력 장비로 빠른 효과를 경험하세요.",
                totalPrice: `약 ${Math.min(budget, 150)}만원`,
                treatments: [
                    { name: "울쎄라", reason: "HIFU 리프팅의 대표 시술", price: "100~200만원", sessions: "1회 (6-12개월 지속)" }
                ],
                order: "1회 시술로 충분, 6개월 후 유지 시술 고려"
            }
        ],
        recommendation: "고객님의 상황을 고려하면 '집중 개선 코스'를 가장 추천드려요. 예산 대비 가장 균형 잡힌 효과를 기대할 수 있습니다.",
        tips: [
            "첫 시술은 테스트 삼아 약한 세팅으로 시작하세요",
            "시술 전후 2주는 자외선 차단제 필수예요",
            "여러 병원 상담 받아보시고 비교해보세요",
            "시술 간격은 최소 2주 이상 두시는 게 좋아요",
            "충분한 수분 섭취가 회복에 도움 됩니다"
        ],
        closing: "궁금한 점이 있으시면 언제든 다시 상담해주세요. 고객님의 피부 고민이 해결되시길 응원합니다! 💙"
    };
}

function getPriceRange(combinations) {
    if (!combinations || combinations.length === 0) return '-';
    
    const prices = combinations.map(c => {
        const priceStr = c.totalPrice || '';
        const match = priceStr.match(/(\d+)/);
        return match ? parseInt(match[0]) : 0;
    }).filter(p => p > 0);
    
    if (prices.length === 0) return '-';
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    if (min === max) return `약 ${min}만원`;
    return `${min}~${max}만원`;
}

function getTotalTreatments(combinations) {
    if (!combinations) return 0;
    
    const allTreatments = new Set();
    combinations.forEach(c => {
        c.treatments?.forEach(t => {
            allTreatments.add(t.name);
        });
    });
    return allTreatments.size;
}

function displayResult(response) {
    document.getElementById('consultLoading').classList.add('hidden');
    document.getElementById('consultResult').classList.remove('hidden');
    
    const userData = consultState.data;
    
    const html = `
        <div class="report-container">
            <div class="report-header">
                <h2 class="report-title">맞춤 시술 상담 리포트</h2>
                <p class="report-subtitle">AI 상담사가 분석한 고객님만을 위한 추천</p>
            </div>
            
            <div class="report-summary-box">
                <div class="report-summary-title">상담 요약</div>
                <div class="report-summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">연령대</div>
                        <div class="summary-value">${userData.age || '-'}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">주요 고민</div>
                        <div class="summary-value">${userData.concerns?.slice(0,2).join(', ') || '-'}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">설정 예산</div>
                        <div class="summary-value">${userData.budget ? userData.budget + '만원' : '-'}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">제안 가격대</div>
                        <div class="summary-value highlight">${getPriceRange(response.combinations)}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">다운타임</div>
                        <div class="summary-value">${userData.downtime || '-'}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">시술 개수</div>
                        <div class="summary-value">${getTotalTreatments(response.combinations)}개</div>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h3 class="report-section-title">💬 상담사 인사</h3>
                <div class="report-greeting">
                    <p>${response.greeting}</p>
                    ${response.analysis ? `<p>${response.analysis}</p>` : ''}
                    ${response.skinType ? `<p><strong>피부 타입 분석:</strong> ${response.skinType}</p>` : ''}
                </div>
            </div>
            
            ${response.timeline ? `
            <div class="report-section">
                <h3 class="report-section-title">📅 전체 플랜 타임라인</h3>
                <div class="report-comment">
                    <p>${response.timeline}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="report-section">
                <h3 class="report-section-title">
                    🎯 맞춤 시술 조합 
                    <span class="badge">3가지 제안</span>
                </h3>
                
                <div class="combinations-grid">
                ${response.combinations?.map((combo, i) => `
                    <div class="combination-card">
                        <div class="combination-header">
                            <div class="combination-title">
                                <span class="num">${i + 1}</span>
                                ${combo.name}
                            </div>
                            <div class="combination-price">${combo.totalPrice}</div>
                        </div>
                        <div class="combination-desc">
                            ${combo.concept}
                            ${combo.expectedResult ? `<div class="expected-result">✨ 기대효과: ${combo.expectedResult}</div>` : ''}
                        </div>
                        <div class="combination-treatments">
                            ${combo.treatments?.map(t => `
                                <div class="treatment-item">
                                    <div class="treatment-info">
                                        <div class="treatment-name">${t.name}</div>
                                        <div class="treatment-detail">${t.reason}</div>
                                        ${t.painLevel || t.downtime ? `
                                        <div class="treatment-meta">
                                            ${t.painLevel ? `<span>통증: ${t.painLevel}</span>` : ''}
                                            ${t.downtime ? `<span>회복: ${t.downtime}</span>` : ''}
                                        </div>
                                        ` : ''}
                                    </div>
                                    <div class="treatment-price">
                                        ${t.price}
                                        <div class="treatment-sessions">${t.sessions}</div>
                                    </div>
                                </div>
                            `).join('') || ''}
                        </div>
                        ${combo.order ? `
                            <div class="order-guide">
                                <div class="order-guide-title">📅 순서</div>
                                <div class="order-guide-content">${combo.order}</div>
                            </div>
                        ` : ''}
                        ${combo.maintenancePlan ? `
                            <div class="maintenance-guide">
                                <div class="order-guide-title">🔄 유지 관리</div>
                                <div class="order-guide-content">${combo.maintenancePlan}</div>
                            </div>
                        ` : ''}
                    </div>
                `).join('') || ''}
                </div>
            </div>
            
            ${response.recommendation ? `
            <div class="report-section">
                <h3 class="report-section-title">⭐ 상담사 추천</h3>
                <div class="report-comment">
                    <p>${response.recommendation}</p>
                </div>
            </div>
            ` : ''}
            
            ${response.precautions ? `
            <div class="report-section">
                <h3 class="report-section-title">⚠️ 시술 전후 주의사항</h3>
                <div class="precautions-grid">
                    <div class="precaution-box before">
                        <h4>🔸 시술 전 주의사항</h4>
                        <ul>
                            ${response.precautions.before?.map(item => `<li>${item}</li>`).join('') || ''}
                        </ul>
                    </div>
                    <div class="precaution-box after">
                        <h4>🔹 시술 후 관리법</h4>
                        <ul>
                            ${response.precautions.after?.map(item => `<li>${item}</li>`).join('') || ''}
                        </ul>
                    </div>
                    ${response.precautions.avoid?.length ? `
                    <div class="precaution-box avoid">
                        <h4>🚫 피해야 할 것</h4>
                        <ul>
                            ${response.precautions.avoid?.map(item => `<li>${item}</li>`).join('') || ''}
                        </ul>
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            ${response.checkList?.length ? `
            <div class="report-section">
                <h3 class="report-section-title">📋 병원 방문 전 체크리스트</h3>
                <div class="checklist-box">
                    <p class="checklist-intro">상담 시 아래 내용을 꼭 확인하세요:</p>
                    <ul class="checklist">
                        ${response.checkList.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
            ` : ''}
            
            ${response.tips?.length ? `
            <div class="report-section">
                <h3 class="report-section-title">💡 전문가 꿀팁</h3>
                <ul class="report-tips">
                    ${response.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${response.closing ? `
            <div class="report-section">
                <div class="report-closing">
                    <p>${response.closing}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="report-disclaimer">
                <strong>안내:</strong> 본 상담 결과는 AI가 제공하는 일반적인 정보이며, 실제 시술 전 반드시 피부과 전문의 상담을 받으시기 바랍니다. 
                표시된 가격은 최소 기준이며, 병원 및 시술 범위에 따라 달라질 수 있습니다.
            </div>
        </div>
    `;
    
    document.getElementById('resultContent').innerHTML = html;
}

function resetConsultation() {
    consultState = {
        currentStep: 1,
        totalSteps: 6,
        data: {
            age: null,
            experience: null,
            concerns: [],
            concernsExtra: '',
            areas: [],
            budget: null,
            downtime: null,
            pain: null,
            event: '',
            extra: ''
        }
    };
    
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.text-input').forEach(input => input.value = '');
    
    goToStep(1);
    
    document.getElementById('consultResult').classList.add('hidden');
    document.getElementById('consultLoading').classList.add('hidden');
    document.getElementById('consultWizard').classList.remove('hidden');
}
