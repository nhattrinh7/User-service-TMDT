import { v4 as uuidv4 } from 'uuid'

export class RoleCategory {
  constructor(
    public readonly id: string,
    public readonly roleId: string,
    public readonly categoryId: string,
    public readonly level: number,
    public readonly isLeaf: boolean,
  ) {}

  static create(props: {
    roleId: string
    categoryId: string
    level: number
    isLeaf: boolean
  }): RoleCategory {
    return new RoleCategory(uuidv4(), props.roleId, props.categoryId, props.level, props.isLeaf)
  }
}
