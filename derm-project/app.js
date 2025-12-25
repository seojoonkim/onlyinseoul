// State
let selectedCategory = null;
let selectedSubcategory = null;
let selectedTreatmentIdx = null;
let searchQuery = '';

// DOM Elements
const $catTabs = document.getElementById('catTabs');
const $sidebar = document.getElementById('sidebar');
const $sidebarTitle = document.getElementById('sidebarTitle');
const $subButtons = document.getElementById('subButtons');
const $content = document.getElementById('content');
const $detailPanel = document.getElementById('detailPanel');
const $detailContent = document.getElementById('detailContent');
const $searchResults = document.getElementById('searchResults');
const $searchInput = document.getElementById('searchInput');
const $totalCount = document.getElementById('totalCount');

// Helpers
function countAll() {
  let total = 0;
  DB.categories.forEach(cat => {
    cat.subcategories.forEach(sub => {
      total += sub.treatments.length;
    });
  });
  return total;
}

function painLevel(pain) {
  if (pain <= 1.5) return { text: '거의 없음', cls: 'pain-green' };
  if (pain <= 2.5) return { text: '약간', cls: 'pain-lime' };
  if (pain <= 3.5) return { text: '보통', cls: 'pain-yellow' };
  return { text: '다소 있음', cls: 'pain-red' };
}

// Render
function renderCatTabs() {
  $catTabs.innerHTML = DB.categories.map(cat =>
    `<button class="cat-tab ${selectedCategory === cat.id ? 'active' : ''}" 
             onclick="selectCategory('${cat.id}')">${cat.name}</button>`
  ).join('');
}

function selectCategory(catId) {
  selectedCategory = catId;
  selectedSubcategory = null;
  selectedTreatmentIdx = null;
  searchQuery = '';
  $searchInput.value = '';
  
  renderCatTabs();
  renderSidebar();
  renderContent();
  hideDetail();
  showMainView();
}

function renderSidebar() {
  const cat = DB.categories.find(c => c.id === selectedCategory);
  if (!cat) {
    $sidebar.classList.add('hidden');
    return;
  }
  
  $sidebar.classList.remove('hidden');
  $sidebarTitle.textContent = cat.name;
  $subButtons.innerHTML = cat.subcategories.map(sub =>
    `<button class="sub-btn ${selectedSubcategory === sub.id ? 'active' : ''}" 
             onclick="selectSubcategory('${sub.id}')">
      ${sub.name} <span>${sub.treatments.length}</span>
    </button>`
  ).join('');
}

function selectSubcategory(subId) {
  selectedSubcategory = subId;
  selectedTreatmentIdx = null;
  renderSidebar();
  renderContent();
  hideDetail();
}

function renderContent() {
  const cat = DB.categories.find(c => c.id === selectedCategory);
  if (!cat) {
    $content.innerHTML = `<div class="empty-state"><h3>카테고리를 선택하세요</h3><p>상단 탭에서 관심있는 시술 카테고리를 선택해주세요</p></div>`;
    return;
  }
  
  const sub = cat.subcategories.find(s => s.id === selectedSubcategory);
  if (!sub) {
    $content.innerHTML = `<div class="empty-state"><h3>${cat.name}</h3><p>좌측 메뉴에서 세부 카테고리를 선택하세요</p></div>`;
    return;
  }
  
  $content.innerHTML = `
    <h2>${sub.name} (${sub.treatments.length}개)</h2>
    <div class="treatment-list">
      ${sub.treatments.map((t, i) => renderCard(t, i)).join('')}
    </div>
  `;
}

function renderCard(t, idx) {
  const pl = painLevel(t.pain);
  return `
    <div class="treatment-card ${selectedTreatmentIdx === idx ? 'selected' : ''}" 
         onclick="selectTreatment(${idx})">
      <div class="card-top">
        <div class="card-title">
          <h3>${t.name}</h3>
          ${t.note ? `<span class="card-note">${t.note}</span>` : ''}
        </div>
        <div class="card-price">
          <p>${t.price}</p>
          <p>${t.sessions}</p>
        </div>
      </div>
      <p class="card-brand">${t.brand}</p>
      <div class="card-tags">
        ${t.target.slice(0, 4).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
      </div>
      <div class="card-meta">
        <span>⏱ ${t.duration}</span>
        <span>📅 ${t.downtime}</span>
        <span class="${pl.cls}">💉 ${pl.text}</span>
      </div>
    </div>
  `;
}

