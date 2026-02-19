import type { CreatePassCodeBodyDto } from '~/presentation/dtos/user.dto'

export class CreatePassCodeCommand {
  constructor(
    public readonly userId: string,
    public readonly body: CreatePassCodeBodyDto,
  ) {}
}
