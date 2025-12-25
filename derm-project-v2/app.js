// ===== 앱 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // 초보자 가이드 표시 (처음 방문 시)
  if (!localStorage.getItem('guideShown')) {
    document.getElementById('guidePopup').classList.remove('hidden');
  }
  
  // 전체 시술 표시
  renderTreatments(DB_EXTENDED.treatments);
  
  // 이벤트 리스너 설정
  setupEventListeners();
}

// ===== 이벤트 리스너 =====
function setupEventListeners() {
  // 검색
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', debounce(handleSearch, 300));
  
  // 고민별 퀵 버튼
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => handleConcernClick(btn));
  });
  
  // 상세 패널 닫기
  document.getElementById('closeDetail').addEventListener('click', closeDetail);
  
  // 가이드 팝업 닫기
  document.getElementById('closeGuide').addEventListener('click', closeGuide);
  document.getElementById('guideCloseBtn').addEventListener('click', closeGuide);
  
  // 배경 클릭으로 팝업 닫기
  document.getElementById('guidePopup').addEventListener('click', (e) => {
    if (e.target.id === 'guidePopup') closeGuide();
  });
}

// ===== 고민별 필터링 =====
const concernMap = {
  '처짐': ['울쎄라', '써마지', '슈링크', '인모드', '실리프팅'],
  '주름': ['보톡스', '울쎄라', '써마지', '필러'],
  '탄력': ['써마지', '울쎄라', '리쥬란', '슈링크', '인모드'],
  '모공': ['프락셀', '스카펫', '스킨보톡스', '피코토닝'],
  '색소': ['피코토닝', '레이저토닝', 'IPL'],
  '여드름': ['여드름 치료', '피코토닝'],
  '볼륨': ['필러', '쥬베룩'],
  '제모': ['레이저 제모']
};

function handleConcernClick(btn) {
  const concern = btn.dataset.concern;
  
  // 버튼 활성화 토글
  document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  // 관련 시술 필터링
  const relatedNames = concernMap[concern] || [];
  const filtered = DB_EXTENDED.treatments.filter(t => 
    relatedNames.some(name => t.name.includes(name)) ||
    t.effects.primary.some(e => e.includes(concern)) ||
    t.effects.secondary.some(e => e.includes(concern)) ||
    t.tags.some(tag => tag.includes(concern))
  );
  
  document.getElementById('listTitle').textContent = `${concern} 고민 추천 시술`;
  renderTreatments(filtered.length > 0 ? filtered : DB_EXTENDED.treatments);
}

// ===== 검색 =====
function handleSearch(e) {
  const query = e.target.value.trim().toLowerCase();
  
  // 퀵 버튼 비활성화
  document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
  
  if (!query) {
    document.getElementById('listTitle').textContent = '인기 시술';
    renderTreatments(DB_EXTENDED.treatments);
    return;
  }
  
  const results = DB_EXTENDED.treatments.filter(t => 
    t.name.toLowerCase().includes(query) ||
    t.nameEn.toLowerCase().includes(query) ||
    t.brand.toLowerCase().includes(query) ||
    t.mechanism.simple.includes(query) ||
    t.mechanism.keywords.some(k => k.toLowerCase().includes(query)) ||
    t.tags.some(tag => tag.includes(query)) ||
    t.effects.primary.some(e => e.includes(query)) ||
    t.effects.secondary.some(e => e.includes(query))
  );
  
  document.getElementById('listTitle').textContent = `"${query}" 검색 결과`;
  renderTreatments(results);
}

