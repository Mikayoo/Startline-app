import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Priority } from '@/content/steps';
import { buildPlan, MAX_PRIORITIES, Plan, Profile } from '@/logic/plan';

// Answers stay in memory by default. They are written to the device only
// when the person taps "Save my plan", and "Delete my data" removes them.
// Nothing is sent to a server in the prototype.

const STORAGE_KEY = 'startline.savedPlan.v1';
const ACCOUNT_KEY = 'startline.account.v1';

// Prototype account. There is no server yet: the account lives on this phone
// only, codes are not really sent, and the passcode is stored as a hash.
export type DocumentKind = 'claimant' | 'passport';
export interface Account {
  name?: string;
  contact: { kind: 'phone' | 'email'; value: string };
  passcodeHash: string;
  faceId: boolean;
  birth?: { day: string; month: string; year: string };
  documents: DocumentKind[];
  createdAt: string;
}
export type AccountDraft = Partial<Account> & { pendingPasscode?: string };

export const emptyProfile: Profile = {
  language: 'en',
  municipality: null,
  household: null,
  status: null,
  priorities: [],
};

interface Saved {
  profile: Profile;
  done: string[];
  savedAt: string;
}

interface AppState {
  profile: Profile;
  plan: Plan;
  done: Set<string>;
  saved: boolean;
  ready: boolean;
  introSeen: boolean;
  markIntroSeen: () => void;
  update: (patch: Partial<Profile>) => void;
  togglePriority: (p: Priority) => void;
  toggleDone: (stepId: string) => void;
  savePlan: () => Promise<void>;
  deleteData: () => Promise<void>;
  account: Account | null;
  draft: AccountDraft;
  unlocked: boolean;
  setDraft: (patch: AccountDraft) => void;
  commitAccount: () => Promise<void>;
  updateAccount: (patch: Partial<Account>) => Promise<void>;
  unlock: () => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [draft, setDraftState] = useState<AccountDraft>({});
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(ACCOUNT_KEY)])
      .then(([raw, rawAccount]) => {
        if (raw) {
          const data = JSON.parse(raw) as Saved;
          setProfile(data.profile);
          setDone(new Set(data.done));
          setSaved(true);
          setIntroSeen(true);
        }
        if (rawAccount) {
          setAccount(JSON.parse(rawAccount) as Account);
          setIntroSeen(true);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const plan = useMemo(() => buildPlan(profile), [profile]);

  const persist = useCallback(async (p: Profile, d: Set<string>) => {
    const data: Saved = { profile: p, done: [...d], savedAt: new Date().toISOString() };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const update = useCallback((patch: Partial<Profile>) => setProfile((p) => ({ ...p, ...patch })), []);

  const togglePriority = useCallback((id: Priority) => {
    setProfile((p) => {
      if (p.priorities.includes(id)) return { ...p, priorities: p.priorities.filter((x) => x !== id) };
      if (p.priorities.length >= MAX_PRIORITIES) return p;
      return { ...p, priorities: [...p.priorities, id] };
    });
  }, []);

  const toggleDone = useCallback(
    (stepId: string) => {
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(stepId)) next.delete(stepId);
        else next.add(stepId);
        if (saved) persist(profile, next).catch(() => {});
        return next;
      });
    },
    [saved, profile, persist],
  );

  const savePlan = useCallback(async () => {
    await persist(profile, done);
    setSaved(true);
  }, [persist, profile, done]);

  const deleteData = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY, ACCOUNT_KEY]);
    setProfile(emptyProfile);
    setDone(new Set());
    setSaved(false);
    setIntroSeen(false);
    setAccount(null);
    setDraftState({});
    setUnlocked(false);
  }, []);

  const markIntroSeen = useCallback(() => setIntroSeen(true), []);

  const setDraft = useCallback((patch: AccountDraft) => setDraftState((d) => ({ ...d, ...patch })), []);

  const commitAccount = useCallback(async () => {
    if (!draft.contact || !draft.passcodeHash) return;
    const next: Account = {
      name: draft.name?.trim() || undefined,
      contact: draft.contact,
      passcodeHash: draft.passcodeHash,
      faceId: !!draft.faceId,
      birth: draft.birth,
      documents: account?.documents ?? [],
      createdAt: account?.createdAt ?? new Date().toISOString(),
    };
    await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
    await persist(profile, done);
    setAccount(next);
    setSaved(true);
    setUnlocked(true);
    setIntroSeen(true);
    setDraftState({});
  }, [draft, account, persist, profile, done]);

  const updateAccount = useCallback(
    async (patch: Partial<Account>) => {
      if (!account) return;
      const next = { ...account, ...patch };
      await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
      setAccount(next);
    },
    [account],
  );

  const unlock = useCallback(() => setUnlocked(true), []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(ACCOUNT_KEY);
    setAccount(null);
    setUnlocked(false);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      profile, plan, done, saved, ready, introSeen, markIntroSeen, update, togglePriority, toggleDone, savePlan, deleteData,
      account, draft, unlocked, setDraft, commitAccount, updateAccount, unlock, signOut,
    }),
    [
      profile, plan, done, saved, ready, introSeen, markIntroSeen, update, togglePriority, toggleDone, savePlan, deleteData,
      account, draft, unlocked, setDraft, commitAccount, updateAccount, unlock, signOut,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider');
  return ctx;
}
