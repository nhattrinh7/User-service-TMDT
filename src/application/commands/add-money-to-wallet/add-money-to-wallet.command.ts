export class AddMoneyToWalletCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
  ) {}
}
