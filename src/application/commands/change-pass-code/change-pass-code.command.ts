import type { ChangePassCodeBodyDto } from '~/presentation/dtos/user.dto'

export class ChangePassCodeCommand {
  constructor(
    public readonly userId: string,
    public readonly body: ChangePassCodeBodyDto,
  ) {}
}
