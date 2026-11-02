import Hero from './Hero.jsx';
import Menu from './Menu.jsx';
import restaurantImage from '../images/restaurant.jpg';

export default function Main() {
  return (
    <main>
        <Hero />

        <Menu />

        <section id="about" className="grid grid-cols-1 bg-ink text-white md:grid-cols-2">
            <div className="self-center px-4 py-10 sm:px-6 md:p-8 lg:p-16">
                <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-accent">About Savora</p>
                <h2 className="mb-6 font-serif text-3xl leading-tight sm:text-4xl lg:text-6xl">Good food.<br />Great company.</h2>
                <p className="mb-7 max-w-[560px] text-lg text-[#dde7ed]">At Savora, we believe that great food brings people together. Our menu pairs familiar favorites with seasonal ingredients, all prepared with care. Whether it is a relaxed lunch or a special occasion, you are always welcome at our table.</p>
                <a className="inline-block rounded bg-accent px-6 py-3 font-bold text-ink transition-colors hover:bg-[#c7f2e0]" href="#reservation">Reserve a table &rarr;</a>
            </div>
            <img className="h-64 w-full object-cover sm:h-80 md:h-full md:min-h-[480px] md:max-h-[540px]" src={restaurantImage} alt="Contemporary dining space with hanging plants and tables" width="1400" height="2100" loading="lazy" />
        </section>

        <section id="reservation" className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 md:px-8 md:py-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-[#286f5d]">Reservations</p>
            <h2 className="mb-4 font-serif text-3xl leading-tight md:text-4xl lg:text-5xl">A seat at Savora</h2>
            <p className="text-muted">Good food is worth sharing. Plan your next visit with us.</p>

            <form className="mt-7 grid grid-cols-1 items-end gap-4 text-left sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                <p className="flex min-w-0 flex-col gap-1.5">
                    <label className="text-sm font-semibold" htmlFor="guest-name">Your name</label>
                    <input className="min-h-12 w-full min-w-0 rounded border border-border bg-white px-3 py-2.5" type="text" id="guest-name" name="guest-name" placeholder="Your name" autoComplete="name" required />
                </p>

                <p className="flex min-w-0 flex-col gap-1.5">
                    <label className="text-sm font-semibold" htmlFor="reservation-date">Date</label>
                    <input className="min-h-12 w-full min-w-0 rounded border border-border bg-white px-3 py-2.5" type="date" id="reservation-date" name="reservation-date" required />
                </p>

                <p className="flex min-w-0 flex-col gap-1.5">
                    <label className="text-sm font-semibold" htmlFor="reservation-time">Time</label>
                    <input className="min-h-12 w-full min-w-0 rounded border border-border bg-white px-3 py-2.5" type="time" id="reservation-time" name="reservation-time" required />
                </p>

                <p className="flex min-w-0 flex-col gap-1.5">
                    <label className="text-sm font-semibold" htmlFor="guest-count">Number of guests</label>
                    <select className="min-h-12 w-full min-w-0 rounded border border-border bg-white px-3 py-2.5" id="guest-count" name="guest-count" required>
                        <option value="">Choose guests</option>
                        <option value="1">1 guest</option>
                        <option value="2">2 guests</option>
                        <option value="3">3 guests</option>
                        <option value="4">4 guests</option>
                        <option value="5">5 guests</option>
                        <option value="6">6 guests</option>
                    </select>
                </p>

                <button className="inline-block rounded bg-accent px-6 py-3 font-bold text-ink transition-colors hover:bg-[#c7f2e0] min-h-12 w-full cursor-pointer sm:w-auto sm:justify-self-start" type="submit">Request a table</button>
            </form>
        </section>
    </main>
  );
}
