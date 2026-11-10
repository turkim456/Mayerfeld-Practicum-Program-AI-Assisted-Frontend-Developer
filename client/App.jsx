import CheckoutSimulation from './components/CheckoutSimulation.jsx';
import CheckoutSuccess from './components/CheckoutSuccess.jsx';
import Header from './components/Header.jsx';
import Main from './components/Main.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Header />
      {window.location.pathname === '/checkout/success' ? <CheckoutSuccess /> : window.location.pathname === '/checkout/simulation' ? <CheckoutSimulation /> : <Main />}
      <Footer />
    </>
  );
}
