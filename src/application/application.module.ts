import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DatabaseModule } from '~/infrastructure/database/database.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'
import { UpdateAvatarHandler } from '~/application/commands/update-avatar/update-avatar.command.handler'
import { CloudinaryService } from '~/common/services/cloudinary.service'
import { GetProfileHandler } from '~/application/queries/get-profile/get-profile.query.handler'
import { UpdateProfileHandler } from '~/application/commands/update-profile/update-profile.command.handler'
import { GetAddressesHandler } from '~/application/queries/get-addresses/get-addresses.query.handler'
import { GetDefaultAddressHandler } from '~/application/queries/get-default-address/get-default-address.command.handler'
import { AddAddressHandler } from '~/application/commands/add-address/add-address.command.handler'
import { DeleteAddressHandler } from '~/application/commands/delete-address/delete-address.command.handler'
import { UpdateAddressHandler } from '~/application/commands/update-address/update-address.command.handler'
import { SetDefaultAddressHandler } from '~/application/commands/set-default-address/set-default-address.command.handler'
import { ChangePasswordHandler } from '~/application/commands/change-password/change-password.command.handler'
import { GetUsersPaginatedHandler } from '~/application/queries/get-users-paginated/get-users-paginated.query.handler'
import { BanUserHandler } from '~/application/commands/ban-user/ban-user.command.handler'
import { UnbanUserHandler } from '~/application/commands/unban-user/unban-user.command.handler'
import { CreateRoleCategoryHandler } from '~/application/commands/create-role-category/create-role-category.command.handler'
import { GetOwnerAndAddressHandler } from '~/application/queries/get-owner-and-address/get-owner-and-address.query.handler'
import { GetTopLevelCategoryIdsHandler } from '~/application/queries/get-top-level-category-ids/get-top-level-category-ids.query.handler'
import { GetOwnerEmailHandler } from '~/application/queries/get-owner-email/get-owner-email.query.handler'
import { GetLeafCategoryIdsHandler } from '~/application/queries/get-leaf-category-ids/get-leaf-category-ids.query.handler'
import { GetUsersInfoHandler } from '~/application/queries/get-users-info/get-users-info.query.handler'
import { CountCartItemsHandler } from '~/application/queries/count-cart-items/count-cart-items.query.handler'
import { GetCartHandler } from '~/application/queries/get-cart/get-cart.query.handler'
import { AddToCartHandler } from '~/application/commands/add-to-cart/add-to-cart.command.handler'
import { DeleteCartItemsHandler } from '~/application/commands/delete-cart-items/delete-cart-items.command.handler'
import { UpdateCartQuantityHandler } from '~/application/commands/update-cart-quantity/update-cart-quantity.command.handler'
import { CreatePassCodeHandler } from '~/application/commands/create-pass-code/create-pass-code.command.handler'
import { ChangePassCodeHandler } from '~/application/commands/change-pass-code/change-pass-code.command.handler'
import { RequestPassCodeResetHandler } from '~/application/commands/request-pass-code-reset/request-pass-code-reset.command.handler'
import { ResetPassCodeHandler } from '~/application/commands/reset-pass-code/reset-pass-code.command.handler'
import { CheckPassCodeHandler } from '~/application/queries/check-pass-code/check-pass-code.query.handler'
import { SagaGetAddressHandler } from '~/application/commands/saga-get-address/saga-get-address.command.handler'
import { SagaRemoveCartItemsHandler } from '~/application/commands/saga-remove-cart-items/saga-remove-cart-items.command.handler'
import { SagaVerifyPasscodeAndDeductHandler } from '~/application/commands/saga-verify-passcode-and-deduct/saga-verify-passcode-and-deduct.command.handler'
import { SagaRefundWalletHandler } from '~/application/commands/saga-refund-wallet/saga-refund-wallet.command.handler'
import { RefundWalletHandler } from '~/application/commands/refund-wallet/refund-wallet.command.handler'

const CommandHandlers = [
  UpdateAvatarHandler,
  UpdateProfileHandler,
  AddAddressHandler,
  DeleteAddressHandler,
  UpdateAddressHandler,
  SetDefaultAddressHandler,
  ChangePasswordHandler,
  BanUserHandler,
  UnbanUserHandler,
  CreateRoleCategoryHandler,
  AddToCartHandler,
  DeleteCartItemsHandler,
  UpdateCartQuantityHandler,
  CreatePassCodeHandler,
  ChangePassCodeHandler,
  RequestPassCodeResetHandler,
  ResetPassCodeHandler,
  SagaGetAddressHandler,
  SagaRemoveCartItemsHandler,
  SagaVerifyPasscodeAndDeductHandler,
  SagaRefundWalletHandler,
  RefundWalletHandler,
]

const QueryHandlers = [
  GetProfileHandler,
  GetAddressesHandler,
  GetDefaultAddressHandler,
  GetUsersPaginatedHandler,
  GetOwnerAndAddressHandler,
  GetTopLevelCategoryIdsHandler,
  GetOwnerEmailHandler,
  GetLeafCategoryIdsHandler,
  GetUsersInfoHandler,
  CountCartItemsHandler,
  GetCartHandler,
  CheckPassCodeHandler,
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