import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductCard } from './ProductCard';
import type { Scent } from '../domain/types';

const scent: Scent = {
  id: 'gm051801',
  name: '威斯汀白茶 / Westin White Tea',
  description: '酒店系列精油，编号 GM051801。',
  toneNote: '茶香花香调 / Tea Floral',
  scenarioIds: ['hotel'],
  isRecommended: true,
  isRegularStock: true,
  isInquiryOnly: false,
  priceTiers: [],
};

describe('ProductCard', () => {
  it('shows the gift reminder before the liter input', () => {
    render(<ProductCard scent={scent} liters={0} onChangeLiters={vi.fn()} />);

    expect(screen.getByText('每满3L香薰精油赠送高端扩香机一台')).toBeInTheDocument();
  });
});
