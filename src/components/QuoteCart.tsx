import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { buildQuoteSummary, createInquiryText } from '../domain/quote';
import type { Catalog, QuoteCart as QuoteCartState } from '../domain/types';
import { QuoteImageCard } from './QuoteImageCard';

interface QuoteCartProps {
  cart: QuoteCartState;
  catalog: Catalog;
  onClose: () => void;
}

export function QuoteCart({ cart, catalog, onClose }: QuoteCartProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const summary = buildQuoteSummary(cart, catalog);
  const inquiryText = createInquiryText(cart, catalog);

  async function copyText() {
    await navigator.clipboard.writeText(inquiryText);
    setCopied(true);
  }

  async function saveImage() {
    if (!imageRef.current) {
      return;
    }
    const dataUrl = await toPng(imageRef.current, { pixelRatio: 2 });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'glassmartin-inquiry.png';
    link.click();
  }

  return (
    <aside className="cart-drawer" aria-label="询价清单">
      <div className="cart-panel">
        <button className="text-button close-button" type="button" onClick={onClose}>
          关闭
        </button>
        <h2>询价清单</h2>
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
          <p className="gift-line">
            满赠扩香机：{summary.giftMachine.name} × {summary.giftMachineCount} 台
          </p>
        ) : null}
        <small>{catalog.settings.finalQuoteNotice}</small>
        <div className="cart-actions">
          <button className="primary-button" type="button" onClick={copyText}>
            {copied ? '已复制' : '复制文本'}
          </button>
          <button className="secondary-button" type="button" onClick={saveImage}>
            生成图片
          </button>
        </div>
        <div className="quote-image-hidden" ref={imageRef}>
          <QuoteImageCard catalog={catalog} summary={summary} />
        </div>
      </div>
    </aside>
  );
}
