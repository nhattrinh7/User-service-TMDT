export class DeleteCartItemsCommand {
  constructor(
    public readonly userId: string,
    public readonly productVariantIds: string[],
  ) {}
}
