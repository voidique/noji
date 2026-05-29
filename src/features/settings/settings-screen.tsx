import {
  Button,
  Form,
  Host,
  Label,
  Picker,
  Section,
  Stepper,
  Text,
  Toggle,
} from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert, StyleSheet } from 'react-native';
import type { JlptLevel } from '../../data/vocab-types';
import { resetAllProgress } from '../../repositories/review-repo';
import { palette } from '../../theme/tokens';
import { useSettings } from './use-settings';

function formatHour(h: number): string {
  if (h === 0) return '오전 12시';
  if (h < 12) return `오전 ${h}시`;
  if (h === 12) return '오후 12시';
  return `오후 ${h - 12}시`;
}

export function SettingsScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const {
    settings,
    updateLevel,
    updateNewPerDay,
    updateNotificationsEnabled,
    updateNotificationHour,
  } = useSettings();

  if (!settings) {
    return null;
  }

  const confirmReset = () => {
    Alert.alert('학습 기록을 초기화할까요?', '모든 단어의 복습 상태가 사라집니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '초기화',
        style: 'destructive',
        onPress: async () => {
          await resetAllProgress(db);
        },
      },
    ]);
  };

  return (
    <Host style={styles.host}>
      <Form>
        <Section title="학습">
          <Picker
            label="목표 레벨"
            selection={settings.targetLevel}
            onSelectionChange={(value) => updateLevel(value as JlptLevel)}
            modifiers={[pickerStyle('menu')]}
          >
            <Text modifiers={[tag('N5')]}>N5</Text>
            <Text modifiers={[tag('N4')]}>N4</Text>
          </Picker>
          <Stepper
            label={`하루 신규 단어: ${settings.newPerDay}개`}
            min={1}
            max={50}
            step={1}
            value={settings.newPerDay}
            onValueChange={(value) => updateNewPerDay(value)}
          />
        </Section>

        <Section title="알림">
          <Toggle
            label="복습 알림"
            isOn={settings.notificationsEnabled}
            onIsOnChange={(isOn) => updateNotificationsEnabled(isOn)}
          />
          {settings.notificationsEnabled ? (
            <Stepper
              label={`알림 시간: ${formatHour(settings.notificationHour)}`}
              min={0}
              max={23}
              step={1}
              value={settings.notificationHour}
              onValueChange={(value) => updateNotificationHour(value)}
            />
          ) : null}
        </Section>

        <Section title="데이터">
          <Button
            role="destructive"
            label="학습 기록 초기화"
            systemImage="arrow.counterclockwise"
            onPress={confirmReset}
          />
        </Section>

        <Section title="정보">
          <Button
            label="튜토리얼 다시 보기"
            systemImage="sparkles"
            onPress={() => router.push('/onboarding')}
          />
          <Button
            label="출처 및 라이선스"
            systemImage="info.circle"
            onPress={() => router.push('/settings/about')}
          />
          <Label title="Noji v1.0" systemImage="app.badge" />
        </Section>
      </Form>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: palette.surfaceGrouped as string,
  },
});
