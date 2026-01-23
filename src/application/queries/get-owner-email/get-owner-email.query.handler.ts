import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import type { IUserRepository } from '~/domain/repositories/user.repository.interface'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { Inject, NotFoundException } from '@nestjs/common'
import { GetOwnerEmailQuery } from '~/application/queries/get-owner-email/get-owner-email.query'

@QueryHandler(GetOwnerEmailQuery)
export class GetOwnerEmailHandler implements IQueryHandler<GetOwnerEmailQuery, { email: string }> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetOwnerEmailQuery): Promise<{ email: string }> {
    const { ownerId } = query

    const user = await this.userRepository.findById(ownerId)
    if (!user) throw new NotFoundException('Owner not found')

    return { email: user.email.getValue() }
  }
}
