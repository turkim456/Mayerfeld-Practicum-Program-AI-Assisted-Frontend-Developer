export default function Footer() {
  return (
    <footer>
        <div className="footer-details" id="visit">
            <section>
                <h2 className="footer-brand">Savora</h2>
                <p>Good food. Great company.</p>
            </section>
            <section>
                <h2>Visit Savora</h2>
                <address>123 Coffee Street, Riyadh, Saudi Arabia</address>
            </section>

            <section id="hours">
                <h2>Opening hours</h2>
                <p>Monday–Friday: 8:00 AM–10:00 PM</p>
                <p>Saturday–Sunday: 9:00 AM–11:00 PM</p>
            </section>
        </div>

        <p className="footer-copyright">&copy; 2026 Savora</p>
    </footer>
  );
}
