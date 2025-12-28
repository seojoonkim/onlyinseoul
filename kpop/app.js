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
    container.innerHTML = '';
    
    Array.from(months).sort().forEach(month => {
        const [year, mon] = month.split('-');
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.month = month;
        btn.textContent = `${parseInt(mon)}월`;
        container.appendChild(btn);
    });
    
    // Re-attach event listeners
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const month = btn.dataset.month;
            
            if (activeFilters.month === month) {
                activeFilters.month = null;
                btn.classList.remove('active');
            } else {
                container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilters.month = month;
            }
            
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
    
    // Sort by date
    filteredPerformances.sort((a, b) => {
        const dateA = a.prfpdfrom?.replace(/\./g, '-') || '';
        const dateB = b.prfpdfrom?.replace(/\./g, '-') || '';
        return dateA.localeCompare(dateB);
    });
    
    document.getElementById('filteredCount').textContent = filteredPerformances.length;
    renderList();
}

// ===== Render List =====
function renderList() {
    const container = document.getElementById('performanceGrid');
    
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
        
        const dateText = p.prfpdfrom === p.prfpdto 
            ? p.prfpdfrom 
            : `${p.prfpdfrom} ~ ${p.prfpdto}`;
        
        return `
            <div class="performance-card" onclick="openModal('${p.mt20id}')">
                <div class="card-poster">
                    ${p.poster 
                        ? `<img src="${p.poster}" alt="${p.prfnm}" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>🎵</div>'">`
                        : '<div class="no-image">🎵</div>'
                    }
                    <span class="card-status ${statusClass}">${p.prfstate}</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${escapeHtml(p.prfnm)}</h3>
                    <div class="card-info">
                        <div class="card-venue">${escapeHtml(p.fcltynm || '-')}</div>
                        <div class="card-date">${dateText}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===== View Tabs =====
function setupViewTabs() {
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.view === 'list') {
                document.getElementById('listView').style.display = 'block';
                document.getElementById('calendarView').style.display = 'none';
            } else {
                document.getElementById('listView').style.display = 'none';
                document.getElementById('calendarView').style.display = 'block';
                renderCalendar();
            }
        });
    });
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
        });
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="calendar-day-num">${day}</div>
                ${dayPerformances.slice(0, 3).map(p => 
                    `<div class="calendar-event" onclick="openModal('${p.mt20id}')" title="${p.prfnm}">${escapeHtml(p.prfnm)}</div>`
                ).join('')}
                ${dayPerformances.length > 3 ? `<div style="font-size:10px;color:#94a3b8;">+${dayPerformances.length - 3}개</div>` : ''}
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
    document.getElementById('modalName').textContent = p.prfnm;
    
    const statusEl = document.getElementById('modalStatus');
    statusEl.textContent = p.prfstate;
    statusEl.className = 'modal-status ' + (p.prfstate === '공연중' ? 'ongoing' : p.prfstate === '공연예정' ? 'upcoming' : 'ended');
    
    const dateText = p.prfpdfrom === p.prfpdto 
        ? p.prfpdfrom 
        : `${p.prfpdfrom} ~ ${p.prfpdto}`;
    document.getElementById('modalDate').textContent = dateText;
    document.getElementById('modalVenue').textContent = p.fcltynm || '-';
    
    // KOPIS 링크
    document.getElementById('modalKopis').href = `https://www.kopis.or.kr/por/db/pblprfr/pblprfrView.do?menuId=MNU_00020&mt20Id=${mt20id}`;
    
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
    
    // 예매 버튼 (relates는 JSONB로 저장됨)
    const ticketBtn = document.getElementById('modalTicket');
    if (p.relates && p.relates.length > 0) {
        ticketBtn.href = p.relates[0].url;
        ticketBtn.textContent = `🎫 ${p.relates[0].name}에서 예매`;
        ticketBtn.style.display = 'flex';
    } else {
        ticketBtn.style.display = 'none';
    }
    
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
