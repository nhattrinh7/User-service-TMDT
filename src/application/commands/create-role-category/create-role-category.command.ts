import { ICommand } from '@nestjs/cqrs'

export class CreateRoleCategoryCommand implements ICommand {
  constructor(
    public readonly body: {
      roleId: string
      categoryId: string
      level: number
      isLeaf: boolean
    },
  ) {}
}
