import { authClient } from '../auth-client.js';

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="bg-white">
        <nav className="mx-auto flex min-h-[88px] max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 md:gap-7 md:px-8">
            <a className="w-full font-serif text-[2.5rem] font-bold tracking-[-2px] md:mr-auto md:w-auto" href="/#home">Savora</a>
            <a className="text-sm hover:underline hover:underline-offset-6" href="/#menu">Our menu</a>
            <a className="text-sm hover:underline hover:underline-offset-6" href="/#about">About</a>
            <a className="text-sm hover:underline hover:underline-offset-6" href="/#visit">Visit us</a>
            <a className="rounded bg-ink px-5 py-3 text-sm text-white hover:underline hover:underline-offset-6" href="/#reservation">Reservations</a>
            <a className="text-sm hover:underline" href="/#account">
              {isPending ? 'Account' : session ? 'My account / Sign out' : 'Sign in'}
            </a>
        </nav>
    </header>
  );
}
