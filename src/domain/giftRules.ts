export function calculateGiftMachineCount(totalOilLiters: number, giftStepLiters: number): number {
  if (!Number.isFinite(totalOilLiters) || !Number.isFinite(giftStepLiters)) {
    return 0;
  }

  if (totalOilLiters < 0 || giftStepLiters <= 0) {
    return 0;
  }

  return Math.floor(totalOilLiters / giftStepLiters);
}
