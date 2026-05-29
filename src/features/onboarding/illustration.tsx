import { BookFlip } from './illustrations/book-flip';
import { CardFlip } from './illustrations/card-flip';
import { Checkmark } from './illustrations/checkmark';
import { PulseCircle } from './illustrations/pulse-circle';
import { RatingBarIllustration } from './illustrations/rating-bar';
import { SrsTimeline } from './illustrations/srs-timeline';
import type { IllustrationKind } from './page-content';

interface Props {
  kind: IllustrationKind;
  active: boolean;
}

export function Illustration({ kind, active }: Props) {
  switch (kind) {
    case 'pulse-circle':
      return <PulseCircle active={active} />;
    case 'book-flip':
      return <BookFlip active={active} />;
    case 'card-flip':
      return <CardFlip active={active} />;
    case 'rating-bar':
      return <RatingBarIllustration active={active} />;
    case 'srs-timeline':
      return <SrsTimeline active={active} />;
    case 'checkmark':
      return <Checkmark active={active} />;
  }
}
