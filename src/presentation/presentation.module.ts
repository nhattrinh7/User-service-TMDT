import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { UserController } from '~/presentation/v1/controllers/user.controller'
import { AdminController } from '~/presentation/v1/controllers/admin.controller'
import { RoleCategoryController } from '~/presentation/v1/controllers/role-category.controller'
import { ApplicationModule } from '~/application/application.module'
import { MessagingModule } from '~/infrastructure/messaging/messaging.module'
  import { RoleController } from '~/presentation/v1/controllers/role.controller'

@Module({
  imports: [CqrsModule, ApplicationModule, MessagingModule],
  controllers: [
    UserController, 
    AdminController, 
    RoleCategoryController, 
    RoleController
  ],
  exports: [],
})
export class PresentationModule {}
