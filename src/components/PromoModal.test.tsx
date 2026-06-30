import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromoModal } from './PromoModal';

describe('PromoModal', () => {
  it('shows promotion before the home content and can be closed', async () => {
    const onClose = vi.fn();
    render(
      <PromoModal
        promotion={{
          enabled: true,
          title: '近期大促',
          body: '采购满指定金额/升数，可赠送 GAS-501F 插电蓝牙 APP 款扩香机。',
          buttonText: '查看推荐方案',
        }}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('近期大促')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '查看推荐方案' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
