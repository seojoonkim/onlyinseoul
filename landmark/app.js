/**
 * Seoul Landmark Guide - Application
 * Multi-language support (Korean/English/Chinese/Japanese)
 * 
 * 데이터 구조: db_ko.js, db_en.js, db_zh.js, db_ja.js
 */

// 전역 변수
let allData = [];
let filteredData = [];
let currentCategory = 'all';
let activeScoreFilters = [];
let map = null;
let markers = [];
let currentInfoWindow = null;

const IMAGE_BASE_URL = './images';

let currentGallery = [];
let currentGalleryIndex = 0;
let currentGalleryCaption = '';

// 현재 언어의 데이터 가져오기
function getLandmarkData() {
    const lang = getLang();
    switch(lang) {
        case 'en': return typeof landmarkData_en !== 'undefined' ? landmarkData_en : [];
        case 'zh': return typeof landmarkData_zh !== 'undefined' ? landmarkData_zh : [];
        case 'ja': return typeof landmarkData_ja !== 'undefined' ? landmarkData_ja : [];
        default: return typeof landmarkData_ko !== 'undefined' ? landmarkData_ko : [];
    }
}

const categoryInfo = {
    palace: { name_ko: '고궁/역사', name_en: 'Palaces/Historic', name_zh: '宫殿/历史', name_ja: '古宮/歴史', icon: '🏯', color: '#dc2626' },
    viewpoint: { name_ko: '전망/야경', name_en: 'Views/Night', name_zh: '观景/夜景', name_ja: '展望/夜景', icon: '🌆', color: '#7c3aed' },
    shopping: { name_ko: '쇼핑', name_en: 'Shopping', name_zh: '购物', name_ja: 'ショッピング', icon: '🛍️', color: '#ec4899' },
    hipplace: { name_ko: '힙플레이스', name_en: 'Hipster Spots', name_zh: '网红地', name_ja: 'ヒップスポット', icon: '🎨', color: '#f59e0b' },
    nature: { name_ko: '공원/자연', name_en: 'Parks/Nature', name_zh: '公园/自然', name_ja: '公園/自然', icon: '🌳', color: '#10b981' },
    museum: { name_ko: '박물관/미술관', name_en: 'Museums/Galleries', name_zh: '博物馆/美术馆', name_ja: '博物館/美術館', icon: '🏛️', color: '#3b82f6' }
};

const scoreInfo = {
    photo: { name_ko: '사진촬영', name_en: 'Photography', name_zh: '摄影', name_ja: '写真撮影', icon: '📷' },
    culture: { name_ko: '문화체험', name_en: 'Culture', name_zh: '文化体验', name_ja: '文化体験', icon: '🎭' },
    activity: { name_ko: '액티비티', name_en: 'Activities', name_zh: '活动', name_ja: 'アクティビティ', icon: '🎯' },
    relaxation: { name_ko: '힐링', name_en: 'Relaxation', name_zh: '休闲', name_ja: 'ヒーリング', icon: '🧘' },
    crowdedness: { name_ko: '한적함', name_en: 'Peaceful', name_zh: '清静', name_ja: '静けさ', icon: '🌿' },
    couple: { name_ko: '커플추천', name_en: 'For Couples', name_zh: '情侣推荐', name_ja: 'カップル向け', icon: '💑' },
    family: { name_ko: '가족추천', name_en: 'For Families', name_zh: '家庭推荐', name_ja: '家族向け', icon: '👨‍👩‍👧' },
    solo: { name_ko: '혼자여행', name_en: 'Solo Travel', name_zh: '独自旅行', name_ja: '一人旅', icon: '🚶' },
    foreigner: { name_ko: '외국인편의', name_en: 'Tourist-Friendly', name_zh: '外国人友好', name_ja: '外国人向け', icon: '🌍' },
    accessibility: { name_ko: '접근성', name_en: 'Accessibility', name_zh: '交通便利', name_ja: 'アクセス', icon: '🚇' }
};

// ===== 언어 헬퍼 =====
function getLang() {
    try { return localStorage.getItem('lang') || 'ko'; } catch(e) { return 'ko'; }
}

function setLangStorage(lang) {
    try { localStorage.setItem('lang', lang); } catch(e) {}
}

function getCatName(cat) {
    if (!cat) return '';
    const lang = getLang();
    return cat['name_' + lang] || cat.name_en || cat.name_ko;
}

function getScoreName(key) {
    const info = scoreInfo[key];
    if (!info) return key;
    const lang = getLang();
    return info['name_' + lang] || info.name_en || info.name_ko;
}

// 데이터가 이미 해당 언어로 되어 있으므로 직접 반환
function getItemName(item) {
    return item?.name || '';
}

function getItemSummary(item) {
    return item?.summary || '';
}

function getItemDescription(item) {
    return item?.description || '';
}

function getItemTips(item) {
    return item?.tips || [];
}

function getItemScoreReasons(item, scoreKey) {
    return item?.score_reasons?.[scoreKey] || [];
}

function getItemAdmission(item) {
    if (!item) return '-';
    const lang = getLang();
    if (lang === 'ko') return item.admission;
    
    const admission = item.admission || '';
    
    // 공통 패턴 번역
    const patterns = {
        en: {
            '무료': 'Free', '원': ' KRW', '한복 착용 시 무료': 'Free with hanbok',
            '한복 착용 시': 'with hanbok', '착용 시': 'when wearing',
            '어른': 'Adult', '청소년': 'Youth', '어린이': 'Child',
            '외국인': 'Foreigner', '내국인': 'Korean'
        },
        zh: {
            '무료': '免费', '원': '韩元', '한복 착용 시 무료': '穿韩服免费',
            '한복 착용 시': '穿韩服时', '착용 시': '穿着时',
            '어른': '成人', '청소년': '青少年', '어린이': '儿童',
            '외국인': '外国人', '내국인': '韩国人'
        },
        ja: {
            '무료': '無料', '원': 'ウォン', '한복 착용 시 무료': '韓服着用で無料',
            '한복 착용 시': '韓服着用時', '착용 시': '着用時',
            '어른': '大人', '청소년': '青少年', '어린이': '子供',
            '외국인': '外国人', '内国人': '韓国人'
        }
    };
    
    let result = admission;
    const p = patterns[lang] || patterns.en;
    // 긴 패턴부터 먼저 매칭
    const sortedKeys = Object.keys(p).sort((a, b) => b.length - a.length);
    for (const ko of sortedKeys) {
        result = result.replace(new RegExp(ko, 'g'), p[ko]);
    }
    return result;
}

function getItemHours(item) {
    if (!item) return '-';
    const lang = getLang();
    const hours = item.hours || '-';
    
    if (lang === 'ko') return hours;
    
    // 운영시간 패턴 번역
    const patterns = {
        en: {
            '24시간': '24 hours',
            '24시간 (매장별 상이)': '24 hours (varies by store)',
            '상점별 상이': 'Varies by store',
            '매장별 상이': 'Varies by store',
            '(해설 시간)': '(guided tour hours)',
            '시간': 'hours'
        },
        zh: {
            '24시간': '24小时',
            '24시간 (매장별 상이)': '24小时（各店不同）',
            '상점별 상이': '各店铺不同',
            '매장별 상이': '各店铺不同',
            '(해설 시간)': '（解说时间）',
            '시간': '小时'
        },
        ja: {
            '24시간': '24時間',
            '24시간 (매장별 상이)': '24時間（店舗により異なる）',
            '상점별 상이': '店舗により異なる',
            '매장별 상이': '店舗により異なる',
            '(해설 시간)': '（ガイドツアー時間）',
            '시간': '時間'
        }
    };
    
    let result = hours;
    const p = patterns[lang] || patterns.en;
    // 긴 패턴부터 먼저 매칭
    const sortedKeys = Object.keys(p).sort((a, b) => b.length - a.length);
    for (const ko of sortedKeys) {
        result = result.replace(new RegExp(ko, 'g'), p[ko]);
    }
    return result;
}

