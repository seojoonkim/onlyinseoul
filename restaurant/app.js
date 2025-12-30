// ===== State =====
let map = null;
let markers = [];
let activeFilters = { cuisine: '한식', award: null };

// Gallery State
let currentGallery = [];
let currentGalleryIndex = 0;
let currentGalleryCaption = '';

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    updateDbCount();
    updateStats();
    renderList();
    setupFilters();
    setupViewTabs();
    setupModal();
});

// ===== Update DB Count =====
function updateDbCount() {
    const total = RESTAURANTS.length;
    document.getElementById('dbCount').textContent = `${total}개 맛집`;
    
    // aboutBadge가 있을 때만 업데이트 (요소가 제거된 경우 에러 방지)
    const aboutBadge = document.getElementById('aboutBadge');
    if (aboutBadge) {
        aboutBadge.textContent = `${total}개 엄선`;
    }
}

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
        
        // Award filter (null = 전체, 아니면 해당 수상만)
        if (activeFilters.award !== null) {
            if (!r.categories.includes(activeFilters.award)) return false;
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
            <td class="cell-rating"><span class="rating-star">⭐</span><span class="rating-num">${r.rating ? r.rating.toFixed(1) : '-'}</span></td>
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
    
    // Award: 버튼 방식 (하나만 선택)
    document.querySelectorAll('#awardFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const award = btn.dataset.award;
            
            // 이미 선택된 버튼이면 무시
            if (btn.classList.contains('active')) {
                return;
            }
            
            // 다른 버튼 클릭하면 교체
            document.querySelectorAll('#awardFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // "all"이면 null, 아니면 해당 award
            activeFilters.award = (award === 'all') ? null : award;
            
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
// 현재 열린 InfoWindow 추적
let currentInfoWindow = null;
let mapInitialized = false;

// 구글 지도 초기화 (콜백)
function initGoogleMap() {
    // 구글 API가 로드되었음을 표시
    window.googleMapsReady = true;
    
    // 지도 탭이 활성화된 상태면 바로 초기화
    const mapView = document.getElementById('mapView');
    if (mapView && mapView.classList.contains('active')) {
        initMap();
    }
}

function initMap() {
    // 구글 API가 아직 로드되지 않았으면 대기
    if (!window.googleMapsReady) {
        setTimeout(initMap, 100);
        return;
    }
    
    const mapEl = document.getElementById('map');
    if (!mapEl) return;
    
    // 이미 초기화되었으면 마커만 업데이트
    if (mapInitialized && map) {
        updateMapMarkers();
        return;
    }
    
    map = new google.maps.Map(mapEl, {
        center: { lat: 37.5400, lng: 127.0000 },
        zoom: 12,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // 지도 클릭 시 InfoWindow 닫기
    map.addListener('click', () => {
        if (currentInfoWindow) {
            currentInfoWindow.close();
            currentInfoWindow = null;
        }
    });
    
    mapInitialized = true;
    updateMapMarkers();
}

// 음식 종류별 색상 반환
function getCuisineColor(cuisine) {
    const group = getCuisineGroup(cuisine);
    const colors = {
        '한식': '#ef5350',
        '프렌치': '#7c4dff',
        '일식': '#ec407a',
        '이탈리안': '#ff7043',
        '중식': '#66bb6a',
        '컨템포러리': '#42a5f5'
    };
    return colors[group] || '#4338ca';
}

// 카테고리별 아이콘 반환
function getCuisineIcon(cuisine) {
    const group = getCuisineGroup(cuisine);
    const icons = {
        '한식': '🍚',
        '프렌치': '🥐',
        '일식': '🍣',
        '이탈리안': '🍝',
        '중식': '🥟',
        '컨템포러리': '🍽️'
    };
    return icons[group] || '🍴';
}

function updateMapMarkers() {
    // 구글 지도가 아직 초기화되지 않았으면 대기
    if (!map) {
        setTimeout(updateMapMarkers, 100);
        return;
    }
    
    // 기존 마커 및 라벨 제거
    markers.forEach(m => {
        if (m.marker) m.marker.setMap(null);
        if (m.label) m.label.setMap(null);
    });
    markers = [];
    
    // 현재 InfoWindow 닫기
    if (currentInfoWindow) {
        currentInfoWindow.close();
        currentInfoWindow = null;
    }
    
    const filtered = filterRestaurants();
    
    filtered.forEach(r => {
        if (!r.lat || !r.lng) return;
        
        const position = { lat: r.lat, lng: r.lng };
        const cuisineIcon = getCuisineIcon(r.cuisine);
        
        // 마커 생성
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: r.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: getCuisineColor(r.cuisine),
                fillOpacity: 0.9,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });
        
        // 라벨 생성 (마커 위에 이름 표시)
        const label = new google.maps.Marker({
            position: position,
            map: map,
            icon: {
                path: 'M 0,0 L 0,0',
                fillOpacity: 0,
                strokeOpacity: 0
            },
            label: {
                text: r.name,
                color: '#1e1b4b',
                fontSize: '11px',
                fontWeight: '600',
                className: 'map-label'
            }
        });
        
        // 수상 배지 HTML (리스트와 동일한 스타일)
        const badgesHtml = r.tags.map(t => 
            `<span style="
                display:inline-block;
                padding:2px 5px;
                border-radius:4px;
                font-size:9px;
                font-weight:600;
                white-space:nowrap;
                margin-left:6px;
                vertical-align:middle;
                ${t.class === 'tag-michelin' ? 'background:#fef3c7;color:#92400e;' : ''}
                ${t.class === 'tag-blueribbon' ? 'background:#dbeafe;color:#1e40af;' : ''}
                ${t.class === 'tag-ccw-baek' ? 'background:#f3f4f6;color:#374151;border:1px solid #e5e7eb;' : ''}
                ${t.class === 'tag-ccw-heuk' ? 'background:#1f2937;color:#fff;' : ''}
            ">${t.label}</span>`
        ).join('');
        
        // 첫 번째 사진 URL
        const photoUrl = r.photos && r.photos.length > 0 ? r.photos[0] : '';
        
        // InfoWindow 내용 (실제 사진 + 배지 + 정보 + 한줄 설명)
        const summaryText = r.summary ? `<p style="font-size:10px;color:#64748b;margin:6px 0 0 0;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${r.summary}</p>` : '';
        
        const infoContent = `
            <div style="display:flex;width:320px;min-height:150px;background:#fff;overflow:hidden;">
                <div style="width:110px;min-height:150px;flex-shrink:0;background:#f1f5f9;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                    ${photoUrl 
                        ? `<img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.parentElement.innerHTML='<span style=font-size:32px>${cuisineIcon}</span>';">` 
                        : `<span style="font-size:32px;">${cuisineIcon}</span>`
                    }
                </div>
                <div style="width:210px;padding:12px;display:flex;flex-direction:column;box-sizing:border-box;">
                    <strong style="font-size:14px;color:#1e1b4b;margin-bottom:6px;line-height:1.3;">${r.name}</strong>
                    <p style="font-size:11px;color:#475569;margin:0;line-height:1.5;">
                        ${r.cuisine || ''} · ${r.district || ''}${badgesHtml}
                    </p>
                    <p style="font-size:11px;color:#475569;margin:4px 0 0 0;line-height:1.5;">
                        ${r.rating ? '⭐ ' + r.rating.toFixed(1) + ' (' + (r.reviews || 0).toLocaleString() + ')' : ''}
                    </p>
                    ${summaryText}
                    <button onclick="openModal('${r.id}')" style="
                        width:100%;
                        padding:8px 0;
                        margin-top:auto;
                        background:linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
                        color:white;
                        border:none;
                        border-radius:6px;
                        cursor:pointer;
                        font-weight:600;
                        font-size:11px;
                    ">자세히 보기</button>
                </div>
            </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
            content: infoContent,
            maxWidth: 300
        });
        
        // 마커 클릭 이벤트
        const handleClick = () => {
            // 이전 InfoWindow 닫기
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            
            // 새 InfoWindow 열기
            infoWindow.open(map, marker);
            currentInfoWindow = infoWindow;
            
            // 해당 위치로 부드럽게 이동 및 확대
            map.panTo(position);
            if (map.getZoom() < 15) {
                map.setZoom(15);
            }
        };
        
        marker.addListener('click', handleClick);
        label.addListener('click', handleClick);
        
        markers.push({ marker, label, infoWindow });
    });
}