function selectTreatment(idx) {
  selectedTreatmentIdx = idx;
  renderContent();
  showDetail();
}

function showDetail() {
  const cat = DB.categories.find(c => c.id === selectedCategory);
  const sub = cat?.subcategories.find(s => s.id === selectedSubcategory);
  const t = sub?.treatments[selectedTreatmentIdx];
  if (!t) return;
  
  const pl = painLevel(t.pain);
  
  $detailContent.innerHTML = `
    <h3>${t.name}</h3>
    <p class="detail-brand">${t.brand}</p>
    
    <div class="detail-section">
      <h4>작용 원리</h4>
      <p>${t.mechanism}</p>
    </div>
    
    <div class="detail-section">
      <h4>효과/적응증</h4>
      <div class="detail-tags">
        ${t.target.map(tag => `<span class="detail-tag">${tag}</span>`).join('')}
      </div>
    </div>
    
    <div class="detail-info">
      <div class="detail-grid">
        <div><p>효과 지속</p><p>${t.duration}</p></div>
        <div><p>회복 기간</p><p>${t.downtime}</p></div>
        <div><p>통증</p><p class="${pl.cls}">${pl.text} (${t.pain}/5)</p></div>
        <div><p>시술 횟수</p><p>${t.sessions}</p></div>
        <div style="grid-column: span 2;"><p>가격대</p><p>${t.price}</p></div>
      </div>
    </div>
    
    ${t.note ? `<div class="detail-section" style="margin-top:16px;"><h4>참고</h4><p>${t.note}</p></div>` : ''}
  `;
  
  $detailPanel.classList.remove('hidden');
}

function hideDetail() {
  $detailPanel.classList.add('hidden');
}

// Search
function doSearch() {
  const q = searchQuery.toLowerCase();
  const results = [];
  
  DB.categories.forEach(cat => {
    cat.subcategories.forEach(sub => {
      sub.treatments.forEach(t => {
        const text = [t.name, t.brand, t.mechanism, ...t.target, t.note || ''].join(' ').toLowerCase();
        if (text.includes(q)) {
          results.push({ ...t, catName: cat.name, subName: sub.name, catId: cat.id, subId: sub.id });
        }
      });
    });
  });
  
  showSearchResults(results);
}

function showSearchResults(results) {
  $sidebar.classList.add('hidden');
  $content.classList.add('hidden');
  $detailPanel.classList.add('hidden');
  $searchResults.classList.remove('hidden');
  
  $searchResults.innerHTML = `
    <p>"${searchQuery}" 검색 결과: <strong>${results.length}개</strong></p>
    <div class="search-grid">
      ${results.map(r => `
        <div class="search-card" onclick="goToTreatment('${r.catId}', '${r.subId}', '${r.name.replace(/'/g, "\\'")}')">
          <p class="path">${r.catName} > ${r.subName}</p>
          <h3>${r.name}</h3>
          <p class="brand">${r.brand}</p>
          <p class="targets">${r.target.slice(0, 4).join(', ')}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function goToTreatment(catId, subId, treatmentName) {
  searchQuery = '';
  $searchInput.value = '';
  selectedCategory = catId;
  selectedSubcategory = subId;
  
  const cat = DB.categories.find(c => c.id === catId);
  const sub = cat?.subcategories.find(s => s.id === subId);
  const idx = sub?.treatments.findIndex(t => t.name === treatmentName);
  
  selectedTreatmentIdx = idx >= 0 ? idx : null;
  
  showMainView();
  renderCatTabs();
  renderSidebar();
  renderContent();
  if (selectedTreatmentIdx !== null) showDetail();
}

function showMainView() {
  $searchResults.classList.add('hidden');
  $content.classList.remove('hidden');
}

// Init
function init() {
  $totalCount.textContent = `총 ${countAll()}개 시술 정보`;
  renderCatTabs();
  
  $searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (searchQuery.length >= 1) {
      doSearch();
    } else {
      showMainView();
      if (selectedCategory) {
        $sidebar.classList.remove('hidden');
        renderSidebar();
        renderContent();
      }
    }
  });
}

init();
