import type { ResetPassCodeBodyDto } from '~/presentation/dtos/user.dto'

export class ResetPassCodeCommand {
  constructor(
    public readonly userId: string,
    public readonly body: ResetPassCodeBodyDto,
  ) {}
}