// ===== Modal =====
let currentRestaurant = null;
let currentReviewPage = 1;
const REVIEWS_PER_PAGE = 20;

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
    
    // 한줄 소개 (왼쪽)
    const summarySection = document.getElementById('summarySection');
    const summaryEl = document.getElementById('modalSummary');
    if (r.summary) {
        summaryEl.textContent = r.summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
    
    // 상세 설명 (오른쪽)
    const descSection = document.getElementById('descriptionSection');
    const descEl = document.getElementById('modalDescription');
    if (r.description) {
        descEl.textContent = r.description;
        descSection.style.display = 'block';
    } else {
        descSection.style.display = 'none';
    }
    
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
    const reviewTotalEl = document.getElementById('reviewTotal');
    const reviewPageInfoEl = document.getElementById('reviewPageInfo');
    
    if (!r || !r.reviewsList || r.reviewsList.length === 0) {
        if (reviewTotalEl) reviewTotalEl.textContent = '';
        if (reviewPageInfoEl) reviewPageInfoEl.textContent = '';
        document.getElementById('modalReviewsList').innerHTML = '<span class="no-data">💬 리뷰 데이터 수집 예정</span>';
        return;
    }
    
    const totalReviews = r.reviewsList.length;
    const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
    const startIdx = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
    const endIdx = Math.min(startIdx + REVIEWS_PER_PAGE, totalReviews);
    const pageReviews = r.reviewsList.slice(startIdx, endIdx);
    
    // 총 리뷰 수 표시
    if (reviewTotalEl) reviewTotalEl.textContent = `- ${totalReviews} reviews`;
    
    // 페이지 정보 표시
    if (reviewPageInfoEl) {
        if (totalPages > 1) {
            reviewPageInfoEl.textContent = `${currentReviewPage} / ${totalPages} pages`;
        } else {
            reviewPageInfoEl.textContent = '';
        }
    }
    
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
    
    // 리뷰 섹션 상단으로 스크롤
    const reviewSection = document.getElementById('reviewSection');
    if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
