import type { Machine } from '../domain/types';

interface MachineCardProps {
  machine: Machine;
  quantity: number;
  onChangeQuantity: (quantity: number) => void;
}

export function MachineCard({ machine, quantity, onChangeQuantity }: MachineCardProps) {
  return (
    <article className="machine-card">
      <img src={machine.image} alt={machine.name} />
      <div className="card-main">
        <span className="pill">{machine.model}</span>
        <h3>{machine.name}</h3>
        <p>{machine.coverageText}</p>
        <small>{machine.sellingPoints.join(' / ')}</small>
      </div>
      <label className="field">
        数量
        <input
          min="0"
          step="1"
          type="number"
          value={quantity}
          onChange={(event) => onChangeQuantity(Number(event.target.value))}
        />
      </label>
    </article>
  );
}
