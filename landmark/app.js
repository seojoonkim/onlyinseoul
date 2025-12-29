/**
 * Seoul Landmark Guide - Application
 * 맛집 가이드와 동일한 구조
 */

// 전역 변수
let allData = [];
let filteredData = [];
let currentCategory = 'all';
let activeScoreFilters = [];
let map = null;
let markers = [];

// R2 이미지 베이스 URL
const R2_BASE_URL = 'https://pub-7e6695e8988144648e5bcecfee551e0d.r2.dev';

// 이미지 뷰어 변수
let currentGalleryImages = [];
let currentImageIndex = 0;

// 카테고리 정보
const categoryInfo = {
    palace: { name: '고궁/역사', icon: '🏯', color: '#dc2626' },
    viewpoint: { name: '전망/야경', icon: '🌆', color: '#7c3aed' },
    shopping: { name: '쇼핑', icon: '🛍️', color: '#ec4899' },
    hipplace: { name: '힙플레이스', icon: '🎨', color: '#f59e0b' },
    nature: { name: '공원/자연', icon: '🌳', color: '#10b981' },
    museum: { name: '박물관/미술관', icon: '🏛️', color: '#3b82f6' }
};

// 점수 정보 - 10개 항목 (순서대로)
const scoreInfo = {
    photo: { name: '사진촬영', icon: '📷' },
    culture: { name: '문화체험', icon: '🎭' },
    activity: { name: '액티비티', icon: '🎯' },
    relaxation: { name: '힐링', icon: '🧘' },
    crowdedness: { name: '한적함', icon: '🌿' },
    couple: { name: '커플추천', icon: '💑' },
    family: { name: '가족추천', icon: '👨‍👩‍👧' },
    solo: { name: '혼자여행', icon: '🚶' },
    foreigner: { name: '외국인편의', icon: '🌍' },
    accessibility: { name: '접근성', icon: '🚇' }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (typeof landmarkData !== 'undefined') {
        allData = landmarkData;
    }
    
    // 초기 로딩 시 인기도순 정렬
    filteredData = [...allData].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    setupEventListeners();
    renderTable();
    updateStats();
});

// 이벤트 리스너
function setupEventListeners() {
    // 뷰 탭
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const view = tab.dataset.view;
            document.getElementById('listView').style.display = view === 'list' ? 'block' : 'none';
            document.getElementById('mapView').style.display = view === 'map' ? 'block' : 'none';
            
            if (view === 'map') renderMap();
        });
    });
    
    // 카테고리 필터
    document.querySelectorAll('#categoryFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#categoryFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            applyFilters();
        });
    });
    
    // 점수 필터 버튼 (라디오 방식 - 하나만 선택)
    document.querySelectorAll('#scoreFilters .score-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#scoreFilters .score-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const score = btn.dataset.score;
            activeScoreFilters = score === 'all' ? [] : [score];
            applyFilters();
        });
    });
    
    // 모달 닫기
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// 필터 적용
function applyFilters() {
    filteredData = allData.filter(item => {
        if (currentCategory !== 'all' && item.category !== currentCategory) {
            return false;
        }
        
        if (activeScoreFilters.length > 0) {
            const hasHighScore = activeScoreFilters.some(score => 
                item.scores && item.scores[score] >= 4
            );
            if (!hasHighScore) return false;
        }
        
        return true;
    });
    
    // 인기도순 내림차순 정렬
    filteredData.sort((a, b) => {
        return (b.popularity || 0) - (a.popularity || 0);
    });
    
    renderTable();
    updateFilteredCount();
}

// 통계 업데이트
function updateStats() {
    const counts = {
        palace: allData.filter(d => d.category === 'palace').length,
        viewpoint: allData.filter(d => d.category === 'viewpoint').length,
        shopping: allData.filter(d => d.category === 'shopping').length,
        hipplace: allData.filter(d => d.category === 'hipplace').length,
        nature: allData.filter(d => d.category === 'nature').length,
        museum: allData.filter(d => d.category === 'museum').length
    };
    
    document.getElementById('palaceCount').textContent = counts.palace;
    document.getElementById('viewpointCount').textContent = counts.viewpoint;
    document.getElementById('shoppingCount').textContent = counts.shopping;
    document.getElementById('hipplaceCount').textContent = counts.hipplace;
    document.getElementById('natureCount').textContent = counts.nature;
    document.getElementById('museumCount').textContent = counts.museum;
    document.getElementById('dbCount').textContent = `${allData.length}개 명소`;
}

