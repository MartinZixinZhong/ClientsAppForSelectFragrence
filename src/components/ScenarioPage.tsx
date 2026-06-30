import type { Catalog, ScenarioId } from '../domain/types';
import { MachineCard } from './MachineCard';
import { ProductCard } from './ProductCard';

interface ScenarioPageProps {
  catalog: Catalog;
  scenarioId: ScenarioId;
  scentLiters: Record<string, number>;
  machineQuantities: Record<string, number>;
  onChangeScentLiters: (scentId: string, liters: number) => void;
  onChangeMachineQuantity: (machineId: string, quantity: number) => void;
  onBackHome: () => void;
}

export function ScenarioPage({
  catalog,
  scenarioId,
  scentLiters,
  machineQuantities,
  onChangeScentLiters,
  onChangeMachineQuantity,
  onBackHome,
}: ScenarioPageProps) {
  const scenario = catalog.scenarios.find((item) => item.id === scenarioId);
  const scents = catalog.scents.filter((scent) => scent.scenarioIds.includes(scenarioId));
  const recommendedScents = scents.filter((scent) => scent.isRecommended || scent.isRegularStock);
  const inquiryScents = scents.filter((scent) => !scent.isRecommended && !scent.isRegularStock);
  const machines = catalog.machines.filter((machine) => machine.scenarioIds.includes(scenarioId));

  return (
    <main className="screen">
      <button className="text-button back-button" type="button" onClick={onBackHome}>
        返回首页
      </button>
      <section className="hero compact">
        <p className="eyebrow">Scenario Recommendation</p>
        <h1>{scenario?.name}</h1>
        <p>{scenario?.subtitle}</p>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>Recommended Scents</span>
          <h2>推荐/常备香型</h2>
        </div>
        {recommendedScents.map((scent) => (
          <ProductCard
            key={scent.id}
            scent={scent}
            liters={scentLiters[scent.id] ?? 0}
            onChangeLiters={(liters) => onChangeScentLiters(scent.id, liters)}
          />
        ))}
      </section>

      {inquiryScents.length > 0 ? (
        <section className="section">
          <div className="section-heading">
            <span>Inquiry Only</span>
            <h2>更多可询香型</h2>
          </div>
          {inquiryScents.map((scent) => (
            <ProductCard
              key={scent.id}
              scent={scent}
              liters={scentLiters[scent.id] ?? 0}
              onChangeLiters={(liters) => onChangeScentLiters(scent.id, liters)}
            />
          ))}
        </section>
      ) : null}

      <section className="section">
        <div className="section-heading">
          <span>Diffuser Machines</span>
          <h2>推荐扩香机</h2>
        </div>
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            quantity={machineQuantities[machine.id] ?? 0}
            onChangeQuantity={(quantity) => onChangeMachineQuantity(machine.id, quantity)}
          />
        ))}
      </section>
    </main>
  );
}
