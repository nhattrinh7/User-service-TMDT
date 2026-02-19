export class AddToCartCommand {
  constructor(
    public readonly userId: string,
    public readonly productVariantId: string,
    public readonly quantity: number,
  ) {}
}
