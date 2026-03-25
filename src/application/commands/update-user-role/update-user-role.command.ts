import { ICommand } from '@nestjs/cqrs'

export class UpdateUserRoleCommand implements ICommand {
  constructor(
    public readonly userId: string,
  ) {}
}
