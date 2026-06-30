import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromoModal } from './PromoModal';

const promotion = {
  enabled: true,
  title: '近期大促',
  body: '采购满指定金额/升数，可赠送 GAS-501F 插电蓝牙 APP 款扩香机。',
  buttonText: '查看推荐方案',
};

describe('PromoModal', () => {
  it('shows promotion before the home content and can be closed', async () => {
    const onClose = vi.fn();
    render(<PromoModal promotion={promotion} onClose={onClose} />);

    expect(screen.getByText('近期大促')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '查看推荐方案' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('puts the black home button above the recommendation button', () => {
    render(<PromoModal promotion={promotion} onClose={vi.fn()} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).toHaveTextContent('先看看首页');
    expect(buttons[0]).toHaveClass('primary-button');
    expect(buttons[1]).toHaveTextContent('查看推荐方案');
  });
});
