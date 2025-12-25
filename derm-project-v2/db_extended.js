// TrueKorea 확장 DB v2.0
// 시술 상세 정보 데이터베이스

const DB_EXTENDED = {
  version: "2.0",
  lastUpdated: "2025-01",
  
  treatments: [
    // ===== 1. 울쎄라 =====
    {
      id: "ulthera",
      name: "울쎄라",
      nameEn: "Ultherapy",
      brand: "Merz",
      category: "리프팅/타이트닝",
      subcategory: "HIFU",
      
      mechanism: {
        simple: "초음파로 피부 깊숙한 근막층을 자극해 콜라겐 재생을 유도하는 리프팅 시술",
        detailed: "고강도 집속 초음파(HIFU)가 피부 1.5~4.5mm 깊이의 SMAS 근막층에 60~70℃ 열응고점을 만들어 콜라겐 재생 및 피부 수축 유도",
        keywords: ["HIFU", "초음파", "SMAS", "콜라겐", "근막층"]
      },
      
      effects: {
        primary: ["턱선 리프팅", "이중턱 개선", "볼처짐 개선"],
        secondary: ["피부 탄력", "잔주름 완화", "모공 축소"],
        notFor: ["깊은 주름", "볼륨 채움", "색소 치료"],
        onsetTime: "1~2개월 후 서서히, 3~6개월 최대 효과",
        duration: "1~2년"
      },
      
      procedure: {
        duration: "60~90분",
        anesthesia: "마취크림 필수, 수면마취 권장",
        sessions: "1회",
        interval: "6개월~1년",
        shots: "300~600샷"
      },
      
      recovery: {
        painLevel: 4,
        painDescription: "시술 중 뼈 근처 찌릿한 통증, 수면마취 시 편안함",
        downtime: "없음~3일",
        commonSideEffects: ["일시적 붓기", "홍반", "뻐근함"],
        recoveryTips: ["당일 세안/화장 가능", "음주/사우나 3~7일 금지"]
      },
      
      suitability: {
        idealAge: "30대 후반~50대",
        bestFor: ["경미~중등도 피부 처짐", "턱선 무너진 분", "다운타임 없이 관리 원하는 분"],
        notRecommended: ["얼굴 살 거의 없는 분", "심한 처짐", "즉각 효과 원하는 분", "임산부"],
        skinType: "모든 피부 타입"
      },
      
      pros: ["FDA 승인", "비침습", "자연스러운 개선", "효과 오래 지속", "바로 일상 복귀"],
      cons: ["높은 가격(100~300만)", "시술 중 통증", "효과 서서히", "볼패임 위험(얼굴 살 적으면)"],
      
      safety: {
        commonSideEffects: ["붓기", "홍반", "뻐근함"],
        seriousSideEffects: ["볼패임", "화상(드묾)", "신경손상(일시적)"],
        contraindications: ["임신/수유", "시술부위 염증", "켈로이드"],
        warnings: ["정품팁 확인 필수", "숙련된 의사 선택"]
      },
      
      pricing: { range: "100~300만원", average: "150만원", factors: ["샷수", "부위", "병원"] },
      
      comparison: {
        vs: {
          "써마지": "울쎄라=깊은층 리프팅, 써마지=진피층 탄력",
          "슈링크": "울쎄라가 더 강력하고 비쌈, 슈링크는 가성비"
        },
        bestWith: ["써마지", "스킨부스터", "보톡스"]
      },
      
      tags: ["리프팅", "HIFU", "FDA승인", "프리미엄"]
    },

    // ===== 2. 써마지 =====
    {
      id: "thermage",
      name: "써마지",
      nameEn: "Thermage FLX",
      brand: "Solta Medical",
      category: "리프팅/타이트닝",
      subcategory: "RF",
      
      mechanism: {
        simple: "고주파(RF)로 피부 진피층에 열을 가해 콜라겐 재생과 탄력 개선",
        detailed: "모노폴라 RF가 진피층(2~3mm)에 균일한 열 전달, 기존 콜라겐 수축 + 새 콜라겐 생성",
        keywords: ["RF", "고주파", "콜라겐", "진피층", "모노폴라"]
      },
      
      effects: {
        primary: ["피부 탄력", "잔주름 완화", "모공 축소"],
        secondary: ["턱선 정리", "피부결 개선"],
        notFor: ["심한 처짐", "볼륨 채움"],
        onsetTime: "즉각 + 1~6개월 점진적 개선",
        duration: "1~2년"
      },
      
      procedure: {
        duration: "30~60분",
        anesthesia: "대부분 불필요",
        sessions: "1회",
        interval: "1년",
        shots: "300~900샷"
      },
      
      recovery: {
        painLevel: 2,
        painDescription: "따뜻~뜨거운 느낌, 참을만함",
        downtime: "없음",
        commonSideEffects: ["일시적 붓기", "홍반"],
        recoveryTips: ["바로 일상 가능"]
      },
      
      suitability: {
        idealAge: "30대~50대",
        bestFor: ["탄력 저하", "모공/피부결 고민", "통증 민감한 분", "얼굴 살 적은 분"],
        notRecommended: ["심한 처짐", "페이스메이커", "임산부"],
        skinType: "모든 피부 타입"
      },
      
      pros: ["통증 적음", "다운타임 없음", "즉각 탄력감", "볼패임 위험 낮음", "눈가 전용팁"],
      cons: ["높은 가격", "리프팅은 울쎄라보다 약함"],
      
      safety: {
        commonSideEffects: ["붓기", "홍반"],
        seriousSideEffects: ["화상(드묾)", "지방위축(매우 드묾)"],
        contraindications: ["페이스메이커", "임신", "금속 임플란트"],
        warnings: ["4세대 FLX 장비 확인", "정품팁 확인"]
      },
      
      pricing: { range: "80~200만원", average: "120만원", factors: ["샷수", "팁 종류"] },
      
      comparison: {
        vs: { "울쎄라": "써마지=탄력/피부결, 울쎄라=리프팅" },
        bestWith: ["울쎄라", "스킨부스터"]
      },
      
      tags: ["탄력", "RF", "고주파", "FDA승인", "저통증"]
    },

    // ===== 3. 슈링크 유니버스 =====
    {
      id: "shrink-universe",
      name: "슈링크 유니버스",
      nameEn: "Shurink Universe",
      brand: "Classys",
      category: "리프팅/타이트닝",
      subcategory: "HIFU",
      
      mechanism: {
        simple: "고강도 초음파로 근막층 자극해 리프팅, 울쎄라의 국산 대안",
        detailed: "HIFU 에너지로 SMAS층에 열응고점 형성, 7가지 카트리지로 맞춤 시술",
        keywords: ["HIFU", "초음파", "SMAS", "국산", "가성비"]
      },
      
      effects: {
        primary: ["리프팅", "턱선 개선", "이중턱"],
        secondary: ["탄력", "피부결"],
        notFor: ["볼륨", "색소"],
        onsetTime: "2~3주 후 시작, 2~3개월 최대",
        duration: "3~6개월"
      },
      
      procedure: {
        duration: "20~30분",
        anesthesia: "마취크림",
        sessions: "3~4회 권장",
        interval: "4~6주",
        shots: "300~600샷"
      },
      
      recovery: {
        painLevel: 2.5,
        painDescription: "울쎄라보다 덜 아픔",
        downtime: "없음",
        commonSideEffects: ["미세 붓기", "홍반"],
        recoveryTips: ["당일 세안/화장 가능", "찬물 세안 피하기"]
      },
      
      suitability: {
        idealAge: "20대 후반~40대",
        bestFor: ["예산 고려하는 분", "리프팅 입문", "유지 관리"],
        notRecommended: ["얼굴 살 없는 분", "즉각적 큰 효과 원하는 분"],
        skinType: "모든 피부 타입"
      },
      
      pros: ["가성비 좋음", "통증 적음", "국산 장비", "다양한 카트리지", "빠른 시술"],
      cons: ["효과 유지 짧음", "여러 번 시술 필요", "울쎄라보다 효과 약함"],
      
      safety: {
        commonSideEffects: ["붓기", "홍반", "화끈거림"],
        seriousSideEffects: ["볼패임", "화상(드묾)"],
        contraindications: ["임신", "피부 염증"],
        warnings: ["숙련된 시술자 중요 (영상출력 없음)"]
      },
      
      pricing: { range: "10~30만원/회", average: "15만원/회", factors: ["샷수", "부위"] },
      
      comparison: {
        vs: {
          "울쎄라": "슈링크 3~4회 ≒ 울쎄라 1회 효과, 가격은 1/3~1/5",
          "더블로": "비슷한 국산 HIFU"
        },
        bestWith: ["인모드", "스킨부스터"]
      },
      
      tags: ["리프팅", "HIFU", "국산", "가성비", "입문용"]
    },

    // ===== 4. 리쥬란 =====
    {
      id: "rejuran",
      name: "리쥬란",
      nameEn: "Rejuran Healer",
      brand: "Pharmaresearch",
      category: "스킨부스터",
      subcategory: "PN",
      
      mechanism: {
        simple: "연어 DNA(PN) 성분을 피부에 주입해 재생력을 높이는 시술",
        detailed: "폴리뉴클레오타이드(PN)가 진피층에서 세포 성장인자 분비 촉진, 콜라겐/엘라스틴 합성 유도",
        keywords: ["PN", "연어DNA", "재생", "스킨부스터"]
      },
      
      effects: {
        primary: ["피부 재생", "탄력 개선", "잔주름 완화"],
        secondary: ["피부결", "속건조 해결", "모공"],
        notFor: ["즉각 볼륨", "리프팅", "색소"],
        onsetTime: "2~4주 후 효과 시작",
        duration: "3~6개월"
      },
      
      procedure: {
        duration: "20~30분",
        anesthesia: "마취크림",
        sessions: "3~4회 권장",
        interval: "2~3주",
        method: "미세주사/기계주입"
      },
      
      recovery: {
        painLevel: 2.5,
        painDescription: "따끔거림",
        downtime: "1~3일",
        commonSideEffects: ["엠보싱(볼록)", "멍", "붓기"],
        recoveryTips: ["엠보싱 2~3일 내 흡수", "다음날부터 화장"]
      },
      
      suitability: {
        idealAge: "20대 후반~50대",
        bestFor: ["피부 재생력 저하", "속건조", "잔주름/탄력", "피부 컨디션 개선"],
        notRecommended: ["해산물 알러지", "켈로이드"],
        skinType: "모든 피부, 민감성도 가능"
      },
      
      pros: ["자연스러운 개선", "K-뷰티 대표", "안전성 검증", "다른 시술 병행 가능"],
      cons: ["엠보싱 1~3일 티남", "여러 회 필요", "효과 서서히"],
      
      safety: {
        commonSideEffects: ["엠보싱", "멍", "붓기"],
        seriousSideEffects: ["감염(드묾)", "알러지(매우 드묾)"],
        contraindications: ["연어/해산물 알러지", "임신/수유", "피부 감염"],
        warnings: ["정품 확인"]
      },
      
      pricing: { range: "15~30만원/회", average: "20만원/회", factors: ["용량", "부위"] },
      
      comparison: {
        vs: {
          "쥬베룩": "리쥬란=재생/탄력, 쥬베룩=볼륨/콜라겐",
          "물광주사": "리쥬란=재생, 물광=보습/즉각 윤기"
        },
        bestWith: ["레이저토닝", "리프팅", "보톡스"]
      },
      
      tags: ["스킨부스터", "재생", "PN", "K-뷰티", "연어주사"]
    },

    // ===== 5. 보톡스 =====
    {
      id: "botox",
      name: "보톡스",
      nameEn: "Botox",
      brand: "Allergan 외 다수",
      category: "주름/보톡스",
      subcategory: "보톡스",
      
      mechanism: {
        simple: "근육에 보툴리눔 톡신을 주입해 주름 완화 및 윤곽 개선",
        detailed: "보툴리눔 톡신이 신경-근육 접합부에서 아세틸콜린 분비 차단, 근육 이완으로 주름 개선",
        keywords: ["보툴리눔톡신", "근육이완", "주름", "윤곽"]
      },
      
      effects: {
        primary: ["표정주름 완화", "이마/미간/눈가", "턱 축소"],
        secondary: ["사각턱 개선", "승모근 축소", "다한증"],
        notFor: ["볼륨", "탄력", "색소"],
        onsetTime: "3~7일 후 효과 시작",
        duration: "3~6개월"
      },
      
      procedure: {
        duration: "10~20분",
        anesthesia: "대부분 불필요",
        sessions: "1회",
        interval: "3~6개월",
        method: "주사"
      },
      
      recovery: {
        painLevel: 1.5,
        painDescription: "따끔, 크게 아프지 않음",
        downtime: "없음",
        commonSideEffects: ["주사 자국", "미세 멍"],
        recoveryTips: ["4시간 눕지 않기", "당일 세안/화장 가능"]
      },
      
      suitability: {
        idealAge: "20대~60대",
        bestFor: ["표정주름", "사각턱", "승모근", "땀 많은 분"],
        notRecommended: ["임산부/수유", "신경근육질환", "해당 부위 감염"],
        skinType: "무관"
      },
      
      pros: ["빠른 효과", "시술 간단", "다운타임 없음", "다양한 부위 적용"],
      cons: ["효과 일시적(3~6개월)", "반복 시술 필요", "과다 시술 시 부자연스러움"],
      
      safety: {
        commonSideEffects: ["멍", "붓기", "두통"],
        seriousSideEffects: ["눈꺼풀 처짐(드묾)", "비대칭", "삼킴곤란(목 시술 시)"],
        contraindications: ["임신/수유", "신경근육질환", "보툴리눔 알러지"],
        warnings: ["정품 확인", "적정 용량 중요"]
      },
      
      pricing: { range: "3~15만원/부위", average: "5만원/부위", factors: ["부위", "용량", "브랜드"] },
      
      comparison: {
        vs: { "필러": "보톡스=근육/주름, 필러=볼륨/채움" },
        bestWith: ["필러", "리프팅", "스킨부스터"]
      },
      
      tags: ["주름", "보톡스", "윤곽", "간편", "입문"]
    },

    // ===== 6. 필러 =====
    {
      id: "filler",
      name: "필러",
      nameEn: "Dermal Filler",
      brand: "Juvederm, Restylane 외 다수",
      category: "필러/볼륨",
      subcategory: "HA필러",
      
      mechanism: {
        simple: "히알루론산(HA)을 피부에 주입해 볼륨 채우고 주름 개선",
        detailed: "가교결합된 HA가 진피/피하층에서 볼륨 유지, 수분 끌어당겨 탄력 부여",
        keywords: ["히알루론산", "HA", "볼륨", "주름"]
      },
      
      effects: {
        primary: ["볼륨 채움", "팔자주름", "입술/코/턱 윤곽"],
        secondary: ["물광", "잔주름"],
        notFor: ["리프팅", "탄력", "색소"],
        onsetTime: "즉각 효과",
        duration: "6개월~2년 (제품따라)"
      },
      
      procedure: {
        duration: "15~30분",
        anesthesia: "마취크림 또는 리도카인 함유 제품",
        sessions: "1회",
        interval: "6~12개월",
        method: "주사/캐뉼라"
      },
      
      recovery: {
        painLevel: 2,
        painDescription: "따끔~찌릿",
        downtime: "1~5일",
        commonSideEffects: ["붓기", "멍", "뭉침"],
        recoveryTips: ["냉찜질", "심한 운동 3일 피하기"]
      },
      
      suitability: {
        idealAge: "20대~60대",
        bestFor: ["꺼진 볼/팔자", "입술 볼륨", "코/턱 라인", "애교살"],
        notRecommended: ["켈로이드", "자가면역질환", "시술부위 염증"],
        skinType: "무관"
      },
      
      pros: ["즉각 효과", "자연스러운 볼륨", "녹일 수 있음(HA)", "다양한 부위"],
      cons: ["일시적 효과", "멍/붓기", "비용 누적", "과시술 시 부자연스러움"],
      
      safety: {
        commonSideEffects: ["붓기", "멍", "뭉침"],
        seriousSideEffects: ["혈관폐색(매우 드묾)", "감염", "육아종"],
        contraindications: ["자가면역질환", "켈로이드", "시술부위 감염"],
        warnings: ["정품 확인", "혈관해부학 숙지된 의사"]
      },
      
      pricing: { range: "20~80만원/cc", average: "40만원/cc", factors: ["제품", "부위", "양"] },
      
      comparison: {
        vs: { "보톡스": "필러=볼륨, 보톡스=근육/주름" },
        bestWith: ["보톡스", "리프팅", "스킨부스터"]
      },
      
      tags: ["볼륨", "필러", "HA", "즉각효과", "윤곽"]
    },

    // ===== 7. 인모드 =====
    {
      id: "inmode",
      name: "인모드",
      nameEn: "InMode",
      brand: "InMode",
      category: "리프팅/타이트닝",
      subcategory: "RF",
      
      mechanism: {
        simple: "고주파(RF)로 지방 감소와 피부 탄력 동시에 개선",
        detailed: "RF가 피부 온도 43도 이하로 유지하며 지방세포 파괴 + 콜라겐 재생",
        keywords: ["RF", "고주파", "지방감소", "탄력"]
      },
      
      effects: {
        primary: ["지방 감소", "턱선 개선", "V라인"],
        secondary: ["탄력", "피부결"],
        notFor: ["볼륨", "색소", "깊은주름"],
        onsetTime: "즉각 + 1~3개월 점진",
        duration: "6개월~1년"
      },
      
      procedure: {
        duration: "30~60분",
        anesthesia: "대부분 불필요",
        sessions: "3~6회 권장",
        interval: "2~4주",
        modes: ["Forma(탄력)", "FX(지방감소)"]
      },
      
      recovery: {
        painLevel: 1.5,
        painDescription: "따뜻한 느낌, 거의 무통",
        downtime: "없음",
        commonSideEffects: ["일시적 홍반"],
        recoveryTips: ["바로 일상 가능"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["턱살/이중턱", "볼살", "지방+탄력 동시 원하는 분"],
        notRecommended: ["페이스메이커", "임산부", "금속 임플란트"],
        skinType: "모든 피부"
      },
      
      pros: ["무통증", "다운타임 없음", "지방+탄력 동시", "즉각 효과"],
      cons: ["여러 회 필요", "효과 제한적(심한 처짐X)"],
      
      safety: {
        commonSideEffects: ["홍반", "열감"],
        seriousSideEffects: ["화상(매우 드묾)"],
        contraindications: ["페이스메이커", "임신", "피부 염증"],
        warnings: ["온도 모니터링 중요"]
      },
      
      pricing: { range: "15~40만원/회", average: "25만원/회", factors: ["모드", "부위"] },
      
      comparison: {
        vs: { "슈링크": "인모드=지방+탄력, 슈링크=리프팅 위주" },
        bestWith: ["슈링크", "스킨부스터"]
      },
      
      tags: ["지방감소", "RF", "V라인", "무통증", "턱선"]
    },

    // ===== 8. 쥬베룩 =====
    {
      id: "juvelook",
      name: "쥬베룩",
      nameEn: "Juvelook",
      brand: "Huons",
      category: "스킨부스터",
      subcategory: "PDLLA",
      
      mechanism: {
        simple: "PDLLA 성분이 콜라겐 생성을 유도해 볼륨과 탄력 개선",
        detailed: "Poly-D,L-lactic acid가 진피층에서 콜라겐 합성 촉진, 점진적 볼륨 증가",
        keywords: ["PDLLA", "콜라겐", "볼륨", "스킨부스터"]
      },
      
      effects: {
        primary: ["콜라겐 재생", "볼륨 개선", "모공 축소"],
        secondary: ["탄력", "피부결", "잔주름"],
        notFor: ["즉각 볼륨", "색소"],
        onsetTime: "4~6주 후 서서히",
        duration: "1~2년"
      },
      
      procedure: {
        duration: "20~30분",
        anesthesia: "마취크림",
        sessions: "2~4회",
        interval: "3~4주",
        method: "미세주사"
      },
      
      recovery: {
        painLevel: 2.5,
        painDescription: "따끔거림",
        downtime: "1~3일",
        commonSideEffects: ["엠보싱", "붓기", "멍"],
        recoveryTips: ["마사지 금지", "3일간 사우나 피하기"]
      },
      
      suitability: {
        idealAge: "30대~50대",
        bestFor: ["콜라겐 저하", "모공", "볼륨 감소", "자연스러운 채움"],
        notRecommended: ["켈로이드", "자가면역질환", "시술부위 염증"],
        skinType: "모든 피부"
      },
      
      pros: ["자연스러운 볼륨", "콜라겐 생성", "효과 오래 지속", "K-뷰티"],
      cons: ["결절 부작용 가능", "효과 느리게 나타남", "여러 회 필요"],
      
      safety: {
        commonSideEffects: ["엠보싱", "멍", "붓기"],
        seriousSideEffects: ["결절(뭉침)", "육아종"],
        contraindications: ["켈로이드", "자가면역질환"],
        warnings: ["과주입 주의", "마사지 금지"]
      },
      
      pricing: { range: "15~40만원/회", average: "25만원/회", factors: ["용량", "부위"] },
      
      comparison: {
        vs: { "리쥬란": "쥬베룩=볼륨/콜라겐, 리쥬란=재생/탄력" },
        bestWith: ["리쥬란", "리프팅", "보톡스"]
      },
      
      tags: ["스킨부스터", "콜라겐", "PDLLA", "볼륨", "K-뷰티"]
    },

    // ===== 9. 피코토닝 =====
    {
      id: "pico-toning",
      name: "피코토닝",
      nameEn: "Pico Toning",
      brand: "다양 (Picosure, Picocare 등)",
      category: "색소/미백",
      subcategory: "피코레이저",
      
      mechanism: {
        simple: "피코초 레이저로 색소를 잘게 부숴 기미/색소 개선",
        detailed: "피코초(10^-12초) 펄스가 멜라닌을 미세 입자로 파쇄, 대식세포가 흡수/배출",
        keywords: ["피코레이저", "색소", "기미", "토닝"]
      },
      
      effects: {
        primary: ["기미", "잡티", "색소침착"],
        secondary: ["피부톤 균일", "모공", "피부결"],
        notFor: ["리프팅", "볼륨", "주름"],
        onsetTime: "3~5회 후 효과 뚜렷",
        duration: "유지관리 필요"
      },
      
      procedure: {
        duration: "15~30분",
        anesthesia: "대부분 불필요",
        sessions: "5~10회",
        interval: "2~4주",
        method: "레이저 조사"
      },
      
      recovery: {
        painLevel: 1.5,
        painDescription: "따끔거림",
        downtime: "없음~1일",
        commonSideEffects: ["홍반", "열감"],
        recoveryTips: ["자외선 차단 필수", "보습"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["기미", "잡티", "색소침착", "피부톤 불균일"],
        notRecommended: ["일광화상 직후", "광과민증", "임산부"],
        skinType: "모든 피부, 민감성 주의"
      },
      
      pros: ["다운타임 적음", "통증 적음", "점진적 개선", "기미에 효과적"],
      cons: ["여러 회 필요", "재발 가능", "자외선 주의"],
      
      safety: {
        commonSideEffects: ["홍반", "열감", "일시적 색소침착"],
        seriousSideEffects: ["과색소침착(드묾)", "저색소침착"],
        contraindications: ["광과민증", "활동성 헤르페스", "임신"],
        warnings: ["자외선 차단 철저"]
      },
      
      pricing: { range: "5~15만원/회", average: "10만원/회", factors: ["장비", "부위"] },
      
      comparison: {
        vs: { "레이저토닝": "피코가 더 짧은 펄스로 효과적, 약간 비쌈" },
        bestWith: ["미백주사", "스킨부스터"]
      },
      
      tags: ["색소", "기미", "피코레이저", "미백", "토닝"]
    },

    // ===== 10. 레이저토닝 =====
    {
      id: "laser-toning",
      name: "레이저토닝",
      nameEn: "Laser Toning",
      brand: "다양 (Spectra, Helios 등)",
      category: "색소/미백",
      subcategory: "Nd:YAG",
      
      mechanism: {
        simple: "1064nm 레이저로 색소 파괴해 피부톤 개선",
        detailed: "Nd:YAG 레이저가 멜라닌에 선택적으로 작용, 색소 파쇄 및 배출 유도",
        keywords: ["레이저토닝", "색소", "1064nm", "Nd:YAG"]
      },
      
      effects: {
        primary: ["피부톤 개선", "잡티", "색소침착"],
        secondary: ["모공", "피부결"],
        notFor: ["깊은 기미", "리프팅", "볼륨"],
        onsetTime: "5~10회 후 효과",
        duration: "유지관리 필요"
      },
      
      procedure: {
        duration: "10~20분",
        anesthesia: "불필요",
        sessions: "10~20회",
        interval: "1~2주",
        method: "레이저 조사"
      },
      
      recovery: {
        painLevel: 1,
        painDescription: "거의 통증 없음",
        downtime: "없음",
        commonSideEffects: ["일시적 홍반"],
        recoveryTips: ["자외선 차단"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["피부톤 칙칙함", "잡티", "가벼운 색소", "관리 목적"],
        notRecommended: ["광과민증", "임산부"],
        skinType: "모든 피부"
      },
      
      pros: ["저렴함", "다운타임 없음", "통증 없음", "점심시간 시술"],
      cons: ["여러 회 필요", "효과 느림", "깊은 기미는 한계"],
      
      safety: {
        commonSideEffects: ["홍반"],
        seriousSideEffects: ["오히려 색소 진해짐(드묾)"],
        contraindications: ["광과민증", "피부 염증"],
        warnings: ["자외선 차단 필수"]
      },
      
      pricing: { range: "3~8만원/회", average: "5만원/회", factors: ["장비", "횟수"] },
      
      comparison: {
        vs: { "피코토닝": "피코가 더 효과적이지만 비쌈" },
        bestWith: ["스킨부스터", "필링"]
      },
      
      tags: ["색소", "토닝", "미백", "저렴", "관리용"]
    },

    // ===== 11. 프락셀 =====
    {
      id: "fraxel",
      name: "프락셀",
      nameEn: "Fraxel",
      brand: "Solta Medical",
      category: "흉터/모공",
      subcategory: "프락셔널",
      
      mechanism: {
        simple: "레이저로 피부에 미세 상처 만들어 재생 유도",
        detailed: "프락셔널 레이저가 미세 치료 영역(MTZ) 형성, 콜라겐 리모델링 및 새 피부 재생",
        keywords: ["프락셔널", "레이저", "재생", "흉터"]
      },
      
      effects: {
        primary: ["흉터 개선", "모공", "피부결"],
        secondary: ["잔주름", "색소침착"],
        notFor: ["리프팅", "볼륨"],
        onsetTime: "2~3회 후 효과",
        duration: "영구적 개선"
      },
      
      procedure: {
        duration: "30~60분",
        anesthesia: "마취크림 필수",
        sessions: "3~5회",
        interval: "4~8주",
        method: "레이저"
      },
      
      recovery: {
        painLevel: 3,
        painDescription: "따끔~화끈거림",
        downtime: "3~7일",
        commonSideEffects: ["홍반", "각질", "붓기"],
        recoveryTips: ["보습 철저", "자외선 차단", "각질 뜯지 않기"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["여드름 흉터", "모공", "피부결 울퉁불퉁", "잔주름"],
        notRecommended: ["켈로이드", "활동성 여드름", "임산부"],
        skinType: "모든 피부, 어두운 피부 주의"
      },
      
      pros: ["흉터에 효과적", "영구적 개선", "검증된 장비"],
      cons: ["다운타임 있음", "통증", "여러 회 필요", "비용"],
      
      safety: {
        commonSideEffects: ["홍반", "각질", "붓기", "색소침착"],
        seriousSideEffects: ["흉터 악화", "감염"],
        contraindications: ["켈로이드", "활동성 피부질환"],
        warnings: ["자외선 차단 필수"]
      },
      
      pricing: { range: "20~50만원/회", average: "35만원/회", factors: ["부위", "강도"] },
      
      comparison: {
        vs: { "MRF(스카펫 등)": "프락셀=레이저, MRF=RF+니들로 다운타임 더 적음" },
        bestWith: ["스킨부스터", "필링"]
      },
      
      tags: ["흉터", "모공", "프락셔널", "재생", "피부결"]
    },

    // ===== 12. 스카펫/포텐자 =====
    {
      id: "scarlet-potenza",
      name: "스카펫/포텐자",
      nameEn: "Scarlet/Potenza",
      brand: "Viol/Cynosure",
      category: "흉터/모공",
      subcategory: "MRF",
      
      mechanism: {
        simple: "마이크로니들 + RF로 흉터/모공 개선",
        detailed: "미세바늘이 진피층까지 침투해 RF 에너지 전달, 콜라겐 재생 유도",
        keywords: ["MRF", "마이크로니들", "RF", "흉터"]
      },
      
      effects: {
        primary: ["흉터", "모공", "탄력"],
        secondary: ["잔주름", "피부결"],
        notFor: ["리프팅", "색소"],
        onsetTime: "2~4주 후 효과 시작",
        duration: "1년 이상"
      },
      
      procedure: {
        duration: "30~60분",
        anesthesia: "마취크림 필수",
        sessions: "3~5회",
        interval: "4~6주",
        method: "MRF"
      },
      
      recovery: {
        painLevel: 2.5,
        painDescription: "따끔거림",
        downtime: "2~5일",
        commonSideEffects: ["홍반", "붓기", "미세출혈"],
        recoveryTips: ["보습", "자외선 차단"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["여드름 흉터", "모공", "탄력 저하", "프락셀 대안"],
        notRecommended: ["켈로이드", "활동성 여드름", "금속 임플란트"],
        skinType: "모든 피부"
      },
      
      pros: ["프락셀보다 다운타임 적음", "모든 피부톤 가능", "탄력도 개선"],
      cons: ["여러 회 필요", "통증", "비용"],
      
      safety: {
        commonSideEffects: ["홍반", "붓기", "미세출혈"],
        seriousSideEffects: ["감염", "흉터 악화"],
        contraindications: ["켈로이드", "금속 임플란트", "혈액응고장애"],
        warnings: ["위생 중요"]
      },
      
      pricing: { range: "25~60만원/회", average: "40만원/회", factors: ["장비", "부위"] },
      
      comparison: {
        vs: { "프락셀": "MRF=다운타임 적음, 프락셀=더 공격적" },
        bestWith: ["스킨부스터", "엑소좀"]
      },
      
      tags: ["흉터", "모공", "MRF", "탄력", "재생"]
    },

    // ===== 13. 물광주사 =====
    {
      id: "skinbooster-ha",
      name: "물광주사",
      nameEn: "Skin Booster",
      brand: "Restylane, Belotero 등",
      category: "스킨부스터",
      subcategory: "HA",
      
      mechanism: {
        simple: "히알루론산을 피부 얕은 층에 주입해 수분과 윤기 공급",
        detailed: "비가교 또는 저가교 HA가 진피층에서 수분 끌어당겨 피부 광채 증가",
        keywords: ["HA", "히알루론산", "보습", "물광"]
      },
      
      effects: {
        primary: ["보습", "윤기", "물광 피부"],
        secondary: ["잔주름", "피부결"],
        notFor: ["리프팅", "볼륨", "색소"],
        onsetTime: "즉각~1주",
        duration: "3~6개월"
      },
      
      procedure: {
        duration: "20~30분",
        anesthesia: "마취크림",
        sessions: "2~3회",
        interval: "2~4주",
        method: "미세주사/기계주입"
      },
      
      recovery: {
        painLevel: 2,
        painDescription: "따끔",
        downtime: "1~3일",
        commonSideEffects: ["엠보싱", "붓기", "멍"],
        recoveryTips: ["엠보싱 1~2일 내 흡수"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["건조함", "칙칙함", "피부톤", "특별한 날 전"],
        notRecommended: ["활동성 피부염", "HA 알러지"],
        skinType: "모든 피부, 특히 건성"
      },
      
      pros: ["즉각 윤기", "안전함", "간편"],
      cons: ["효과 짧음", "엠보싱 티남", "비용 누적"],
      
      safety: {
        commonSideEffects: ["엠보싱", "멍", "붓기"],
        seriousSideEffects: ["알러지(드묾)", "감염"],
        contraindications: ["HA 알러지", "피부 감염"],
        warnings: ["정품 확인"]
      },
      
      pricing: { range: "10~30만원/회", average: "20만원/회", factors: ["제품", "양"] },
      
      comparison: {
        vs: { "리쥬란": "물광=즉각 보습, 리쥬란=근본 재생" },
        bestWith: ["리쥬란", "리프팅"]
      },
      
      tags: ["물광", "보습", "HA", "윤기", "입문"]
    },

    // ===== 14. 스킨보톡스 =====
    {
      id: "skin-botox",
      name: "스킨보톡스",
      nameEn: "Skin Botox",
      brand: "다양",
      category: "주름/보톡스",
      subcategory: "보톡스",
      
      mechanism: {
        simple: "보톡스를 피부 얕게 주입해 모공과 피지 개선",
        detailed: "희석된 보툴리눔톡신이 피지선과 입모근에 작용, 모공 축소 및 번들거림 감소",
        keywords: ["보톡스", "모공", "피지", "광채"]
      },
      
      effects: {
        primary: ["모공 축소", "피지 조절", "피부결"],
        secondary: ["잔주름", "윤기"],
        notFor: ["리프팅", "볼륨", "색소"],
        onsetTime: "1~2주",
        duration: "3~4개월"
      },
      
      procedure: {
        duration: "15~20분",
        anesthesia: "마취크림",
        sessions: "1회",
        interval: "3~4개월",
        method: "미세주사"
      },
      
      recovery: {
        painLevel: 1.5,
        painDescription: "따끔",
        downtime: "없음~1일",
        commonSideEffects: ["주사자국", "미세 붓기"],
        recoveryTips: ["당일 세안 가능"]
      },
      
      suitability: {
        idealAge: "20대~40대",
        bestFor: ["넓은 모공", "지성 피부", "번들거림", "피부결 개선"],
        notRecommended: ["건성 피부", "보툴리눔 알러지"],
        skinType: "지성/복합성에 특히 효과"
      },
      
      pros: ["모공에 효과적", "다운타임 없음", "간편"],
      cons: ["효과 짧음", "반복 필요"],
      
      safety: {
        commonSideEffects: ["주사자국"],
        seriousSideEffects: ["과도한 건조"],
        contraindications: ["보툴리눔 알러지", "임산부"],
        warnings: ["적정 농도 중요"]
      },
      
      pricing: { range: "10~25만원/회", average: "15만원/회", factors: ["부위", "양"] },
      
      comparison: {
        vs: { "일반 보톡스": "스킨보톡스=모공/피지, 일반=주름/윤곽" },
        bestWith: ["물광주사", "리쥬란"]
      },
      
      tags: ["모공", "피지", "보톡스", "피부결", "지성피부"]
    },

    // ===== 15. 엑소좀 =====
    {
      id: "exosome",
      name: "엑소좀",
      nameEn: "Exosome",
      brand: "ExoCoBio(ASCE+) 등",
      category: "스킨부스터",
      subcategory: "엑소좀",
      
      mechanism: {
        simple: "줄기세포 유래 엑소좀으로 피부 재생 촉진",
        detailed: "줄기세포에서 분비된 나노 소포체가 성장인자/단백질 전달, 세포 커뮤니케이션 활성화",
        keywords: ["엑소좀", "줄기세포", "재생", "성장인자"]
      },
      
      effects: {
        primary: ["피부 재생", "항염", "트러블 진정"],
        secondary: ["탄력", "피부결", "홍반"],
        notFor: ["리프팅", "볼륨", "색소 직접 치료"],
        onsetTime: "2~4주",
        duration: "3~6개월"
      },
      
      procedure: {
        duration: "20~30분",
        anesthesia: "마취크림",
        sessions: "3~5회",
        interval: "2~4주",
        method: "미세주사/MTS"
      },
      
      recovery: {
        painLevel: 2,
        painDescription: "따끔",
        downtime: "1~2일",
        commonSideEffects: ["홍반", "붓기"],
        recoveryTips: ["보습", "자극 피하기"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["민감성", "트러블 피부", "시술 후 재생", "전반적 피부개선"],
        notRecommended: ["자가면역질환", "악성종양 병력"],
        skinType: "모든 피부, 특히 민감성/트러블"
      },
      
      pros: ["강력한 재생", "민감성에도 가능", "트러블 진정", "다른 시술 후 회복"],
      cons: ["비용", "여러 회 필요", "효과 개인차"],
      
      safety: {
        commonSideEffects: ["홍반", "붓기"],
        seriousSideEffects: ["알러지(매우 드묾)"],
        contraindications: ["악성종양", "자가면역질환"],
        warnings: ["제품 품질 확인"]
      },
      
      pricing: { range: "20~50만원/회", average: "30만원/회", factors: ["제품", "농도"] },
      
      comparison: {
        vs: { "리쥬란": "엑소좀=재생/항염 더 강력, 리쥬란=탄력" },
        bestWith: ["MRF", "리프팅", "레이저 후"]
      },
      
      tags: ["엑소좀", "재생", "줄기세포", "민감성", "트러블"]
    },

    // ===== 16. 제모 레이저 =====
    {
      id: "hair-removal",
      name: "레이저 제모",
      nameEn: "Laser Hair Removal",
      brand: "젠틀맥스, 클라리티 등",
      category: "제모",
      subcategory: "레이저",
      
      mechanism: {
        simple: "레이저가 모낭의 멜라닌 흡수해 영구적으로 털 감소",
        detailed: "755nm/1064nm 레이저가 모낭에 흡수되어 열 발생, 성장기 모낭 파괴",
        keywords: ["레이저제모", "모낭", "영구제모", "755nm"]
      },
      
      effects: {
        primary: ["영구적 털 감소", "모낭 파괴"],
        secondary: ["피부결 개선", "모공 축소"],
        notFor: ["흰털", "금색 털"],
        onsetTime: "2~3회 후 감소 느낌",
        duration: "영구적(80~90% 감모)"
      },
      
      procedure: {
        duration: "부위별 10~60분",
        anesthesia: "대부분 불필요",
        sessions: "6~10회",
        interval: "4~6주(얼굴), 6~8주(바디)",
        method: "레이저"
      },
      
      recovery: {
        painLevel: 2,
        painDescription: "고무줄로 튕기는 느낌",
        downtime: "없음",
        commonSideEffects: ["홍반", "열감"],
        recoveryTips: ["자외선 차단", "보습"]
      },
      
      suitability: {
        idealAge: "10대 후반~50대",
        bestFor: ["짙은 털", "면도 귀찮음", "매끄러운 피부 원함"],
        notRecommended: ["흰털/금털", "피부질환", "일광화상 직후"],
        skinType: "모든 피부톤(장비 선택)"
      },
      
      pros: ["영구적 효과", "시간 절약", "매끄러움", "모공 개선"],
      cons: ["여러 회 필요", "비용", "흰털 불가"],
      
      safety: {
        commonSideEffects: ["홍반", "열감", "일시적 부종"],
        seriousSideEffects: ["화상", "색소침착(드묾)"],
        contraindications: ["광과민증", "활동성 피부질환"],
        warnings: ["시술 전 왁싱/뽑기 금지"]
      },
      
      pricing: { range: "1~20만원/부위/회", average: "5만원/부위/회", factors: ["부위", "횟수"] },
      
      comparison: {
        vs: { "IPL제모": "레이저가 더 효과적이지만 비쌈" },
        bestWith: ["제모 후 스킨케어"]
      },
      
      tags: ["제모", "영구제모", "레이저", "매끄러움"]
    },

    // ===== 17. 실리프팅 =====
    {
      id: "thread-lift",
      name: "실리프팅",
      nameEn: "Thread Lift",
      brand: "PDO, PCL, PLLA 다양",
      category: "리프팅/타이트닝",
      subcategory: "실리프팅",
      
      mechanism: {
        simple: "녹는 실을 피부 아래 삽입해 즉각적으로 당겨 올림",
        detailed: "코그(가시) 달린 실이 조직을 물리적으로 거상, 이후 콜라겐 생성 유도",
        keywords: ["실리프팅", "PDO", "코그", "거상"]
      },
      
      effects: {
        primary: ["즉각 리프팅", "턱선", "볼처짐"],
        secondary: ["콜라겐 재생"],
        notFor: ["탄력만 원하는 경우", "볼륨"],
        onsetTime: "즉각 효과",
        duration: "1~2년 (실 종류에 따라)"
      },
      
      procedure: {
        duration: "30~60분",
        anesthesia: "국소마취",
        sessions: "1회",
        interval: "1~2년",
        method: "실 삽입"
      },
      
      recovery: {
        painLevel: 2.5,
        painDescription: "뻐근함, 당김",
        downtime: "3~7일",
        commonSideEffects: ["붓기", "멍", "당김감"],
        recoveryTips: ["입 크게 안벌리기 2주", "격한 표정 자제"]
      },
      
      suitability: {
        idealAge: "30대~50대",
        bestFor: ["즉각 효과 원하는 분", "중등도 처짐", "수술 안하고 리프팅"],
        notRecommended: ["피부 매우 얇은 분", "켈로이드", "심한 처짐"],
        skinType: "대부분 가능"
      },
      
      pros: ["즉각 효과", "수술 대비 간단", "회복 빠름"],
      cons: ["효과 제한적", "부작용 가능", "비용"],
      
      safety: {
        commonSideEffects: ["붓기", "멍", "당김", "뻐근함"],
        seriousSideEffects: ["실 튀어나옴", "감염", "비대칭"],
        contraindications: ["켈로이드", "자가면역질환", "혈액응고장애"],
        warnings: ["숙련된 시술자 중요"]
      },
      
      pricing: { range: "50~200만원", average: "100만원", factors: ["실 종류", "개수"] },
      
      comparison: {
        vs: { "울쎄라": "실=즉각 물리적 거상, 울쎄라=점진적 콜라겐" },
        bestWith: ["필러", "보톡스"]
      },
      
      tags: ["실리프팅", "즉각효과", "리프팅", "거상"]
    },

    // ===== 18. 여드름 치료 =====
    {
      id: "acne-treatment",
      name: "여드름 치료",
      nameEn: "Acne Treatment",
      brand: "아큐네, PDT 등",
      category: "여드름/트러블",
      subcategory: "복합치료",
      
      mechanism: {
        simple: "레이저/PDT/압출 복합으로 여드름 원인 치료",
        detailed: "PDT(광역동치료)는 피지선 축소, 레이저는 살균/염증 완화, 압출은 즉각 배출",
        keywords: ["여드름", "PDT", "피지", "염증"]
      },
      
      effects: {
        primary: ["여드름 개선", "피지 조절", "염증 완화"],
        secondary: ["모공", "흉터 예방"],
        notFor: ["흉터 치료(별도)", "리프팅"],
        onsetTime: "2~4주 후 개선",
        duration: "유지관리 필요"
      },
      
      procedure: {
        duration: "30~60분",
        anesthesia: "마취크림(PDT시)",
        sessions: "5~10회",
        interval: "1~2주",
        method: "복합치료"
      },
      
      recovery: {
        painLevel: 2,
        painDescription: "얼얼함, 화끈",
        downtime: "1~3일",
        commonSideEffects: ["홍반", "각질", "일시적 악화"],
        recoveryTips: ["자외선 차단", "보습", "손대지 않기"]
      },
      
      suitability: {
        idealAge: "10대~30대",
        bestFor: ["활동성 여드름", "반복되는 트러블", "피지 과다"],
        notRecommended: ["광과민증", "임산부(일부 치료)"],
        skinType: "지성/여드름 피부"
      },
      
      pros: ["근본 원인 치료", "재발 감소", "흉터 예방"],
      cons: ["여러 회 필요", "일시적 악화 가능", "비용 누적"],
      
      safety: {
        commonSideEffects: ["홍반", "각질", "일시적 여드름 악화"],
        seriousSideEffects: ["색소침착", "화상(드묾)"],
        contraindications: ["광과민증", "PDT 과민"],
        warnings: ["짜지 않기", "처방약 병행"]
      },
      
      pricing: { range: "5~20만원/회", average: "10만원/회", factors: ["치료 종류", "정도"] },
      
      comparison: {
        vs: { "스킨케어만": "시술이 더 빠르고 확실한 효과" },
        bestWith: ["스킨케어 처방", "스킨부스터(안정 후)"]
      },
      
      tags: ["여드름", "트러블", "피지", "PDT", "관리"]
    },

    // ===== 19. IPL =====
    {
      id: "ipl",
      name: "IPL",
      nameEn: "Intense Pulsed Light",
      brand: "루메니스, M22 등",
      category: "색소/미백",
      subcategory: "IPL",
      
      mechanism: {
        simple: "여러 파장의 빛으로 색소/홍반/탄력 복합 개선",
        detailed: "광대역 빛이 멜라닌/헤모글로빈에 흡수되어 색소 파괴 및 혈관 응고",
        keywords: ["IPL", "광선치료", "색소", "홍반"]
      },
      
      effects: {
        primary: ["잡티", "홍반", "안면홍조"],
        secondary: ["피부톤", "모세혈관", "탄력"],
        notFor: ["깊은 기미", "리프팅", "볼륨"],
        onsetTime: "1~2주 후(잡티 딱지 탈락)",
        duration: "유지관리 필요"
      },
      
      procedure: {
        duration: "15~30분",
        anesthesia: "불필요~마취크림",
        sessions: "3~5회",
        interval: "3~4주",
        method: "광조사"
      },
      
      recovery: {
        painLevel: 1.5,
        painDescription: "고무줄 튕김",
        downtime: "없음~3일",
        commonSideEffects: ["홍반", "잡티 진해짐(→탈락)", "딱지"],
        recoveryTips: ["자외선 차단 필수", "딱지 뜯지 않기"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["잡티", "홍반/홍조", "피부톤 개선", "모세혈관"],
        notRecommended: ["어두운 피부톤", "일광화상 직후", "광과민증"],
        skinType: "밝은 피부에 효과적"
      },
      
      pros: ["다목적", "다운타임 적음", "통증 적음", "가격 합리적"],
      cons: ["깊은 색소 한계", "여러 회 필요", "일시적 잡티 진해짐"],
      
      safety: {
        commonSideEffects: ["홍반", "딱지", "일시적 색소침착"],
        seriousSideEffects: ["화상", "색소탈실"],
        contraindications: ["광과민증", "최근 태닝"],
        warnings: ["자외선 차단 철저"]
      },
      
      pricing: { range: "8~20만원/회", average: "12만원/회", factors: ["장비", "부위"] },
      
      comparison: {
        vs: { "레이저토닝": "IPL=잡티/홍반에 강함, 토닝=깊은 색소" },
        bestWith: ["스킨부스터", "보습관리"]
      },
      
      tags: ["IPL", "잡티", "홍반", "복합개선", "관리"]
    },

    // ===== 20. 지방분해 주사 =====
    {
      id: "lipolysis-injection",
      name: "지방분해주사",
      nameEn: "Lipolysis Injection",
      brand: "카이벨라, PPC 등",
      category: "바디/지방",
      subcategory: "지방분해",
      
      mechanism: {
        simple: "약물 주입으로 지방세포 파괴해 국소 지방 감소",
        detailed: "디옥시콜산(카이벨라) 또는 PPC가 지방세포막 용해, 대사 배출",
        keywords: ["지방분해", "카이벨라", "이중턱", "윤곽"]
      },
      
      effects: {
        primary: ["이중턱 감소", "턱선 개선", "국소 지방 감소"],
        secondary: ["윤곽 개선"],
        notFor: ["전신 다이어트", "탄력(별도 시술)"],
        onsetTime: "4~6주 후 효과",
        duration: "영구적(지방세포 파괴)"
      },
      
      procedure: {
        duration: "15~30분",
        anesthesia: "마취크림/얼음찜질",
        sessions: "2~4회",
        interval: "4~6주",
        method: "주사"
      },
      
      recovery: {
        painLevel: 2.5,
        painDescription: "화끈거림, 붓기",
        downtime: "3~7일",
        commonSideEffects: ["붓기(심함)", "멍", "뭉침", "저림"],
        recoveryTips: ["냉찜질", "2~3일 심한 붓기 정상"]
      },
      
      suitability: {
        idealAge: "20대~50대",
        bestFor: ["이중턱", "볼살", "국소 지방", "운동해도 안빠지는 곳"],
        notRecommended: ["삼킴곤란", "시술부위 감염", "임산부"],
        skinType: "무관"
      },
      
      pros: ["수술 없이 지방 감소", "영구적 효과", "국소 타겟"],
      cons: ["붓기 심함", "통증", "여러 회 필요", "비용"],
      
      safety: {
        commonSideEffects: ["붓기", "멍", "통증", "저림", "뭉침"],
        seriousSideEffects: ["신경손상(일시적)", "피부괴사(매우 드묾)"],
        contraindications: ["삼킴곤란", "감염", "응고장애"],
        warnings: ["FDA 승인 제품(카이벨라) 권장"]
      },
      
      pricing: { range: "20~50만원/회", average: "35만원/회", factors: ["부위", "양"] },
      
      comparison: {
        vs: { "쿨스컬프팅": "주사=더 빠름/붓기 많음, 쿨스컬프팅=무통증/느림" },
        bestWith: ["리프팅(탄력 보완)", "인모드"]
      },
      
      tags: ["지방분해", "이중턱", "윤곽", "카이벨라", "국소지방"]
    }
  ]
};

// 유틸리티 함수
function getTreatmentById(id) {
  return DB_EXTENDED.treatments.find(t => t.id === id);
}

function getTreatmentsByCategory(category) {
  return DB_EXTENDED.treatments.filter(t => t.category === category);
}

function getTreatmentsByTag(tag) {
  return DB_EXTENDED.treatments.filter(t => t.tags.includes(tag));
}

function searchTreatments(query) {
  const q = query.toLowerCase();
  return DB_EXTENDED.treatments.filter(t => 
    t.name.includes(q) || 
    t.nameEn.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q)) ||
    t.mechanism.keywords.some(k => k.toLowerCase().includes(q))
  );
}

console.log("DB_EXTENDED 로드 완료:", DB_EXTENDED.treatments.length, "개 시술");

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DB_EXTENDED, getTreatmentById, getTreatmentsByCategory, getTreatmentsByTag, searchTreatments };
}