function updateFilteredCount() {
    document.getElementById('filteredCount').textContent = filteredData.length;
}

// 테이블 렌더링
function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#94a3b8;">검색 결과가 없습니다.</td></tr>';
        updateFilteredCount();
        return;
    }
    
    tbody.innerHTML = filteredData.map((item, idx) => {
        const cat = categoryInfo[item.category] || {};
        const thumbUrl = `${R2_BASE_URL}/${item.id}/${item.id}_01.jpg`;
        const popularity = item.popularity || 50;
        
        return `
            <tr onclick="openModal('${item.id}')">
                <td class="cell-rank">${idx + 1}</td>
                <td>
                    <div class="cell-photo">
                        <img src="${thumbUrl}" alt="${item.name_ko}" onerror="this.parentElement.innerHTML='${cat.icon || '📍'}'">
                    </div>
                </td>
                <td>
                    <div class="cell-name">${item.name_ko}</div>
                    <span class="cell-category-mobile ${item.category}">${cat.icon} ${cat.name}</span>
                </td>
                <td>
                    <span class="cell-category ${item.category}">${cat.icon} ${cat.name}</span>
                </td>
                <td class="cell-location">${item.district || '-'}</td>
                <td class="cell-duration">${item.duration || '-'}</td>
                <td class="cell-popularity">
                    <div class="popularity-bar">
                        <div class="popularity-track">
                            <div class="popularity-fill ${getPopularityClass(popularity)}" style="width: ${popularity}%"></div>
                        </div>
                        <span class="popularity-value ${getPopularityClass(popularity)}">${popularity}</span>
                    </div>
                    <span class="popularity-value-mobile ${getPopularityClass(popularity)}">${popularity}</span>
                </td>
            </tr>
        `;
    }).join('');
    
    updateFilteredCount();
}

function getScoreClass(score) {
    if (score >= 4) return 'high';
    if (score >= 3) return 'mid';
    return 'low';
}

function getPopularityClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    if (score >= 40) return 'score-low';
    return 'score-very-low';
}

