export class SagaRemoveCartItemsCommand {
  constructor(
    public readonly sagaId: string,
    public readonly userId: string,
    public readonly productVariantIds: string[],
  ) {}
}