function getItemLocation(item) {
    if (!item || !item.district) return '';
    const lang = getLang();
    const districtValue = item.district;
    
    // 한국어: 원본 그대로
    if (lang === 'ko') {
        return districtValue;
    }
    
    // 구 번역 맵
    const guMap = {
        '종로구': { en: 'Jongno-gu', zh: '钟路区', ja: '鍾路区' },
        '중구': { en: 'Jung-gu', zh: '中区', ja: '中区' },
        '용산구': { en: 'Yongsan-gu', zh: '龙山区', ja: '龍山区' },
        '성동구': { en: 'Seongdong-gu', zh: '城东区', ja: '城東区' },
        '광진구': { en: 'Gwangjin-gu', zh: '广津区', ja: '広津区' },
        '동대문구': { en: 'Dongdaemun-gu', zh: '东大门区', ja: '東大門区' },
        '중랑구': { en: 'Jungnang-gu', zh: '中浪区', ja: '中浪区' },
        '성북구': { en: 'Seongbuk-gu', zh: '城北区', ja: '城北区' },
        '강북구': { en: 'Gangbuk-gu', zh: '江北区', ja: '江北区' },
        '도봉구': { en: 'Dobong-gu', zh: '道峰区', ja: '道峰区' },
        '노원구': { en: 'Nowon-gu', zh: '芦原区', ja: '蘆原区' },
        '은평구': { en: 'Eunpyeong-gu', zh: '恩平区', ja: '恩平区' },
        '서대문구': { en: 'Seodaemun-gu', zh: '西大门区', ja: '西大門区' },
        '마포구': { en: 'Mapo-gu', zh: '麻浦区', ja: '麻浦区' },
        '양천구': { en: 'Yangcheon-gu', zh: '阳川区', ja: '陽川区' },
        '강서구': { en: 'Gangseo-gu', zh: '江西区', ja: '江西区' },
        '구로구': { en: 'Guro-gu', zh: '九老区', ja: '九老区' },
        '금천구': { en: 'Geumcheon-gu', zh: '衿川区', ja: '衿川区' },
        '영등포구': { en: 'Yeongdeungpo-gu', zh: '永登浦区', ja: '永登浦区' },
        '동작구': { en: 'Dongjak-gu', zh: '铜雀区', ja: '銅雀区' },
        '관악구': { en: 'Gwanak-gu', zh: '冠岳区', ja: '冠岳区' },
        '서초구': { en: 'Seocho-gu', zh: '瑞草区', ja: '瑞草区' },
        '강남구': { en: 'Gangnam-gu', zh: '江南区', ja: '江南区' },
        '송파구': { en: 'Songpa-gu', zh: '松坡区', ja: '松坡区' },
        '강동구': { en: 'Gangdong-gu', zh: '江东区', ja: '江東区' }
    };
    
    // 동/장소 로마자 맵 (영어용, 중국어/일본어도 동일하게 사용)
    const placeMap = {
        // 동 이름
        '명동': 'Myeongdong', '서교동': 'Seogyo-dong', '남산동': 'Namsan-dong',
        '역삼동': 'Yeoksam-dong', '성수동': 'Seongsu-dong', '삼청동': 'Samcheong-dong',
        '가회동': 'Gahoe-dong', '익선동': 'Ikseon-dong', '연남동': 'Yeonnam-dong',
        '한남동': 'Hannam-dong', '이태원동': 'Itaewon-dong', '신사동': 'Sinsa-dong',
        '청담동': 'Cheongdam-dong', '압구정동': 'Apgujeong-dong', '잠실동': 'Jamsil-dong',
        '여의도동': 'Yeouido-dong', '망원동': 'Mangwon-dong', '연희동': 'Yeonhui-dong',
        '부암동': 'Buam-dong', '평창동': 'Pyeongchang-dong', '상암동': 'Sangam-dong',
        '문래동': 'Mullae-dong', '신당동': 'Sindang-dong', '창신동': 'Changsin-dong',
        '혜화동': 'Hyehwa-dong', '광장동': 'Gwangjang-dong', '송파동': 'Songpa-dong',
        '반포동': 'Banpo-dong', '서빙고동': 'Seobinggo-dong', '이촌동': 'Ichon-dong',
        '삼성동': 'Samsung-dong', '논현동': 'Nonhyeon-dong', '방배동': 'Bangbae-dong',
        '양재동': 'Yangjae-dong', '도곡동': 'Dogok-dong', '개포동': 'Gaepo-dong',
        '대치동': 'Daechi-dong', '수서동': 'Suseo-dong', '잠원동': 'Jamwon-dong',
        '신림동': 'Sillim-dong', '봉천동': 'Bongcheon-dong', '노량진동': 'Noryangjin-dong',
        '흑석동': 'Heukseok-dong', '상도동': 'Sangdo-dong', '신대방동': 'Sindaebang-dong',
        '당산동': 'Dangsan-dong', '영등포동': 'Yeongdeungpo-dong', '마곡동': 'Magok-dong',
        '응암동': 'Eungam-dong', '불광동': 'Bulgwang-dong', '합정동': 'Hapjeong-dong',
        '상수동': 'Sangsu-dong', '공덕동': 'Gongdeok-dong', '용산동': 'Yongsan-dong',
        '후암동': 'Huam-dong', '청파동': 'Cheongpa-dong', '옥수동': 'Oksu-dong',
        '금호동': 'Geumho-dong', '행당동': 'Haengdang-dong', '능동': 'Neung-dong',
        '군자동': 'Gunja-dong', '화양동': 'Hwayang-dong', '자양동': 'Jayang-dong',
        '구의동': 'Guui-dong', '면목동': 'Myeonmok-dong', '장안동': 'Jangan-dong',
        '답십리동': 'Dapsimni-dong', '전농동': 'Jeonnong-dong', '제기동': 'Jegi-dong',
        '회기동': 'Hoegi-dong', '돈암동': 'Donam-dong', '안암동': 'Anam-dong',
        '보문동': 'Bomun-dong', '정릉동': 'Jeongneung-dong', '길음동': 'Gireum-dong',
        '상계동': 'Sanggye-dong', '중계동': 'Junggye-dong', '공릉동': 'Gongneung-dong',
        '수유동': 'Suyu-dong', '미아동': 'Mia-dong', '쌍문동': 'Ssangmun-dong',
        '창동': 'Chang-dong', '도봉동': 'Dobong-dong', '방학동': 'Banghak-dong',
        '통의동': 'Tongui-dong', '효자동': 'Hyoja-dong', '사직동': 'Sajik-dong',
        '소격동': 'Sogyeok-dong', '안국동': 'Anguk-dong', '계동': 'Gye-dong',
        '원서동': 'Wonseo-dong', '관훈동': 'Gwanhun-dong', '인의동': 'Inui-dong',
        '숭인동': 'Sungin-dong', '소공동': 'Sogong-dong', '회현동': 'Hoehyeon-dong',
        '필동': 'Pil-dong', '장충동': 'Jangchung-dong', '광희동': 'Gwanghui-dong',
        '무교동': 'Mugyo-dong', '정동': 'Jeong-dong', '서소문동': 'Seosomun-dong',
        '만리동': 'Malli-dong', '중림동': 'Jungnim-dong', '황학동': 'Hwanghak-dong',
        '서초동': 'Seocho-dong', '번동': 'Beon-dong', '응봉동': 'Eungbong-dong',
        '성북동': 'Seongbuk-dong', '방이동': 'Bangi-dong', '잠실본동': 'Jamsil-dong',
        '통인동': 'Tongin-dong', '무악동': 'Muak-dong', '흥인동': 'Heungin-dong',
        '궁정동': 'Gungjeong-dong',
        // 도로명/특수 지명
        '을지로': 'Euljiro', '을지로3가': 'Euljiro 3-ga', '을지로7가': 'Euljiro 7-ga',
        '세종로': 'Sejongno', '세종대로': 'Sejong-daero', '충무로': 'Chungmuro',
        '태평로': 'Taepyeongno', '삼청로': 'Samcheong-ro', '율곡로': 'Yulgok-ro',
        '창경궁로': 'Changgyeonggung-ro', '새문안로': 'Saemunan-ro',
        '남대문로': 'Namdaemun-ro', '남대문시장길': 'Namdaemun Market',
        '인사동길': 'Insadong-gil', '원효로': 'Wonhyo-ro', '의주로': 'Uiju-ro',
        // 특수 표현
        '일대': 'area', '대학로': 'Daehangno', '북촌': 'Bukchon', '서촌': 'Seochon',
        '인사동': 'Insadong', '신촌': 'Sinchon', '홍대': 'Hongdae', '왕십리': 'Wangsimni',
        '연신내': 'Yeonsinnae', '충정로': 'Chungjeongno'
    };
    
    // 구 번역 함수
    function translateGu(gu) {
        return guMap[gu]?.[lang] || guMap[gu]?.en || gu;
    }
    
    // 장소 번역 함수 (로마자 변환)
    function translatePlace(place) {
        return placeMap[place] || place;
    }
    
    // 케이스 1: 슬래시로 구분된 복수 구 (예: "강북구/은평구", "종로구/중구")
    if (districtValue.includes('/')) {
        const parts = districtValue.split('/');
        return parts.map(p => translateGu(p.trim())).join(' & ');
    }
    
    // 케이스 2: 공백으로 구분 (예: "강남구 삼성동", "종로구 세종로")
    const parts = districtValue.split(' ');
    if (parts.length === 1) {
        // 구만 있는 경우
        return translateGu(parts[0]);
    }
    
    // 구 + 나머지
    const guPart = parts[0];
    const restPart = parts.slice(1).join(' ');
    
    const translatedGu = translateGu(guPart);
    const translatedRest = translatePlace(restPart);
    
    return `${translatedGu} ${translatedRest}`;
}

