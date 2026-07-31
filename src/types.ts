export interface ItinerantLog {
  id: string;
  date: string; // YYYY-MM-DD
  schoolName: string; // 학교명
  studentName: string; // 학생명
  gradeClass?: string; // 학년/학급 (예: 초3 특수학급)
  startTime: string; // 시작 시간 (예: 10:00)
  endTime: string; // 종료 시간 (예: 10:40)
  period?: string; // 교시 (예: 2교시)
  domain: string; // 교육영역/과목 (예: 국어, 사회적응, 근육운동)
  content: string; // 교육내용 및 활동
  remarks: string; // 비고 및 관찰 특이사항
  approvalPersons?: {
    teacher: string; // 담당
    teamLeader: string; // 팀장/부장
    director: string; // 원장/교장
  };
  createdAt: string;
}

export interface MonthlyGoal {
  month: string; // e.g. "3월", "4월", "5월", "6월", "7월"
  goal: string;
}

export interface IEPGoal {
  id: string;
  studentName: string;
  schoolName?: string;
  academicYear: string; // 연도 (예: 2026학년도)
  semester: string; // 학기 (1학기 / 2학기)
  domain: string; // 영역 (국어, 수학, 자립생활, 사회적응, 행동지원 등)
  longTermGoal: string; // 장기목표
  monthlyGoals: MonthlyGoal[]; // 월별 목표 목록 (예: 3월~7월 / 9월~1월)
  shortTermGoals?: string[]; // (구버전 호환)
  evaluationText: string; // 학기/월 평가 내용
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  schoolName: string;
  gradeClass: string;
  category: string; // 장애유형 (지적장애, 자폐성장애, 발달지체, 뇌병변 등)
  teacherInCharge?: string; // 담당 순회교사
}

export interface GASConfig {
  webAppUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export type TabType = 'log-entry' | 'iep-management' | 'student-timeline';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}
