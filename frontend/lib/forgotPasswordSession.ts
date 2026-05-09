/** Holds email + code after successful verification until reset completes or app cold-starts. */
let pendingPasswordReset:
  | { email: string; code: string; setAtMs: number }
  | null = null;

const TTL_MS = 15 * 60 * 1000;

export function setPendingPasswordReset(email: string, code: string) {
  pendingPasswordReset = {
    email: email.toLowerCase().trim(),
    code,
    setAtMs: Date.now(),
  };
}

/** Returns pending session if fresh and matches the given email. */
export function getPendingPasswordReset(
  email: string,
): { code: string } | null {
  const e = email.toLowerCase().trim();
  if (!pendingPasswordReset || pendingPasswordReset.email !== e) return null;
  if (Date.now() - pendingPasswordReset.setAtMs > TTL_MS) {
    pendingPasswordReset = null;
    return null;
  }
  return { code: pendingPasswordReset.code };
}

export function clearPendingPasswordReset() {
  pendingPasswordReset = null;
}
