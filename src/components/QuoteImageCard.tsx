import type { QuoteSummary } from '../domain/quote';
import type { Catalog } from '../domain/types';

interface QuoteImageCardProps {
  catalog: Catalog;
  summary: QuoteSummary;
}

export function QuoteImageCard({ catalog, summary }: QuoteImageCardProps) {
  return (
    <div className="quote-image-card">
      <div className="quote-image-brand">
        <img src="/images/glassmartin-logo.jpg" alt="GlassMartin" />
        <div>
          <strong>{catalog.settings.brandName}</strong>
          <span>{catalog.settings.brandSubtitle}</span>
        </div>
      </div>
      <h2>空间香氛服务询价清单</h2>
      <p>使用场景：{summary.scenario?.name ?? '未选择'}</p>
      <p>精油总升数：{summary.totalOilLiters}L</p>
      {summary.scentItems.map((item) => (
        <p key={item.scent.id}>
          精油：{item.scent.name} × {item.liters}L
        </p>
      ))}
      {summary.machineItems.map((item) => (
        <p key={item.machine.id}>
          扩香机：{item.machine.name} × {item.quantity} 台
        </p>
      ))}
      {summary.giftMachine && summary.giftMachineCount > 0 ? (
        <p>
          满赠扩香机：{summary.giftMachine.name} × {summary.giftMachineCount} 台
        </p>
      ) : null}
      <small>{catalog.settings.finalQuoteNotice}</small>
    </div>
  );
}
