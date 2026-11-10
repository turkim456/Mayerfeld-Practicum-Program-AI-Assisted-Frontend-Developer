import { useEffect, useState } from 'react';

const money = (value, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value / 100);

export default function CheckoutSimulation() {
  const orderId = new URLSearchParams(window.location.search).get('order_id');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        if (!orderId) throw new Error('Missing order reference.');
        const response = await fetch('/api/orders/' + encodeURIComponent(orderId), { signal: controller.signal, cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load your order.');
        if (!data.simulation) throw new Error('This order is not a simulated checkout.');
        setOrder(data);
      } catch (error) { if (error.name !== 'AbortError') setError(error.message); }
    }
    load();
    return () => controller.abort();
  }, [orderId]);

  async function simulate(outcome) {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/payments/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, outcome }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to complete simulation.');
      if (data.url) window.location.assign(data.url);
      else { setError(data.message); setBusy(false); }
    } catch (error) { setError(error.message); setBusy(false); }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#286f5d]">Savora · Payment simulation</p>
      <h1 className="mb-5 font-serif text-4xl">Try the checkout</h1>
      <p className="mb-6 rounded border border-border bg-[#f5faf7] p-4">This is a portfolio demonstration. No card details are needed and no money is charged.</p>
      {!order && !error && <p role="status">Loading your order…</p>}
      {order && <section className="mb-6 rounded border border-border p-5">
        <h2 className="mb-3 font-bold">Your order</h2>
        <ul>{order.items.map((item, index) => <li key={index} className="mb-2 flex justify-between gap-4"><span>{item.quantity} × {item.dish_name}</span><span>{money(item.unit_price_cents * item.quantity, order.currency)}</span></li>)}</ul>
        <p className="mt-4 font-bold">Total: {money(order.total_cents, order.currency)}</p>
      </section>}
      {error && <p role="alert" className="mb-5 text-red-700">{error}</p>}
      {order && <div className="mb-6 flex flex-wrap gap-3">
        <button onClick={() => simulate('approved')} disabled={busy} className="rounded bg-ink px-5 py-3 font-bold text-white disabled:opacity-40">{busy ? 'Confirming simulation…' : order.status === 'paid' ? 'View confirmation' : 'Simulate successful payment'}</button>
        {order.status !== 'paid' && <button onClick={() => simulate('declined')} disabled={busy} className="rounded border border-border px-5 py-3 disabled:opacity-40">Simulate declined payment</button>}
      </div>}
      <a href="/?checkout=cancelled#menu" className="underline">Cancel and return to menu</a>
      {!order && error && <p className="mt-4"><a href="/#account" className="underline">Sign in to view your order</a></p>}
    </main>
  );
}
