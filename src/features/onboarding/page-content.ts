export type IllustrationKind =
  | 'pulse-circle'
  | 'book-flip'
  | 'card-flip'
  | 'srs-timeline'
  | 'checkmark';

export interface OnboardingPage {
  kind: IllustrationKind;
  title: string;
  body: string;
}

export const ONBOARDING_PAGES: OnboardingPage[] = [
  {
    kind: 'pulse-circle',
    title: '노지에 오신 것을 환영합니다',
    body: '조용하고 차분한\nJLPT 어휘 학습 시스템.',
  },
  {
    kind: 'book-flip',
    title: 'JLPT N5 · N4 어휘',
    body: '엄선된 단어와 한국어 의미,\n그리고 일본어 예문.',
  },
  {
    kind: 'card-flip',
    title: '탭하고 확인하고 평가하기',
    body: '카드를 탭해 의미를 확인하고\n얼마나 잘 외웠는지 평가하세요.',
  },
  {
    kind: 'srs-timeline',
    title: '잊을 때쯤 다시 만나요',
    body: '어려운 단어는 더 빨리,\n잘 아는 단어는 더 늦게 돌아옵니다.',
  },
  {
    kind: 'checkmark',
    title: '하루 몇 분이면 충분합니다',
    body: '조금씩, 매일.\n오늘부터 시작해요.',
  },
];
