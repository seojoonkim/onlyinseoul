// ===== State =====
let map = null;
let markers = [];
let activeFilters = { cuisine: '한식', awards: ['Michelin', 'Blue Ribbon', 'Culinary Class Wars'] };

// Gallery State
let currentGallery = [];
let currentGalleryIndex = 0;
let currentGalleryCaption = '';

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderList();
    setupFilters();
    setupViewTabs();
    setupModal();
});

// ===== Update Stats =====
function updateStats() {
    const michelin = RESTAURANTS.filter(r => r.categories.includes('Michelin')).length;
    const blueribbon = RESTAURANTS.filter(r => r.categories.includes('Blue Ribbon')).length;
    const ccw = RESTAURANTS.filter(r => r.categories.includes('Culinary Class Wars')).length;
    
    document.getElementById('michelinCount').textContent = michelin;
    document.getElementById('blueribbonCount').textContent = blueribbon;
    document.getElementById('ccwCount').textContent = ccw;
}

// ===== Cuisine Grouping =====
function getCuisineGroup(cuisine) {
    if (!cuisine) return '기타';
    if (cuisine.includes('한식') || cuisine === '모던 한식') return '한식';
    if (cuisine.includes('프렌치') || cuisine.includes('프랑스')) return '프렌치';
    if (cuisine.includes('일식') || cuisine === '스시' || cuisine === '야키토리') return '일식';
    if (cuisine.includes('이탈리안')) return '이탈리안';
    if (cuisine.includes('중식')) return '중식';
    if (cuisine.includes('컨템포러리')) return '컨템포러리';
    return '기타';
}

// ===== Filter =====
function filterRestaurants() {
    return RESTAURANTS.filter(r => {
        // Cuisine filter (null = 전체)
        if (activeFilters.cuisine !== null) {
            if (getCuisineGroup(r.cuisine) !== activeFilters.cuisine) return false;
        }
        
        // Award filter (체크된 것 중 하나라도 있으면 OK)
        if (activeFilters.awards.length > 0) {
            const hasAward = activeFilters.awards.some(award => r.categories.includes(award));
            if (!hasAward) return false;
        } else {
            // 아무것도 체크 안되면 아무것도 안보임
            return false;
        }
        
        return true;
    });
}

// ===== Render List =====
function renderList() {
    const filtered = filterRestaurants()
        .sort((a, b) => {
            // 1차: 평점 내림차순
            if (b.rating !== a.rating) return b.rating - a.rating;
            // 2차: 리뷰 수 내림차순
            return b.reviews - a.reviews;
        });
    const container = document.getElementById('tableBody');
    
    document.getElementById('filteredCount').textContent = filtered.length;
    
    if (filtered.length === 0) {
        container.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#94a3b8;">검색 결과가 없습니다</td></tr>';
        return;
    }
    
    container.innerHTML = filtered.map((r, i) => {
        // dong 필드 사용 또는 주소에서 추출
        let dongText = r.dong || '';
        if (!dongText && r.address) {
            const dongMatch = r.address.match(/([가-힣]+동\d*가?)/);
            if (dongMatch) dongText = dongMatch[1];
        }
        const locationText = dongText ? `${r.district} ${dongText}` : (r.district || '서울');
        
        return `
        <tr onclick="openModal('${r.id}')">
            <td class="cell-rank">${i + 1}</td>
            <td>
                <div class="cell-photo">
                    ${r.photos && r.photos.length > 0 
                        ? `<img src="${r.photos[0]}" alt="${r.name}">`
                        : '📷'}
                </div>
            </td>
            <td><div class="cell-name" title="${r.name}">${r.name}</div></td>
            <td class="cell-cuisine">${r.cuisine || '-'}</td>
            <td class="cell-location">
                ${locationText}
            </td>
            <td>
                <div class="cell-awards">
                    ${r.tags.map(t => `<span class="tag ${t.class}">${t.label}</span>`).join('')}
                </div>
            </td>
            <td class="cell-rating">⭐ ${r.rating ? r.rating.toFixed(1) : '-'}</td>
            <td class="cell-reviews">${r.reviews ? r.reviews.toLocaleString() : '-'}</td>
        </tr>
    `}).join('');
}

