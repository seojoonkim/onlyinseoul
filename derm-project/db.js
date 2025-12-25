const DB = {
  categories: [
    {
      id: "lifting",
      name: "리프팅/타이트닝",
      subcategories: [
        {
          id: "hifu",
          name: "HIFU",
          treatments: [
            { name: "울쎄라", brand: "Merz", mechanism: "고강도 집속 초음파로 SMAS층 열응고, 콜라겐 재생", target: ["처진피부", "턱선", "주름"], duration: "1~2년", downtime: "없음~경미", pain: 3.5, sessions: "연 1회", price: "100~300만원", note: "FDA승인" },
            { name: "슈링크 유니버스", brand: "Classys", mechanism: "카트리지 교체형 HIFU, 다양한 깊이 조사", target: ["리프팅", "턱선", "탄력"], duration: "6개월~1년", downtime: "거의 없음", pain: 2.5, sessions: "3~6개월 간격", price: "30~80만원", note: "국산인기" },
            { name: "더블로 골드", brand: "Hironic", mechanism: "듀얼 HIFU로 두 겹 열응고점 생성", target: ["리프팅", "탄력", "팔자"], duration: "6개월~1년", downtime: "거의 없음", pain: 2.5, sessions: "3~6개월 간격", price: "30~70만원", note: "" },
            { name: "울트라포머 MPT", brand: "Classys", mechanism: "마이크로 펄스로 균일한 열응고, 통증 최소화", target: ["리프팅", "탄력", "주름"], duration: "6개월~1년", downtime: "거의 없음", pain: 2, sessions: "3~6개월 간격", price: "30~80만원", note: "" },
            { name: "텐써라", brand: "Jeisys", mechanism: "선형 집속 초음파로 넓은 면적 동시 조사", target: ["리프팅", "탄력"], duration: "6개월~1년", downtime: "거의 없음", pain: 2, sessions: "3~6개월 간격", price: "30~60만원", note: "" },
            { name: "리프테라", brand: "Classys", mechanism: "펜타입 핸드피스로 섬세한 부위 케어", target: ["눈가", "입가", "섬세부위"], duration: "6개월~1년", downtime: "거의 없음", pain: 2, sessions: "3~6개월 간격", price: "30~60만원", note: "" },
            { name: "소노퀸", brand: "뉴선메디", mechanism: "저출력 HIFU로 반복 시술", target: ["탄력", "피부결"], duration: "3~6개월", downtime: "없음", pain: 1.5, sessions: "2~4주 간격 3~5회", price: "10~30만원", note: "저자극" },
            { name: "울쎄라피 프라임", brand: "Merz", mechanism: "업그레이드 MFU-V, 8mm 깊이 초음파, 실시간 영상", target: ["리프팅", "탄력", "이중턱"], duration: "1~2년", downtime: "없음", pain: 2.5, sessions: "연 1회", price: "150~350만원", note: "2025 신모델" },
            { name: "소프웨이브", brand: "Sofwave", mechanism: "12MHz SUPERB기술, 1.5mm 주름 타겟", target: ["잔주름", "깊은주름", "탄력"], duration: "6개월~1년", downtime: "없음", pain: 2, sessions: "1~2회", price: "50~100만원", note: "주름특화" }
          ]
        },
        {
          id: "rf",
          name: "RF (고주파)",
          treatments: [
            { name: "써마지 FLX", brand: "Solta Medical", mechanism: "단극성 고주파로 진피 전체 가열, AccuREP 기술", target: ["탄력", "주름", "모공"], duration: "1~2년", downtime: "없음", pain: 2.5, sessions: "연 1회", price: "150~400만원", note: "4세대" },
            { name: "써마지 CPT", brand: "Solta Medical", mechanism: "컴포트 펄스로 통증 감소", target: ["탄력", "주름"], duration: "1~2년", downtime: "없음", pain: 2, sessions: "1회", price: "100~250만원", note: "3세대" },
            { name: "올리지오", brand: "Solta Medical", mechanism: "차세대 단극성 RF", target: ["탄력", "리프팅", "주름"], duration: "1~2년", downtime: "없음", pain: 2, sessions: "1회", price: "150~350만원", note: "최신" },
            { name: "올리지오X", brand: "원텍", mechanism: "업그레이드 출력+쿨링, 모노폴라 RF", target: ["탄력", "리프팅", "주름"], duration: "1~2년", downtime: "없음", pain: 2, sessions: "1회", price: "100~200만원", note: "2024업그레이드" },
            { name: "올리지오 키스", brand: "원텍", mechanism: "RF+HIFU 결합, 맞춤형 시술", target: ["탄력", "리프팅", "윤곽"], duration: "1~2년", downtime: "없음", pain: 2.5, sessions: "1회", price: "150~300만원", note: "RF+HIFU복합" },
            { name: "튠페이스", brand: "루트로닉", mechanism: "양극성 RF + 마사지", target: ["탄력", "부기", "림프순환"], duration: "시술 직후~3개월", downtime: "없음", pain: 1, sessions: "주 1~2회, 10회", price: "10~20만원/회", note: "관리형" },
            { name: "버츄 RF", brand: "Solta Medical", mechanism: "마이크로니들 RF로 진피 직접 자극", target: ["흉터", "모공", "탄력"], duration: "1년 이상", downtime: "2~5일", pain: 3, sessions: "3~5회", price: "30~50만원/회", note: "" },
            { name: "세르프", brand: "Cynosure/루트로닉", mechanism: "6.78MHz+2MHz 듀얼 고주파, 진피+지방층 동시", target: ["리프팅", "타이트닝", "턱선"], duration: "6개월~1년", downtime: "없음", pain: 1.5, sessions: "1회 600샷", price: "80~150만원", note: "2024신장비 마취불필요" },
            { name: "볼뉴머", brand: "Classys", mechanism: "6.78MHz 단극성 고주파, 써마지 대안", target: ["탄력", "주름", "리프팅"], duration: "1~2년", downtime: "없음", pain: 2, sessions: "연1회", price: "80~150만원", note: "국산써마지대안" },
            { name: "덴써티", brand: "Lutronic", mechanism: "단극성+양극성 RF 복합", target: ["탄력", "리프팅", "피부결"], duration: "6개월~1년", downtime: "없음", pain: 2, sessions: "3~6개월간격", price: "50~100만원", note: "이영애모델" },
            { name: "쿨페이즈", brand: "Classys", mechanism: "모노폴라RF + 실시간 냉각", target: ["탄력", "리프팅", "주름"], duration: "6개월~1년", downtime: "없음", pain: 1.5, sessions: "1회", price: "60~120만원", note: "하지원모델" }
          ]
        },
        {
          id: "inmode",
          name: "인모드",
          treatments: [
            { name: "인모드 FX", brand: "InMode", mechanism: "프랙셔널 RF로 미세 열점 생성", target: ["탄력", "주름", "모공"], duration: "1년 이상", downtime: "3~7일", pain: 3, sessions: "3~4회", price: "50~100만원/회", note: "" },
            { name: "인모드 포르마", brand: "InMode", mechanism: "비침습 RF로 43도까지 균일 가열", target: ["탄력", "리프팅"], duration: "6개월", downtime: "없음", pain: 1, sessions: "6~8회", price: "20~40만원/회", note: "무통증" },
            { name: "모피어스8", brand: "InMode", mechanism: "마이크로니들 RF, 최대 8mm 깊이", target: ["탄력", "흉터", "모공", "튼살"], duration: "1년 이상", downtime: "3~7일", pain: 3.5, sessions: "3~4회", price: "50~100만원/회", note: "깊은침투" },
            { name: "이보크", brand: "InMode", mechanism: "핸즈프리 페이셜 RF", target: ["턱선", "볼살", "이중턱"], duration: "6개월~1년", downtime: "없음", pain: 1.5, sessions: "6~8회", price: "30~50만원/회", note: "핸즈프리" }
          ]
        },
        {
          id: "needlerf",
          name: "니들RF/MRF",
          treatments: [
            { name: "포텐자", brand: "Cynosure", mechanism: "4가지 팁 교체, 펄스/CW 모드 전환", target: ["모공", "흉터", "탄력", "홍조"], duration: "1년 이상", downtime: "2~5일", pain: 3, sessions: "3~5회", price: "40~80만원/회", note: "다기능" },
            { name: "시크릿 RF", brand: "Cutera", mechanism: "64개 마이크로니들, 반절연침", target: ["주름", "탄력", "흉터"], duration: "1년 이상", downtime: "2~5일", pain: 3, sessions: "3~4회", price: "40~70만원/회", note: "" },
            { name: "인트라셀", brand: "Jeisys", mechanism: "49개 절연침으로 진피 선택적 RF", target: ["모공", "여드름흉터", "탄력"], duration: "1년 이상", downtime: "2~5일", pain: 3, sessions: "3~5회", price: "30~60만원/회", note: "" },
            { name: "스칼렛S", brand: "Viol", mechanism: "니들 RF + 공기압 기술", target: ["탄력", "모공", "흉터"], duration: "1년 이상", downtime: "2~5일", pain: 3, sessions: "3~4회", price: "30~60만원/회", note: "" },
            { name: "실펌X", brand: "Viol", mechanism: "펄스형/CW RF 선택, 홍조 특화", target: ["홍조", "색소", "탄력", "모공"], duration: "1년 이상", downtime: "2~5일", pain: 2.5, sessions: "3~5회", price: "30~60만원/회", note: "홍조특화" },
            { name: "아그네스", brand: "AGNES", mechanism: "절연침으로 피지선 선택적 파괴", target: ["여드름", "피지과다", "한관종"], duration: "영구적", downtime: "1~3일", pain: 2.5, sessions: "3~5회", price: "20~50만원/회", note: "피지선파괴" }
          ]
        },
        {
          id: "thread",
          name: "실리프팅",
          treatments: [
            { name: "PDO 실 (모노)", brand: "다양", mechanism: "녹는실 삽입으로 콜라겐 생성 유도", target: ["잔주름", "탄력"], duration: "6~12개월", downtime: "1~3일", pain: 2.5, sessions: "1~2회", price: "30~60만원", note: "기본실" },
            { name: "PDO 코그실", brand: "다양", mechanism: "가시 있는 실로 물리적 리프팅", target: ["처진피부", "팔자", "턱선"], duration: "1~2년", downtime: "3~7일", pain: 3, sessions: "1회", price: "80~200만원", note: "강력리프팅" },
            { name: "민트리프트", brand: "HansBiomed", mechanism: "360도 가시 패턴 PDO", target: ["리프팅", "턱선"], duration: "1~2년", downtime: "3~7일", pain: 3, sessions: "1회", price: "100~250만원", note: "특허기술" },
            { name: "PCL실", brand: "Sinclair", mechanism: "PDO보다 오래 유지되는 PCL 소재", target: ["리프팅", "볼륨"], duration: "2~3년", downtime: "3~7일", pain: 3, sessions: "1회", price: "150~300만원", note: "장기지속" },
            { name: "실루엣소프트", brand: "Sinclair", mechanism: "PLLA 콘이 달린 실", target: ["리프팅", "볼륨"], duration: "2년 이상", downtime: "5~7일", pain: 3, sessions: "1회", price: "150~350만원", note: "PLLA" }
          ]
        },
        {
          id: "ems",
          name: "EMS/근육",
          treatments: [
            { name: "엠페이스", brand: "BTL", mechanism: "HIFES로 안면 근육 선택적 자극", target: ["이마주름", "눈가", "턱선"], duration: "6개월~1년", downtime: "없음", pain: 1, sessions: "4회 (주 1회)", price: "50~80만원/회", note: "근육강화" },
            { name: "엠스컬프 페이스", brand: "BTL", mechanism: "HIFEM으로 표정근 강화", target: ["탄력", "리프팅"], duration: "6개월", downtime: "없음", pain: 1, sessions: "4~6회", price: "40~60만원/회", note: "" },
            { name: "티타늄 리프팅", brand: "Cutera", mechanism: "755+810+1064nm 3파장, STACK/SHR 듀얼", target: ["리프팅", "타이트닝", "톤업", "심부볼"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "2~4주간격 3~5회", price: "30~60만원/회", note: "설인아모델 즉각효과" },
            { name: "온다", brand: "DEKA", mechanism: "마이크로웨이브로 지방+콜라겐 동시 자극", target: ["지방감소", "탄력", "셀룰라이트"], duration: "6개월~1년", downtime: "없음", pain: 2, sessions: "3~4회", price: "50~100만원/회", note: "마이크로웨이브" },
            { name: "리투오", brand: "Viora", mechanism: "CORE 기술 멀티RF, 3개 주파수 동시 조사", target: ["리프팅", "탄력", "셀룰라이트", "바디"], duration: "6개월~1년", downtime: "없음", pain: 1.5, sessions: "6~8회", price: "30~50만원/회", note: "멀티RF" }
          ]
        }
      ]
    },
    {
      id: "booster",
      name: "스킨부스터",
      subcategories: [
        {
          id: "pn",
          name: "PN/PDRN",
          treatments: [
            { name: "리쥬란 힐러", brand: "Pharmaresearch", mechanism: "연어 유래 PN으로 섬유아세포 활성화", target: ["재생", "탄력", "주름", "흉터"], duration: "6개월~1년", downtime: "1~3일", pain: 2.5, sessions: "3~4회", price: "15~30만원/회", note: "오리지널" },
            { name: "리쥬란 아이", brand: "Pharmaresearch", mechanism: "눈가 전용 저점도 PN", target: ["눈가주름", "다크서클"], duration: "6개월", downtime: "1~2일", pain: 2, sessions: "3~4회", price: "10~20만원/회", note: "눈가전용" },
            { name: "리쥬란 HB", brand: "Pharmaresearch", mechanism: "PN + 히알루론산", target: ["보습", "재생", "윤기"], duration: "3~6개월", downtime: "1~2일", pain: 2, sessions: "3~4회", price: "15~25만원/회", note: "보습강화" },
            { name: "리쥬란 턴오버", brand: "Pharmaresearch", mechanism: "고농도 PN으로 턴오버 촉진", target: ["노화피부", "탄력", "재생"], duration: "6개월~1년", downtime: "2~3일", pain: 2.5, sessions: "3~4회", price: "20~35만원/회", note: "고농도" },
            { name: "플라센텍스", brand: "다양", mechanism: "PDRN 주사로 조직 재생", target: ["재생", "상처", "탄력"], duration: "3~6개월", downtime: "1~2일", pain: 2, sessions: "3~5회", price: "8~15만원/회", note: "PDRN" },
            { name: "리쥬란 HB 플러스", brand: "Pharmaresearch", mechanism: "PN+리도카인 함유, 통증 53% 감소", target: ["재생", "보습", "탄력"], duration: "6개월", downtime: "1일", pain: 1.5, sessions: "3~4회", price: "15~25만원/회", note: "2024신제품" },
            { name: "스킨바이브", brand: "Allergan", mechanism: "FDA승인 HA 스킨부스터, 피부 수화", target: ["보습", "광채", "피부결"], duration: "6개월", downtime: "1일", pain: 2, sessions: "1회", price: "30~50만원", note: "FDA승인" },
            { name: "135 스킨부스터", brand: "다양", mechanism: "135개 영양성분 복합 주입", target: ["칙칙함", "피부결", "톤업"], duration: "3~6개월", downtime: "1일", pain: 2, sessions: "3~4회", price: "15~25만원/회", note: "복합영양" },
            { name: "뉴라덤", brand: "Medytox", mechanism: "57가지 성분 복합", target: ["재생", "탄력", "트러블"], duration: "3~6개월", downtime: "1일", pain: 2, sessions: "3~4회", price: "15~25만원/회", note: "57성분" }
          ]
        },
        {
          id: "pla",
          name: "PLA/콜라겐부스터",
          treatments: [
            { name: "쥬베룩", brand: "Across", mechanism: "PLA 입자가 콜라겐 생성 자극", target: ["탄력", "주름", "볼륨"], duration: "1~2년", downtime: "1~3일", pain: 2.5, sessions: "3~4회", price: "20~40만원/회", note: "인기" },
            { name: "쥬베룩 볼륨", brand: "Across", mechanism: "고농도 PLA", target: ["볼륨", "탄력", "꺼진부위"], duration: "1~2년", downtime: "2~4일", pain: 2.5, sessions: "2~3회", price: "30~50만원/회", note: "볼륨강화" },
            { name: "스컬트라", brand: "Galderma", mechanism: "PLLA로 점진적 콜라겐 생성", target: ["볼륨", "팔자", "꺼진볼"], duration: "2년 이상", downtime: "1~3일", pain: 2.5, sessions: "2~3회", price: "50~100만원/회", note: "볼륨전문" },
            { name: "엘란쎄", brand: "Sinclair", mechanism: "PCL + CMC 젤, 즉각+점진 효과", target: ["볼륨", "주름", "윤곽"], duration: "1~4년", downtime: "1~3일", pain: 2.5, sessions: "1~2회", price: "40~80만원/회", note: "즉각+점진" }
          ]
        },
        {
          id: "exosome",
          name: "엑소좀",
          treatments: [
            { name: "ASCE+ 엑소좀", brand: "ExoCoBio", mechanism: "줄기세포 유래 엑소좀으로 세포간 신호전달", target: ["재생", "탄력", "홍조", "안티에이징"], duration: "3~6개월", downtime: "없음~1일", pain: 1.5, sessions: "4~6회", price: "20~50만원/회", note: "줄기세포유래" },
            { name: "엑소좀 MTS", brand: "다양", mechanism: "마이크로니들링 + 엑소좀", target: ["재생", "흉터", "모공"], duration: "3~6개월", downtime: "1~2일", pain: 2, sessions: "4~6회", price: "20~40만원/회", note: "" },
            { name: "ASCE+ 샤이닝", brand: "ExoCoBio", mechanism: "미백 특화 엑소좀", target: ["미백", "톤업", "색소"], duration: "3~6개월", downtime: "없음", pain: 1.5, sessions: "4~6회", price: "20~50만원/회", note: "미백특화" },

            { name: "세렉소", brand: "에이바이오머티리얼즈", mechanism: "식물유래 엑소좀(병풀,인삼), 포텐자 병합", target: ["재생", "장벽강화", "홍반완화"], duration: "3~6개월", downtime: "1일", pain: 2, sessions: "3~4회", price: "15~30만원/회", note: "식물엑소좀" }
          ]
        },
        {
          id: "ha",
          name: "HA부스터/물광",
          treatments: [
            { name: "물광주사", brand: "다양", mechanism: "비가교 HA를 진피에 주입", target: ["보습", "윤기", "피부결"], duration: "1~3개월", downtime: "1~3일", pain: 2, sessions: "2~4회", price: "10~25만원/회", note: "기본물광" },
            { name: "샤넬주사", brand: "Filorga NCTF", mechanism: "HA + 비타민 + 아미노산 55종", target: ["윤기", "탄력", "영양"], duration: "2~4개월", downtime: "1~2일", pain: 2, sessions: "3~4회", price: "20~40만원/회", note: "멀티비타민" },
            { name: "프로파일로", brand: "IBSA", mechanism: "고순도 HA가 BAP포인트에서 확산", target: ["탄력", "처진피부", "리프팅"], duration: "6개월~1년", downtime: "1~2일", pain: 2.5, sessions: "2회", price: "30~60만원/회", note: "BAP테크닉" },
            { name: "볼벨라 스킨", brand: "Allergan", mechanism: "쥬비덤 계열 스킨부스터용 HA", target: ["보습", "잔주름"], duration: "6~9개월", downtime: "1~2일", pain: 2, sessions: "1~2회", price: "25~40만원/회", note: "" },
            { name: "레스틸렌 스킨부스터", brand: "Galderma", mechanism: "NASHA 기술 미세 HA", target: ["보습", "윤기", "탄력"], duration: "6개월", downtime: "1~2일", pain: 2, sessions: "3회", price: "20~35만원/회", note: "" },
            { name: "벨로테로 리바이브", brand: "Merz", mechanism: "HA+글리세롤, CPM기술로 균일확산", target: ["보습", "피부결", "광채", "장벽강화"], duration: "6개월", downtime: "1~3일", pain: 2, sessions: "3회 (4주간격)", price: "25~40만원/회", note: "2025신제품 한예슬모델" },
            { name: "로리앙 엘레멘트", brand: "중헌제약", mechanism: "글루타치온+비타민C+트라넥삼산+나이아신아마이드 동결건조", target: ["미백", "색소", "톤업"], duration: "3~6개월", downtime: "없음~1일", pain: 2, sessions: "3~4회", price: "30~40만원/회", note: "미백특화EBD부스터" }
          ]
        },
        {
          id: "vitamin",
          name: "비타민/영양주사",
          treatments: [
            { name: "백옥주사", brand: "다양", mechanism: "글루타치온 정맥주사로 미백/해독", target: ["미백", "해독", "항산화"], duration: "2~4주", downtime: "없음", pain: 1, sessions: "주 1~2회, 10회", price: "3~10만원/회", note: "미백" },
            { name: "신데렐라주사", brand: "다양", mechanism: "알파리포산 기반 항산화", target: ["항산화", "다이어트보조"], duration: "2~4주", downtime: "없음", pain: 1, sessions: "주 1~2회", price: "5~15만원/회", note: "" },
            { name: "마늘주사", brand: "다양", mechanism: "비타민B1 유도체로 피로 회복", target: ["피로회복", "활력"], duration: "1~2주", downtime: "없음", pain: 1, sessions: "주 1~2회", price: "3~8만원/회", note: "" },
            { name: "비타민C 메가도스", brand: "다양", mechanism: "고용량 비타민C 정맥주사", target: ["항산화", "미백", "면역"], duration: "2~4주", downtime: "없음", pain: 1, sessions: "주 1~2회", price: "5~15만원/회", note: "" },
            { name: "태반주사", brand: "라이넥/멜스몬", mechanism: "인태반 추출물로 세포 활성화", target: ["재생", "안티에이징", "갱년기"], duration: "1~2주", downtime: "없음", pain: 1.5, sessions: "주 2~3회", price: "5~15만원/회", note: "" }
          ]
        },
        {
          id: "special",
          name: "특수부스터",
          treatments: [
            { name: "더마톡신", brand: "다양", mechanism: "묽은 보톡스를 얕은 층에 광범위 주입", target: ["모공", "피지", "피부결"], duration: "3~4개월", downtime: "없음~경미", pain: 2, sessions: "3~6개월마다", price: "20~40만원", note: "스킨보톡스" },
            { name: "PRP 자가혈", brand: "자가혈", mechanism: "혈소판풍부혈장의 성장인자로 재생", target: ["재생", "탄력", "흉터", "모발"], duration: "6개월~1년", downtime: "1~3일", pain: 2.5, sessions: "3~4회", price: "20~50만원/회", note: "자가혈" },
            { name: "줄기세포배양액", brand: "다양", mechanism: "줄기세포 분비 성장인자 복합체", target: ["재생", "안티에이징", "윤기"], duration: "3~6개월", downtime: "없음~1일", pain: 1.5, sessions: "4~6회", price: "30~80만원/회", note: "" }
          ]
        }
      ]
    },
    {
      id: "pigment",
      name: "색소/미백",
      subcategories: [
        {
          id: "pico",
          name: "피코레이저",
          treatments: [
            { name: "피코웨이", brand: "Candela", mechanism: "피코초 펄스로 색소 미세 분쇄", target: ["기미", "주근깨", "문신", "피부결"], duration: "영구~유지필요", downtime: "1~7일", pain: 2.5, sessions: "3~10회", price: "10~50만원/회", note: "프리미엄" },
            { name: "피코슈어", brand: "Cynosure", mechanism: "755nm 피코초, Focus Lens", target: ["기미", "색소", "문신", "모공"], duration: "영구~유지필요", downtime: "1~5일", pain: 2.5, sessions: "3~10회", price: "15~50만원/회", note: "755nm" },
            { name: "피코플러스", brand: "Lutronic", mechanism: "1064/532/595/660nm 4파장", target: ["기미", "컬러문신", "홍조"], duration: "영구~유지필요", downtime: "1~5일", pain: 2.5, sessions: "3~10회", price: "10~40만원/회", note: "4파장" },
            { name: "피코케어", brand: "원텍", mechanism: "국산 피코초 레이저", target: ["기미", "주근깨", "잡티"], duration: "영구~유지필요", downtime: "1~5일", pain: 2.5, sessions: "3~10회", price: "8~30만원/회", note: "국산" },
            { name: "스타워커", brand: "Fotona", mechanism: "피코+나노 하이브리드", target: ["색소", "문신", "피부결"], duration: "영구~유지필요", downtime: "1~5일", pain: 2.5, sessions: "3~10회", price: "15~40만원/회", note: "" },
            { name: "인라이튼", brand: "Cutera", mechanism: "피코+나노 듀얼모드", target: ["색소", "문신", "기미"], duration: "영구~유지필요", downtime: "1~5일", pain: 2.5, sessions: "3~10회", price: "10~40만원/회", note: "" }
          ]
        },
        {
          id: "qswitch",
          name: "Q스위치/토닝",
          treatments: [
            { name: "레블라이트 SI", brand: "Cynosure", mechanism: "1064nm Q스위치, PTP모드", target: ["기미", "피부톤", "모공"], duration: "유지시술필요", downtime: "없음", pain: 1.5, sessions: "10~20회", price: "5~15만원/회", note: "토닝대표" },
            { name: "스펙트라 VRM", brand: "Lutronic", mechanism: "듀얼펄스 Q스위치", target: ["기미", "색소", "모공"], duration: "유지시술필요", downtime: "없음", pain: 1.5, sessions: "10~20회", price: "5~15만원/회", note: "" },
            { name: "메들라이트 C6", brand: "ConBio", mechanism: "클래식 Q스위치", target: ["기미", "색소"], duration: "유지시술필요", downtime: "없음", pain: 1.5, sessions: "10~20회", price: "3~10만원/회", note: "클래식" },
            { name: "헬리오스", brand: "Lutronic", mechanism: "차세대 Q스위치", target: ["기미", "색소", "모공"], duration: "유지시술필요", downtime: "없음", pain: 1.5, sessions: "10~20회", price: "5~15만원/회", note: "" }
          ]
        },
        {
          id: "pigmentlaser",
          name: "색소레이저",
          treatments: [
            { name: "루비레이저", brand: "다양", mechanism: "694nm 멜라닌 선택적 흡수", target: ["오타모반", "깊은색소", "문신"], duration: "영구적", downtime: "7~14일", pain: 3, sessions: "3~10회", price: "5~30만원/회", note: "깊은색소" },
            { name: "알렉산드라이트", brand: "다양", mechanism: "755nm 멜라닌 파괴", target: ["주근깨", "검버섯", "제모"], duration: "영구적", downtime: "5~10일", pain: 2.5, sessions: "1~5회", price: "5~20만원/회", note: "" },
            { name: "젠틀맥스 프로", brand: "Candela", mechanism: "755nm + 1064nm 듀얼", target: ["색소", "제모", "혈관"], duration: "영구~유지필요", downtime: "1~5일", pain: 2.5, sessions: "3~10회", price: "10~30만원/회", note: "듀얼" }
          ]
        },
        {
          id: "ipl",
          name: "IPL/BBL",
          treatments: [
            { name: "IPL", brand: "다양", mechanism: "광대역 빛으로 멜라닌/헤모글로빈 타겟", target: ["색소", "홍조", "잔털", "모공"], duration: "유지시술필요", downtime: "없음~경미", pain: 2, sessions: "5~10회", price: "5~15만원/회", note: "멀티효과" },
            { name: "BBL", brand: "Sciton", mechanism: "BroadBand Light, Forever Young", target: ["색소", "홍조", "탄력", "안티에이징"], duration: "유지시술필요", downtime: "없음~경미", pain: 2, sessions: "3~6회", price: "15~40만원/회", note: "프리미엄" },
            { name: "M22 IPL", brand: "Lumenis", mechanism: "OPT 기술", target: ["색소", "홍조", "모세혈관"], duration: "유지시술필요", downtime: "없음~1일", pain: 2, sessions: "5~10회", price: "10~25만원/회", note: "" }
          ]
        },
        {
          id: "vascular",
          name: "혈관/홍조",
          treatments: [
            { name: "브이빔 퍼펙타", brand: "Candela", mechanism: "595nm PDL로 혈관 폐쇄", target: ["홍조", "모세혈관", "여드름자국"], duration: "영구~유지필요", downtime: "없음~3일", pain: 2, sessions: "3~6회", price: "10~30만원/회", note: "혈관대표" },
            { name: "엑셀브이", brand: "Cutera", mechanism: "532nm + 1064nm 듀얼", target: ["홍조", "혈관", "색소"], duration: "영구~유지필요", downtime: "없음~1일", pain: 2, sessions: "3~5회", price: "15~40만원/회", note: "듀얼혈관" },
            { name: "브이빔 프리마", brand: "Candela", mechanism: "차세대 브이빔", target: ["홍조", "혈관", "흉터"], duration: "영구~유지필요", downtime: "없음~3일", pain: 2, sessions: "3~6회", price: "10~35만원/회", note: "" }
          ]
        },
        {
          id: "spot",
          name: "점/잡티제거",
          treatments: [
            { name: "CO2 점제거", brand: "다양", mechanism: "CO2 레이저로 조직 기화", target: ["점", "검버섯", "사마귀"], duration: "영구적", downtime: "7~14일", pain: 2, sessions: "1회", price: "1~5만원/개", note: "기본" },
            { name: "어븀야그 점제거", brand: "다양", mechanism: "어븀야그로 정밀 박피", target: ["점", "검버섯", "잡티"], duration: "영구적", downtime: "5~10일", pain: 2, sessions: "1회", price: "1~5만원/개", note: "정밀" },
            { name: "냉동치료", brand: "다양", mechanism: "액체질소로 동결", target: ["검버섯", "사마귀", "티눈"], duration: "영구적", downtime: "1~2주", pain: 2, sessions: "1~3회", price: "1~3만원/개", note: "" }
          ]
        }
      ]
    },
    {
      id: "acne",
      name: "여드름/모공/흉터",
      subcategories: [
        {
          id: "fractional",
          name: "프랙셔널",
          treatments: [
            { name: "프락셀 듀얼", brand: "Solta", mechanism: "1550/1927nm 듀얼, 미세열기둥으로 진피 재생", target: ["흉터", "모공", "주름", "색소"], duration: "영구~유지필요", downtime: "5~10일", pain: 3, sessions: "3~5회", price: "30~60만원/회", note: "대표" },
            { name: "울트라펄스 CO2", brand: "Lumenis", mechanism: "CO2 프랙셔널, 강력한 리모델링", target: ["깊은흉터", "모공", "주름"], duration: "영구~유지필요", downtime: "7~14일", pain: 3.5, sessions: "3~5회", price: "40~80만원/회", note: "강력" },
            { name: "앙코르", brand: "Lutronic", mechanism: "CO2 + CoolPeel 모드", target: ["흉터", "모공", "주름"], duration: "영구~유지필요", downtime: "3~14일", pain: 3, sessions: "3~5회", price: "30~60만원/회", note: "" },
            { name: "에코투/모자이크", brand: "다양", mechanism: "CO2 프랙셔널", target: ["흉터", "모공"], duration: "영구~유지필요", downtime: "5~10일", pain: 3, sessions: "3~5회", price: "20~50만원/회", note: "" },
            { name: "피코 프랙셔널", brand: "다양", mechanism: "피코레이저 프랙셔널, LIOB", target: ["모공", "흉터", "색소"], duration: "영구~유지필요", downtime: "1~3일", pain: 2, sessions: "3~5회", price: "15~40만원/회", note: "저다운타임" },
            { name: "클리어앤브릴리언트", brand: "Solta", mechanism: "1440nm 저출력 프랙셔널", target: ["피부결", "모공", "유지관리"], duration: "유지필요", downtime: "1~2일", pain: 1.5, sessions: "4~6회", price: "15~30만원/회", note: "관리용" },
            { name: "써펙트", brand: "Viora", mechanism: "RF 프랙셔널 + 마이크로니들", target: ["흉터", "모공", "탄력"], duration: "1년이상", downtime: "3~5일", pain: 3, sessions: "3~4회", price: "30~50만원/회", note: "RF프락셔널" }
          ]
        },
        {
          id: "acnetreat",
          name: "여드름치료",
          treatments: [
            { name: "PDT (광역동)", brand: "다양", mechanism: "광감작제 + LED로 피지선/여드름균 파괴", target: ["염증성여드름", "피지과다"], duration: "6개월~1년", downtime: "3~7일", pain: 2, sessions: "3~5회", price: "15~35만원/회", note: "염증특화" },
            { name: "아그네스", brand: "AGNES", mechanism: "미세침 RF로 피지선 영구 파괴", target: ["여드름", "피지선", "한관종"], duration: "영구적", downtime: "1~3일", pain: 2.5, sessions: "3~5회", price: "20~50만원/회", note: "영구" },
            { name: "압출+관리", brand: "수기", mechanism: "압출 + 진정/항균 관리", target: ["화이트헤드", "블랙헤드"], duration: "일시적", downtime: "1~2일", pain: 2, sessions: "주기적", price: "3~10만원/회", note: "기본" },
            { name: "살리실산 필링", brand: "다양", mechanism: "BHA로 모공 속 노폐물 제거", target: ["여드름", "모공", "블랙헤드"], duration: "유지필요", downtime: "1~3일", pain: 1.5, sessions: "4~6회", price: "3~8만원/회", note: "" },
            { name: "블루라이트", brand: "다양", mechanism: "415nm으로 여드름균 살균", target: ["여드름균", "염증"], duration: "유지필요", downtime: "없음", pain: 0.5, sessions: "10~20회", price: "2~5만원/회", note: "무자극" }
          ]
        },
        {
          id: "pore",
          name: "모공관리",
          treatments: [
            { name: "아쿠아필", brand: "다양", mechanism: "물줄기+흡입으로 모공 청소", target: ["모공", "피지", "블랙헤드"], duration: "2~4주", downtime: "없음", pain: 0.5, sessions: "주기적", price: "5~15만원/회", note: "기본관리" },
            { name: "MTS", brand: "다양", mechanism: "미세침으로 콜라겐 재생", target: ["모공", "흉터", "탄력"], duration: "유지필요", downtime: "1~3일", pain: 2, sessions: "4~6회", price: "10~20만원/회", note: "" },
            { name: "카본필링", brand: "다양", mechanism: "카본+레이저로 피지/각질 제거", target: ["모공", "피지", "톤"], duration: "2~4주", downtime: "없음", pain: 1, sessions: "4~8회", price: "5~15만원/회", note: "할리우드필링" },
            { name: "하이드라페이셜", brand: "Edge Systems", mechanism: "3단계 클렌징/필링/수분공급", target: ["모공", "피지", "보습"], duration: "2~4주", downtime: "없음", pain: 0.5, sessions: "주기적", price: "10~20만원/회", note: "" }
          ]
        },
        {
          id: "scar",
          name: "흉터치료",
          treatments: [
            { name: "서브시전", brand: "수기", mechanism: "바늘로 흉터 아래 섬유조직 절단", target: ["롤링흉터", "함몰흉터"], duration: "영구적", downtime: "3~7일", pain: 2.5, sessions: "3~5회", price: "20~50만원/회", note: "필수" },
            { name: "펀치절제술", brand: "수기", mechanism: "깊은 흉터 펀치로 절제 후 봉합", target: ["아이스픽흉터"], duration: "영구적", downtime: "5~7일", pain: 2.5, sessions: "1~2회", price: "5~15만원/개", note: "" },
            { name: "도트필/TCA CROSS", brand: "다양", mechanism: "고농도 TCA 점적", target: ["아이스픽흉터", "깊은흉터"], duration: "영구~유지필요", downtime: "7~14일", pain: 2.5, sessions: "3~6회", price: "10~30만원/회", note: "" },
            { name: "필러 (흉터)", brand: "다양", mechanism: "함몰 부위 HA 필러 주입", target: ["함몰흉터", "롤링흉터"], duration: "6개월~1년", downtime: "없음~경미", pain: 2, sessions: "1~2회", price: "20~50만원", note: "즉각효과" },
            { name: "스테로이드 주사", brand: "다양", mechanism: "켈로이드에 스테로이드 주입", target: ["켈로이드", "비후성흉터"], duration: "영구~재발가능", downtime: "없음", pain: 2, sessions: "3~6회", price: "3~10만원/회", note: "" }
          ]
        }
      ]
    },
    {
      id: "petit",
      name: "쁘띠시술",
      subcategories: [
        {
          id: "botox",
          name: "보톡스",
          treatments: [
            { name: "보톡스 (앨러간)", brand: "Allergan", mechanism: "보툴리눔 톡신으로 신경-근육 차단", target: ["주름", "사각턱", "승모근", "다한증"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "10~30만원", note: "오리지널" },
            { name: "제오민", brand: "Merz", mechanism: "순수 보툴리눔 톡신 (복합단백질 제거)", target: ["주름", "사각턱"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "10~25만원", note: "순수톡신" },
            { name: "디스포트", brand: "Ipsen", mechanism: "확산력 좋은 보툴리눔 톡신", target: ["주름", "사각턱", "이마"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "8~20만원", note: "확산형" },
            { name: "나보타", brand: "대웅제약", mechanism: "국산 보툴리눔 톡신", target: ["주름", "사각턱", "종아리"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "5~15만원", note: "국산대표" },
            { name: "보툴렉스", brand: "휴젤", mechanism: "국산 보툴리눔 톡신", target: ["주름", "사각턱"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "5~15만원", note: "국산" },
            { name: "메디톡신", brand: "메디톡스", mechanism: "국산 보툴리눔 톡신", target: ["주름", "사각턱"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "5~15만원", note: "국산" },
            { name: "리즈톡스", brand: "휴온스", mechanism: "국산 보툴리눔 톡신", target: ["주름", "사각턱"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "5~12만원", note: "국산" },
            { name: "코어톡스", brand: "메디톡스", mechanism: "비동물성 보툴리눔 톡신", target: ["주름", "사각턱"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "8~18만원", note: "비동물성" },
            { name: "이노톡스", brand: "메디톡스", mechanism: "액상형 보툴리눔 톡신", target: ["주름", "사각턱"], duration: "3~6개월", downtime: "없음", pain: 2, sessions: "4~6개월마다", price: "8~20만원", note: "액상형" }
          ]
        },
        {
          id: "filler",
          name: "필러",
          treatments: [
            { name: "쥬비덤 볼루마", brand: "Allergan", mechanism: "VYCROSS 기술 고밀도 HA", target: ["볼륨", "팔자", "관자"], duration: "12~18개월", downtime: "2~5일", pain: 2.5, sessions: "1회", price: "40~80만원/cc", note: "볼륨대표" },
            { name: "쥬비덤 볼벨라", brand: "Allergan", mechanism: "저점도 HA, 섬세 부위용", target: ["입술", "눈가"], duration: "6~12개월", downtime: "1~3일", pain: 2, sessions: "1회", price: "35~60만원", note: "입술전용" },
            { name: "쥬비덤 볼리프트", brand: "Allergan", mechanism: "중점도 HA", target: ["팔자", "마리오넷"], duration: "12~15개월", downtime: "2~4일", pain: 2.5, sessions: "1회", price: "40~70만원/cc", note: "" },
            { name: "레스틸렌", brand: "Galderma", mechanism: "NASHA 기술 HA", target: ["주름", "볼륨", "입술"], duration: "6~12개월", downtime: "2~5일", pain: 2.5, sessions: "1회", price: "30~60만원", note: "클래식" },
            { name: "레스틸렌 리프트", brand: "Galderma", mechanism: "OBT 기술 리프팅 HA", target: ["볼리프팅", "턱선"], duration: "12~18개월", downtime: "2~5일", pain: 2.5, sessions: "1회", price: "40~70만원", note: "" },
            { name: "벨로테로", brand: "Merz", mechanism: "CPM 기술 균일 HA", target: ["잔주름", "입술", "눈가"], duration: "6~12개월", downtime: "1~3일", pain: 2, sessions: "1회", price: "30~50만원", note: "자연스러움" },
            { name: "테오시알", brand: "Teoxane", mechanism: "RHA 기술, 움직임 적응", target: ["주름", "볼륨"], duration: "9~18개월", downtime: "2~4일", pain: 2.5, sessions: "1회", price: "35~60만원", note: "RHA" },
            { name: "더채움", brand: "휴젤", mechanism: "국산 HA 필러", target: ["주름", "볼륨", "코"], duration: "6~12개월", downtime: "2~4일", pain: 2.5, sessions: "1회", price: "15~30만원", note: "국산" },
            { name: "뉴라미스", brand: "메디톡스", mechanism: "국산 HA 필러", target: ["주름", "볼륨"], duration: "6~12개월", downtime: "2~4일", pain: 2.5, sessions: "1회", price: "15~30만원", note: "국산" },
            { name: "아띠에르", brand: "휴온스", mechanism: "국산 HA 필러", target: ["코", "이마", "턱"], duration: "6~12개월", downtime: "2~5일", pain: 2.5, sessions: "1회", price: "15~35만원", note: "국산" },
            { name: "래디에스", brand: "Merz", mechanism: "CaHA 기반, 즉각+콜라겐 생성", target: ["볼륨", "턱", "손등"], duration: "12~18개월", downtime: "2~5일", pain: 2.5, sessions: "1회", price: "40~80만원", note: "CaHA" },
            { name: "볼룩스", brand: "Allergan", mechanism: "고밀도 HA 안면윤곽용", target: ["턱", "광대", "이마"], duration: "18~24개월", downtime: "1~5일", pain: 2.5, sessions: "1회", price: "50~70만원/cc", note: "윤곽전용" },
            { name: "테오시알 RHA", brand: "Teoxane", mechanism: "탄력HA, 표정 움직임에 적응", target: ["팔자", "입술", "눈가"], duration: "12~18개월", downtime: "1~3일", pain: 2.5, sessions: "1회", price: "40~60만원/cc", note: "움직임특화" }
          ]
        },
        {
          id: "contour",
          name: "윤곽시술",
          treatments: [
            { name: "사각턱 보톡스", brand: "다양", mechanism: "교근 보톡스로 턱선 갸름", target: ["사각턱", "이갈이"], duration: "4~6개월", downtime: "없음", pain: 2, sessions: "3~6개월마다", price: "15~30만원", note: "윤곽기본" },
            { name: "턱끝 필러", brand: "다양", mechanism: "무턱에 필러로 길이/볼륨", target: ["무턱", "턱라인"], duration: "12~18개월", downtime: "2~5일", pain: 2.5, sessions: "1회", price: "30~60만원", note: "" },
            { name: "이마 필러", brand: "다양", mechanism: "꺼진 이마에 볼륨", target: ["꺼진이마", "이마볼륨"], duration: "12~18개월", downtime: "2~5일", pain: 2.5, sessions: "1회", price: "50~100만원", note: "" },
            { name: "코필러", brand: "다양", mechanism: "코등/코끝 필러로 높이 교정", target: ["낮은코", "코등"], duration: "12~18개월", downtime: "1~3일", pain: 2.5, sessions: "1회", price: "20~50만원", note: "비수술코" },
            { name: "애교살 필러", brand: "다양", mechanism: "눈밑 소량 필러", target: ["애교살"], duration: "6~12개월", downtime: "1~3일", pain: 2, sessions: "1회", price: "20~40만원", note: "" },
            { name: "승모근 보톡스", brand: "다양", mechanism: "승모근 보톡스로 어깨라인 슬림", target: ["승모근", "어깨라인"], duration: "4~6개월", downtime: "없음", pain: 2, sessions: "3~6개월마다", price: "20~50만원", note: "" }
          ]
        }
      ]
    },
    {
      id: "hair",
      name: "제모",
      subcategories: [
        {
          id: "device",
          name: "레이저장비",
          treatments: [
            { name: "젠틀맥스 프로", brand: "Candela", mechanism: "755nm + 1064nm 듀얼파장", target: ["전신제모", "다양한피부톤"], duration: "영구감모", downtime: "없음~경미", pain: 2.5, sessions: "6~10회", price: "부위별상이", note: "제모대표" },
            { name: "클래리티2", brand: "Lutronic", mechanism: "755nm + 1064nm, 플랫탑빔", target: ["전신제모"], duration: "영구감모", downtime: "없음~경미", pain: 2.5, sessions: "6~10회", price: "부위별상이", note: "" },
            { name: "소프라노 아이스", brand: "Alma", mechanism: "810nm SHR 방식, 통증 최소화", target: ["전신제모", "통증민감"], duration: "영구감모", downtime: "없음", pain: 1.5, sessions: "8~12회", price: "부위별상이", note: "무통" },
            { name: "라이트쉬어", brand: "Lumenis", mechanism: "800nm 다이오드, 쿨링 시스템", target: ["전신제모"], duration: "영구감모", downtime: "없음", pain: 2, sessions: "6~10회", price: "부위별상이", note: "" },
            { name: "엘리트IQ", brand: "Cynosure", mechanism: "755nm+1064nm 스키니컨택쿨링", target: ["전신제모"], duration: "영구감모", downtime: "없음", pain: 2, sessions: "5~8회", price: "부위별상이", note: "쿨링강화" }
          ]
        },
        {
          id: "area",
          name: "부위별",
          treatments: [
            { name: "수염제모 (남성)", brand: "레이저", mechanism: "얼굴 수염 레이저 제모", target: ["수염", "턱수염"], duration: "영구감모", downtime: "1~2일", pain: 3, sessions: "10~15회", price: "10~20만원/회", note: "남성인기" },
            { name: "겨드랑이 제모", brand: "레이저", mechanism: "겨드랑이 레이저 제모", target: ["겨드랑이"], duration: "영구감모", downtime: "없음", pain: 2, sessions: "6~8회", price: "3~8만원/회", note: "기본" },
            { name: "다리 제모", brand: "레이저", mechanism: "하퇴/대퇴 레이저 제모", target: ["다리", "허벅지"], duration: "영구감모", downtime: "없음~경미", pain: 2, sessions: "6~10회", price: "10~30만원/회", note: "" },
            { name: "팔 제모", brand: "레이저", mechanism: "팔 전체 레이저 제모", target: ["팔", "손등"], duration: "영구감모", downtime: "없음", pain: 2, sessions: "6~8회", price: "5~15만원/회", note: "" },
            { name: "브라질리언", brand: "레이저", mechanism: "비키니라인 전체 레이저 제모", target: ["비키니라인"], duration: "영구감모", downtime: "없음~1일", pain: 3, sessions: "8~12회", price: "10~25만원/회", note: "" },
            { name: "전신 제모", brand: "레이저", mechanism: "전신 레이저 제모 패키지", target: ["전신"], duration: "영구감모", downtime: "없음~경미", pain: 2.5, sessions: "6~10회", price: "50~150만원/회", note: "패키지" }
          ]
        }
      ]
    },
    {
      id: "hairloss",
      name: "탈모",
      subcategories: [
        {
          id: "treatment",
          name: "탈모치료",
          treatments: [
            { name: "두피 PRP", brand: "자가혈", mechanism: "혈소판풍부혈장으로 모낭 활성화", target: ["탈모", "모발성장"], duration: "유지필요", downtime: "없음~1일", pain: 2.5, sessions: "4~6회", price: "20~50만원/회", note: "성장인자" },
            { name: "두피 메조테라피", brand: "다양", mechanism: "비타민/미녹시딜 직접 주입", target: ["탈모", "영양공급"], duration: "유지필요", downtime: "없음", pain: 2, sessions: "10~20회", price: "5~15만원/회", note: "" },
            { name: "엑소좀 모발", brand: "다양", mechanism: "엑소좀으로 모낭 재생", target: ["탈모", "모낭재생"], duration: "유지필요", downtime: "없음", pain: 2, sessions: "6~10회", price: "20~50만원/회", note: "" },
            { name: "LLLT", brand: "다양", mechanism: "저출력 레이저로 두피 혈행 개선", target: ["탈모", "초기탈모"], duration: "유지필요", downtime: "없음", pain: 0, sessions: "주 2~3회", price: "3~10만원/회", note: "비침습" },
            { name: "모발이식", brand: "수술", mechanism: "후두부 모낭 채취→이식", target: ["탈모", "M자", "정수리"], duration: "영구적", downtime: "7~14일", pain: 3, sessions: "1회", price: "300~1000만원", note: "영구적" },
            { name: "피나스테리드", brand: "프로페시아 등", mechanism: "DHT 생성 차단", target: ["남성형탈모"], duration: "복용중유지", downtime: "없음", pain: 0, sessions: "매일복용", price: "월3~10만원", note: "FDA승인" },
            { name: "미녹시딜", brand: "로게인 등", mechanism: "두피 혈관 확장", target: ["탈모", "초기탈모"], duration: "사용중유지", downtime: "없음", pain: 0, sessions: "매일도포", price: "월2~5만원", note: "외용제" }
          ]
        }
      ]
    },
    {
      id: "body",
      name: "바디/비만",
      subcategories: [
        {
          id: "fatinject",
          name: "지방분해주사",
          treatments: [
            { name: "HPL 주사", brand: "다양", mechanism: "복합성분으로 지방세포 파괴", target: ["이중턱", "볼살", "팔뚝"], duration: "영구적", downtime: "3~7일", pain: 2.5, sessions: "3~5회", price: "10~30만원/회", note: "인기" },
            { name: "윤곽주사/PPC", brand: "다양", mechanism: "PPC로 지방세포막 용해", target: ["이중턱", "볼살"], duration: "영구적", downtime: "3~7일", pain: 2.5, sessions: "3~5회", price: "10~25만원/회", note: "" },
            { name: "카이벨라", brand: "Allergan", mechanism: "합성 데옥시콜산, FDA 승인", target: ["이중턱"], duration: "영구적", downtime: "5~10일", pain: 3, sessions: "2~6회", price: "30~60만원/회", note: "FDA승인" },
            { name: "카복시", brand: "다양", mechanism: "CO2 가스로 혈행 개선/지방 분해", target: ["셀룰라이트", "다크서클", "튼살"], duration: "유지필요", downtime: "멍가능", pain: 2, sessions: "10~15회", price: "5~15만원/회", note: "" }
          ]
        },
        {
          id: "fatdevice",
          name: "지방감소장비",
          treatments: [
            { name: "쿨스컬프팅", brand: "Allergan", mechanism: "냉각으로 지방세포 자연사 유도", target: ["복부", "옆구리", "허벅지"], duration: "영구적", downtime: "없음", pain: 2, sessions: "1~3회", price: "50~150만원/부위", note: "FDA승인" },
            { name: "리포뎀", brand: "다양", mechanism: "고주파로 지방 감소", target: ["복부", "허벅지"], duration: "영구적", downtime: "없음", pain: 2, sessions: "6~10회", price: "20~50만원/회", note: "" },
            { name: "반퀴시", brand: "BTL", mechanism: "선택적 RF로 지방 가열 파괴", target: ["복부", "옆구리"], duration: "영구적", downtime: "없음", pain: 1.5, sessions: "4~6회", price: "30~60만원/회", note: "" },
            { name: "엠스컬프", brand: "BTL", mechanism: "HIFEM으로 근육 강화+지방 감소", target: ["복부", "엉덩이", "팔", "다리"], duration: "유지필요", downtime: "없음", pain: 2, sessions: "4~6회", price: "40~80만원/회", note: "근육+지방" },
            { name: "트루스컬프", brand: "Cutera", mechanism: "RF로 지방세포 파괴", target: ["복부", "옆구리"], duration: "영구적", downtime: "없음", pain: 2, sessions: "1~2회", price: "50~100만원/부위", note: "" },
            { name: "엠스컬프 NEO", brand: "BTL", mechanism: "HIFEM+RF 동시, 근육증가+지방감소", target: ["복근", "힙업", "팔뚝"], duration: "6개월~1년", downtime: "없음", pain: 1, sessions: "4~8회", price: "30~50만원/회", note: "근육+지방동시" },
            { name: "쿨스컬프팅 엘리트", brand: "Allergan", mechanism: "듀얼쿨링패널 업그레이드", target: ["복부", "옆구리", "허벅지"], duration: "영구적", downtime: "없음", pain: 2, sessions: "1~2회", price: "50~100만원/부위", note: "듀얼업그레이드" },
            { name: "슈어", brand: "Cynosure", mechanism: "1060nm 다이오드 지방파괴", target: ["복부", "옆구리", "등"], duration: "영구적", downtime: "없음", pain: 2, sessions: "1~2회", price: "50~80만원/부위", note: "레이저지방파괴" }
          ]
        },
        {
          id: "bodytreat",
          name: "바디케어",
          treatments: [
            { name: "튼살 프랙셔널", brand: "다양", mechanism: "프랙셔널로 튼살 부위 재생", target: ["튼살", "임신선"], duration: "영구~유지필요", downtime: "3~7일", pain: 2.5, sessions: "5~10회", price: "20~50만원/회", note: "" },
            { name: "셀룰라이트 관리", brand: "다양", mechanism: "RF/마사지로 셀룰라이트 개선", target: ["셀룰라이트", "허벅지"], duration: "유지필요", downtime: "없음", pain: 1.5, sessions: "10~20회", price: "10~30만원/회", note: "" },
            { name: "LPG 엔더몰로지", brand: "LPG", mechanism: "롤링 마사지로 림프순환/셀룰라이트", target: ["셀룰라이트", "부기"], duration: "유지필요", downtime: "없음", pain: 1, sessions: "10~20회", price: "10~20만원/회", note: "" }
          ]
        },
        {
          id: "sweat",
          name: "다한증",
          treatments: [
            { name: "다한증 보톡스", brand: "다양", mechanism: "땀샘 신경 차단", target: ["겨드랑이", "손", "발"], duration: "4~6개월", downtime: "없음", pain: 2.5, sessions: "6개월마다", price: "30~80만원", note: "기본" },
            { name: "미라드라이", brand: "miraDry", mechanism: "마이크로파로 땀샘 영구 파괴", target: ["겨드랑이"], duration: "영구적", downtime: "2~5일", pain: 2.5, sessions: "1~2회", price: "150~300만원", note: "영구적" }
          ]
        }
      ]
    },
    {
      id: "skincare",
      name: "스킨케어/필링",
      subcategories: [
        {
          id: "chemical",
          name: "화학필링",
          treatments: [
            { name: "라라필", brand: "다양", mechanism: "젖산 기반 부드러운 필링", target: ["각질", "피부결", "톤"], duration: "2~4주", downtime: "1~3일", pain: 1.5, sessions: "4~6회", price: "5~15만원/회", note: "순한필링" },
            { name: "블랙필", brand: "다양", mechanism: "숯 성분 + 산으로 모공/피지 관리", target: ["모공", "피지", "블랙헤드"], duration: "2~4주", downtime: "1~3일", pain: 1.5, sessions: "4~6회", price: "5~15만원/회", note: "" },
            { name: "TCA 필링", brand: "다양", mechanism: "트리클로로초산으로 중간층 박피", target: ["잡티", "주름", "흉터"], duration: "유지필요", downtime: "7~14일", pain: 2.5, sessions: "2~4회", price: "10~30만원/회", note: "중간박피" },
            { name: "제스너 필링", brand: "다양", mechanism: "살리실산+젖산+레조시놀", target: ["여드름", "색소", "피부결"], duration: "유지필요", downtime: "5~7일", pain: 2, sessions: "3~5회", price: "5~15만원/회", note: "" },
            { name: "글리콜산/AHA", brand: "다양", mechanism: "글리콜산으로 표층 각질 제거", target: ["각질", "톤", "잔주름"], duration: "2~4주", downtime: "1~3일", pain: 1.5, sessions: "4~8회", price: "3~10만원/회", note: "" },
            { name: "살리실산/BHA", brand: "다양", mechanism: "지용성 산으로 모공 깊숙이 작용", target: ["여드름", "모공", "피지"], duration: "2~4주", downtime: "1~3일", pain: 1.5, sessions: "4~8회", price: "3~10만원/회", note: "" },
            { name: "알라딘필", brand: "다양", mechanism: "해면침+약물로 각질 제거", target: ["각질", "피부결", "탄력"], duration: "2~4주", downtime: "3~5일", pain: 2, sessions: "4~6회", price: "10~25만원/회", note: "해면침" }
          ]
        },
        {
          id: "skinmanage",
          name: "스킨케어관리",
          treatments: [
            { name: "LED 테라피", brand: "다양", mechanism: "파장별 LED로 재생/진정/미백", target: ["재생", "진정", "여드름"], duration: "일시적", downtime: "없음", pain: 0, sessions: "주 2~3회", price: "2~5만원/회", note: "비침습" },
            { name: "이온토", brand: "다양", mechanism: "전류로 유효성분 침투 촉진", target: ["보습", "미백", "영양"], duration: "일시적", downtime: "없음", pain: 0.5, sessions: "주 1~2회", price: "3~8만원/회", note: "" },
            { name: "초음파관리", brand: "다양", mechanism: "초음파로 유효성분 침투", target: ["보습", "탄력", "영양"], duration: "일시적", downtime: "없음", pain: 0.5, sessions: "주 1~2회", price: "3~8만원/회", note: "" },
            { name: "RF케어", brand: "다양", mechanism: "저출력 RF로 탄력 관리", target: ["탄력", "리프팅"], duration: "일시적", downtime: "없음", pain: 1, sessions: "주 1~2회", price: "5~15만원/회", note: "" },
            { name: "쿨링/진정팩", brand: "다양", mechanism: "시술 후 진정 및 수분 공급", target: ["진정", "보습"], duration: "일시적", downtime: "없음", pain: 0, sessions: "시술후", price: "1~3만원", note: "시술후케어" },
            { name: "리쥬비네이션", brand: "다양", mechanism: "종합 피부재생 관리 프로그램", target: ["탄력", "재생", "윤기"], duration: "유지필요", downtime: "없음~1일", pain: 1, sessions: "주 1회, 10회", price: "10~30만원/회", note: "종합관리" },
            { name: "LDM", brand: "Wellcomet", mechanism: "고밀도 초음파 마사지, 다중 주파수", target: ["트러블", "부기", "재생"], duration: "시술직후", downtime: "없음", pain: 0, sessions: "주1~2회", price: "5~15만원/회", note: "홈케어가능" },
            { name: "아쿠아필", brand: "다양", mechanism: "워터제트+석션 딥클렌징", target: ["모공", "피지", "각질"], duration: "2~4주", downtime: "없음", pain: 0, sessions: "2~4주간격", price: "5~15만원/회", note: "관리형" },
            { name: "할리우드필", brand: "다양", mechanism: "카본필링+레이저토닝 병합", target: ["모공", "피지", "톤업"], duration: "2~4주", downtime: "없음", pain: 1, sessions: "2~4주간격", price: "10~20만원/회", note: "인기관리" },
            { name: "톰더글로우", brand: "톰더글로우", mechanism: "LDM 고밀도 초음파, 홈케어 디바이스", target: ["탄력", "재생", "콜라겐"], duration: "지속사용", downtime: "없음", pain: 0, sessions: "주 3~5회", price: "기기200만원대", note: "2025인기홈케어" },
            { name: "쿼드쎄라", brand: "쿼드쎄라", mechanism: "LDM 초음파 홈케어, 4가지 주파수", target: ["탄력", "재생", "주름"], duration: "지속사용", downtime: "없음", pain: 0, sessions: "매일", price: "기기200만원대", note: "LDM홈케어" },
            { name: "에어젯", brand: "다양", mechanism: "고압 공기로 약물 무바늘 주입", target: ["스킨부스터", "재생", "침투촉진"], duration: "시술별", downtime: "없음", pain: 1, sessions: "시술시", price: "5~10만원추가", note: "무통 약물전달" }
          ]
        }
      ]
    }
  ]
};
