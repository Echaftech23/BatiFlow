import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

type ApiErr = { field?: string; message?: string };

export function applyApiErrorsToForm<T extends FieldValues>(
  body: unknown,
  setError: UseFormSetError<T>,
  setRootMessage: (msg: string | null) => void,
  knownFields: readonly string[],
): string | null {
  const b =
    body && typeof body === 'object'
      ? (body as { errors?: ApiErr[]; message?: string | string[] })
      : null;
  setRootMessage(null);
  const rootParts: string[] = [];

  if (Array.isArray(b?.errors)) {
    for (const e of b.errors) {
      const msg = typeof e.message === 'string' ? e.message : 'Erreur';
      const f = typeof e.field === 'string' ? e.field : '';
      if (f && knownFields.includes(f)) setError(f as Path<T>, { message: msg });
      else if (f || msg) rootParts.push(msg);
    }
  }

  if (typeof b?.message === 'string' && b.message.length > 0) rootParts.push(b.message);
  else if (Array.isArray(b?.message)) rootParts.push(...b.message.map(String));

  const root = rootParts.length > 0 ? [...new Set(rootParts)].join(' ') : null;
  if (root) setRootMessage(root);
  return root;
}