function getItemRoadAddress(item) {
    if (!item) return '';
    
    // 현재 언어 DB에 주소가 있으면 사용
    if (item.road_address) {
        return item.road_address;
    }
    
    // 없으면 영어 DB에서 fallback
    if (typeof landmarkData_en !== 'undefined') {
        const enItem = landmarkData_en.find(e => e.id === item.id);
        if (enItem?.road_address) {
            return enItem.road_address;
        }
    }
    
    return '';
}

function getItemJibunAddress(item) {
    if (!item) return '';
    
    // 현재 언어 DB에 주소가 있으면 사용
    if (item.jibun_address) {
        return item.jibun_address;
    }
    
    // 없으면 영어 DB에서 fallback
    if (typeof landmarkData_en !== 'undefined') {
        const enItem = landmarkData_en.find(e => e.id === item.id);
        if (enItem?.jibun_address) {
            return enItem.jibun_address;
        }
    }
    
    return '';
}

function translateDistrict(district) {
    if (!district) return '-';
    const lang = getLang();
    if (lang === 'ko') return district;
    
    const districtMap = {
        en: {
            "종로구": "Jongno-gu", "중구": "Jung-gu", "용산구": "Yongsan-gu",
            "성동구": "Seongdong-gu", "광진구": "Gwangjin-gu", "동대문구": "Dongdaemun-gu",
            "중랑구": "Jungnang-gu", "성북구": "Seongbuk-gu", "강북구": "Gangbuk-gu",
            "도봉구": "Dobong-gu", "노원구": "Nowon-gu", "은평구": "Eunpyeong-gu",
            "서대문구": "Seodaemun-gu", "마포구": "Mapo-gu", "양천구": "Yangcheon-gu",
            "강서구": "Gangseo-gu", "구로구": "Guro-gu", "금천구": "Geumcheon-gu",
            "영등포구": "Yeongdeungpo-gu", "동작구": "Dongjak-gu", "관악구": "Gwanak-gu",
            "서초구": "Seocho-gu", "강남구": "Gangnam-gu", "송파구": "Songpa-gu", "강동구": "Gangdong-gu"
        },
        zh: {
            "종로구": "钟路区", "중구": "中区", "용산구": "龙山区",
            "성동구": "城东区", "광진구": "广津区", "동대문구": "东大门区",
            "중랑구": "中浪区", "성북구": "城北区", "강북구": "江北区",
            "도봉구": "道峰区", "노원구": "芦原区", "은평구": "恩平区",
            "서대문구": "西大门区", "마포구": "麻浦区", "양천구": "阳川区",
            "강서구": "江西区", "구로구": "九老区", "금천구": "衿川区",
            "영등포구": "永登浦区", "동작구": "铜雀区", "관악구": "冠岳区",
            "서초구": "瑞草区", "강남구": "江南区", "송파구": "松坡区", "강동구": "江东区"
        },
        ja: {
            "종로구": "鍾路区", "중구": "中区", "용산구": "龍山区",
            "성동구": "城東区", "광진구": "広津区", "동대문구": "東大門区",
            "중랑구": "中浪区", "성북구": "城北区", "강북구": "江北区",
            "도봉구": "道峰区", "노원구": "蘆原区", "은평구": "恩平区",
            "서대문구": "西大門区", "마포구": "麻浦区", "양천구": "陽川区",
            "강서구": "江西区", "구로구": "九老区", "금천구": "衿川区",
            "영등포구": "永登浦区", "동작구": "銅雀区", "관악구": "冠岳区",
            "서초구": "瑞草区", "강남구": "江南区", "송파구": "松坡区", "강동구": "江東区"
        }
    };
    
    const map = districtMap[lang] || districtMap.en;
    for (const [ko, trans] of Object.entries(map)) {
        if (district.startsWith(ko)) {
            const dongPart = district.replace(ko, '').trim();
            if (dongPart) {
                // 동 이름을 로마자로 변환
                const romanized = romanizeDong(dongPart);
                return `${trans} ${romanized}`;
            }
            return trans;
        }
    }
    return district;
}

function romanizeDong(dong) {
    const dongMap = {
        "명동": "Myeongdong", "서교동": "Seogyo-dong", "남산동": "Namsan-dong",
        "역삼동": "Yeoksam-dong", "성수동": "Seongsu-dong", "잠실동": "Jamsil-dong",
        "신사동": "Sinsa-dong", "청담동": "Cheongdam-dong", "압구정동": "Apgujeong-dong",
        "이태원동": "Itaewon-dong", "한남동": "Hannam-dong", "삼청동": "Samcheong-dong",
        "북촌": "Bukchon", "서촌": "Seochon", "익선동": "Ikseon-dong",
        "연남동": "Yeonnam-dong", "망원동": "Mangwon-dong", "합정동": "Hapjeong-dong",
        "을지로": "Euljiro", "종로": "Jongno", "광화문": "Gwanghwamun",
        "여의도동": "Yeouido-dong", "영등포동": "Yeongdeungpo-dong",
        "가로수길": "Garosu-gil", "경리단길": "Gyeongnidan-gil"
    };
    return dongMap[dong] || dong;
}

function translateDuration(duration) {
    if (!duration) return '-';
    const lang = getLang();
    if (lang === 'ko') return duration;
    
    const map = {
        en: {
            '30분-1시간': '30min-1hr', '1-2시간': '1-2 hours', '2-3시간': '2-3 hours',
            '3-4시간': '3-4 hours', '4시간 이상': '4+ hours', '반나절': 'Half day', '하루': 'Full day'
        },
        zh: {
            '30분-1시간': '30分钟-1小时', '1-2시간': '1-2小时', '2-3시간': '2-3小时',
            '3-4시간': '3-4小时', '4시간 이상': '4小时以上', '반나절': '半天', '하루': '一天'
        },
        ja: {
            '30분-1시간': '30分-1時間', '1-2시간': '1-2時間', '2-3시간': '2-3時間',
            '3-4시간': '3-4時間', '4시간 이상': '4時間以上', '반나절': '半日', '하루': '終日'
        }
    };
    return map[lang]?.[duration] || duration;
}

