import { useState } from 'react';
import QuantityStepper from './QuantityStepper.jsx';
import { dishes } from '../data/dishes.js';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'starters', label: 'Starters' },
  { value: 'main-dishes', label: 'Main dishes' },
  { value: 'desserts', label: 'Desserts' },
];

function DishCard({ dish, quantity, onQuantityChange }) {
  return (
    <article className="overflow-hidden rounded border border-border bg-white">
      <img className="h-[230px] w-full object-cover" src={dish.image} alt={dish.alt} width={dish.width} height={dish.height} loading="lazy" />
      <div className="p-5">
        <h3 className="mb-3 font-serif text-xl font-bold leading-tight">{dish.name}</h3>
        <p className="mb-4 text-sm text-muted">{dish.description}</p>
        <p className="text-lg font-bold">${dish.price}</p>
        <QuantityStepper value={quantity} onChange={onQuantityChange} name={dish.name} />
      </div>
    </article>
  );
}

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState({});

  // Store each dish's quantity by its id, keeping the other quantities.
  function updateQuantity(dishId, value) {
    setQuantities((previous) => ({ ...previous, [dishId]: value }));
  }

  // Show every dish for All, otherwise show only the selected category.
  const filteredDishes = dishes.filter((dish) =>
    selectedCategory === 'all' || dish.category === selectedCategory
  );

  return (
    <section id="menu" className="bg-white px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[1216px]">
        <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-center text-[#286f5d]">Our menu</p>
        <h2 className="mb-4 font-serif text-3xl leading-tight md:text-4xl lg:text-5xl text-center">Made to be enjoyed</h2>
        <p className="mb-6 text-center text-muted">From the first bite to the last, find your new favorite.</p>

        <div className="mb-10 flex flex-wrap justify-center gap-5 md:gap-8" role="group" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
              aria-pressed={selectedCategory === category.value}
              className="cursor-pointer border-b-2 border-accent pb-2 hover:border-ink aria-pressed:border-ink aria-pressed:font-bold"
            >
              {category.label}
            </button>
          ))}
        </div>

        <p className="mb-4 text-center text-sm text-muted" aria-live="polite">
          Showing {filteredDishes.length} dishes
        </p>
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              quantity={quantities[dish.id] ?? 0}
              onQuantityChange={(value) => updateQuantity(dish.id, value)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
