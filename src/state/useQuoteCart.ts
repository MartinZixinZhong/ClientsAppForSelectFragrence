import { useEffect, useMemo, useState } from 'react';
import type { QuoteCart, ScenarioId } from '../domain/types';

const STORAGE_KEY = 'glassmartin.quoteCart';

const emptyCart: QuoteCart = {
  scenarioId: null,
  scents: [],
  machines: [],
};

function readInitialCart(): QuoteCart {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return emptyCart;
  }

  try {
    return JSON.parse(stored) as QuoteCart;
  } catch {
    return emptyCart;
  }
}

export function useQuoteCart() {
  const [cart, setCart] = useState<QuoteCart>(readInitialCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return useMemo(
    () => ({
      cart,
      setScenario: (scenarioId: ScenarioId) => setCart((current) => ({ ...current, scenarioId })),
      setScentLiters: (scentId: string, liters: number) =>
        setCart((current) => ({
          ...current,
          scents: [
            ...current.scents.filter((item) => item.scentId !== scentId),
            { scentId, liters },
          ].filter((item) => item.liters > 0),
        })),
      setMachineQuantity: (machineId: string, quantity: number) =>
        setCart((current) => ({
          ...current,
          machines: [
            ...current.machines.filter((item) => item.machineId !== machineId),
            { machineId, quantity },
          ].filter((item) => item.quantity > 0),
        })),
      clearCart: () => setCart(emptyCart),
    }),
    [cart],
  );
}