function translateStation(station) {
    if (!station) return '-';
    const lang = getLang();
    if (lang === 'ko') return station;
    
    let result = station;
    
    // 주요 역명 번역
    const stationNames = {
        en: {
            '경복궁': 'Gyeongbokgung', '광화문': 'Gwanghwamun', '종로3가': 'Jongno 3-ga',
            '을지로입구': 'Euljiro 1-ga', '명동': 'Myeongdong', '동대문': 'Dongdaemun',
            '홍대입구': 'Hongik Univ.', '신촌': 'Sinchon', '이태원': 'Itaewon',
            '강남': 'Gangnam', '삼성': 'Samsung', '잠실': 'Jamsil', '여의도': 'Yeouido',
            '서울': 'Seoul', '용산': 'Yongsan', '안국': 'Anguk', '종각': 'Jonggak',
            '시청': 'City Hall', '을지로3가': 'Euljiro 3-ga', '충무로': 'Chungmuro',
            '동대문역사문화공원': 'DDP', '성수': 'Seongsu', '건대입구': 'Konkuk Univ.',
            '합정': 'Hapjeong', '망원': 'Mangwon', '연남': 'Yeonnam', '상수': 'Sangsu'
        },
        zh: {
            '경복궁': '景福宫', '광화문': '光化门', '종로3가': '钟路三街',
            '을지로입구': '乙支路入口', '명동': '明洞', '동대문': '东大门',
            '홍대입구': '弘大入口', '신촌': '新村', '이태원': '梨泰院',
            '강남': '江南', '삼성': '三成', '잠실': '蚕室', '여의도': '汝矣岛',
            '서울': '首尔', '용산': '龙山', '안국': '安国', '종각': '钟阁',
            '시청': '市厅', '을지로3가': '乙支路三街', '충무로': '忠武路',
            '동대문역사문화공원': '东大门历史文化公园', '성수': '圣水', '건대입구': '建大入口',
            '합정': '合井', '망원': '望远', '연남': '延南', '상수': '上水'
        },
        ja: {
            '경복궁': '景福宮', '광화문': '光化門', '종로3가': '鍾路3街',
            '을지로입구': '乙支路入口', '명동': '明洞', '동대문': '東大門',
            '홍대입구': '弘大入口', '신촌': '新村', '이태원': '梨泰院',
            '강남': '江南', '삼성': '三成', '잠실': '蚕室', '여의도': '汝矣島',
            '서울': 'ソウル', '용산': '龍山', '안국': '安国', '종각': '鍾閣',
            '시청': '市庁', '을지로3가': '乙支路3街', '충무로': '忠武路',
            '동대문역사문화공원': '東大門歴史文化公園', '성수': '聖水', '건대입구': '建大入口',
            '합정': '合井', '망원': '望遠', '연남': '延南', '상수': '上水'
        }
    };
    
    const names = stationNames[lang] || stationNames.en;
    for (const [ko, trans] of Object.entries(names)) {
        result = result.replace(new RegExp(ko, 'g'), trans);
    }
    
    // 일반 패턴 번역
    const patterns = {
        en: { '역': ' Station', '번출구': ' Exit', '호선': ' Line ' },
        zh: { '역': '站', '번출구': '号出口', '호선': '号线' },
        ja: { '역': '駅', '번출구': '番出口', '호선': '号線' }
    };
    
    const p = patterns[lang] || patterns.en;
    for (const [ko, trans] of Object.entries(p)) {
        result = result.replace(new RegExp(ko, 'g'), trans);
    }
    return result;
}

function translateClosed(closed) {
    if (!closed) return '-';
    const lang = getLang();
    if (lang === 'ko') return closed;
    
    const map = {
        en: {
            "월요일": "Monday", "화요일": "Tuesday", "수요일": "Wednesday",
            "목요일": "Thursday", "금요일": "Friday", "토요일": "Saturday",
            "일요일": "Sunday", "연중무휴": "Open daily", "없음": "None"
        },
        zh: {
            "월요일": "周一", "화요일": "周二", "수요일": "周三",
            "목요일": "周四", "금요일": "周五", "토요일": "周六",
            "일요일": "周日", "연중무휴": "全年无休", "없음": "无"
        },
        ja: {
            "월요일": "月曜日", "화요일": "火曜日", "수요일": "水曜日",
            "목요일": "木曜日", "금요일": "金曜日", "토요일": "土曜日",
            "일요일": "日曜日", "연중무휴": "年中無休", "없음": "なし"
        }
    };
    return map[lang]?.[closed] || closed;
}

// ===== Google Maps =====
function initGoogleMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    map = new google.maps.Map(mapContainer, {
        center: { lat: 37.5665, lng: 126.9780 },
        zoom: 12,
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
        mapTypeControl: false, fullscreenControl: true, streetViewControl: false
    });
    
    map.addListener('click', () => {
        if (currentInfoWindow) { currentInfoWindow.close(); currentInfoWindow = null; }
    });
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
    // 현재 언어에 맞는 데이터 로드
    allData = getLandmarkData();
    
    if (!allData || allData.length === 0) {
        console.error('landmarkData not found!');
        return;
    }
    
    console.log(`✅ 데이터 로드 완료: ${allData.length}개 (${getLang()})`);
    
    // 초기 언어에 따른 폰트 설정
    document.body.setAttribute('data-lang', getLang());
    
    filteredData = [...allData].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    setupEventListeners();
    updateUITexts();
    renderTable();
    updateStats();
});

// ===== 언어 토글 =====
function setLanguage(lang) {
    setLangStorage(lang);
    
    // body에 언어 속성 설정 (폰트 변경용)
    document.body.setAttribute('data-lang', lang);
    
    // 언어별 데이터 다시 로드
    allData = getLandmarkData();
    
    // 현재 필터 상태 유지하면서 데이터 재정렬
    applyFilters();
    
    updateUITexts();
    renderTable();
    updateStats();
    
    // 언어 버튼 활성화 상태 업데이트
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    const mapView = document.getElementById('mapView');
    if (mapView && mapView.style.display !== 'none') renderMap();
}

// ===== UI 텍스트 업데이트 =====
function updateUITexts() {
    const lang = getLang();
    const totalCount = allData.length;
    
    // 언어 버튼 활성화 상태
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // 헤더 배지 (108개 명소)
    const headerBadge = document.getElementById('dbCount');
    if (headerBadge) {
        const badgeTexts = {
            ko: `${totalCount}개 명소`,
            en: `${totalCount} Spots`,
            zh: `${totalCount}个景点`,
            ja: `${totalCount}箇所`
        };
        headerBadge.textContent = badgeTexts[lang] || badgeTexts.ko;
    }
    
    const subTitle = document.querySelector('.logo-sub');
    if (subTitle) {
        const titles = { ko: '서울 명소 가이드', en: 'Seoul Attractions Guide', zh: '首尔景点指南', ja: 'ソウル名所ガイド' };
        subTitle.textContent = titles[lang] || titles.ko;
    }
    
    document.querySelectorAll('.view-tab').forEach(tab => {
        const listNames = { ko: '리스트', en: 'List', zh: '列表', ja: 'リスト' };
        const mapNames = { ko: '지도', en: 'Map', zh: '地图', ja: '地図' };
        if (tab.dataset.view === 'list') tab.textContent = listNames[lang] || listNames.ko;
        if (tab.dataset.view === 'map') tab.textContent = mapNames[lang] || mapNames.ko;
    });
    
    const aboutTitle = document.querySelector('.about-header h2');
    if (aboutTitle) {
        const titles = { ko: 'Only In Seoul 명소 컬렉션', en: 'Only In Seoul Attractions Collection', zh: 'Only In Seoul 景点精选', ja: 'Only In Seoul 名所コレクション' };
        aboutTitle.textContent = titles[lang] || titles.ko;
    }
    
    // 소개 텍스트
    const aboutDesc = document.querySelector('.about-desc');
    if (aboutDesc) {
        const descTexts = {
            ko: `네이버 블로그 30만개 이상의 분석을 통해 선별한 서울 대표 명소 ${totalCount}곳. 실제 방문자들의 경험을 바탕으로 한 신뢰도 높은 점수를 제공합니다.`,
            en: `${totalCount} top Seoul attractions selected through analysis of over 300,000 Naver blog posts. We provide reliable scores based on real visitors' experiences.`,
            zh: `通过分析30万篇Naver博客精选的首尔代表性景点${totalCount}处。基于真实游客体验提供高可信度评分。`,
            ja: `Naverブログ30万件以上の分析により厳選したソウルの代表的な名所${totalCount}箇所。実際の訪問者の経験に基づいた信頼性の高い評価を提供します。`
        };
        aboutDesc.innerHTML = descTexts[lang] || descTexts.ko;
    }
    
    // 카테고리 통계
    const aboutCategories = document.getElementById('aboutCategories');
    if (aboutCategories) {
        const catCounts = {};
        Object.keys(categoryInfo).forEach(cat => {
            catCounts[cat] = allData.filter(d => d.category === cat).length;
        });
        
        const catStatsTexts = {
            ko: `고궁/역사 ${catCounts.palace}곳, 전망/야경 ${catCounts.viewpoint}곳, 쇼핑 ${catCounts.shopping}곳, 힙플레이스 ${catCounts.hipplace}곳, 공원/자연 ${catCounts.nature}곳, 박물관/미술관 ${catCounts.museum}곳`,
            en: `Palaces/History ${catCounts.palace}, Views/Night ${catCounts.viewpoint}, Shopping ${catCounts.shopping}, Hip Places ${catCounts.hipplace}, Parks/Nature ${catCounts.nature}, Museums ${catCounts.museum}`,
            zh: `古宫/历史 ${catCounts.palace}处, 观景/夜景 ${catCounts.viewpoint}处, 购物 ${catCounts.shopping}处, 潮流地 ${catCounts.hipplace}处, 公园/自然 ${catCounts.nature}处, 博物馆/美术馆 ${catCounts.museum}处`,
            ja: `古宮/歴史 ${catCounts.palace}箇所, 展望/夜景 ${catCounts.viewpoint}箇所, ショッピング ${catCounts.shopping}箇所, ヒップスポット ${catCounts.hipplace}箇所, 公園/自然 ${catCounts.nature}箇所, 博物館/美術館 ${catCounts.museum}箇所`
        };
        aboutCategories.textContent = catStatsTexts[lang] || catStatsTexts.ko;
    }
    
    // 검색결과 텍스트
    updateFilteredCountText();
    
    document.querySelectorAll('#categoryFilters .filter-btn').forEach(btn => {
        const cat = btn.dataset.category;
        const allNames = { ko: '장소 전체', en: 'All Places', zh: '全部景点', ja: 'すべて' };
        if (cat === 'all') btn.textContent = allNames[lang] || allNames.ko;
        else if (categoryInfo[cat]) btn.textContent = `${categoryInfo[cat].icon} ${getCatName(categoryInfo[cat])}`;
    });
    
    document.querySelectorAll('#scoreFilters .score-filter-btn').forEach(btn => {
        const score = btn.dataset.score;
        const allNames = { ko: '추천 전체', en: 'All Picks', zh: '全部推荐', ja: 'すべて' };
        if (score === 'all') btn.textContent = allNames[lang] || allNames.ko;
        else if (scoreInfo[score]) btn.textContent = `${scoreInfo[score].icon} ${getScoreName(score)}`;
    });
    
    const headers = document.querySelectorAll('.landmark-table th');
    const headerTexts = {
        ko: ['#', '사진', '이름', '카테고리', '위치', '소요시간', '인기도'],
        en: ['#', 'Photo', 'Name', 'Category', 'Location', 'Duration', 'Popularity'],
        zh: ['#', '照片', '名称', '分类', '位置', '时长', '人气'],
        ja: ['#', '写真', '名前', 'カテゴリ', '場所', '所要時間', '人気度']
    };
    const texts = headerTexts[lang] || headerTexts.ko;
    headers.forEach((th, i) => { if (texts[i]) th.textContent = texts[i]; });
}

