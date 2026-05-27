import type { ReviewRating, ReviewState, ReviewStatus } from '../data/vocab-types';

const DAY_MS = 86_400_000;
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const LEARNING_STEP_MIN = 1;
const HARD_MULT = 1.2;
const EASY_BONUS = 1.3;

export interface Schedulable {
  status: ReviewStatus;
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
}

export interface Scheduled {
  status: ReviewStatus;
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
  dueAt: number;
  lastReviewedAt: number;
}

export function applyRating(
  state: Schedulable,
  rating: ReviewRating,
  now: number = Date.now()
): Scheduled {
  const reps = state.reps + 1;
  switch (rating) {
    case 'again':
      return {
        status: 'learning',
        ease: clampEase(state.ease - 0.2),
        intervalDays: 0,
        reps,
        lapses: state.lapses + 1,
        dueAt: now + LEARNING_STEP_MIN * 60_000,
        lastReviewedAt: now,
      };
    case 'hard': {
      const ease = clampEase(state.ease - 0.15);
      const interval = Math.max(1, (state.intervalDays || 1) * HARD_MULT);
      return {
        status: state.status === 'new' ? 'learning' : 'review',
        ease,
        intervalDays: interval,
        reps,
        lapses: state.lapses,
        dueAt: now + interval * DAY_MS,
        lastReviewedAt: now,
      };
    }
    case 'good': {
      const interval =
        state.status === 'new' ? 1 : Math.max(1, (state.intervalDays || 1) * state.ease);
      return {
        status: 'review',
        ease: state.ease,
        intervalDays: interval,
        reps,
        lapses: state.lapses,
        dueAt: now + interval * DAY_MS,
        lastReviewedAt: now,
      };
    }
    case 'easy': {
      const ease = clampEase(state.ease + 0.15);
      const interval =
        state.status === 'new' ? 3 : Math.max(2, (state.intervalDays || 1) * ease * EASY_BONUS);
      return {
        status: 'known',
        ease,
        intervalDays: interval,
        reps,
        lapses: state.lapses,
        dueAt: now + interval * DAY_MS,
        lastReviewedAt: now,
      };
    }
  }
}

function clampEase(value: number): number {
  if (value < MIN_EASE) return MIN_EASE;
  if (value > MAX_EASE) return MAX_EASE;
  return value;
}

export function toScheduled(state: ReviewState): Schedulable {
  return {
    status: state.status,
    ease: state.ease,
    intervalDays: state.intervalDays,
    reps: state.reps,
    lapses: state.lapses,
  };
}
