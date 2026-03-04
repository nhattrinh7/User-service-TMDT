export class SagaVerifyPasscodeAndDeductCommand {
  constructor(
    public readonly sagaId: string,
    public readonly userId: string,
    public readonly passcode: string,
    public readonly amount: number,
  ) {}
}
