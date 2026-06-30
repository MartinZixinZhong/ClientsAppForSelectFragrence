interface HeaderProps {
  brandName: string;
  brandSubtitle: string;
  cartCount: number;
  onOpenCart: () => void;
}

export function Header({ brandName, brandSubtitle, cartCount, onOpenCart }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <img src="/images/glassmartin-logo.jpg" alt={brandName} />
        <div>
          <strong>{brandName}</strong>
          <span>{brandSubtitle}</span>
        </div>
      </div>
      <button className="cart-button" type="button" onClick={onOpenCart}>
        清单 {cartCount}
      </button>
    </header>
  );
}
