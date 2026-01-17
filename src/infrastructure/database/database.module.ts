import { Module } from '@nestjs/common'
import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { USER_REPOSITORY } from '~/domain/repositories/user.repository.interface'
import { REFRESH_TOKEN_REPOSITORY } from '~/domain/repositories/refresh-token.repository.interface'
import { ADDRESS_REPOSITORY } from '~/domain/repositories/address.repository.interface'
import { UserRepository } from '~/infrastructure/database/repositories/user.repository'
import { RefreshTokenRepository } from '~/infrastructure/database/repositories/refresh-token.repository'
import { AddressRepository } from '~/infrastructure/database/repositories/address.repository'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },
    {
      provide: ADDRESS_REPOSITORY,
      useClass: AddressRepository,
    },
  ],
  exports: [
    USER_REPOSITORY, 
    REFRESH_TOKEN_REPOSITORY,
    ADDRESS_REPOSITORY
  ],
})
export class DatabaseModule {}
