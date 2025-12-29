// ===== Config =====
const SUPABASE_URL = 'https://iausfassbdmpieinhaba.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdXNmYXNzYmRtcGllaW5oYWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTg1ODQsImV4cCI6MjA4MjMzNDU4NH0.E6zhK_NvH8MMjAbGU9yJruJPytwtL8TeJm-pqWhIduc';

// ===== State =====
let performances = [];
let filteredPerformances = [];
let activeFilters = { status: 'all', month: null };
let currentMonth = new Date();

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadPerformances();
    setupFilters();
    setupViewTabs();
    setupModal();
    updateMonthFilters();
});

// ===== Supabase Query Helper =====
async function supabaseQuery(endpoint) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch from Supabase');
    }
    
    return response.json();
}

// ===== Load Data =====
async function loadPerformances() {
    try {
        // Supabase에서 직접 조회 (정렬: 시작일 기준)
        performances = await supabaseQuery('performances?select=*&order=prfpdfrom.asc');
        
        // Update stats
        updateStats();
        updateDbCount();
        
        // Update time (가장 최근 업데이트된 공연 기준)
        if (performances.length > 0) {
            const lastUpdated = performances.reduce((latest, p) => {
                const pDate = new Date(p.updated_at);
                return pDate > latest ? pDate : latest;
            }, new Date(0));
            
            document.getElementById('updateTime').textContent = 
                `업데이트: ${lastUpdated.toLocaleDateString('ko-KR')} ${lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        
        // Render
        filterAndRender();
        
    } catch (error) {
        console.error('Failed to load performances:', error);
        document.getElementById('loading').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😢</div>
                <div class="empty-state-text">데이터를 불러오는데 실패했습니다</div>
            </div>
        `;
    }
}

// ===== Update Stats =====
function updateStats() {
    const total = performances.length;
    const ongoing = performances.filter(p => p.prfstate === '공연중').length;
    const upcoming = performances.filter(p => p.prfstate === '공연예정').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('ongoingCount').textContent = ongoing;
    document.getElementById('upcomingCount').textContent = upcoming;
}

function updateDbCount() {
    document.getElementById('dbCount').textContent = `${performances.length}개 공연`;
}

// ===== Update Month Filters =====
function updateMonthFilters() {
    const months = new Set();
    const today = new Date();
    
    // 현재 월부터 3개월
    for (let i = 0; i < 4; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    
    const container = document.getElementById('monthFilters');
    
    // 전체 버튼 유지하고 월 버튼만 추가
    const existingAllBtn = container.querySelector('[data-month="all"]');
    container.innerHTML = '';
    
    // 전체 버튼 다시 추가
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.dataset.month = 'all';
    allBtn.textContent = '전체';
    container.appendChild(allBtn);
    
    // 월 버튼 추가
    Array.from(months).sort().forEach(month => {
        const [year, mon] = month.split('-');
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.month = month;
        btn.textContent = `${parseInt(mon)}월`;
        container.appendChild(btn);
    });
    
    // 이벤트 리스너
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const month = btn.dataset.month;
            
            // 모든 버튼 비활성화
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // 클릭한 버튼 활성화
            btn.classList.add('active');
            
            // 필터 설정
            activeFilters.month = month === 'all' ? null : month;
            
            filterAndRender();
        });
    });
}

// ===== Filters =====
function setupFilters() {
    document.querySelectorAll('#statusFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#statusFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilters.status = btn.dataset.status;
            filterAndRender();
        });
    });
}

function filterAndRender() {
    filteredPerformances = performances.filter(p => {
        // Status filter
        if (activeFilters.status !== 'all' && p.prfstate !== activeFilters.status) {
            return false;
        }
        
        // Month filter
        if (activeFilters.month) {
            const perfMonth = p.prfpdfrom?.substring(0, 7).replace('.', '-');
            if (perfMonth !== activeFilters.month) {
                return false;
            }
        }
        
        return true;
    });
    
    // 3일 전 날짜 계산
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0].replace(/-/g, '.');
    
    // 3일 이상 지난 완료 공연 제외
    filteredPerformances = filteredPerformances.filter(p => {
        if (p.prfstate === '공연완료') {
            const endDate = p.prfpdto?.replace(/-/g, '.') || '';
            return endDate >= threeDaysAgoStr;
        }
        return true;
    });
    
    // Sort by status priority, then by date
    filteredPerformances.sort((a, b) => {
        // 상태 우선순위: 완료(0) → 공연중(1) → 공연예정(2)
        const statusOrder = { '공연완료': 0, '공연중': 1, '공연예정': 2 };
        const statusA = statusOrder[a.prfstate] ?? 2;
        const statusB = statusOrder[b.prfstate] ?? 2;
        
        if (statusA !== statusB) {
            return statusA - statusB;
        }
        
        // 같은 상태면 날짜순 (완료는 최근 것 먼저)
        const dateA = a.prfpdfrom?.replace(/\./g, '-') || '';
        const dateB = b.prfpdfrom?.replace(/\./g, '-') || '';
        if (a.prfstate === '공연완료') {
            return dateB.localeCompare(dateA); // 최근 완료 먼저
        }
        return dateA.localeCompare(dateB);
    });
    
    document.getElementById('filteredCount').textContent = filteredPerformances.length;
    
    // 현재 활성화된 뷰에 따라 렌더링
    const activeTab = document.querySelector('.view-tab.active');
    const currentView = activeTab ? activeTab.dataset.view : 'list';
    
    if (currentView === 'list') {
        renderList();
    } else if (currentView === 'card') {
        renderCardView();
    }
}