// ===== 시술 카드 렌더링 =====
function renderTreatments(treatments) {
  const container = document.getElementById('cardsContainer');
  document.getElementById('listCount').textContent = `${treatments.length}개`;
  
  if (treatments.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
        <p style="font-size: 48px; margin-bottom: 16px;">🔍</p>
        <h3 style="font-size: 18px; margin-bottom: 8px;">검색 결과가 없습니다</h3>
        <p>다른 키워드로 검색해보세요</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = treatments.map(t => `
    <div class="card" onclick="showDetail('${t.id}')">
      <div class="card-header">
        <div>
          <div class="card-title">${t.name}</div>
          <div class="card-brand">${t.brand}</div>
        </div>
        <span class="card-category">${t.subcategory}</span>
      </div>
      <div class="card-desc">${t.mechanism.simple}</div>
      <div class="card-tags">
        ${t.effects.primary.slice(0, 3).map(e => `<span class="tag">${e}</span>`).join('')}
      </div>
      <div class="card-meta">
        <span class="meta-item">💰 ${t.pricing.average}</span>
        <span class="meta-item">⏱️ ${t.effects.duration}</span>
        <span class="meta-item">${getPainEmoji(t.recovery.painLevel)} 통증 ${t.recovery.painLevel}/5</span>
      </div>
    </div>
  `).join('');
}

function getPainEmoji(level) {
  if (level <= 1.5) return '😊';
  if (level <= 2.5) return '😐';
  if (level <= 3.5) return '😣';
  return '😖';
}

// ===== 상세 패널 =====
function showDetail(id) {
  const t = DB_EXTENDED.treatments.find(item => item.id === id);
  if (!t) return;
  
  const panel = document.getElementById('detailPanel');
  const content = document.getElementById('detailContent');
  
  content.innerHTML = `
    <!-- 헤더 -->
    <div class="detail-header">
      <div class="detail-title">${t.name}</div>
      <div class="detail-subtitle">${t.nameEn} · ${t.brand}</div>
    </div>
    
    <!-- 원리 설명 -->
    <div class="detail-section">
      <div class="section-title">이 시술은요</div>
      <div class="mechanism-box">
        <div class="mechanism-simple">${t.mechanism.simple}</div>
        <div class="mechanism-detail" id="mechDetail" style="display: none;">
          ${t.mechanism.detailed}
        </div>
        <div class="mechanism-toggle" onclick="toggleMechanism()">
          <span id="mechToggleText">자세히 보기 ▼</span>
        </div>
      </div>
    </div>
    
    <!-- 효과 -->
    <div class="detail-section">
      <div class="section-title">기대 효과</div>
      <div class="effect-list">
        ${t.effects.primary.map(e => `<span class="effect-item">${e}</span>`).join('')}
        ${t.effects.secondary.map(e => `<span class="effect-item secondary">${e}</span>`).join('')}
      </div>
      ${t.effects.notFor.length > 0 ? `
        <div style="margin-top: 12px;">
          <small style="color: var(--text-light);">❌ 이런 효과는 기대하기 어려워요:</small>
          <div class="effect-list" style="margin-top: 6px;">
            ${t.effects.notFor.map(e => `<span class="effect-item not-for">${e}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
    
    <!-- 시술 정보 -->
    <div class="detail-section">
      <div class="section-title">시술 정보</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">시술 시간</div>
          <div class="info-value">${t.procedure.duration}</div>
        </div>
        <div class="info-item">
          <div class="info-label">마취</div>
          <div class="info-value">${t.procedure.anesthesia}</div>
        </div>
        <div class="info-item">
          <div class="info-label">권장 횟수</div>
          <div class="info-value">${t.procedure.sessions}</div>
        </div>
        <div class="info-item">
          <div class="info-label">시술 주기</div>
          <div class="info-value">${t.procedure.interval}</div>
        </div>
      </div>
    </div>
    
    <!-- 통증 & 회복 -->
    <div class="detail-section">
      <div class="section-title">통증 & 회복</div>
      <div class="info-grid">
        <div class="info-item" style="grid-column: 1/-1;">
          <div class="info-label">통증 정도</div>
          <div class="pain-level">
            <span>${getPainEmoji(t.recovery.painLevel)}</span>
            <div class="pain-bar">
              <div class="pain-fill ${getPainClass(t.recovery.painLevel)}" style="width: ${t.recovery.painLevel * 20}%"></div>
            </div>
            <span style="font-size: 14px; font-weight: 500;">${t.recovery.painLevel}/5</span>
          </div>
          <div style="font-size: 13px; color: var(--text-light); margin-top: 8px;">
            ${t.recovery.painDescription}
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">다운타임</div>
          <div class="info-value">${t.recovery.downtime}</div>
        </div>
        <div class="info-item">
          <div class="info-label">일반적 반응</div>
          <div class="info-value" style="font-size: 13px;">${t.recovery.commonSideEffects.join(', ')}</div>
        </div>
      </div>
    </div>
    
    <!-- 이런 분께 추천 -->
    <div class="detail-section">
      <div class="section-title">이런 분께 추천</div>
      <div class="suitability-box">
        <div class="suit-row">
          <span class="suit-label good">추천 ✓</span>
          <div class="suit-items">
            ${t.suitability.bestFor.map(item => `<span class="suit-item">${item}</span>`).join('')}
          </div>
        </div>
        <div class="suit-row">
          <span class="suit-label bad">비추천 ✗</span>
          <div class="suit-items">
            ${t.suitability.notRecommended.map(item => `<span class="suit-item">${item}</span>`).join('')}
          </div>
        </div>
        <div style="margin-top: 12px; font-size: 13px; color: var(--text-light);">
          💡 적정 연령대: ${t.suitability.idealAge}
        </div>
      </div>
    </div>
    
    <!-- 장단점 -->
    <div class="detail-section">
      <div class="section-title">장점과 단점</div>
      <div class="pros-cons">
        <div class="pros">
          <h4>👍 장점</h4>
          <ul>
            ${t.pros.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <div class="cons">
          <h4>👎 단점</h4>
          <ul>
            ${t.cons.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    
    <!-- 가격 -->
    <div class="detail-section">
      <div class="section-title">예상 비용</div>
      <div class="price-box">
        <div class="price-range">${t.pricing.range}</div>
        <div class="price-note">
          평균 ${t.pricing.average} · ${t.pricing.factors.join(', ')}에 따라 변동
        </div>
      </div>
    </div>
    
    <!-- 다른 시술과 비교 -->
    ${Object.keys(t.comparison.vs).length > 0 ? `
      <div class="detail-section">
        <div class="section-title">다른 시술과 비교</div>
        <div class="compare-list">
          ${Object.entries(t.comparison.vs).map(([name, desc]) => `
            <div class="compare-item">
              <div class="compare-title">${t.name} vs ${name}</div>
              <div class="compare-desc">${desc}</div>
            </div>
          `).join('')}
        </div>
        ${t.comparison.bestWith ? `
          <div style="margin-top: 12px; font-size: 13px; color: var(--text-light);">
            💫 함께하면 좋은 시술: ${t.comparison.bestWith.join(', ')}
          </div>
        ` : ''}
      </div>
    ` : ''}
    
    <!-- 안전 정보 -->
    <div class="detail-section">
      <div class="section-title">주의사항</div>
      <div class="safety-box">
        <div class="safety-title">⚠️ 시술 전 확인하세요</div>
        <ul class="safety-list">
          ${t.safety.contraindications.map(c => `<li>🚫 ${c}</li>`).join('')}
          ${t.safety.warnings.map(w => `<li>⚡ ${w}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  
  panel.classList.remove('hidden');
  panel.scrollTop = 0;
}

function getPainClass(level) {
  if (level <= 1.5) return 'low';
  if (level <= 3) return 'medium';
  return 'high';
}

function toggleMechanism() {
  const detail = document.getElementById('mechDetail');
  const text = document.getElementById('mechToggleText');
  
  if (detail.style.display === 'none') {
    detail.style.display = 'block';
    text.textContent = '간단히 보기 ▲';
  } else {
    detail.style.display = 'none';
    text.textContent = '자세히 보기 ▼';
  }
}

function closeDetail() {
  document.getElementById('detailPanel').classList.add('hidden');
}

function closeGuide() {
  document.getElementById('guidePopup').classList.add('hidden');
  localStorage.setItem('guideShown', 'true');
}

// ===== 유틸리티 =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
