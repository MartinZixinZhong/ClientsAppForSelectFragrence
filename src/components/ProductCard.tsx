import type { Scent } from '../domain/types';

interface ProductCardProps {
  scent: Scent;
  liters: number;
  onChangeLiters: (liters: number) => void;
}

export function ProductCard({ scent, liters, onChangeLiters }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="card-main">
        <span className="pill">{scent.isRegularStock ? '常备推荐' : '更多可询'}</span>
        <h3>{scent.name}</h3>
        <p>{scent.description}</p>
        <small>{scent.toneNote}</small>
      </div>
      <div className="price-tiers">
        {scent.priceTiers.map((tier) => (
          <span key={tier.label}>
            {tier.label}：{tier.referencePriceText}
          </span>
        ))}
      </div>
      <label className="field">
        采购升数
        <input
          min="0"
          step="0.5"
          type="number"
          value={liters}
          onChange={(event) => onChangeLiters(Number(event.target.value))}
        />
      </label>
    </article>
  );
}
