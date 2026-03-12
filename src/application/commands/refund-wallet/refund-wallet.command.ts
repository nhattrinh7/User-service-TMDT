export class RefundWalletCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
  ) {}
}
