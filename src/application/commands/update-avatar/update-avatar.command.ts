import { ICommand } from '@nestjs/cqrs'

export class UpdateAvatarCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly file: Express.Multer.File,
  ) {}
}
