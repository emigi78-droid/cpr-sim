/*
 * 재난·응급 분기형 시뮬레이션 V9 — 시나리오 데이터
 * ─────────────────────────────────────────────
 * 선택지 문구·피드백·배점·지연 시간은 이 파일만 고치면 됩니다.
 * clips: 실제 영상 경로(이 파일 기준 상대경로). 비어 있으면 "임시 컷"(장면 설명 + 자막)으로 재생.
 * 영상이 완성되면 clips 에 파일 경로만 추가하세요.
 *
 * 효과(effects): cprDelay(초), sceneDelay(초), flag('lateEMS' | 'extraRed' | 'hypoglycemia' | 'ntgFail')
 * 판정(verdict): correct 정답 / partial 부분 / wrong 오답 / critical 치명
 */
window.SCENARIO = {
  version: 'V9',
  title: '폭우로 인한 터널 붕괴 — 다수사상자 대응과 심정지 환자 소생',
  start: 'N01',
  placeholderSeconds: 6, // 임시 컷 기본 재생 시간(초). 설정에서 변경 가능

  nodes: {
    // ───────────── 재난 영역 ─────────────
    N01: { type: 'video', title: '폭우 속 터널 진입', clips: ['media/clip-55e283a2ce.mp4'],
      desc: '집중호우가 내리는 국도. 차량들이 천천히 터널로 들어간다.',
      lines: [['라디오', '현재 집중호우로 일부 지역에 호우경보가 발효되었습니다. 외출을 자제하시고 기상 정보에 귀 기울여 주시기 바랍니다.'],
              ['간호사', '비가 너무 많이 오네.']],
      next: 'N02' },
    N02: { type: 'video', title: '누수 · 낙석 · 붕괴',
      clips: ['media/clip-1cd71b4115.mov', 'media/clip-f7d9b4906b.mov', 'media/clip-fbb2c622b9.mov', 'media/clip-d59756b191.mov'],
      desc: '터널 천장에서 물이 새고, 콘크리트 조각이 떨어지다가 터널 일부가 무너진다.',
      lines: [['환자', '물이 새는 것 같은데…'], ['일반인', '돌이 떨어지고 있어요!'], ['행인', '터널이 무너졌어요!']],
      next: 'N03' },
    N03: { type: 'video', title: '혼란', clips: ['media/clip-78de7f59c2.mov'],
      desc: '조명이 꺼지고 비상등만 깜박인다. 사람들이 비명을 지르며 차에서 나온다. 어디선가 신음 소리가 들린다.',
      lines: [['일반인', '다들 괜찮으세요?'], ['???', '살려주세요…']],
      next: 'DP1' },

    DP1: { type: 'decision', dp: 'DP1', ui: 'single', points: 10, timeLimit: 20, timeoutKey: 'C',
      prompt: '터널이 무너졌습니다. 어디선가 신음 소리가 들립니다. 간호사인 당신이 가장 먼저 할 일은?',
      options: [
        { key: 'A', text: '천장·바닥·전기시설 등 현장의 위험요인을 먼저 확인한다', verdict: 'correct', next: 'N04',
          fb: '재난 현장의 첫 원칙은 자기 안전 → 현장 안전 → 환자입니다.' },
        { key: 'B', text: '신음 소리가 나는 차량으로 즉시 달려간다', verdict: 'critical', next: 'W1',
          fb: '현장 안전을 확인하지 않고 진입하면 2차 붕괴에 휘말릴 수 있습니다. 구조자가 환자가 되면 아무도 구할 수 없습니다.' },
        { key: 'C', text: '차 안에서 구조대가 올 때까지 기다린다', verdict: 'wrong', next: 'W2', effects: { sceneDelay: 60 },
          fb: '의료인이 있는 현장에서 리더가 없으면 대응 전체가 늦어집니다.' },
        { key: 'D', text: '모두 터널 밖으로 뛰어나가라고 외친다', verdict: 'wrong', next: 'W3', effects: { flag: 'extraRed' },
          fb: '공황 상태의 군중을 한꺼번에 움직이면 넘어짐·압사 같은 2차 사고가 생깁니다.' }
      ] },

    N04: { type: 'video', title: '위험요인 확인', clips: [],
      desc: '간호사가 갈라진 천장과 떨어지는 콘크리트를 살핀다. 행인이 물웅덩이 위에서 불꽃이 튀는 전선을 발견한다.',
      banner: '위험요인: 낙석 · 누수 · 전기',
      lines: [['간호사', '천장에서 계속 떨어지고 있습니다. 추가 붕괴 위험이 있어요.'], ['행인', '전선에서 불꽃이 나요!'],
              ['간호사', '젖은 바닥과 전기시설 근처에는 가지 마세요!']],
      next: 'N05' },
    N05: { type: 'video', title: '군중 통제 · 리더 선언', clips: [],
      desc: '간호사가 손을 들어 사람들을 멈추고, 일반인(검은 후드티)이 안전한 쪽으로 사람들을 안내한다. 간호사가 자신이 간호사임을 밝힌다.',
      lines: [['간호사', '모두 침착하세요. 낙석이 없는 곳으로 이동하세요.'], ['일반인', '이쪽으로 오세요!'],
              ['간호사', '저는 간호사입니다. 제가 응급처치를 맡겠습니다. 모두 제 지시에 따라 주세요.']],
      next: 'DP2' },

    DP2: { type: 'decision', dp: 'DP2', ui: 'triage', points: 15,
      prompt: 'START 분류를 시작합니다. 각 환자에게 알맞은 중증도 색을 지정하세요.',
      patients: [
        { key: '가', info: '스스로 걸어서 안전구역으로 이동함', answer: 'green' },
        { key: '나', info: '다리 부상으로 보행 불가 · 호흡 24회/분 · 요골맥박 촉지 · "손을 쥐어보세요" 지시 이행', answer: 'yellow' },
        { key: '다', info: '의식 없음 · 호흡 34회/분', answer: 'red' },
        { key: '라', info: '호흡 없음 → 기도 개방 후에도 호흡 없음', answer: 'black' },
        { key: '마', info: '공황 중 넘어져 머리 부상 · 의식 저하 · 지시 이행 불가', answer: 'red', onlyIf: 'extraRed' }
      ],
      fb: 'START = 보행(R) → 호흡 30회/분 기준 → 순환(요골맥박·CRT 2초) → 의식(지시 이행)',
      next: 'N06' },

    N06: { type: 'video', title: '분류 결과', clips: [],
      desc: '걸을 수 있는 경상자들이 안전구역으로 이동하고, 간호사가 다리 부상자와 의식 저하자를 차례로 확인한다. 천장에서 작은 낙석이 다시 떨어진다.',
      showTriage: true,
      lines: [['간호사', '추가 붕괴 위험이 있습니다. 절대로 위험구역 안으로 들어가지 마세요.']],
      next: 'DP3' },

    DP3: { type: 'decision', dp: 'DP3', ui: 'single', points: 10,
      prompt: '분류를 마쳤습니다. 119 신고와 환자 관찰을 맡길 사람이 필요합니다. 어떻게 지시할까요?',
      options: [
        { key: 'A', text: '"흰 셔츠 입으신 분, 119에 신고해 주세요. 검은 후드티 입으신 분은 환자들 상태를 계속 봐 주세요."', verdict: 'correct', next: 'N07',
          fb: '지목 + 구체적 행동 + 복창 확인이 지시의 원칙입니다.' },
        { key: 'B', text: '"누가 119 좀 불러주세요!"', verdict: 'wrong', next: 'W4', effects: { flag: 'lateEMS' },
          fb: '불특정 다수에게 요청하면 모두가 "누군가 했겠지" 하고 미룹니다(방관자 효과).' },
        { key: 'C', text: '간호사가 직접 119에 전화하면서 환자 곁을 떠난다', verdict: 'wrong', next: 'W4', effects: { flag: 'lateEMS', sceneDelay: 30 },
          fb: '현장 리더가 자리를 비우면 환자 관찰과 현장 통제가 함께 무너집니다.' }
      ] },

    N07: { type: 'video', title: '119 신고 · 출동', clips: [],
      desc: '행인(흰 셔츠)이 119에 신고한다. 소방서에서 구조대가 장비를 챙겨 빗속으로 출동한다.',
      lines: [['행인', '여보세요, 119입니까? 폭우로 터널 일부가 붕괴되었습니다. 다수의 부상자가 발생했습니다.'],
              ['119', '현재 상황을 보고받고 출동 중입니다.']],
      next: 'N08' },

    // ───────────── 응급 영역 ─────────────
    N08: { type: 'video', title: '흉통 환자 발견',
      clips: ['media/clip-8a2032addb.mov', 'media/clip-aa4efa1371.mov'],
      desc: '승용차 운전석의 남성이 가슴을 움켜쥐고 식은땀을 흘린다. 간호사가 다가간다.',
      lines: [['환자', '가슴이 너무 아픕니다… 숨쉬기가 힘듭니다.'], ['일반인', '여기 환자가 있습니다!']],
      next: 'N09' },
    N09: { type: 'video', title: '환자 확인 · 병력 · 통증 사정', clips: [],
      desc: '간호사가 의식을 확인하고, 환자의 상의 안주머니에서 심근경색 응급식별표·스텐트 시술 카드·NTG 약통을 찾는다.',
      overlay: 'idcard',
      lines: [['간호사', '환자분, 제 말 들리십니까? 성함을 말씀해 주세요.'], ['간호사', '심근경색 병력이 있으시네요. 스텐트 시술도 받으셨군요.'],
              ['간호사', '가장 심한 통증을 10점이라고 하면 지금 몇 점인가요?'], ['환자', '9점 정도입니다… 가슴을 누르는 것처럼 아픕니다.']],
      next: 'N10' },
    N10: { type: 'video', title: '활력징후 · 산소포화도 · 혈당', clips: [],
      desc: '간호사가 혈압과 맥박·호흡을 측정하고 손가락에 산소포화도 측정기를 끼운다. 일반인이 차에서 어머니의 혈당측정기를 가져온다.',
      vitals: { BP: '160/100 mmHg', PR: '112 회/분', RR: '26 회/분', SpO2: '91 %', BST: '112 mg/dL' },
      lines: [['간호사', '혈압 160에 100, 맥박 112회, 호흡 26회입니다.'], ['일반인', '저희 어머니가 당뇨 환자라 혈당기가 차에 있습니다.'],
              ['간호사', '산소포화도 91%, 혈당은 112입니다.']],
      next: 'DP4-1' },

    'DP4-1': { type: 'decision', dp: 'DP4-1', ui: 'single', points: 8, keepVitals: true,
      prompt: '환자는 9점의 압박성 흉통을 호소하고, 평소 복용하던 NTG를 갖고 있습니다. 지금 가장 적절한 중재는?',
      options: [
        { key: 'A', text: '혈압 등 금기 여부를 확인한 뒤, 환자가 소지한 NTG를 설하 투여한다', verdict: 'correct', next: 'DP4-2',
          fb: 'NTG는 혀 밑에서 녹여 흡수시킵니다. 투여 전 수축기 혈압과 금기 약물을 반드시 확인합니다.' },
        { key: 'B', text: '통증이 심하니 NTG 2정을 물과 함께 삼키게 한다', verdict: 'wrong', next: 'DP4-2', effects: { flag: 'ntgFail' },
          fb: '삼키면 간에서 대부분 분해되어 효과가 거의 없습니다(경로 오류). 한 번에 1정이 원칙입니다(용량 오류).' },
        { key: 'C', text: '혈당측정기가 있으니 인슐린을 피하주사한다', verdict: 'wrong', next: 'DP4-2', effects: { flag: 'hypoglycemia' },
          fb: '혈당 112 mg/dL는 정상 범위입니다. 적응증 없는 인슐린 투여는 저혈당을 일으킵니다.' },
        { key: 'D', text: '구조대가 올 때까지 투약 없이 관찰만 한다', verdict: 'partial', points: 4, next: 'DP4-2', effects: { flag: 'ntgFail' },
          fb: '환자 본인의 처방약이 있고 금기가 없다면, 흉통 완화를 미룰 이유가 없습니다.' }
      ] },

    'DP4-2': { type: 'decision', dp: 'DP4-2', ui: 'multi', points: 7, keepVitals: true,
      prompt: 'NTG 투여 전 확인해야 할 항목을 모두 고르세요.',
      options: [
        { key: 'A', text: '수축기 혈압이 90 mmHg 이상인지', verdict: 'correct' },
        { key: 'B', text: '최근 발기부전 치료제(PDE-5 억제제) 복용 여부', verdict: 'correct' },
        { key: 'C', text: '오늘 이미 복용한 NTG 개수와 시간', verdict: 'correct' },
        { key: 'D', text: '본인 약인지, 약명·용량·경로 (5 rights)', verdict: 'correct' },
        { key: 'E', text: '공복 여부', verdict: 'wrong' },
        { key: 'F', text: '체온', verdict: 'wrong' }
      ],
      fb: '💬 디브리핑에서 이야기해 봅시다: 맥박 112회는 확인 항목에 넣었나요? 어떻게 판단했나요?',
      route: function (s) { // 4-1 선택에 따라 다음 장면
        if (s.flags.hypoglycemia) return 'W6';
        if (s.flags.ntgFail) return 'W5';
        return 'N11';
      } },

    N11: { type: 'video', title: 'NTG 설하 투여', clips: [],
      desc: '간호사가 혈압을 다시 확인하고, NTG 0.4 mg 한 알을 환자의 혀 밑에 넣는다. 환자가 등받이에 기대며 조금 편안해진다.',
      banner: 'NTG 0.4 mg 설하',
      lines: [['간호사', '혀 밑에 넣고 녹을 때까지 삼키지 마십시오.'], ['환자', '조금 편해지는 것 같습니다.']],
      next: 'N12' },
    N12: { type: 'video', title: '상태 악화 · 의식 소실', clips: [],
      desc: '환자의 얼굴이 갑자기 잿빛이 되고 눈이 풀린다. 차 문 밖으로 쓰러지는 환자를 간호사가 붙잡아 바닥에 눕힌다.',
      lines: [['환자', '갑자기… 어지럽습니다… 숨이…'], ['간호사', '환자분! 환자분, 들리십니까?'], ['일반인', '의식이 없습니다!']],
      next: 'DP5' },

    DP5: { type: 'decision', dp: 'DP5', ui: 'single', points: 10, timeLimit: 10, timeoutKey: 'TIMEOUT',
      prompt: '환자가 갑자기 쓰러졌습니다. 10초 안에 결정하세요.',
      options: [
        { key: 'A', text: '어깨를 두드리며 반응을 확인하고, 10초 이내로 호흡과 경동맥 맥박을 동시에 확인한다', verdict: 'correct', next: 'N13',
          fb: '반응 → 호흡·맥박 동시 확인(10초 이내)이 심정지 판단의 표준입니다.' },
        { key: 'B', text: '정신 차리게 물을 먹인다', verdict: 'wrong', next: 'W7', effects: { cprDelay: 30 },
          fb: '의식이 저하된 환자에게 물을 먹이면 흡인 위험이 큽니다.' },
        { key: 'C', text: 'NTG를 1정 더 투여한다', verdict: 'wrong', next: 'W7', effects: { cprDelay: 30 },
          fb: '의식 소실은 NTG 추가 투여 상황이 아닙니다. 심정지 여부부터 확인해야 합니다.' },
        { key: 'D', text: '혈압을 다시 측정한다', verdict: 'wrong', next: 'W7', effects: { cprDelay: 30 },
          fb: '혈압 측정에는 시간이 걸립니다. 지금은 반응·호흡·맥박 확인이 우선입니다.' }
      ],
      timeout: { verdict: 'wrong', points: 5, next: 'N13', effects: { cprDelay: 10 },
        fb: '10초 안에 결정하지 못했습니다. 망설인 시간만큼 압박 시작이 늦어집니다.' } },

    N13: { type: 'video', title: '심정지 확인', clips: [],
      desc: '바닥에 누운 환자. 간호사가 경동맥을 촉지하며 가슴의 움직임을 지켜본다. 가슴이 올라오지 않는다.',
      lines: [['간호사', '반응 없습니다. 정상호흡이 없습니다. 맥박도 없습니다. 심정지입니다!']],
      next: 'DP6' },

    DP6: { type: 'decision', dp: 'DP6', ui: 'single', points: 15, timeLimit: 10, timeoutKey: 'TIMEOUT',
      prompt: '심정지입니다. 첫 행동은? (10초)',
      options: [
        { key: 'A', text: '즉시 가슴압박을 시작하면서, 사람을 지목해 AED를 가져오게 하고 119와 통화하게 한다', verdict: 'correct', next: 'N14',
          fb: '압박 시작이 1초라도 빨라야 합니다. 나머지 일은 지목해서 맡깁니다.' },
        { key: 'B', text: '인공호흡 2회부터 시행한다', verdict: 'wrong', next: 'W8', effects: { cprDelay: 30 },
          fb: '성인 심정지는 가슴압박부터 시작합니다(C-A-B).' },
        { key: 'C', text: '간호사가 직접 AED를 가지러 차로 달려간다', verdict: 'critical', next: 'W8', effects: { cprDelay: 60 },
          fb: '그동안 아무도 압박하지 않습니다. AED는 다른 사람에게 맡기고 압박을 시작해야 합니다.' },
        { key: 'D', text: '맥박을 다시 10초간 확인한다', verdict: 'wrong', next: 'W8', effects: { cprDelay: 30 },
          fb: '이미 심정지를 확인했습니다. 재확인은 압박을 늦출 뿐입니다.' }
      ],
      timeout: { verdict: 'wrong', points: 7, next: 'N14', effects: { cprDelay: 10 },
        fb: '10초 안에 결정하지 못했습니다. 망설인 시간만큼 압박 시작이 늦어집니다.' } },

    N14: { type: 'video', title: '가슴압박 · 119 통화 · AED 도착', clips: [],
      desc: '간호사가 무릎을 꿇고 강하고 빠르게 가슴을 압박한다. 일반인은 119와 통화하고, 행인이 AED를 들고 뛰어온다.',
      metronome: true,
      lines: [['간호사', '흰 셔츠 입으신 분은 제 차 앞자리에 있는 AED를 가져와 주세요! 검은 후드티 입으신 분은 119와 통화하면서 2분 후 압박을 교대해 주세요.'],
              ['일반인', '119 맞습니까? 52세 남성 환자가 흉통 후 심정지가 발생했습니다. 간호사가 심폐소생술을 하고 있습니다.'],
              ['행인', 'AED 가져왔습니다!']],
      next: 'DP7' },

    DP7: { type: 'decision', dp: 'DP7', ui: 'pads', points: 10,
      prompt: 'AED 패드 2장을 올바른 위치에 붙이세요. (그림을 눌러 패드를 놓고, 다시 누르면 위치가 바뀝니다)',
      fb: '패드 1: 환자의 오른쪽 쇄골 바로 아래 / 패드 2: 왼쪽 젖꼭지 아래 중간겨드랑선. 화면에서는 환자의 오른쪽이 보는 사람의 왼쪽입니다.',
      wrongEffects: { cprDelay: 20 },
      next: 'N15' },

    N15: { type: 'video', title: '패드 부착 · 심장리듬 분석', clips: [],
      desc: '패드를 붙이자 AED가 리듬을 분석한다. 세 사람 모두 손을 들고 환자에게서 떨어진다.',
      overlay: 'aed-analyze',
      lines: [['AED', '심장리듬을 분석합니다. 환자에게서 떨어지십시오.'], ['간호사', '모두 환자에게서 떨어지세요!'], ['행인', '접촉하는 사람 없습니다.']],
      next: 'DP8-1' },

    'DP8-1': { type: 'decision', dp: 'DP8-1', ui: 'single', points: 4, overlay: 'aed-shock',
      prompt: 'AED: "제세동이 필요합니다. 충전 완료." 다음 행동은?',
      options: [
        { key: 'A', text: '"모두 떨어지세요!" 외치고 주변을 눈으로 확인한 뒤 버튼을 누른다', verdict: 'correct', next: 'DP8-2',
          fb: '제세동 직전 안전 확인은 구조자와 주변 사람을 지킵니다.' },
        { key: 'B', text: '압박을 계속하는 사람이 있는 상태에서 버튼을 누른다', verdict: 'critical', next: 'W9',
          fb: '환자에게 닿아 있는 사람은 감전될 수 있습니다.' },
        { key: 'C', text: '맥박을 한 번 더 확인한 후 누른다', verdict: 'wrong', next: 'DP8-2', effects: { cprDelay: 20 },
          fb: 'AED가 제세동이 필요하다고 판단했습니다. 맥박 재확인은 제세동을 늦출 뿐입니다.' }
      ] },

    'DP8-2': { type: 'decision', dp: 'DP8-2', ui: 'single', points: 4,
      prompt: '제세동을 시행했습니다. 바로 다음 행동은?',
      options: [
        { key: 'A', text: '즉시 가슴압박을 다시 시작한다', verdict: 'correct', next: 'N16',
          fb: '제세동 직후 2분간 바로 압박합니다. 리듬 재분석은 AED가 2분 뒤에 합니다.' },
        { key: 'B', text: '맥박과 호흡을 먼저 확인한다', verdict: 'wrong', next: 'N16', effects: { cprDelay: 15 },
          fb: '제세동 직후 확인하는 동안 압박이 멈춥니다(압박 중단 시간 증가).' },
        { key: 'C', text: 'AED로 바로 리듬을 다시 분석한다', verdict: 'wrong', next: 'N16', effects: { cprDelay: 15 },
          fb: '재분석은 2분 뒤입니다. 그동안 압박을 이어가야 합니다.' }
      ] },

    N16: { type: 'video', title: '제세동 · 압박 재개', clips: [],
      desc: '간호사가 팔을 넓게 뻗어 주변을 막고 버튼을 누른다. 환자의 몸이 한 번 움찔한다. 곧바로 압박을 다시 시작한다.',
      metronome: true,
      lines: [['간호사', '제세동 시행합니다. 모두 떨어지세요. 3, 2, 1!'], ['간호사', '바로 가슴압박 다시 시작합니다.']],
      next: 'N17' },
    N17: { type: 'video', title: '2분 경과 · 압박 교대', clips: [],
      desc: '2분이 지나 일반인이 압박을 교대한다. 간호사가 옆에서 손으로 박자를 맞추며 지도한다.',
      banner: '⏱ 2분 경과', metronome: true,
      lines: [['일반인', '제가 교대하겠습니다.']],
      next: 'DP8-3' },

    'DP8-3': { type: 'decision', dp: 'DP8-3', ui: 'single', points: 2,
      prompt: '교대하는 일반인(심폐소생술 교육을 받은 적 없음)에게 어떻게 안내할까요?',
      options: [
        { key: 'A', text: '"가슴 가운데를 약 5 cm 깊이로, 분당 100~120회, 강하고 빠르게 압박만 해 주세요."', verdict: 'correct', next: 'JUDGE',
          fb: '인공호흡 교육을 받지 않은 일반인에게는 가슴압박소생술(압박만)을 안내합니다. (한국 심폐소생술 지침 2020)' },
        { key: 'B', text: '"압박 30회, 인공호흡 2회를 반복해 주세요."', verdict: 'partial', points: 0, next: 'JUDGE',
          fb: '교육받지 않은 일반인에게 인공호흡까지 요구하면 압박이 자주 끊깁니다. 압박만 안내합니다.' }
      ] },

    // ───────────── 판정 ─────────────
    JUDGE: { type: 'judge', thresholds: { a: 30, b: 90 } }, // cprDelay ≤30 → A, ≤90 → B, 그 이상 → C

    N18: { type: 'video', title: 'ROSC · 재평가', clips: [],
      desc: 'AED 재분석 후 환자가 깊게 숨을 몰아쉬고 가슴이 스스로 오르내린다. 잠시 후 눈을 뜬다.',
      banner: 'ROSC (자발순환 회복)',
      vitals: { BP: '110/70 mmHg', PR: '84 회/분', RR: '22 회/분', SpO2: '95 %', 의식: '명료 · 질문에 반응' },
      lines: [['간호사', '맥박이 돌아왔습니다. 자발호흡이 있습니다.'], ['환자', '여기가 어디죠?']],
      next: 'DP9' },
    N18B: { type: 'video', title: '지연된 ROSC', clips: [],
      desc: '맥박은 돌아왔지만 환자는 눈을 뜨지 못한다. 간호사가 어깨를 두드리며 불러도 반응이 없다.',
      banner: 'ROSC · 의식 없음',
      vitals: { BP: '98/62 mmHg', PR: '104 회/분', RR: '18 회/분', SpO2: '92 %', 의식: '통증에만 반응' },
      lines: [['간호사', '맥박은 돌아왔습니다… 환자분, 눈 떠 보세요!']],
      next: 'DP9' },

    DP9: { type: 'decision', dp: 'DP9', ui: 'sbar', points: 5,
      prompt: '구조대가 도착했습니다. 카드를 골라 S → B → A → R 순서로 인계하세요. (8장 중 4장)',
      cards: [
        { key: 'S', text: '52세 남성, 흉통 발생 후 심정지가 발생했습니다.' },
        { key: 'B', text: '관상동맥질환으로 스텐트 시술 병력이 있고, 소지하던 NTG 0.4 mg을 설하 투여했습니다.' },
        { key: 'A', text: 'CPR과 AED 1회 제세동 후 ROSC되었고, 재평가 활력징후와 의식 상태는 화면과 같습니다.' },
        { key: 'R', text: '급성 심근경색이 의심되어 PCI가 가능한 병원으로 즉시 이송이 필요하며, 이송 중 재심정지를 모니터링해 주십시오.' },
        { key: 'x1', text: '환자분이 많이 놀라신 것 같습니다.' },
        { key: 'x2', text: '혈당이 112라서 인슐린을 투여했습니다.' },
        { key: 'x3', text: '가까운 병원 아무 곳으로나 빨리 이송해 주세요.' },
        { key: 'x4', text: '터널 안이 많이 어두웠습니다.' }
      ],
      fb: 'S(상황) → B(배경: 병력·투약) → A(사정: 처치와 결과, 활력징후) → R(제언: 이송 병원과 모니터링)',
      route: function (s) { return s.ending === 'END-B' ? 'ENDB_CLIP' : 'N19'; } },

    N19: { type: 'video', title: '인계 · 이송', clips: [],
      desc: '구조대가 환자를 들것에 옮겨 구급차에 태운다. 빗속 터널 출구에서 세 사람이 떠나는 구급차를 바라본다.',
      lines: [['119', '인계받았습니다. 출발합니다!'], ['간호사', '모두 수고하셨습니다.']],
      next: 'END' },

    // ───────────── 오답 경로 ─────────────
    W1: { type: 'video', title: '2차 낙석', clips: [], wrong: true,
      desc: '간호사가 차량으로 달려가는 순간, 천장에서 큰 콘크리트 덩어리가 떨어진다. 먼지가 화면을 덮고 모든 것이 어두워진다.',
      lines: [['', '(굉음… 정적… 멀리서 사이렌)']],
      next: 'END', ending: 'END-D' },
    W2: { type: 'video', title: '리더 없는 현장', clips: ['media/clip-d72f5f2b84.mp4'], wrong: true,
      desc: '사람들이 먼지 속에서 이리저리 흩어진다. 누구도 지시하지 않는다.', banner: '⏱ 1분 경과',
      lines: [['', '"누가 좀…" "어떡해…"']], next: 'N04' },
    W3: { type: 'video', title: '공황', clips: [], wrong: true,
      desc: '사람들이 출구로 몰려가다 한 남성이 잔해에 걸려 넘어지며 머리를 부딪힌다.', banner: '적색 환자 1명 추가 발생',
      lines: [['', '(비명)']], next: 'N04' },
    W4: { type: 'video', title: '신고 지연', clips: ['media/clip-29a2dd1e42.mp4'], wrong: true,
      desc: '세 사람이 휴대전화를 들고 서로 눈치만 본다. 뒤늦게야 한 사람이 전화를 건다.', banner: '⏱ 신고가 3분 늦어졌습니다',
      lines: [['', '"신고했어요?" "누가 했겠죠…"']], next: 'N07' },
    W5: { type: 'video', title: '통증 지속', clips: [], wrong: true,
      desc: '시간이 지나도 환자는 가슴을 움켜쥐고 신음한다. 흉통이 줄지 않는다.',
      lines: [['환자', '아직도… 가슴이 너무 아픕니다…']], next: 'N12' },
    W6: { type: 'video', title: '저혈당 증상', clips: [], wrong: true,
      desc: '인슐린 주사 후 환자가 식은땀을 흘리며 손을 떨고, 초점 없는 눈으로 횡설수설한다.',
      lines: [['환자', '여기가… 어디…']], next: 'N12' },
    W7: { type: 'video', title: '시간 허비', clips: [], wrong: true,
      desc: '물병 뚜껑을 여는 동안 쓰러진 환자의 입술이 파랗게 변해 간다.', banner: '⏱ 30초 경과',
      lines: [['', '(심장박동 효과음이 느려진다)']], next: 'N13' },
    W8: { type: 'video', title: '압박 지연', clips: ['media/clip-e686dc524b.mp4'], wrong: true,
      desc: '바닥에 쓰러진 환자 곁에 아무도 없다. 멀어지는 발소리와 깜박이는 비상등.', banner: '⏱ 가슴압박 없이 시간이 흐릅니다',
      lines: [['', '(멀어지는 발소리)']], next: 'N14' },
    W9: { type: 'video', title: '감전', clips: [], wrong: true,
      desc: '압박하던 일반인이 충격을 받고 뒤로 튕겨 나가 젖은 바닥에 쓰러진다.',
      lines: [['행인', '으악! 사람이 쓰러졌어요!']], next: 'END', ending: 'END-E' },

    ENDB_CLIP: { type: 'video', title: '서둘러 이송', clips: [],
      desc: '눈을 감은 환자를 구조대가 서둘러 들것에 올려 터널 밖으로 달려 나간다.',
      lines: [['119', '의식이 없습니다. 바로 이송합니다!']], next: 'END' },
    ENDC_CLIP: { type: 'video', title: '소생 실패', clips: [],
      desc: 'AED가 "제세동이 필요하지 않습니다"라고 말한다. 구조대가 도착해 처치를 이어받고, 간호사는 고개를 숙인다.',
      overlay: 'aed-noshock',
      lines: [['AED', '제세동이 필요하지 않습니다. 가슴압박을 계속하십시오.']], next: 'END' }
  },

  endings: {
    'END-A': { label: '최선의 소생', verdict: 'correct', msg: '침착한 판단과 협력이 생명을 살렸습니다.' },
    'END-B': { label: '지연된 소생', verdict: 'partial', msg: 'ROSC는 되었지만, 지체된 시간만큼 뇌 손상 위험이 커졌습니다.' },
    'END-C': { label: '소생 실패', verdict: 'critical', msg: '심정지 후 1분이 지날 때마다 생존율이 크게 떨어집니다.' },
    'END-D': { label: '구조자 부상', verdict: 'critical', msg: '구조자가 환자가 되면 아무도 구할 수 없습니다.' },
    'END-E': { label: '2차 사고(감전)', verdict: 'critical', msg: '제세동 직전 "모두 떨어지세요"는 생명을 지키는 확인입니다.' }
  },

  closing: [
    '재난현장에서는 자신의 안전을 가장 먼저 확보합니다.',
    'START 분류를 통해 다수사상자를 신속하게 분류합니다.',
    '심정지 환자는 즉시 CPR과 AED를 시행합니다.',
    '정확한 SBAR 인계는 환자의 생존율을 높입니다.',
    '침착한 판단과 협력은 생명을 살리는 가장 중요한 시작입니다.'
  ]
};

window.CLIP_NAMES = {"media/clip-55e283a2ce.mp4":"Seedance 2_5 - Scene 1_수정.mp4","media/clip-1cd71b4115.mov":"Seedance 2_5 - Scene 2.mov","media/clip-f7d9b4906b.mov":"Seedance 2_5 - Scene 3-1.mov","media/clip-fbb2c622b9.mov":"Seedance 2_5 - Scene 3-2.mov","media/clip-d59756b191.mov":"Seedance 2_5 -scene4 .mov","media/clip-78de7f59c2.mov":"Seedance 2_5 - Scene 5.mov","media/clip-8a2032addb.mov":"Seedance 2_5 - 환자가 가슴을 움켜잡고 있는 영상.mov","media/clip-aa4efa1371.mov":"Seedance 2_5 - 간호사가 다가와 환자상태를 확인하는 영상.mov","media/clip-d72f5f2b84.mp4":"W2.mp4","media/clip-29a2dd1e42.mp4":"W4.mp4","media/clip-e686dc524b.mp4":"W8.mp4"};