// ===== Filters =====
function setupFilters() {
    // Cuisine: 라디오 방식 (하나만 선택, 항상 하나는 선택되어 있음)
    document.querySelectorAll('#cuisineFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cuisine = btn.dataset.cuisine;
            
            // 이미 선택된 버튼이면 무시 (항상 하나는 선택되어야 함)
            if (btn.classList.contains('active')) {
                return;
            }
            
            // 다른 버튼 클릭하면 교체
            document.querySelectorAll('#cuisineFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // "전체"면 null, 아니면 해당 cuisine
            activeFilters.cuisine = (cuisine === '전체') ? null : cuisine;
            
            renderList();
            if (map) updateMapMarkers();
        });
    });
    
    // Award: 체크박스 방식
    document.querySelectorAll('#awardFilters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const award = checkbox.dataset.award;
            if (checkbox.checked) {
                if (!activeFilters.awards.includes(award)) {
                    activeFilters.awards.push(award);
                }
            } else {
                activeFilters.awards = activeFilters.awards.filter(a => a !== award);
            }
            renderList();
            if (map) updateMapMarkers();
        });
    });
}

// ===== View Tabs =====
function setupViewTabs() {
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.view === 'list') {
                document.getElementById('listView').style.display = 'flex';
                document.getElementById('mapView').classList.remove('active');
            } else {
                document.getElementById('listView').style.display = 'none';
                document.getElementById('mapView').classList.add('active');
                initMap();
            }
        });
    });
}

// ===== Map =====
function initMap() {
    if (map) return;
    
    map = L.map('map').setView([37.5400, 127.0000], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO'
    }).addTo(map);
    
    updateMapMarkers();
}

function updateMapMarkers() {
    // 기존 마커 제거
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    const filtered = filterRestaurants();
    
    filtered.forEach(r => {
        if (!r.lat || !r.lng) return;
        
        // 색상: 카테고리별
        let color = '#4338ca';
        if (r.categories.includes('Michelin')) color = '#f59e0b';
        else if (r.categories.includes('Blue Ribbon')) color = '#3b82f6';
        
        const marker = L.circleMarker([r.lat, r.lng], {
            radius: 10,
            fillColor: color,
            color: '#fff',
            weight: 2,
            fillOpacity: 0.9
        }).addTo(map);
        
        marker.bindPopup(`
            <div style="min-width:160px;font-family:Pretendard,sans-serif;padding:4px;">
                <strong style="font-size:14px;">${r.name}</strong><br>
                <span style="font-size:12px;color:#666;">${r.cuisine || ''}</span><br>
                ${r.rating ? `<span style="color:#f59e0b;font-size:13px;">⭐ ${r.rating.toFixed(1)}</span>` : ''}
                <br>
                <button onclick="openModal('${r.id}')" style="margin-top:8px;padding:6px 12px;background:#4338ca;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;">상세 보기</button>
            </div>
        `);
        
        markers.push(marker);
    });
}

// ===== Modal =====
let currentRestaurant = null;
let currentReviewPage = 1;
const REVIEWS_PER_PAGE = 10;

