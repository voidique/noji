import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useSQLiteContext } from 'expo-sqlite';
import { DynamicColorIOS, Platform } from 'react-native';
import { useWidgetSync } from '../../features/widget/use-widget-sync';
import { isOnboardedSync } from '../../repositories/settings-repo';

const tint =
  Platform.OS === 'ios' ? DynamicColorIOS({ light: '#111111', dark: '#F2F2F2' }) : '#111111';

export default function TabsLayout() {
  const db = useSQLiteContext();
  useWidgetSync();
  if (!isOnboardedSync(db)) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <NativeTabs tintColor={tint} labelStyle={{ color: tint }} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>오늘</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'circle', selected: 'circle.inset.filled' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="browse">
        <NativeTabs.Trigger.Label>단어</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'book', selected: 'book.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved">
        <NativeTabs.Trigger.Label>저장</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'bookmark', selected: 'bookmark.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>설정</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
