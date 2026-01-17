import { ICommand } from '@nestjs/cqrs'
import { UpdateProfileBodyDto } from '~/presentation/dtos/user.dto'

export class UpdateProfileCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly body: UpdateProfileBodyDto,
  ) {}
}