function setupModal() {
    document.getElementById('modal').addEventListener('click', e => {
        if (e.target.id === 'modal') closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(id) {
    const r = RESTAURANTS.find(x => x.id === id);
    if (!r) return;
    
    currentRestaurant = r;
    currentReviewPage = 1;
    
    document.getElementById('modalName').textContent = r.name;
    document.getElementById('modalTags').innerHTML = r.tags.map(t => 
        `<span class="tag ${t.class}">${t.label}</span>`
    ).join('');
    document.getElementById('modalAddress').textContent = r.address || '-';
    document.getElementById('modalDistrict').textContent = r.district || '서울';
    document.getElementById('modalPhone').textContent = r.phone || '-';
    document.getElementById('modalChef').textContent = r.chef || '-';
    
    // 전화 버튼
    const callBtn = document.getElementById('modalCallBtn');
    if (r.phone && r.phone !== '-') {
        callBtn.href = `tel:${r.phone.replace(/[^0-9+]/g, '')}`;
        callBtn.style.display = 'inline-flex';
    } else {
        callBtn.style.display = 'none';
    }
    
    // 리뷰 히스토그램
    renderReviewSummary(r);
    
    // Photos (최대 15개)
    if (r.photos && r.photos.length > 0) {
        const photos = r.photos.slice(0, 15);
        document.getElementById('modalPhotos').innerHTML = `
            <div class="photos-grid">
                ${photos.map((p, i) => `<img src="${p}" onclick="openGallery(${JSON.stringify(photos).replace(/"/g, '&quot;')}, ${i}, '공식 사진')">`).join('')}
            </div>
        `;
    } else {
        document.getElementById('modalPhotos').innerHTML = '<span class="no-data">📷 사진 데이터 수집 예정</span>';
    }
    
    // Reviews with pagination
    renderReviews();
    
    const gmapsUrl = r.url || `https://www.google.com/maps/search/${encodeURIComponent(r.name + ' 서울')}`;
    document.getElementById('modalGmaps').href = gmapsUrl;
    
    const websiteBtn = document.getElementById('modalWebsite');
    if (r.website) {
        websiteBtn.href = r.website;
        websiteBtn.style.display = 'flex';
    } else {
        websiteBtn.style.display = 'none';
    }
    
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderReviewSummary(r) {
    const container = document.getElementById('modalReviewSummary');
    
    if (!r.reviewsList || r.reviewsList.length === 0) {
        container.innerHTML = '<span class="no-data">리뷰 데이터 수집 예정</span>';
        return;
    }
    
    // 별점별 개수 계산
    const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    r.reviewsList.forEach(rev => {
        const star = Math.round(rev.rating);
        if (star >= 1 && star <= 5) distribution[star]++;
    });
    
    const total = r.reviewsList.length;
    const avgRating = r.rating || (r.reviewsList.reduce((sum, rev) => sum + rev.rating, 0) / total);
    
    // 히스토그램 HTML 생성
    let histogramHTML = '';
    for (let star = 5; star >= 1; star--) {
        const count = distribution[star];
        const percent = total > 0 ? (count / total) * 100 : 0;
        histogramHTML += `
            <div class="rating-bar">
                <span class="rating-label">${star}점</span>
                <div class="rating-bar-track">
                    <div class="rating-bar-fill" style="width: ${percent}%"></div>
                </div>
                <span class="rating-count">${count}</span>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="review-summary-content">
            <div class="review-score">
                <div class="review-score-number">${avgRating.toFixed(1)}</div>
                <div class="review-score-stars">${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5 - Math.round(avgRating))}</div>
                <div class="review-score-count">${total.toLocaleString()}개 리뷰</div>
            </div>
            <div class="review-histogram">
                ${histogramHTML}
            </div>
        </div>
    `;
}

function renderReviews() {
    const r = currentRestaurant;
    if (!r || !r.reviewsList || r.reviewsList.length === 0) {
        document.getElementById('reviewTotal').textContent = '';
        document.getElementById('modalReviewsList').innerHTML = '<span class="no-data">💬 리뷰 데이터 수집 예정</span>';
        return;
    }
    
    const totalReviews = r.reviewsList.length;
    const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
    const startIdx = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
    const endIdx = Math.min(startIdx + REVIEWS_PER_PAGE, totalReviews);
    const pageReviews = r.reviewsList.slice(startIdx, endIdx);
    
    // 총 리뷰 수 표시
    document.getElementById('reviewTotal').textContent = `(${totalReviews}개)`;
    
    let html = `<div class="reviews-list">`;
    
    pageReviews.forEach(rev => {
        const reviewPhotos = rev.photos && rev.photos.length > 0 
            ? `<div class="review-photos">${rev.photos.slice(0, 3).map((p, i) => `<img src="${p}" onclick="openGallery(${JSON.stringify(rev.photos).replace(/"/g, '&quot;')}, ${i}, '${rev.author}님의 리뷰 사진')">`).join('')}</div>`
            : '';
        
        html += `
            <div class="review-card">
                <div class="review-header">
                    <strong class="review-author">${rev.author}</strong>
                    ${rev.isLocalGuide ? '<span class="local-guide">🏅 로컬가이드</span>' : ''}
                    <span class="review-rating">⭐ ${rev.rating}</span>
                    <span class="review-date">${rev.date || ''}</span>
                </div>
                <p class="review-text">${rev.text || rev.textTranslated || '(내용 없음)'}</p>
                ${reviewPhotos}
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Pagination
    if (totalPages > 1) {
        html += `
            <div class="reviews-pagination">
                <button class="page-btn" onclick="changeReviewPage(${currentReviewPage - 1})" ${currentReviewPage === 1 ? 'disabled' : ''}>← 이전</button>
                <span class="page-info">${startIdx + 1}-${endIdx} / ${totalReviews}</span>
                <button class="page-btn" onclick="changeReviewPage(${currentReviewPage + 1})" ${currentReviewPage === totalPages ? 'disabled' : ''}>다음 →</button>
            </div>
        `;
    }
    
    document.getElementById('modalReviewsList').innerHTML = html;
}

function changeReviewPage(page) {
    const totalPages = Math.ceil(currentRestaurant.reviewsList.length / REVIEWS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentReviewPage = page;
    renderReviews();
    
    // 리뷰 컨테이너 최상단으로 스크롤
    document.querySelector('.modal-right').scrollTop = 0;
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = '';
    currentRestaurant = null;
    currentReviewPage = 1;
}

// ===== Image Gallery =====
function openGallery(photos, startIndex, caption) {
    currentGallery = photos;
    currentGalleryIndex = startIndex;
    currentGalleryCaption = caption || '';
    
    updateGalleryImage();
    document.getElementById('galleryModal').classList.add('active');
}

function closeGallery() {
    document.getElementById('galleryModal').classList.remove('active');
    currentGallery = [];
    currentGalleryIndex = 0;
}

function navigateGallery(direction) {
    currentGalleryIndex += direction;
    
    // 순환
    if (currentGalleryIndex < 0) {
        currentGalleryIndex = currentGallery.length - 1;
    } else if (currentGalleryIndex >= currentGallery.length) {
        currentGalleryIndex = 0;
    }
    
    updateGalleryImage();
}

function updateGalleryImage() {
    const img = document.getElementById('galleryImage');
    const counter = document.getElementById('galleryCounter');
    const caption = document.getElementById('galleryCaption');
    const thumbnails = document.getElementById('galleryThumbnails');
    
    img.src = currentGallery[currentGalleryIndex];
    counter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
    caption.textContent = currentGalleryCaption;
    
    // 썸네일 렌더링
    thumbnails.innerHTML = currentGallery.map((photo, i) => `
        <img src="${photo}" 
             class="gallery-thumb ${i === currentGalleryIndex ? 'active' : ''}" 
             onclick="jumpToGalleryImage(${i})"
             alt="">
    `).join('');
}

function jumpToGalleryImage(index) {
    currentGalleryIndex = index;
    updateGalleryImage();
}

// 키보드 네비게이션
document.addEventListener('keydown', e => {
    if (!document.getElementById('galleryModal').classList.contains('active')) return;
    
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') navigateGallery(-1);
    if (e.key === 'ArrowRight') navigateGallery(1);
});

// 갤러리 배경 클릭 시 닫기
document.getElementById('galleryModal')?.addEventListener('click', e => {
    if (e.target.id === 'galleryModal') closeGallery();
});
