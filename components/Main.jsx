import Hero from './Hero.jsx';
import Menu from './Menu.jsx';
import restaurantImage from '../images/restaurant.jpg';

export default function Main() {
  return (
    <main>
        <Hero />

        <Menu />

        <section id="about">
            <div className="about-content">
                <p className="eyebrow">About Savora</p>
                <h2>Good food.<br />Great company.</h2>
                <p>At Savora, we believe that great food brings people together. Our menu pairs familiar favorites with seasonal ingredients, all prepared with care. Whether it is a relaxed lunch or a special occasion, you are always welcome at our table.</p>
                <a className="hero-button" href="#reservation">Reserve a table &rarr;</a>
            </div>
            <img src={restaurantImage} alt="Contemporary dining space with hanging plants and tables" width="1400" height="2100" loading="lazy" />
        </section>

        <section id="reservation">
            <p className="eyebrow">Reservations</p>
            <h2>A seat at Savora</h2>
            <p>Good food is worth sharing. Plan your next visit with us.</p>

            <form>
                <p>
                    <label htmlFor="guest-name">Your name</label>
                    <input type="text" id="guest-name" name="guest-name" placeholder="Your name" autoComplete="name" required />
                </p>

                <p>
                    <label htmlFor="reservation-date">Date</label>
                    <input type="date" id="reservation-date" name="reservation-date" required />
                </p>

                <p>
                    <label htmlFor="reservation-time">Time</label>
                    <input type="time" id="reservation-time" name="reservation-time" required />
                </p>

                <p>
                    <label htmlFor="guest-count">Number of guests</label>
                    <select id="guest-count" name="guest-count" required>
                        <option value="">Choose guests</option>
                        <option value="1">1 guest</option>
                        <option value="2">2 guests</option>
                        <option value="3">3 guests</option>
                        <option value="4">4 guests</option>
                        <option value="5">5 guests</option>
                        <option value="6">6 guests</option>
                    </select>
                </p>

                <button type="submit">Request a table</button>
            </form>
        </section>
    </main>
  );
}