// 지도 렌더링
function renderMap() {
    if (!map) {
        map = L.map('map').setView([37.5665, 126.9780], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
    }
    
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    filteredData.forEach(item => {
        if (item.coordinates?.lat && item.coordinates?.lng) {
            const cat = categoryInfo[item.category] || {};
            const marker = L.marker([item.coordinates.lat, item.coordinates.lng])
                .bindPopup(`
                    <div style="min-width:200px;">
                        <strong style="font-size:15px;">${cat.icon} ${item.name_ko}</strong>
                        <p style="font-size:12px;color:#64748b;margin:6px 0;">${item.summary || ''}</p>
                        <button onclick="openModal('${item.id}')" style="
                            width:100%;
                            padding:8px;
                            background:linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
                            color:white;
                            border:none;
                            border-radius:6px;
                            cursor:pointer;
                            font-weight:600;
                        ">자세히 보기</button>
                    </div>
                `)
                .addTo(map);
            markers.push(marker);
        }
    });
    
    setTimeout(() => map.invalidateSize(), 100);
}

// 모달 열기
function openModal(id) {
    const item = allData.find(d => d.id === id);
    if (!item) return;
    
    const cat = categoryInfo[item.category] || {};
    
    // 헤더
    document.getElementById('modalName').textContent = item.name_ko;
    document.getElementById('modalTags').innerHTML = `
        ${item.name_en ? `<span class="modal-name-en">${item.name_en}</span>` : ''}
        <span class="modal-tag ${item.category}">${cat.icon} ${cat.name}</span>
    `;
    
    // 기본 정보
    document.getElementById('modalAdmission').textContent = item.admission || '-';
    document.getElementById('modalHours').textContent = item.hours || '-';
    document.getElementById('modalClosed').textContent = item.closed || '-';
    document.getElementById('modalDuration').textContent = item.duration || '-';
    document.getElementById('modalDistrict').textContent = item.district || '-';
    document.getElementById('modalStation').textContent = item.nearest_station || '-';
    
    // 소개
    document.getElementById('modalSummary').textContent = item.summary || '';
    document.getElementById('modalDescription').textContent = item.description || '';
    
    // 갤러리 (15장)
    const galleryEl = document.getElementById('modalGallery');
    if (galleryEl) {
        currentGalleryImages = [];
        let galleryHTML = '';
        
        for (let i = 1; i <= 15; i++) {
            const imgNum = String(i).padStart(2, '0');
            const imgUrl = `${R2_BASE_URL}/${item.id}/${item.id}_${imgNum}.jpg`;
            currentGalleryImages.push({
                url: imgUrl,
                caption: `${item.name_ko} - ${i}/15`
            });
            
            galleryHTML += `
                <div class="gallery-thumb" onclick="openImageViewer(${i - 1})">
                    <img src="${imgUrl}" alt="${item.name_ko} ${i}" 
                         onerror="this.parentElement.classList.add('placeholder'); this.parentElement.innerHTML='📷';">
                </div>
            `;
        }
        galleryEl.innerHTML = galleryHTML;
    }
    
    // 팁
    const tipsEl = document.getElementById('modalTips');
    if (tipsEl) {
        if (item.tips && item.tips.length > 0) {
            tipsEl.innerHTML = item.tips.map(tip => `<li>${tip}</li>`).join('');
        } else {
            tipsEl.innerHTML = '<li>등록된 팁이 없습니다.</li>';
        }
    }
    
    // 인기도 섹션
    const popularityEl = document.getElementById('modalPopularity');
    if (popularityEl) {
        const popularity = item.popularity || 50;
        const blogCount = item.blog_count || 0;
        
        // 전체 순위 계산
        const sortedAll = [...allData].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        const overallRank = sortedAll.findIndex(d => d.id === item.id) + 1;
        
        // 카테고리 내 순위 계산
        const categoryItems = allData.filter(d => d.category === item.category);
        const sortedCategory = [...categoryItems].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        const categoryRank = sortedCategory.findIndex(d => d.id === item.id) + 1;
        
        const catInfo = categoryInfo[item.category] || {};
        
        // 블로그 건수 포맷
        const formatBlogCount = (count) => {
            if (count >= 1000000) return (count / 10000).toFixed(0) + '만';
            if (count >= 10000) return (count / 10000).toFixed(0) + '만';
            if (count >= 1000) return (count / 1000).toFixed(1) + '천';
            return count.toLocaleString();
        };
        
        popularityEl.innerHTML = `
            <div class="popularity-card">
                <div class="label">전체 순위</div>
                <div class="value">${overallRank} <span>위</span></div>
            </div>
            <div class="popularity-card">
                <div class="label">${catInfo.name} 순위</div>
                <div class="value">${categoryRank} <span>위</span></div>
            </div>
            <div class="popularity-card">
                <div class="label">네이버 블로그</div>
                <div class="value">${blogCount > 0 ? formatBlogCount(blogCount) : '-'} <span>건</span></div>
            </div>
            <div class="popularity-card">
                <div class="label">인기도</div>
                <div class="value">${popularity} <span>/ 99</span></div>
            </div>
        `;
    }
    
    // 점수 요약 섹션 (5개씩 2줄) - 상세 평가 위에 배치
    const scoreSummaryEl = document.getElementById('modalScoreSummary');
    const displayScores = ['photo', 'culture', 'activity', 'relaxation', 'crowdedness', 'couple', 'family', 'solo', 'foreigner', 'accessibility'];
    
    if (scoreSummaryEl) {
        scoreSummaryEl.innerHTML = displayScores.map(key => {
            const info = scoreInfo[key];
            const value = item.scores?.[key] || 0;
            const stars = '★'.repeat(value) + '☆'.repeat(5 - value);
            
            return `
                <div class="score-summary-item" onclick="scrollToScoreDetail('${key}')">
                    <div class="score-summary-top">
                        <span class="score-summary-icon">${info.icon}</span>
                        <span class="score-summary-name">${info.name}</span>
                    </div>
                    <span class="score-summary-stars" data-score="${value}">${stars}</span>
                </div>
            `;
        }).join('');
    }
    
    // 점수별 평가 근거 (리스트 형태 + 별점) - 10개 항목
    const scoresListEl = document.getElementById('modalScoresList');
    
    if (scoresListEl) {
        scoresListEl.innerHTML = displayScores.map(key => {
            const info = scoreInfo[key];
            const value = item.scores?.[key] || 0;
            const reasons = item.score_reasons?.[key] || [];
            
            // 별점 생성 (채워진 별 + 빈 별)
            const stars = '★'.repeat(value) + '☆'.repeat(5 - value);
            
            return `
                <div class="score-row" id="score-detail-${key}">
                    <div class="score-row-header">
                        <span class="score-row-icon">${info.icon}</span>
                        <span class="score-row-name">${info.name}</span>
                        <span class="score-row-stars" data-score="${value}">${stars}</span>
                    </div>
                    <ul class="score-row-reasons">
                        ${reasons.length > 0 
                            ? reasons.map(r => `<li>${r}</li>`).join('')
                            : '<li class="no-reason">평가 근거 준비 중</li>'
                        }
                    </ul>
                </div>
            `;
        }).join('');
    }
    
    // 링크
    const encodedName = encodeURIComponent(item.name_ko);
    document.getElementById('modalGoogleMap').href = `https://www.google.com/maps/search/${encodedName}+서울`;
    document.getElementById('modalNaverMap').href = `https://map.naver.com/v5/search/${encodedName}`;
    document.getElementById('modalKakaoMap').href = `https://map.kakao.com/?q=${encodedName}`;
    
    // 모달 표시
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // sticky 감지 설정
    setTimeout(() => setupStickyObserver(), 100);
}

// 모달 닫기
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = '';
}

