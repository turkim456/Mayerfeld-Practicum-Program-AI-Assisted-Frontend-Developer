function DishCard({ name, description, price }) {
  return (
    <article>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>${price}</p>
    </article>
  );
}

export default function App() {
  return (
    <section id="menu">
      <h2>Our menu</h2>

      <DishCard
        name="Roasted tomato soup"
        description="Slow-roasted tomatoes with fresh herbs and warm sourdough."
        price={8}
      />

      <DishCard
        name="Crispy calamari"
        description="Lightly fried calamari served with lemon and herb aioli."
        price={12}
      />

      <DishCard
        name="Burrata toast"
        description="Fresh burrata, ripe tomatoes, and basil on toasted sourdough."
        price={11}
      />

      <DishCard
        name="House olives"
        description="Mixed olives marinated with citrus, garlic, and rosemary."
        price={6}
      />

      <DishCard
        name="Herb-roasted chicken"
        description="Roasted chicken with seasonal vegetables and creamy mashed potatoes."
        price={22}
      />

      <DishCard
        name="Pan-seared salmon"
        description="Salmon with lemon butter, rice pilaf, and grilled asparagus."
        price={26}
      />

      <DishCard
        name="Slow-braised beef short rib"
        description="Beef braised until tender, served with mashed potatoes and roasted carrots."
        price={29}
      />

      <DishCard
        name="Mushroom risotto"
        description="Creamy Arborio rice with roasted mushrooms, Parmesan, and fresh thyme."
        price={21}
      />

      <DishCard
        name="Chicken pesto pasta"
        description="Grilled chicken and penne tossed with basil pesto and Parmesan."
        price={20}
      />

      <DishCard
        name="Roasted cauliflower steak"
        description="Spiced cauliflower with herbed yogurt, chickpeas, and toasted almonds."
        price={18}
      />

      <DishCard
        name="Warm chocolate brownie"
        description="Rich chocolate brownie served warm with vanilla ice cream."
        price={9}
      />

      <DishCard
        name="New York cheesecake"
        description="Creamy baked cheesecake with a buttery biscuit base and berry sauce."
        price={8}
      />

      <DishCard
        name="Seasonal fruit tart"
        description="Flaky pastry filled with vanilla cream and fresh seasonal fruit."
        price={8}
      />

      <DishCard
        name="Tiramisu"
        description="Espresso-soaked sponge layered with mascarpone and cocoa."
        price={9}
      />
    </section>
  );
}
