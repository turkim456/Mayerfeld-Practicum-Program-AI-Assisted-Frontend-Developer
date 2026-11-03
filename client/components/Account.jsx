import { useState } from 'react';
import { authClient } from '../auth-client.js';

export default function Account() {
  const { data: session, isPending, error: sessionError, refetch } = authClient.useSession();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = mode === 'signup'
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) setError(result.error.message || 'Unable to sign in. Please try again.');
      else setPassword('');
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally { setBusy(false); }
  }

  async function handleSignOut() {
    setBusy(true);
    setError('');
    try {
      const result = await authClient.signOut();
      if (result.error) setError('Unable to sign out. Please try again.');
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <section id="account" className="bg-white px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-md">
        <h2 className="mb-6 text-center font-serif text-3xl">Your Savora account</h2>
        {isPending ? (
          <p className="text-center" role="status">Checking your session…</p>
        ) : sessionError ? (
          <div className="text-center">
            <p role="alert">Unable to check your session. Please try again.</p>
            <button type="button" onClick={() => refetch()} className="mt-4 rounded bg-accent px-5 py-3 font-bold">Retry</button>
          </div>
        ) : session ? (
          <div className="text-center">
            <p className="mb-4 break-words">Welcome, {session.user.name}!</p>
            <button type="button" onClick={handleSignOut} disabled={busy} className="cursor-pointer rounded bg-ink px-6 py-3 font-bold text-white disabled:opacity-50">
              {busy ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {mode === 'signup' && (
                <label className="grid gap-1 text-sm font-semibold">Name
                  <input value={name} onChange={event => setName(event.target.value)} required maxLength={100} autoComplete="name" className="min-w-0 rounded border border-border px-3 py-3" />
                </label>
              )}
              <label className="grid gap-1 text-sm font-semibold">Email
                <input type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" className="min-w-0 rounded border border-border px-3 py-3" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">Password
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} required minLength={8} maxLength={128} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className="min-w-0 rounded border border-border px-3 py-3" />
              </label>
              <button disabled={busy} className="cursor-pointer rounded bg-accent px-6 py-3 font-bold disabled:opacity-50">
                {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            </form>
            <button type="button" disabled={busy} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setPassword(''); }} className="mt-4 cursor-pointer text-sm underline">
              {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
            </button>
          </>
        )}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      </div>
    </section>
  );
}