// 이미지 뷰어 열기
function openImageViewer(index) {
    currentImageIndex = index;
    const viewer = document.getElementById('imageViewer');
    updateViewerImage();
    viewer.classList.add('active');
}

// 이미지 뷰어 닫기
function closeImageViewer() {
    document.getElementById('imageViewer').classList.remove('active');
}

// 이미지 변경
function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = currentGalleryImages.length - 1;
    if (currentImageIndex >= currentGalleryImages.length) currentImageIndex = 0;
    updateViewerImage();
}

// 뷰어 이미지 업데이트
function updateViewerImage() {
    const img = currentGalleryImages[currentImageIndex];
    if (!img) return;
    
    document.getElementById('viewerImage').src = img.url;
    document.getElementById('viewerCaption').textContent = img.caption;
    document.getElementById('viewerCounter').textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
}

// 키보드 이벤트 (이미지 뷰어)
document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById('imageViewer');
    if (viewer && viewer.classList.contains('active')) {
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
        if (e.key === 'Escape') closeImageViewer();
    }
});

// 점수 상세 항목으로 스크롤 이동
function scrollToScoreDetail(key) {
    const targetEl = document.getElementById(`score-detail-${key}`);
    const scoreSummary = document.getElementById('scoreSummarySection');
    
    // 모바일에서는 modal-body-two-col이 스크롤 컨테이너
    const isMobile = window.innerWidth <= 768;
    const scrollContainer = isMobile 
        ? document.querySelector('.modal-body-two-col') 
        : document.querySelector('.modal-col-right');
    
    if (targetEl && scrollContainer && scoreSummary) {
        // sticky 섹션 높이 계산
        const stickyHeight = scoreSummary.offsetHeight;
        const targetRect = targetEl.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        // 현재 스크롤 위치 + 타겟까지의 거리 - sticky 높이 - 여유 공간
        const scrollTop = scrollContainer.scrollTop + (targetRect.top - containerRect.top) - stickyHeight - 60;
        
        scrollContainer.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
        
        // 하이라이트 효과
        targetEl.classList.add('highlight');
        setTimeout(() => targetEl.classList.remove('highlight'), 6000);
    }
}

// sticky 상태 감지하여 그림자 효과 추가
function setupStickyObserver() {
    const scoreSummary = document.getElementById('scoreSummarySection');
    
    // 모바일에서는 modal-body-two-col이 스크롤 컨테이너
    const isMobile = window.innerWidth <= 768;
    const scrollContainer = isMobile 
        ? document.querySelector('.modal-body-two-col') 
        : document.querySelector('.modal-col-right');
    
    if (scoreSummary && scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            const rect = scoreSummary.getBoundingClientRect();
            const parentRect = scrollContainer.getBoundingClientRect();
            
            // sticky 상태인지 확인 (상단에 붙었을 때)
            if (rect.top <= parentRect.top + 5) {
                scoreSummary.classList.add('stuck');
            } else {
                scoreSummary.classList.remove('stuck');
            }
        });
    }
}