function updateFilteredCountText() {
    const lang = getLang();
    const filterResult = document.querySelector('.filter-result');
    if (filterResult) {
        const count = document.getElementById('filteredCount')?.textContent || '0';
        const resultTexts = {
            ko: `${count}개 검색결과`,
            en: `${count} results`,
            zh: `${count}个搜索结果`,
            ja: `${count}件の検索結果`
        };
        filterResult.innerHTML = resultTexts[lang] || resultTexts.ko;
    }
}

// ===== 이벤트 리스너 =====
function setupEventListeners() {
    // 언어 버튼 이벤트
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
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
    
    document.querySelectorAll('#categoryFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#categoryFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            applyFilters();
        });
    });
    
    document.querySelectorAll('#scoreFilters .score-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#scoreFilters .score-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const score = btn.dataset.score;
            activeScoreFilters = score === 'all' ? [] : [score];
            applyFilters();
        });
    });
    
    document.getElementById('modal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeModal(); closeGallery(); }
        const galleryModal = document.getElementById('galleryModal');
        if (galleryModal?.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
        }
    });
    
    document.getElementById('galleryModal')?.addEventListener('click', e => {
        if (e.target.id === 'galleryModal') closeGallery();
    });
}

// ===== 필터 =====
function applyFilters() {
    filteredData = allData.filter(item => {
        if (currentCategory !== 'all' && item.category !== currentCategory) return false;
        if (activeScoreFilters.length > 0) {
            const hasHighScore = activeScoreFilters.some(score => item.scores && item.scores[score] >= 4);
            if (!hasHighScore) return false;
        }
        return true;
    });
    filteredData.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    renderTable();
    updateFilteredCount();
}

// ===== 통계 =====
function updateStats() {
    const lang = getLang();
    const counts = {
        palace: allData.filter(d => d.category === 'palace').length,
        viewpoint: allData.filter(d => d.category === 'viewpoint').length,
        shopping: allData.filter(d => d.category === 'shopping').length,
        hipplace: allData.filter(d => d.category === 'hipplace').length,
        nature: allData.filter(d => d.category === 'nature').length,
        museum: allData.filter(d => d.category === 'museum').length
    };
    const total = allData.length;
    
    const dbCountEl = document.getElementById('dbCount');
    if (dbCountEl) {
        const dbTexts = {
            ko: `${total}개 명소`, en: `${total} Attractions`,
            zh: `${total}个景点`, ja: `${total}箇所`
        };
        dbCountEl.textContent = dbTexts[lang] || dbTexts.ko;
    }
    
    const aboutDescEl = document.querySelector('.about-desc');
    if (aboutDescEl) {
        const descTexts = {
            ko: `네이버 블로그 30만개 이상의 분석을 통해 선별한 서울 대표 명소 <span id="aboutTotalCount">${total}</span>곳. 실제 방문자들의 경험을 바탕으로 한 신뢰도 높은 점수를 제공합니다.`,
            en: `Top Seoul attractions curated from analysis of 300,000+ Naver blog posts. <span id="aboutTotalCount">${total}</span> locations with reliable scores based on real visitor experiences.`,
            zh: `通过分析30万篇Naver博客精选的首尔代表性景点<span id="aboutTotalCount">${total}</span>处。基于真实游客体验提供高可信度评分。`,
            ja: `Naverブログ30万件以上の分析により厳選したソウルの代表的な名所<span id="aboutTotalCount">${total}</span>箇所。実際の訪問者の経験に基づいた信頼性の高い評価を提供します。`
        };
        aboutDescEl.innerHTML = descTexts[lang] || descTexts.ko;
    }
    
    const categoriesEl = document.getElementById('aboutCategories');
    if (categoriesEl) {
        const catTexts = {
            ko: `고궁/역사 ${counts.palace}곳, 전망/야경 ${counts.viewpoint}곳, 쇼핑 ${counts.shopping}곳, 힙플레이스 ${counts.hipplace}곳, 공원/자연 ${counts.nature}곳, 박물관/미술관 ${counts.museum}곳`,
            en: `Palaces/Historic ${counts.palace}, Views/Night ${counts.viewpoint}, Shopping ${counts.shopping}, Hipster Spots ${counts.hipplace}, Parks/Nature ${counts.nature}, Museums/Galleries ${counts.museum}`,
            zh: `古宫/历史 ${counts.palace}处, 观景/夜景 ${counts.viewpoint}处, 购物 ${counts.shopping}处, 潮流地 ${counts.hipplace}处, 公园/自然 ${counts.nature}处, 博物馆/美术馆 ${counts.museum}处`,
            ja: `古宮/歴史 ${counts.palace}箇所, 展望/夜景 ${counts.viewpoint}箇所, ショッピング ${counts.shopping}箇所, ヒップスポット ${counts.hipplace}箇所, 公園/自然 ${counts.nature}箇所, 博物館/美術館 ${counts.museum}箇所`
        };
        categoriesEl.textContent = catTexts[lang] || catTexts.ko;
    }
    updateFilteredCount();
}

function updateFilteredCount() {
    const lang = getLang();
    const resultEl = document.querySelector('.filter-result');
    if (resultEl) {
        const count = filteredData.length;
        const resultTexts = {
            ko: `<span id="filteredCount">${count}</span>개 검색결과`,
            en: `<span id="filteredCount">${count}</span> Results`,
            zh: `<span id="filteredCount">${count}</span>个搜索结果`,
            ja: `<span id="filteredCount">${count}</span>件の検索結果`
        };
        resultEl.innerHTML = resultTexts[lang] || resultTexts.ko;
    }
}

