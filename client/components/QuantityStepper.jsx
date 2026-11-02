// The parent owns the value; this component only requests changes.
export default function QuantityStepper({ value, onChange, name }) {
  return (
    <div className="mt-4 flex items-center gap-3" role="group" aria-label={`Quantity for ${name}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value === 0}
        aria-label={`Decrease quantity for ${name}`}
        className="h-11 w-11 cursor-pointer rounded border border-border hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>
      <output className="min-w-6 text-center font-bold" aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`Increase quantity for ${name}`}
        className="h-11 w-11 cursor-pointer rounded border border-border hover:bg-accent"
      >
        +
      </button>
    </div>
  );
}
