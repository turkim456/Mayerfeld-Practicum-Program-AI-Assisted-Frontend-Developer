export default function Header() {
  return (
    <header className="bg-white">
        <nav className="mx-auto flex min-h-[88px] max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 md:gap-7 md:px-8">
            <a className="w-full font-serif text-[2.5rem] font-bold tracking-[-2px] md:mr-auto md:w-auto" href="#home">Savora</a>
            <a className="text-sm hover:underline hover:underline-offset-6" href="#menu">Our menu</a>
            <a className="text-sm hover:underline hover:underline-offset-6" href="#about">About</a>
            <a className="text-sm hover:underline hover:underline-offset-6" href="#visit">Visit us</a>
            <a className="rounded bg-ink px-5 py-3 text-sm text-white hover:underline hover:underline-offset-6" href="#reservation">Reservations</a>
        </nav>
    </header>
  );
}
