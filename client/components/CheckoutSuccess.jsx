import { useEffect, useState } from 'react';

const money = (cents, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);

export default function CheckoutSuccess() {
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('Waiting for payment confirmation…');
  const [attempt, setAttempt] = useState(0);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    let timer;
    let count = 0;
    const id = new URLSearchParams(window.location.search).get('order_id');
    setChecking(true);
    setMessage('Waiting for payment confirmation…');
    async function check() {
      try {
        if (!id) throw new Error('The order reference is missing.');
        const response = await fetch('/api/orders/' + encodeURIComponent(id), { signal: controller.signal, cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to check your order.');
        setOrder(data);
        if (data.status === 'paid') {
          setMessage('Simulated payment confirmed. No real money was charged.');
          setChecking(false);
        } else if (++count < 15) {
          timer = setTimeout(check, 2000);
        } else {
          setMessage('Your payment confirmation is still pending. Check again in a moment.');
          setChecking(false);
        }
      } catch (error) {
        if (error.name !== 'AbortError') { setMessage(error.message); setChecking(false); }
      }
    }
    check();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [attempt]);
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#286f5d]">Savora · Payment simulation</p>
      <h1 className="mb-5 font-serif text-4xl">{order?.status === 'paid' ? 'Your demo order is confirmed' : 'Checking your order'}</h1>
      <p role="status" className="mb-6">{message}</p>
      {order && <section className="mb-6 rounded border border-border p-5">
        <h2 className="mb-3 font-bold">Order details</h2>
        <p className="mb-3 break-all text-sm">Reference: {order.id}</p>
        <p className="mb-4 font-bold">Status: {order.status === 'paid' ? 'Paid (simulation)' : 'Pending confirmation'}</p>
        <ul>{order.items.map((item, index) => <li key={index} className="mb-2 flex justify-between gap-4">
          <span>{item.quantity} × {item.dish_name}</span><span>{money(item.unit_price_cents * item.quantity, order.currency)}</span>
        </li>)}</ul>
        <p className="mt-4 font-bold">Total: {money(order.total_cents, order.currency)}</p>
      </section>}
      {!checking && order?.status !== 'paid' && <button className="mr-5 rounded bg-accent px-5 py-3 font-bold" onClick={() => setAttempt(attempt + 1)}>Check again</button>}
      <a className="underline" href="/#menu">Back to menu</a>
      {!checking && !order && <p className="mt-4"><a className="underline" href="/#account">Sign in to view your order</a></p>}
    </main>
  );
}
