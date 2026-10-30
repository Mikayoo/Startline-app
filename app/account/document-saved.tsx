import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AccountScreen, SuccessBadge } from '@/components/account';
import { Card, Txt } from '@/components/ui';
import { DocumentKind, useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

const TITLES: Record<DocumentKind, string> = {
  claimant: 'Refugee Protection Claimant Document',
  passport: 'Passport or other ID',
};

// v3.1 "A15 Document saved".
export default function DocumentSaved() {
  const { doc = 'claimant' } = useLocalSearchParams<{ doc?: DocumentKind }>();
  const { account, updateAccount } = useApp();

  useEffect(() => {
    if (account && !account.documents.includes(doc)) updateAccount({ documents: [...account.documents, doc] });
  }, [account, doc, updateAccount]);

  return (
    <AccountScreen
      back={false}
      hero={
        <View style={{ marginTop: space[8], marginBottom: space[2] }}>
          <SuccessBadge />
        </View>
      }
      title="Document saved"
      helper="It stays on this phone. Startline uses it only to show steps that apply to you."
      primary={{ label: 'Done', onPress: () => router.dismissTo('/privacy') }}
    >
      <Card style={{ gap: 2 }}>
        <Txt variant="cardTitle">{TITLES[doc] ?? TITLES.claimant}</Txt>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          {account ? 'Saved today · on this phone only' : 'Prototype: nothing is stored without an account'}
        </Txt>
      </Card>
    </AccountScreen>
  );
}
