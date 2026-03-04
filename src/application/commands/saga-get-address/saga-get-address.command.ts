export class SagaGetAddressCommand {
  constructor(
    public readonly sagaId: string,
    public readonly userId: string,
    public readonly addressId: string,
  ) {}
}
