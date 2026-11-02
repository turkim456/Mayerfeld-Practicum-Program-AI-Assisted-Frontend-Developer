export default function Footer() {
  return (
    <footer className="bg-ink px-4 pt-12 pb-6 sm:px-6 text-[#dde7ed]">
      <div className="mx-auto max-w-[1216px]">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10" id="visit">
            <section>
                <h2 className="mb-4 font-serif text-[2.5rem] font-bold leading-tight text-white">Savora</h2>
                <p className="mb-2 text-sm">Good food. Great company.</p>
            </section>
            <section>
                <h2 className="mb-4 font-bold leading-tight text-accent">Visit Savora</h2>
                <address className="mb-2 text-sm not-italic">123 Coffee Street, Riyadh, Saudi Arabia</address>
            </section>

            <section id="hours">
                <h2 className="mb-4 font-bold leading-tight text-accent">Opening hours</h2>
                <p className="mb-2 text-sm">Monday–Friday: 8:00 AM–10:00 PM</p>
                <p className="mb-2 text-sm">Saturday–Sunday: 9:00 AM–11:00 PM</p>
            </section>
        </div>

        <p className="mt-8 border-t border-[#435361] pt-5 text-sm">&copy; 2026 Savora</p>
      </div>
    </footer>
  );
}
