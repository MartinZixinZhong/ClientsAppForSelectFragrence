import type { Promotion } from '../domain/types';

interface PromoModalProps {
  promotion: Promotion;
  onClose: () => void;
}

export function PromoModal({ promotion, onClose }: PromoModalProps) {
  if (!promotion.enabled) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="promo-title">
      <div className="promo-modal">
        <p className="eyebrow">GlassMartin</p>
        <h2 id="promo-title">{promotion.title}</h2>
        <p>{promotion.body}</p>
        <button className="primary-button" type="button" onClick={onClose}>
          {promotion.buttonText}
        </button>
        <button className="text-button" type="button" onClick={onClose}>
          先看看首页
        </button>
      </div>
    </div>
  );
}
