import salmonImage from '../images/salmon.jpg';

export default function Hero() {
  return (
    <section className="grid grid-cols-1 bg-ink text-white md:grid-cols-2" id="home">
        <div className="self-center px-4 py-10 sm:px-6 md:p-8 lg:p-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-accent">Fresh ingredients. Bold flavors.</p>
            <h1 className="mb-6 max-w-[580px] font-serif text-4xl sm:text-5xl lg:text-7xl leading-tight tracking-[-2px]">Savor every moment.</h1>
            <p className="mb-7 max-w-[560px] text-lg text-[#dde7ed]">Seasonal ingredients, flavorful dishes, and a welcoming atmosphere. Savora is a place to enjoy great food and even better company.</p>
            <a className="inline-block rounded bg-accent px-6 py-3 font-bold text-ink transition-colors hover:bg-[#c7f2e0]" href="#menu">Explore our menu &rarr;</a>
        </div>
        <img className="h-64 w-full object-cover sm:h-80 md:h-full md:min-h-[480px]" src={salmonImage} alt="Salmon served with asparagus and rice on a plate" width="1400" height="933" />
    </section>
  );
}
