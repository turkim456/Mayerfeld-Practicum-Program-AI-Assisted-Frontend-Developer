import { dishes } from '../data/dishes.js';
function DishCard({ dish }) {
  return (
    <article>
      <img className="dish-image" src={dish.image} alt={dish.alt} width={dish.width} height={dish.height} loading="lazy" />
      <h4>{dish.name}</h4>
      <p>{dish.description}</p>
      <p className="price">${dish.price}</p>
    </article>
  );
}

export default function Menu() {
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
        {dishes.filter((dish) => dish.category === 'starters').map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </section>

      <section className="menu-category" id="main-dishes">
        <h3>Main Dishes</h3>
        {dishes.filter((dish) => dish.category === 'main-dishes').map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </section>

      <section className="menu-category" id="desserts">
        <h3>Desserts</h3>
        {dishes.filter((dish) => dish.category === 'desserts').map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </section>
    </section>
  );
}
