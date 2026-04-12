import { IQuery } from '@nestjs/cqrs'

export interface GetOwnerAndAddressPayload {
  shopId: string
  ownerId: string
  addressId: string
}

export class GetOwnerAndAddressQuery implements IQuery {
  constructor(public readonly data: GetOwnerAndAddressPayload[]) {}
}