// ===== Render List =====
function renderList() {
    const tableWrap = document.getElementById('performanceTableWrap');
    const tbody = document.getElementById('performanceBody');
    
    if (filteredPerformances.length === 0) {
        tableWrap.style.display = 'none';
        const listView = document.getElementById('listView');
        if (!document.getElementById('emptyState')) {
            const emptyDiv = document.createElement('div');
            emptyDiv.id = 'emptyState';
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = `
                <div class="empty-state-icon">🎤</div>
                <div class="empty-state-text">해당 조건의 공연이 없습니다</div>
            `;
            listView.appendChild(emptyDiv);
        }
        return;
    }
    
    // Remove empty state if exists
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.remove();
    
    tableWrap.style.display = 'block';
    
    tbody.innerHTML = filteredPerformances.map((p, index) => {
        const statusClass = p.prfstate === '공연중' ? 'ongoing' : 
                           p.prfstate === '공연예정' ? 'upcoming' : 'ended';
        
        // 상태 텍스트 간소화
        const statusText = p.prfstate === '공연중' ? '진행' : 
                          p.prfstate === '공연예정' ? '예정' : '완료';
        
        const dateText = p.prfpdfrom === p.prfpdto 
            ? p.prfpdfrom 
            : `${p.prfpdfrom} ~ ${p.prfpdto}`;
        
        // 아티스트 추출
        const artist = extractArtist(p);
        
        return `
            <tr onclick="openModal('${p.mt20id}')">
                <td class="cell-num">${index + 1}</td>
                <td>
                    <div class="cell-poster">
                        ${p.poster 
                            ? `<img src="${p.poster}" alt="" onerror="this.parentElement.innerHTML='<div class=\\'no-img\\'>🎵</div>'">`
                            : '<div class="no-img">🎵</div>'
                        }
                    </div>
                </td>
                <td class="cell-title">
                    <div class="title-main">${escapeHtml(decodeHtml(p.prfnm))} <span class="status-badge-inline ${statusClass}">${statusText}</span></div>
                    <div class="title-artist-mobile">${escapeHtml(decodeHtml(artist))}</div>
                    <div class="title-date-mobile">${dateText}</div>
                </td>
                <td class="cell-artist">${escapeHtml(decodeHtml(artist))}</td>
                <td class="cell-venue">${escapeHtml(decodeHtml(p.fcltynm || '-'))}</td>
                <td class="cell-date">${dateText}</td>
                <td class="cell-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== 아티스트 추출 함수 =====
function extractArtist(p) {
    // 1. prfcast(출연진)가 있으면 전체 사용
    if (p.prfcast && p.prfcast.trim()) {
        // "등" 제거하고 노이즈 키워드 제거
        let artist = p.prfcast.replace(/\s*등\s*$/, '').trim();
        
        // 노이즈 키워드 제거
        const noisePatterns = [
            /\s*전국투어\s*/g,
            /\s*콘서트\s*/g,
            /\s*CONCERT\s*/gi,
            /\s*TOUR\s*/gi,
            /\s*SHOW\s*/gi,
            /\s*단독\s*/g,
            /\s*발매기념\s*/g,
            /\s*정규\s*\d*집?\s*/g,
            /\s*앨범\s*/g,
            /\s*내한\s*/g,
            /\s*팬미팅\s*/g,
            /\s*라이브\s*/g,
            /\s*LIVE\s*/gi,
        ];
        
        for (const pattern of noisePatterns) {
            artist = artist.replace(pattern, ' ');
        }
        
        return artist.replace(/\s+/g, ' ').trim();
    }
    
    // 2. 공연명에서 아티스트 추출 시도
    const title = p.prfnm || '';
    
    // 패턴들: "아티스트 콘서트", "아티스트: 콘서트명", "아티스트 단독", etc.
    const patterns = [
        /^([가-힣A-Za-z0-9\s\-]+?)\s*콘서트/,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*단독/,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*팬미팅/,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*팬콘/,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*CONCERT/i,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*TOUR/i,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*LIVE/i,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*공연/,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*내한/,
        /^([가-힣A-Za-z0-9\s\-]+?)\s*:\s*/,
        /^([가-힣A-Za-z0-9\s\-]+?)\s+\d{1,2}(st|nd|rd|th)/i,
    ];
    
    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match && match[1]) {
            const artist = match[1].trim();
            // 너무 짧거나 일반적인 단어 제외
            if (artist.length >= 2 && !['the', '더', '콘서트', '라이브'].includes(artist.toLowerCase())) {
                return artist;
            }
        }
    }
    
    // 3. 추출 실패시
    return '-';
}

// ===== View Tabs =====
function setupViewTabs() {
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const view = tab.dataset.view;
            
            document.getElementById('listView').style.display = view === 'list' ? 'block' : 'none';
            document.getElementById('cardView').style.display = view === 'card' ? 'grid' : 'none';
            document.getElementById('calendarView').style.display = view === 'calendar' ? 'block' : 'none';
            
            if (view === 'card') {
                renderCardView();
            } else if (view === 'calendar') {
                renderCalendar();
            }
        });
    });
}

// ===== Card View =====
function renderCardView() {
    const container = document.getElementById('cardView');
    
    if (filteredPerformances.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🎤</div>
                <div class="empty-state-text">해당 조건의 공연이 없습니다</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredPerformances.map(p => {
        const statusClass = p.prfstate === '공연중' ? 'ongoing' : 
                           p.prfstate === '공연예정' ? 'upcoming' : 'ended';
        const statusText = p.prfstate;
        
        const dateText = p.prfpdfrom === p.prfpdto 
            ? p.prfpdfrom 
            : `${p.prfpdfrom} ~ ${p.prfpdto}`;
        
        const artist = extractArtist(p);
        
        return `
            <div class="performance-card" onclick="openModal('${p.mt20id}')">
                <div class="card-poster">
                    ${p.poster 
                        ? `<img src="${p.poster}" alt="" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>🎵</div>'">`
                        : '<div class="no-image">🎵</div>'
                    }
                    <span class="card-status ${statusClass}">${statusText}</span>
                </div>
                <div class="card-content">
                    <div class="card-title">${escapeHtml(decodeHtml(p.prfnm))}</div>
                    ${artist && artist !== '-' ? `<div class="card-artist">${escapeHtml(decodeHtml(artist))}</div>` : ''}
                    <div class="card-info">
                        <div class="card-venue">${escapeHtml(decodeHtml(p.fcltynm || '-'))}</div>
                        <div class="card-date">${dateText}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Calendar =====
function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    document.getElementById('calendarTitle').textContent = `${year}년 ${month + 1}월`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    let html = days.map(d => `<div class="calendar-day-header">${d}</div>`).join('');
    
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month"><div class="calendar-day-num">${prevLastDay - i}</div></div>`;
    }
    
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${year}.${String(month + 1).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        
        const dayPerformances = performances.filter(p => {
            const from = p.prfpdfrom?.replace(/-/g, '.');
            const to = p.prfpdto?.replace(/-/g, '.');
            return from <= dateStr && to >= dateStr;
        }).sort((a, b) => {
            // 가격에서 숫자 추출 (최고가 기준)
            const priceA = extractMaxPrice(a.pcseguidance);
            const priceB = extractMaxPrice(b.pcseguidance);
            return priceB - priceA; // 높은 가격순
        });
        
        const dayId = `day-${year}-${month}-${day}`;
        const hasMore = dayPerformances.length > 5;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" id="${dayId}">
                <div class="calendar-day-num">${day}</div>
                <div class="calendar-events-collapsed">
                    ${dayPerformances.slice(0, 5).map(p => 
                        `<div class="calendar-event" onclick="openModal('${p.mt20id}')" title="${decodeHtml(p.prfnm)}">
                            ${p.poster ? `<img src="${p.poster}" class="calendar-event-poster" alt="">` : ''}
                            <span>${escapeHtml(decodeHtml(p.prfnm))}</span>
                        </div>`
                    ).join('')}
                    ${hasMore ? `<div class="calendar-more" onclick="expandDay('${dayId}', ${dayPerformances.length})">+${dayPerformances.length - 5}개 더보기</div>` : ''}
                </div>
                <div class="calendar-events-expanded" style="display:none;">
                    ${dayPerformances.map(p => 
                        `<div class="calendar-event" onclick="openModal('${p.mt20id}')" title="${decodeHtml(p.prfnm)}">
                            ${p.poster ? `<img src="${p.poster}" class="calendar-event-poster" alt="">` : ''}
                            <span>${escapeHtml(decodeHtml(p.prfnm))}</span>
                        </div>`
                    ).join('')}
                    ${hasMore ? `<div class="calendar-more" onclick="collapseDay('${dayId}')">접기</div>` : ''}
                </div>
            </div>
        `;
    }
    
    const remainingDays = 42 - (startDay + lastDay.getDate());
    for (let i = 1; i <= remainingDays; i++) {
        html += `<div class="calendar-day other-month"><div class="calendar-day-num">${i}</div></div>`;
    }
    
    document.getElementById('calendarGrid').innerHTML = html;
    
    document.getElementById('prevMonth').onclick = () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    };
    
    document.getElementById('nextMonth').onclick = () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    };
}

// ===== Modal =====
function setupModal() {
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(mt20id) {
    // Supabase에서 이미 모든 데이터를 가져왔으므로 로컬에서 찾기
    const p = performances.find(perf => perf.mt20id === mt20id);
    if (!p) return;
    
    // 기본 정보
    document.getElementById('modalPoster').src = p.poster || '';
    document.getElementById('modalName').textContent = decodeHtml(p.prfnm);
    
    const statusEl = document.getElementById('modalStatus');
    statusEl.textContent = p.prfstate;
    statusEl.className = 'modal-status ' + (p.prfstate === '공연중' ? 'ongoing' : p.prfstate === '공연예정' ? 'upcoming' : 'ended');
    
    const dateText = p.prfpdfrom === p.prfpdto 
        ? p.prfpdfrom 
        : `${p.prfpdfrom} ~ ${p.prfpdto}`;
    document.getElementById('modalDate').textContent = dateText;
    document.getElementById('modalVenue').textContent = p.fcltynm || '-';
    
    // 출연
    if (p.prfcast) {
        document.getElementById('modalCastRow').style.display = 'flex';
        document.getElementById('modalCast').textContent = p.prfcast;
    } else {
        document.getElementById('modalCastRow').style.display = 'none';
    }
    
    // 가격
    if (p.pcseguidance) {
        document.getElementById('modalPriceRow').style.display = 'flex';
        document.getElementById('modalPrice').textContent = p.pcseguidance;
    } else {
        document.getElementById('modalPriceRow').style.display = 'none';
    }
    
    // 런타임
    if (p.prfruntime) {
        document.getElementById('modalRuntimeRow').style.display = 'flex';
        document.getElementById('modalRuntime').textContent = p.prfruntime;
    } else {
        document.getElementById('modalRuntimeRow').style.display = 'none';
    }
    
    // 관람연령
    if (p.prfage) {
        document.getElementById('modalAgeRow').style.display = 'flex';
        document.getElementById('modalAge').textContent = p.prfage;
    } else {
        document.getElementById('modalAgeRow').style.display = 'none';
    }
    
    // 공연시간
    if (p.dtguidance) {
        document.getElementById('modalTimeRow').style.display = 'flex';
        document.getElementById('modalTime').textContent = p.dtguidance;
    } else {
        document.getElementById('modalTimeRow').style.display = 'none';
    }
    
    // 주최/기획
    if (p.entrpsnm) {
        document.getElementById('modalProducerRow').style.display = 'flex';
        document.getElementById('modalProducer').textContent = p.entrpsnm;
    } else {
        document.getElementById('modalProducerRow').style.display = 'none';
    }
    
    // 예매 버튼 (relates는 JSONB로 저장됨)
    const ticketBtn = document.getElementById('modalTicket');
    if (p.relates && p.relates.length > 0) {
        ticketBtn.href = p.relates[0].url;
        ticketBtn.textContent = `🎫 ${p.relates[0].name}에서 예매`;
        ticketBtn.style.display = 'flex';
    } else {
        ticketBtn.style.display = 'none';
    }
    
    // 검색 링크
    const searchQuery = encodeURIComponent(p.prfnm);
    document.getElementById('modalNaver').href = `https://search.naver.com/search.naver?query=${searchQuery}`;
    document.getElementById('modalGoogle').href = `https://www.google.com/search?q=${searchQuery}`;
    
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Helpers =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function decodeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent;
}

// 가격 문자열에서 최고가 추출
function extractMaxPrice(priceStr) {
    if (!priceStr) return 0;
    const numbers = priceStr.match(/[\d,]+/g);
    if (!numbers) return 0;
    const prices = numbers.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => n > 100);
    return prices.length > 0 ? Math.max(...prices) : 0;
}

// 캘린더 날짜 확장/축소
function expandDay(dayId, total) {
    const dayEl = document.getElementById(dayId);
    if (dayEl) {
        dayEl.querySelector('.calendar-events-collapsed').style.display = 'none';
        dayEl.querySelector('.calendar-events-expanded').style.display = 'block';
    }
}

function collapseDay(dayId) {
    const dayEl = document.getElementById(dayId);
    if (dayEl) {
        dayEl.querySelector('.calendar-events-collapsed').style.display = 'block';
        dayEl.querySelector('.calendar-events-expanded').style.display = 'none';
    }
}
