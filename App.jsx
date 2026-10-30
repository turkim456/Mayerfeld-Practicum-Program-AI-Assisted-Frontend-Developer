import dishImage0 from './images/tomato-soup.jpg';
import dishImage1 from './images/calamari.jpg';
import dishImage2 from './images/burrata-toast.jpg';
import dishImage3 from './images/olives.jpg';
import dishImage4 from './images/roasted-chicken.jpg';
import dishImage5 from './images/salmon.jpg';
import dishImage6 from './images/beef-short-rib.jpg';
import dishImage7 from './images/mushroom-risotto.jpg';
import dishImage8 from './images/chicken-pesto-pasta.jpg';
import dishImage9 from './images/cauliflower-steak.jpg';
import dishImage10 from './images/brownie.jpg';
import dishImage11 from './images/cheesecake.jpg';
import dishImage12 from './images/fruit-tart.jpg';
import dishImage13 from './images/tiramisu.jpg';

function DishCard({ name, description, price, image, alt, width, height }) {
  return (
    <article>
      <img className="dish-image" src={image} alt={alt} width={width} height={height} loading="lazy" />
      <h4>{name}</h4>
      <p>{description}</p>
      <p className="price">${price}</p>
    </article>
  );
}

export default function App() {
  return (
    <section id="menu">
            <p className="eyebrow">Our menu</p>
            <h2>Made to be enjoyed</h2>
            <p className="section-intro">From the first bite to the last, find your new favorite.</p>
            <nav className="menu-links" aria-label="Menu categories">
                <a href="#starters">Starters</a>
                <a href="#main-dishes">Main dishes</a>
                <a href="#desserts">Desserts</a>
            </nav>
            <section className="menu-category" id="starters">
                <h3>Starters</h3>
                <DishCard
                    name="Roasted tomato soup"
                    description="Slow-roasted tomatoes with fresh herbs and warm sourdough."
                    price={8}
                    image={dishImage0}
                    alt="Tomato soup garnished with fresh leaves and a breadstick"
                    width={1400}
                    height={934}
                />
                <DishCard
                    name="Crispy calamari"
                    description="Lightly fried calamari served with lemon and herb aioli."
                    price={12}
                    image={dishImage1}
                    alt="Golden fried calamari rings with lemon and dipping sauce"
                    width={1200}
                    height={800}
                />
                <DishCard
                    name="Burrata toast"
                    description="Fresh burrata, ripe tomatoes, and basil on toasted sourdough."
                    price={11}
                    image={dishImage2}
                    alt="Burrata cheese with herbs, olive oil and crisp toast"
                    width={1200}
                    height={1601}
                />
                <DishCard
                    name="House olives"
                    description="Mixed olives marinated with citrus, garlic, and rosemary."
                    price={6}
                    image={dishImage3}
                    alt="Green and black olives arranged in silver serving bowls"
                    width={1200}
                    height={1800}
                />
            </section>

            <section className="menu-category" id="main-dishes">
                <h3>Main Dishes</h3>
                <DishCard
                    name="Herb-roasted chicken"
                    description="Roasted chicken with seasonal vegetables and creamy mashed potatoes."
                    price={22}
                    image={dishImage4}
                    alt="Roasted chicken with vegetables and lemon in a baking dish"
                    width={1200}
                    height={800}
                />
                <DishCard
                    name="Pan-seared salmon"
                    description="Salmon with lemon butter, rice pilaf, and grilled asparagus."
                    price={26}
                    image={dishImage5}
                    alt="Salmon served with asparagus and rice"
                    width={1400}
                    height={933}
                />
                <DishCard
                    name="Slow-braised beef short rib"
                    description="Beef braised until tender, served with mashed potatoes and roasted carrots."
                    price={29}
                    image={dishImage6}
                    alt="Braised beef short ribs served on a plate"
                    width={3008}
                    height={2000}
                />
                <DishCard
                    name="Mushroom risotto"
                    description="Creamy Arborio rice with roasted mushrooms, Parmesan, and fresh thyme."
                    price={21}
                    image={dishImage7}
                    alt="Creamy mushroom risotto served with crispy toppings"
                    width={1200}
                    height={795}
                />
                <DishCard
                    name="Chicken pesto pasta"
                    description="Grilled chicken and penne tossed with basil pesto and Parmesan."
                    price={20}
                    image={dishImage8}
                    alt="Pesto pasta with chicken served in a white dish"
                    width={1200}
                    height={800}
                />
                <DishCard
                    name="Roasted cauliflower steak"
                    description="Spiced cauliflower with herbed yogurt, chickpeas, and toasted almonds."
                    price={18}
                    image={dishImage9}
                    alt="Golden roasted cauliflower steaks served on a plate"
                    width={1200}
                    height={1797}
                />
            </section>

            <section className="menu-category" id="desserts">
                <h3>Desserts</h3>
                <DishCard
                    name="Warm chocolate brownie"
                    description="Rich chocolate brownie served warm with vanilla ice cream."
                    price={9}
                    image={dishImage10}
                    alt="Chocolate brownie drizzled with chocolate sauce"
                    width={1400}
                    height={2098}
                />
                <DishCard
                    name="New York cheesecake"
                    description="Creamy baked cheesecake with a buttery biscuit base and berry sauce."
                    price={8}
                    image={dishImage11}
                    alt="Slice of creamy cheesecake with strawberries and a biscuit base"
                    width={1200}
                    height={1600}
                />
                <DishCard
                    name="Seasonal fruit tart"
                    description="Flaky pastry filled with vanilla cream and fresh seasonal fruit."
                    price={8}
                    image={dishImage12}
                    alt="Fruit tart topped with mixed berries and kiwi"
                    width={1200}
                    height={1800}
                />
                <DishCard
                    name="Tiramisu"
                    description="Espresso-soaked sponge layered with mascarpone and cocoa."
                    price={9}
                    image={dishImage13}
                    alt="Tiramisu dusted with cocoa and served with wooden spoons"
                    width={1200}
                    height={800}
                />
            </section>
        </section>
  );
}
