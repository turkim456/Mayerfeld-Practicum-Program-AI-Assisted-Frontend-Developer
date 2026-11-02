import { dishes } from '../data/dishes.js';
function DishCard({ dish }) {
  return (
    <article className="overflow-hidden rounded border border-border bg-white">
      <img className="h-[230px] w-full object-cover" src={dish.image} alt={dish.alt} width={dish.width} height={dish.height} loading="lazy" />
      <div className="p-5">
      <h4 className="mb-3 font-serif text-xl font-bold leading-tight">{dish.name}</h4>
      <p className="mb-4 text-sm text-muted">{dish.description}</p>
      <p className="text-lg font-bold">${dish.price}</p>
      </div>
    </article>
  );
}

export default function Menu() {
  return (
    <section id="menu" className="bg-white px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[1216px]">
      <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-center text-[#286f5d]">Our menu</p>
      <h2 className="mb-4 font-serif text-3xl leading-tight md:text-4xl lg:text-5xl text-center">Made to be enjoyed</h2>
      <p className="mb-6 text-center text-muted">From the first bite to the last, find your new favorite.</p>
      <nav className="mb-10 flex flex-wrap justify-center gap-5 md:gap-8" aria-label="Menu categories">
        <a className="border-b-2 border-accent pb-2 hover:border-ink" href="#starters">Starters</a>
        <a className="border-b-2 border-accent pb-2 hover:border-ink" href="#main-dishes">Main dishes</a>
        <a className="border-b-2 border-accent pb-2 hover:border-ink" href="#desserts">Desserts</a>
      </nav>
      <section className="mt-9 mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" id="starters">
        <h3 className="col-span-full mb-1 font-serif text-2xl font-bold leading-tight">Starters</h3>
        {dishes.filter((dish) => dish.category === 'starters').map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </section>

      <section className="mt-9 mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" id="main-dishes">
        <h3 className="col-span-full mb-1 font-serif text-2xl font-bold leading-tight">Main Dishes</h3>
        {dishes.filter((dish) => dish.category === 'main-dishes').map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </section>

      <section className="mt-9 mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" id="desserts">
        <h3 className="col-span-full mb-1 font-serif text-2xl font-bold leading-tight">Desserts</h3>
        {dishes.filter((dish) => dish.category === 'desserts').map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </section>
      </div>
    </section>
  );
}
