import salmonImage from '../images/salmon.jpg';

export default function Hero() {
  return (
    <section className="hero" id="home">
        <div className="hero-content">
            <p className="eyebrow">Fresh ingredients. Bold flavors.</p>
            <h1>Savor every moment.</h1>
            <p>Seasonal ingredients, flavorful dishes, and a welcoming atmosphere. Savora is a place to enjoy great food and even better company.</p>
            <a className="hero-button" href="#menu">Explore our menu &rarr;</a>
        </div>
        <img src={salmonImage} alt="Salmon served with asparagus and rice on a plate" width="1400" height="933" />
    </section>
  );
}
