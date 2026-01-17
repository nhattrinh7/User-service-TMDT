import { ICommand } from '@nestjs/cqrs'
import { ChangePasswordBodyDto } from '~/presentation/dtos/user.dto'

export class ChangePasswordCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly body: ChangePasswordBodyDto,
  ) {}
}
