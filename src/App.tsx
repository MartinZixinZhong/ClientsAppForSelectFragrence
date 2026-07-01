import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { PromoModal } from './components/PromoModal';
import { QuoteCart } from './components/QuoteCart';
import { ScenarioPage } from './components/ScenarioPage';
import { loadCatalog } from './data/loadCatalog';
import type { Catalog, ScenarioId } from './domain/types';
import { useQuoteCart } from './state/useQuoteCart';

export function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState('');
  const [showPromo, setShowPromo] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const { cart, setScenario, setScentLiters, setMachineQuantity, clearCart } = useQuoteCart();

  useEffect(() => {
    loadCatalog()
      .then(setCatalog)
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  if (error) {
    return (
      <main className="screen">
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!catalog) {
    return (
      <main className="screen">
        <p>正在加载 GlassMartin 产品资料...</p>
      </main>
    );
  }

  const cartCount = cart.scents.length + cart.machines.length;
  const scentLiters = Object.fromEntries(cart.scents.map((item) => [item.scentId, item.liters]));
  const machineQuantities = Object.fromEntries(cart.machines.map((item) => [item.machineId, item.quantity]));
  const showScenario = cart.scenarioId && !isHome;

  return (
    <>
      {showPromo ? <PromoModal promotion={catalog.promotion} onClose={() => setShowPromo(false)} /> : null}
      <Header
        brandName={catalog.settings.brandName}
        brandSubtitle={catalog.settings.brandSubtitle}
        cartCount={cartCount}
        onOpenCart={() => setShowCart(true)}
      />
      {showScenario ? (
        <ScenarioPage
          catalog={catalog}
          scenarioId={cart.scenarioId as ScenarioId}
          scentLiters={scentLiters}
          machineQuantities={machineQuantities}
          onChangeScentLiters={setScentLiters}
          onChangeMachineQuantity={setMachineQuantity}
          onBackHome={() => setIsHome(true)}
        />
      ) : (
        <Home
          catalog={catalog}
          onSelectScenario={(scenario) => {
            setScenario(scenario.id);
            setIsHome(false);
          }}
          onAddPackage={(packageOption) => {
            setScenario(packageOption.scenarioId);
            setIsHome(false);
            packageOption.scentIds.forEach((scentId) => setScentLiters(scentId, packageOption.suggestedLiters));
            packageOption.machineItems.forEach((item) => setMachineQuantity(item.machineId, item.quantity));
            setShowCart(true);
          }}
        />
      )}
      {showCart ? (
        <QuoteCart cart={cart} catalog={catalog} onClose={() => setShowCart(false)} onClear={clearCart} />
      ) : null}
    </>
  );
}
