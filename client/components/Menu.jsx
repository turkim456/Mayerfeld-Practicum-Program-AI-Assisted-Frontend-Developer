import { useEffect, useState } from 'react';
import QuantityStepper from './QuantityStepper.jsx';


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
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadMenu() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/dishes', { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load the menu.');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid menu response.');
        setDishes(data);
      } catch (error) {
        if (error.name !== 'AbortError') setError('Unable to load the menu. Please try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadMenu();
    return () => controller.abort();
  }, [attempt]);

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
    <section id="menu" className="bg-white px-4 py-12 sm:px-6 md:py-16">
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
          {loading ? 'Loading menu…' : error ? '' : `Showing ${filteredDishes.length} dishes`}
        </p>
        {error && (
          <div className="mb-6 text-center">
            <p role="alert" className="text-red-700">{error}</p>
            <button type="button" onClick={() => setAttempt(attempt + 1)} className="mt-3 cursor-pointer rounded bg-accent px-5 py-3 font-bold">Retry menu</button>
          </div>
        )}
        {!loading && !error && filteredDishes.length === 0 && <p className="mb-6 text-center">No dishes in this category yet.</p>}
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
