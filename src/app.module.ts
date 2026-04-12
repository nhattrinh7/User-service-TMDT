import { HealthModule } from './health/health.module'
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'
import { ZodValidationPipe } from 'nestjs-zod'
import { APP_PIPE } from '@nestjs/core'
import { PresentationModule } from '~/presentation/presentation.module'
import { ApplicationModule } from '~/application/application.module'
import { InfrastructureModule } from '~/infrastructure/infrastructure.module'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { RequestLoggingMiddleware } from '~/common/middleware/request-logging.middleware'

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short', // Chống spam tấn công brute-force thử password, chống bot tự động
        ttl: 1000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 500,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),

        SERVICE_NAME: Joi.string().required(),
        SERVICE_HOST: Joi.string().required(),
        PORT: Joi.number().required(),
        SUPER_ADMIN_EMAIL: Joi.string().required(),
        SUPER_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        CUSTOMER_ADMIN_EMAIL: Joi.string().required(),
        CUSTOMER_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        FASHION_ADMIN_EMAIL: Joi.string().required(),
        FASHION_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        BEAUTY_HEALTH_ADMIN_EMAIL: Joi.string().required(),
        BEAUTY_HEALTH_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        TECH_ADMIN_EMAIL: Joi.string().required(),
        TECH_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        HOME_LIFESTYLE_ADMIN_EMAIL: Joi.string().required(),
        HOME_LIFESTYLE_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        LEISURE_ADMIN_EMAIL: Joi.string().required(),
        LEISURE_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        FOOD_BEVERAGE_ADMIN_EMAIL: Joi.string().required(),
        FOOD_BEVERAGE_ADMIN_PASSWORD: Joi.string().allow('').optional(),
        SHIPPER_EMAIL: Joi.string().required(),
        SHIPPER_PASSWORD: Joi.string().allow('').optional(),
        WAREHOUSE_SCANNER_1_EMAIL: Joi.string().required(),
        WAREHOUSE_SCANNER_2_EMAIL: Joi.string().required(),
        WAREHOUSE_SCANNER_3_EMAIL: Joi.string().required(),
        WAREHOUSE_SCANNER_PASSWORD: Joi.string().allow('').optional(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().allow('').optional(),
        RABBITMQ_HOST: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true, // Show 1 errors per times
      },
    }),
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('{*path}')
  }
}