// ===== 테이블 렌더링 =====
function renderTable() {
    const lang = getLang();
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    if (filteredData.length === 0) {
        const noResultsMsg = {
            ko: '검색 결과가 없습니다.',
            en: 'No results found.',
            zh: '没有搜索结果。',
            ja: '検索結果がありません。'
        };
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#94a3b8;">${noResultsMsg[lang] || noResultsMsg.en}</td></tr>`;
        updateFilteredCount();
        return;
    }
    
    tbody.innerHTML = filteredData.map((item, idx) => {
        const cat = categoryInfo[item.category] || {};
        const thumbUrl = `${IMAGE_BASE_URL}/${item.id}/${item.id}_01.jpg`;
        const popularity = item.popularity || 50;
        const displayName = getItemName(item);
        const catName = getCatName(cat);
        const district = getItemLocation(item);
        const duration = translateDuration(item.duration);
        
        return `
            <tr onclick="openModal('${item.id}')">
                <td class="cell-rank">${idx + 1}</td>
                <td><div class="cell-photo"><img src="${thumbUrl}" alt="${displayName}" onerror="this.parentElement.innerHTML='${cat.icon || '📍'}'"></div></td>
                <td>
                    <div class="cell-name">${displayName}</div>
                    <span class="cell-category-mobile ${item.category}">${cat.icon} ${catName}</span>
                </td>
                <td><span class="cell-category ${item.category}">${cat.icon} ${catName}</span></td>
                <td class="cell-location">${district}</td>
                <td class="cell-duration">${duration}</td>
                <td class="cell-popularity">
                    <div class="popularity-bar">
                        <div class="popularity-track"><div class="popularity-fill ${getPopularityClass(popularity)}" style="width: ${popularity}%"></div></div>
                        <span class="popularity-value ${getPopularityClass(popularity)}">${popularity}</span>
                    </div>
                    <span class="popularity-value-mobile ${getPopularityClass(popularity)}">${popularity}</span>
                </td>
            </tr>
        `;
    }).join('');
    updateFilteredCount();
}

function getPopularityClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    if (score >= 40) return 'score-low';
    return 'score-very-low';
}

function getCategoryColor(category) {
    const colors = { palace: '#dc2626', viewpoint: '#7c3aed', shopping: '#ec4899', hipplace: '#f59e0b', nature: '#10b981', museum: '#3b82f6' };
    return colors[category] || '#6b7280';
}

// ===== 지도 =====
function renderMap() {
    if (!map) { setTimeout(renderMap, 100); return; }
    const lang = getLang();
    
    markers.forEach(m => { if (m.marker) m.marker.setMap(null); if (m.label) m.label.setMap(null); });
    markers = [];
    if (currentInfoWindow) { currentInfoWindow.close(); currentInfoWindow = null; }
    
    filteredData.forEach(item => {
        if (item.coordinates?.lat && item.coordinates?.lng) {
            const cat = categoryInfo[item.category] || {};
            const position = { lat: item.coordinates.lat, lng: item.coordinates.lng };
            const displayName = getItemName(item);
            const summary = getItemSummary(item);
            
            const marker = new google.maps.Marker({
                position, map, title: displayName,
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: getCategoryColor(item.category), fillOpacity: 0.9, strokeColor: '#ffffff', strokeWeight: 2 }
            });
            
            const label = new google.maps.Marker({
                position, map,
                icon: { path: 'M 0,0 L 0,0', fillOpacity: 0, strokeOpacity: 0 },
                label: { text: displayName, color: '#1e1b4b', fontSize: '11px', fontWeight: '600', className: 'map-label' }
            });
            
            const viewMoreText = lang === 'en' ? 'View Details' : '자세히 보기';
            const infoContent = `
                <div style="display:flex;width:300px;height:150px;background:#fff;overflow:hidden;">
                    <div style="width:110px;height:150px;flex-shrink:0;background:linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);display:flex;align-items:center;justify-content:center;">
                        <span style="font-size:40px;">${cat.icon || '📍'}</span>
                    </div>
                    <div style="width:190px;padding:14px;display:flex;flex-direction:column;box-sizing:border-box;height:150px;">
                        <strong style="font-size:14px;color:#1e1b4b;margin-bottom:8px;">${displayName}</strong>
                        <p style="font-size:11px;color:#64748b;margin:0;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;flex:1;">${summary || ''}</p>
                        <button onclick="openModal('${item.id}')" style="width:100%;padding:8px 0;margin-top:auto;background:linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:11px;">${viewMoreText}</button>
                    </div>
                </div>
            `;
            
            const infoWindow = new google.maps.InfoWindow({ content: infoContent, pixelOffset: new google.maps.Size(0, -10) });
            
            marker.addListener('click', () => { if (currentInfoWindow) currentInfoWindow.close(); infoWindow.open(map, marker); currentInfoWindow = infoWindow; });
            label.addListener('click', () => { if (currentInfoWindow) currentInfoWindow.close(); infoWindow.open(map, marker); currentInfoWindow = infoWindow; });
            
            markers.push({ marker, label, infoWindow });
        }
    });
    
    if (filteredData.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        filteredData.forEach(item => { if (item.coordinates?.lat && item.coordinates?.lng) bounds.extend({ lat: item.coordinates.lat, lng: item.coordinates.lng }); });
        map.fitBounds(bounds);
    }
}

// ===== 모달 =====
function openModal(id) {
    const item = allData.find(d => d.id === id);
    if (!item) return;
    
    const lang = getLang();
    const cat = categoryInfo[item.category] || {};
    const displayName = getItemName(item);
    const catName = getCatName(cat);
    
    const modalOverlay = document.getElementById('modal');
    const leftCol = document.querySelector('.modal-col-left');
    const rightCol = document.querySelector('.modal-col-right');
    if (modalOverlay) modalOverlay.scrollTop = 0;
    if (leftCol) leftCol.scrollTop = 0;
    if (rightCol) rightCol.scrollTop = 0;
    
    document.getElementById('modalName').textContent = displayName;
    document.getElementById('modalTags').innerHTML = `
        ${lang === 'ko' && item.name_en ? `<span class="modal-name-en">${item.name_en}</span>` : ''}
        ${lang === 'en' && item.name_ko ? `<span class="modal-name-en">${item.name_ko}</span>` : ''}
        <span class="modal-tag ${item.category}">${cat.icon} ${catName}</span>
    `;
    
    updateModalTitles(lang);
    
    document.getElementById('modalAdmission').textContent = getItemAdmission(item) || '-';
    document.getElementById('modalHours').textContent = getItemHours(item) || '-';
    document.getElementById('modalClosed').textContent = translateClosed(item.closed) || '-';
    document.getElementById('modalDuration').textContent = translateDuration(item.duration) || '-';
    document.getElementById('modalStation').textContent = translateStation(item.nearest_station) || '-';
    
    // 주소: 한국어는 한국어 DB, 그 외(영어/중국어/일본어)는 영어 DB에서 가져옴
    const isKorean = lang === 'ko';
    if (isKorean) {
        document.getElementById('modalRoadAddress').textContent = item.road_address || '-';
        document.getElementById('modalJibunAddress').textContent = item.jibun_address || '-';
    } else {
        // 영어 DB에서 주소 가져오기
        const enItem = (typeof landmarkData_en !== 'undefined' ? landmarkData_en : []).find(d => d.id === item.id);
        document.getElementById('modalRoadAddress').textContent = enItem?.road_address || '-';
        document.getElementById('modalJibunAddress').textContent = enItem?.jibun_address || '-';
    }
    
    document.getElementById('modalSummary').textContent = getItemSummary(item) || '';
    document.getElementById('modalDescription').textContent = getItemDescription(item) || '';
    
    loadGallery(item, displayName);
    loadTips(item, lang);
    renderPopularitySection(item, lang);
    renderScoreSummary(item);
    renderScoreDetails(item, lang);
    
    // 지도 검색 - 한국어는 한국어 이름, 그 외는 영어 이름으로 검색
    const searchName = isKorean ? item.name : (item.name_en || item.name);
    const searchCity = isKorean ? '서울' : 'Seoul';
    const googleQuery = encodeURIComponent(searchName + ' ' + searchCity);
    const naverQuery = encodeURIComponent(isKorean ? item.name : (item.name_en || item.name));
    
    document.getElementById('modalGoogleMap').href = `https://www.google.com/maps/search/?api=1&query=${googleQuery}`;
    document.getElementById('modalNaverMap').href = `https://map.naver.com/v5/search/${naverQuery}`;
    
    // 로고 + 서비스명
    const mapLabels = {
        ko: { google: '구글맵', naver: '네이버지도' },
        en: { google: 'Google Maps', naver: 'Naver Map' },
        zh: { google: '谷歌地图', naver: 'Naver地图' },
        ja: { google: 'Googleマップ', naver: 'Naverマップ' }
    };
    const mL = mapLabels[lang] || mapLabels.ko;
    document.querySelector('#modalGoogleMap').innerHTML = `<img src="https://www.google.com/favicon.ico" alt="" class="btn-favicon"> ${mL.google}`;
    document.querySelector('#modalNaverMap').innerHTML = `<img src="https://www.naver.com/favicon.ico" alt="" class="btn-favicon"> ${mL.naver}`;
    
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => { setupStickyObserver(); }, 100);
}

