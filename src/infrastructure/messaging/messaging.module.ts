import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { CqrsModule } from '@nestjs/cqrs'
import { MESSAGE_PUBLISHER } from '~/domain/contracts/message-publisher.interface'
import { RabbitMQPublisher } from '~/infrastructure/messaging/publishers/rabbitmq.publisher'
import { GetOwnerAndAddressConsumer } from '~/infrastructure/messaging/consumers/get-owner-and-address.consumer'
import { GetOwnerEmailConsumer } from '~/infrastructure/messaging/consumers/get-owner-email.consumer'
import { GetLeafCategoryIdsConsumer } from '~/infrastructure/messaging/consumers/get-leaf-category-ids.consumer'
import { GetUsersInfoConsumer } from '~/infrastructure/messaging/consumers/get-users-info.consumer'
import { SagaUserConsumer } from '~/infrastructure/messaging/consumers/saga-user.consumer'

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin123@localhost:5672'],
          queue: 'notification_queue',
          persistent: true,
        },
      },
      {
        name: 'SHOP_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin123@localhost:5672'],
          queue: 'shop_queue',
          persistent: true,
        },
      },
      {
        name: 'CATALOG_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin123@localhost:5672'],
          queue: 'catalog_queue',
          persistent: true,
        },
      },
      {
        name: 'SAGA_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin123@localhost:5672'],
          queue: 'saga_queue',
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [GetOwnerAndAddressConsumer, GetOwnerEmailConsumer, GetLeafCategoryIdsConsumer, GetUsersInfoConsumer, SagaUserConsumer],
  providers: [
    {
      provide: MESSAGE_PUBLISHER,
      useClass: RabbitMQPublisher,
    },
  ],
  exports: [ClientsModule, MESSAGE_PUBLISHER],
})
export class MessagingModule {}

