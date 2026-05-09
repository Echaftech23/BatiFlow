import * as SecureStore from 'expo-secure-store';

const REGISTER_DRAFT_KEY = 'batiflow_register_draft';

export type RegisterDraft = { email: string };

export async function saveRegisterDraft(draft: RegisterDraft): Promise<void> {
  await SecureStore.setItemAsync(REGISTER_DRAFT_KEY, JSON.stringify(draft));
}

export async function getRegisterDraft(): Promise<RegisterDraft | null> {
  try {
    const raw = await SecureStore.getItemAsync(REGISTER_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RegisterDraft;
    if (
      typeof parsed.email === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearRegisterDraft(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REGISTER_DRAFT_KEY);
  } catch {
    /* missing */
  }
}