function updateModalTitles(lang) {
    // 모든 섹션 h3 태그 직접 업데이트
    const titles = {
        intro: { ko: '✨ 소개', en: '✨ INTRODUCTION', zh: '✨ 简介', ja: '✨ 紹介' },
        photos: { ko: '📷 사진', en: '📷 PHOTOS', zh: '📷 照片', ja: '📷 写真' },
        tips: { ko: '💡 방문 팁', en: '💡 VISITOR TIPS', zh: '💡 游览攻略', ja: '💡 訪問のヒント' },
        info: { ko: '🕐 운영 정보', en: '🕐 INFORMATION', zh: '🕐 运营信息', ja: '🕐 営業情報' },
        address: { ko: '📍 주소', en: '📍 ADDRESS', zh: '📍 地址', ja: '📍 住所' },
        popularity: { ko: '🔥 인기도', en: '🔥 POPULARITY', zh: '🔥 人气指数', ja: '🔥 人気度' },
        desc: { ko: '📖 상세 설명', en: '📖 DESCRIPTION', zh: '📖 详细介绍', ja: '📖 詳細説明' },
        scores: { ko: '📊 데이터 기반 점수', en: '📊 SCORES', zh: '📊 数据评分', ja: '📊 データスコア' },
        detailed: { ko: '📋 데이터 기반 상세 평가', en: '📋 DETAILED EVALUATION', zh: '📋 详细评价', ja: '📋 詳細評価' }
    };
    
    const sectionTitles = document.querySelectorAll('.modal-section h3, .score-summary-section h3');
    sectionTitles.forEach(h3 => {
        const text = h3.textContent.toLowerCase();
        if (text.includes('소개') || text.includes('introduction') || text.includes('简介') || text.includes('紹介')) {
            h3.textContent = titles.intro[lang] || titles.intro.ko;
        } else if (text.includes('사진') || text.includes('photos') || text.includes('照片') || text.includes('写真')) {
            h3.textContent = titles.photos[lang] || titles.photos.ko;
        } else if (text.includes('팁') || text.includes('tips') || text.includes('攻略') || text.includes('ヒント')) {
            h3.textContent = titles.tips[lang] || titles.tips.ko;
        } else if (text.includes('운영') || text.includes('information') || text.includes('运营') || text.includes('営業')) {
            h3.textContent = titles.info[lang] || titles.info.ko;
        } else if (text.includes('주소') || text.includes('address') || text.includes('地址') || text.includes('住所')) {
            h3.textContent = titles.address[lang] || titles.address.ko;
        } else if (text.includes('인기도') || text.includes('popularity') || text.includes('人气') || text.includes('人気度')) {
            h3.textContent = titles.popularity[lang] || titles.popularity.ko;
        } else if ((text.includes('상세 설명') || text.includes('상세설명') || text.includes('详细介绍') || text.includes('詳細説明')) || (text.includes('description') && !text.includes('detailed') && !text.includes('evaluation'))) {
            h3.textContent = titles.desc[lang] || titles.desc.ko;
        } else if (text.includes('데이터 기반 점수') || text.includes('scores') || text.includes('数据评分') || text.includes('データスコア')) {
            h3.textContent = titles.scores[lang] || titles.scores.ko;
        } else if (text.includes('상세 평가') || text.includes('detailed') || text.includes('evaluation') || text.includes('详细评价') || text.includes('詳細評価')) {
            h3.textContent = titles.detailed[lang] || titles.detailed.ko;
        }
    });
    
    const labels = document.querySelectorAll('.info-label');
    const labelTexts = {
        ko: ['입장료', '운영시간', '휴무일', '소요시간', '가까운역'],
        en: ['Admission', 'Hours', 'Closed', 'Duration', 'Nearest Station'],
        zh: ['门票', '营业时间', '休息日', '游览时长', '最近地铁站'],
        ja: ['入場料', '営業時間', '休館日', '所要時間', '最寄り駅']
    };
    const texts = labelTexts[lang] || labelTexts.ko;
    labels.forEach((label, i) => { if (texts[i]) label.textContent = texts[i]; });
    
    // 도로명/지번 태그 번역
    const addressLabels = {
        ko: { road: '도로명', jibun: '지번', copy: '복사', copied: '완료' },
        en: { road: 'Street', jibun: 'Lot', copy: 'Copy', copied: 'Done' },
        zh: { road: '道路名', jibun: '地番', copy: '复制', copied: '完成' },
        ja: { road: '道路名', jibun: '地番', copy: 'コピー', copied: '完了' }
    };
    const addrL = addressLabels[lang] || addressLabels.ko;
    const roadLabel = document.getElementById('labelRoadAddress');
    const jibunLabel = document.getElementById('labelJibunAddress');
    if (roadLabel) roadLabel.textContent = addrL.road;
    if (jibunLabel) jibunLabel.textContent = addrL.jibun;
    
    // 복사 버튼 번역
    document.querySelectorAll('.copy-btn').forEach(btn => {
        if (!btn.classList.contains('copied')) btn.textContent = addrL.copy;
    });
    
    // 복사 함수용 전역 변수 저장
    window.copyLabels = addrL;
}

function loadGallery(item, displayName) {
    const galleryEl = document.getElementById('modalGallery');
    if (!galleryEl) return;
    
    const photos = [];
    for (let i = 1; i <= 15; i++) photos.push(`${IMAGE_BASE_URL}/${item.id}/${item.id}_${String(i).padStart(2, '0')}.jpg`);
    
    galleryEl.innerHTML = '';
    const loadedPhotos = [];
    let loadCount = 0;
    
    photos.forEach((p, i) => {
        const img = new Image();
        img.onload = () => { loadedPhotos.push({ url: p, index: i }); loadCount++; if (loadCount === photos.length) renderGalleryThumbs(galleryEl, loadedPhotos, displayName); };
        img.onerror = () => { loadCount++; if (loadCount === photos.length) renderGalleryThumbs(galleryEl, loadedPhotos, displayName); };
        img.src = p;
    });
}

function renderGalleryThumbs(container, loadedPhotos, name) {
    const lang = getLang();
    loadedPhotos.sort((a, b) => a.index - b.index);
    const validPhotos = loadedPhotos.map(p => p.url);
    
    if (validPhotos.length === 0) {
        container.innerHTML = `<div class="no-photos">${lang === 'en' ? 'No photos available.' : '등록된 사진이 없습니다.'}</div>`;
        return;
    }
    
    container.innerHTML = validPhotos.map((p, i) => `
        <div class="gallery-thumb" onclick="openGallery(${JSON.stringify(validPhotos).replace(/"/g, '&quot;')}, ${i}, '${name.replace(/'/g, "\\'")}')">
            <img src="${p}" alt="${name} ${i + 1}">
        </div>
    `).join('');
}

function loadTips(item, lang) {
    const tipsEl = document.getElementById('modalTips');
    const tips = getItemTips(item);
    const noTipsMsg = {
        ko: '등록된 팁이 없습니다.',
        en: 'No tips available.',
        zh: '暂无提示信息。',
        ja: 'ヒントがありません。'
    };
    
    if (tipsEl) {
        const html = tips && tips.length > 0 
            ? tips.map(tip => `<li>${tip}</li>`).join('') 
            : `<li>${noTipsMsg[lang] || noTipsMsg.ko}</li>`;
        tipsEl.innerHTML = html;
    }
}

