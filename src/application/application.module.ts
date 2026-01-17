import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DatabaseModule } from '~/infrastructure/database/database.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'
import { UpdateAvatarHandler } from '~/application/commands/update-avatar/update-avatar.command.handler'
import { CloudinaryService } from '~/common/services/cloudinary.service'
import { GetProfileHandler } from '~/application/queries/get-profile/get-profile.query.handler'
import { UpdateProfileHandler } from '~/application/commands/update-profile/update-profile.command.handler'
import { GetAddressesHandler } from '~/application/queries/get-addresses/get-addresses.query.handler'
import { GetDefaultAddressHandler } from '~/application/queries//get-default-address/get-default-address.command.handler'
import { AddAddressHandler } from '~/application/commands/add-address/add-address.command.handler'
import { DeleteAddressHandler } from '~/application/commands/delete-address/delete-address.command.handler'
import { UpdateAddressHandler } from '~/application/commands/update-address/update-address.command.handler'
import { SetDefaultAddressHandler } from '~/application/commands/set-default-address/set-default-address.command.handler'
import { ChangePasswordHandler } from '~/application/commands/change-password/change-password.command.handler'
import { GetUsersPaginatedHandler } from '~/application/queries/get-users-paginated/get-users-paginated.query.handler'
import { BanUserHandler } from '~/application/commands/ban-user/ban-user.command.handler'
import { UnbanUserHandler } from '~/application/commands/unban-user/unban-user.command.handler'

const CommandHandlers = [
  UpdateAvatarHandler,
  UpdateProfileHandler,
  AddAddressHandler,
  DeleteAddressHandler,
  UpdateAddressHandler,
  SetDefaultAddressHandler,
  ChangePasswordHandler,
  BanUserHandler,
  UnbanUserHandler
]

const QueryHandlers = [
  GetProfileHandler,
  GetAddressesHandler,
  GetDefaultAddressHandler,
  GetUsersPaginatedHandler
]

const EventHandlers = [

]
 
@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    MessagingModule
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    CloudinaryService
  ],
  exports: [],
})
export class ApplicationModule {}