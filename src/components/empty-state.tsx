import { ContentUnavailableView, Host } from '@expo/ui/swift-ui';
import type { SFSymbol } from 'sf-symbols-typescript';

interface Props {
  title: string;
  systemImage?: SFSymbol;
  description?: string;
}

export function EmptyState({ title, systemImage = 'sparkles', description }: Props) {
  return (
    <Host matchContents>
      <ContentUnavailableView title={title} systemImage={systemImage} description={description} />
    </Host>
  );
}