function renderPopularitySection(item, lang) {
    const el = document.getElementById('modalPopularity');
    if (!el) return;
    
    const popularity = item.popularity || 50;
    const blogCount = item.blog_count || 0;
    
    const sortedAll = [...allData].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    const overallRank = sortedAll.findIndex(d => d.id === item.id) + 1;
    
    const categoryItems = allData.filter(d => d.category === item.category);
    const sortedCat = [...categoryItems].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    const catRank = sortedCat.findIndex(d => d.id === item.id) + 1;
    
    const catInfo = categoryInfo[item.category] || {};
    const catName = getCatName(catInfo);
    
    const formatCount = (c) => {
        if (lang === 'en') {
            if (c >= 1000000) return (c / 1000000).toFixed(1) + 'M';
            if (c >= 1000) return (c / 1000).toFixed(0) + 'K';
            return c.toLocaleString();
        }
        if (lang === 'zh') {
            if (c >= 10000) return (c / 10000).toFixed(0) + '万';
            return c.toLocaleString();
        }
        if (lang === 'ja') {
            if (c >= 10000) return (c / 10000).toFixed(0) + '万';
            return c.toLocaleString();
        }
        if (c >= 10000) return (c / 10000).toFixed(0) + '만';
        if (c >= 1000) return (c / 1000).toFixed(1) + '천';
        return c.toLocaleString();
    };
    
    const labels = {
        ko: { overall: '전체 순위', catRank: '순위', blog: '네이버 블로그', pop: '인기도', rank: '위', count: '건' },
        en: { overall: 'Overall Rank', catRank: 'Rank', blog: 'Blog Posts', pop: 'Popularity', rank: '', count: '' },
        zh: { overall: '总排名', catRank: '排名', blog: 'Naver博客', pop: '人气指数', rank: '位', count: '篇' },
        ja: { overall: '総合順位', catRank: '順位', blog: 'Naverブログ', pop: '人気度', rank: '位', count: '件' }
    };
    const L = labels[lang] || labels.ko;
    
    el.innerHTML = lang === 'en' ? `
        <div class="popularity-card"><div class="label">${L.overall}</div><div class="value">#${overallRank}</div></div>
        <div class="popularity-card"><div class="label">${catName} ${L.catRank}</div><div class="value">#${catRank}</div></div>
        <div class="popularity-card"><div class="label">${L.blog}</div><div class="value">${blogCount > 0 ? formatCount(blogCount) : '-'}</div></div>
        <div class="popularity-card"><div class="label">${L.pop}</div><div class="value">${popularity}<span>/99</span></div></div>
    ` : `
        <div class="popularity-card"><div class="label">${L.overall}</div><div class="value">${overallRank} <span>${L.rank}</span></div></div>
        <div class="popularity-card"><div class="label">${catName} ${L.catRank}</div><div class="value">${catRank} <span>${L.rank}</span></div></div>
        <div class="popularity-card"><div class="label">${L.blog}</div><div class="value">${blogCount > 0 ? formatCount(blogCount) : '-'} <span>${L.count}</span></div></div>
        <div class="popularity-card"><div class="label">${L.pop}</div><div class="value">${popularity} <span>/ 99</span></div></div>
    `;
}

function renderScoreSummary(item) {
    const el = document.getElementById('modalScoreSummary');
    if (!el) return;
    
    const keys = ['photo', 'culture', 'activity', 'relaxation', 'crowdedness', 'couple', 'family', 'solo', 'foreigner', 'accessibility'];
    
    el.innerHTML = keys.map(key => {
        const info = scoreInfo[key];
        const value = item.scores?.[key] || 0;
        const stars = '★'.repeat(value) + '☆'.repeat(5 - value);
        return `
            <div class="score-summary-item" onclick="scrollToScoreDetail('${key}')">
                <div class="score-summary-top"><span class="score-summary-icon">${info.icon}</span><span class="score-summary-name">${getScoreName(key)}</span></div>
                <span class="score-summary-stars" data-score="${value}">${stars}</span>
            </div>
        `;
    }).join('');
}

function renderScoreDetails(item, lang) {
    const el = document.getElementById('modalScoresList');
    if (!el) return;
    
    const keys = ['photo', 'culture', 'activity', 'relaxation', 'crowdedness', 'couple', 'family', 'solo', 'foreigner', 'accessibility'];
    const noReasonMsg = lang === 'en' ? 'Details coming soon' : '평가 근거 준비 중';
    
    el.innerHTML = keys.map(key => {
        const info = scoreInfo[key];
        const value = item.scores?.[key] || 0;
        const reasons = getItemScoreReasons(item, key);
        const stars = '★'.repeat(value) + '☆'.repeat(5 - value);
        return `
            <div class="score-row" id="score-detail-${key}">
                <div class="score-row-header"><span class="score-row-icon">${info.icon}</span><span class="score-row-name">${getScoreName(key)}</span><span class="score-row-stars" data-score="${value}">${stars}</span></div>
                <ul class="score-row-reasons">${reasons.length > 0 ? reasons.map(r => `<li>${r}</li>`).join('') : `<li class="no-reason">${noReasonMsg}</li>`}</ul>
            </div>
        `;
    }).join('');
}

function closeModal() {
    document.getElementById('modal')?.classList.remove('active');
    document.body.style.overflow = '';
}

function copyAddress(type) {
    const el = type === 'road' ? document.getElementById('modalRoadAddress') : document.getElementById('modalJibunAddress');
    const text = el?.textContent;
    if (!text || text === '-') return;
    
    const labels = window.copyLabels || { copy: '복사', copied: '완료' };
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = el.parentElement.querySelector('.copy-btn');
        if (btn) {
            btn.classList.add('copied');
            btn.textContent = labels.copied;
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.textContent = labels.copy;
            }, 1500);
        }
    });
}

function scrollToScoreDetail(key) {
    const target = document.getElementById(`score-detail-${key}`);
    const summary = document.getElementById('scoreSummarySection');
    const isMobile = window.innerWidth <= 768;
    const container = isMobile ? document.querySelector('.modal-body-two-col') : document.querySelector('.modal-col-right');
    
    if (target && container && summary) {
        const stickyH = summary.offsetHeight;
        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop + (targetRect.top - containerRect.top) - stickyH - 60;
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        target.classList.add('highlight');
        setTimeout(() => target.classList.remove('highlight'), 6000);
    }
}

function setupStickyObserver() {
    const summary = document.getElementById('scoreSummarySection');
    const isMobile = window.innerWidth <= 768;
    const container = isMobile ? document.querySelector('.modal-body-two-col') : document.querySelector('.modal-col-right');
    
    if (summary && container) {
        container.addEventListener('scroll', () => {
            const rect = summary.getBoundingClientRect();
            const parentRect = container.getBoundingClientRect();
            summary.classList.toggle('stuck', rect.top <= parentRect.top + 5);
        });
    }
}

// ===== 갤러리 =====
function openGallery(photos, startIndex, caption) {
    currentGallery = photos;
    currentGalleryIndex = startIndex;
    currentGalleryCaption = caption || '';
    updateGalleryImage();
    document.getElementById('galleryModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    document.getElementById('galleryModal')?.classList.remove('active');
    if (!document.getElementById('modal')?.classList.contains('active')) document.body.style.overflow = '';
    currentGallery = [];
    currentGalleryIndex = 0;
}

function navigateGallery(dir) {
    currentGalleryIndex += dir;
    if (currentGalleryIndex < 0) currentGalleryIndex = currentGallery.length - 1;
    if (currentGalleryIndex >= currentGallery.length) currentGalleryIndex = 0;
    updateGalleryImage();
}

function updateGalleryImage() {
    const img = document.getElementById('galleryImage');
    const counter = document.getElementById('galleryCounter');
    const caption = document.getElementById('galleryCaption');
    const thumbs = document.getElementById('galleryThumbnails');
    
    if (img) img.src = currentGallery[currentGalleryIndex];
    if (counter) counter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
    if (caption) caption.textContent = currentGalleryCaption;
    
    if (thumbs) {
        thumbs.innerHTML = currentGallery.map((p, i) => `
            <img src="${p}" class="gallery-thumb ${i === currentGalleryIndex ? 'active' : ''}" onclick="jumpToGalleryImage(${i})" onerror="this.style.display='none'" alt="">
        `).join('');
    }
}

function jumpToGalleryImage(index) {
    currentGalleryIndex = index;
    updateGalleryImage();
}
