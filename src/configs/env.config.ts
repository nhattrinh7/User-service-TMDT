import { ConfigService } from '@nestjs/config'

class EnvConfig {
  constructor(private configService: ConfigService) {}

  get config() {
    return {
      DATABASE_URL: this.configService.get<string>('DATABASE_URL')!,
      SERVICE_NAME: this.configService.get<string>('SERVICE_NAME'),
      SERVICE_HOST: this.configService.get<string>('SERVICE_HOST'),
      PORT: this.configService.get<string>('PORT'),

      SUPER_ADMIN_EMAIL: this.configService.get<string>('SUPER_ADMIN_EMAIL'),
      SUPER_ADMIN_PASSWORD: this.configService.get<string>('SUPER_ADMIN_PASSWORD'),
      CUSTOMER_ADMIN_EMAIL: this.configService.get<string>('CUSTOMER_ADMIN_EMAIL'),
      CUSTOMER_ADMIN_PASSWORD: this.configService.get<string>('CUSTOMER_ADMIN_PASSWORD'),
      FASHION_ADMIN_EMAIL: this.configService.get<string>('FASHION_ADMIN_EMAIL'),
      FASHION_ADMIN_PASSWORD: this.configService.get<string>('FASHION_ADMIN_PASSWORD'),
      BEAUTY_HEALTH_ADMIN_EMAIL: this.configService.get<string>('BEAUTY_HEALTH_ADMIN_EMAIL'),
      BEAUTY_HEALTH_ADMIN_PASSWORD: this.configService.get<string>('BEAUTY_HEALTH_ADMIN_PASSWORD'),
      TECH_ADMIN_EMAIL: this.configService.get<string>('TECH_ADMIN_EMAIL'),
      TECH_ADMIN_PASSWORD: this.configService.get<string>('TECH_ADMIN_PASSWORD'),
      HOME_LIFESTYLE_ADMIN_EMAIL: this.configService.get<string>('HOME_LIFESTYLE_ADMIN_EMAIL'),
      HOME_LIFESTYLE_ADMIN_PASSWORD: this.configService.get<string>(
        'HOME_LIFESTYLE_ADMIN_PASSWORD',
      ),
      LEISURE_ADMIN_EMAIL: this.configService.get<string>('LEISURE_ADMIN_EMAIL'),
      LEISURE_ADMIN_PASSWORD: this.configService.get<string>('LEISURE_ADMIN_PASSWORD'),
      FOOD_BEVERAGE_ADMIN_EMAIL: this.configService.get<string>('FOOD_BEVERAGE_ADMIN_EMAIL'),
      FOOD_BEVERAGE_ADMIN_PASSWORD: this.configService.get<string>('FOOD_BEVERAGE_ADMIN_PASSWORD'),
    }
  }

  get cloudinary() {
    return {
      CLOUDINARY_CLOUD_NAME: this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      CLOUDINARY_API_KEY: this.configService.get<string>('CLOUDINARY_API_KEY'),
      CLOUDINARY_API_SECRET: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    }
  }
}

let envInstance: EnvConfig

export const setConfigService = (configService: ConfigService) => {
  envInstance = new EnvConfig(configService)
}

export const env = new Proxy({} as EnvConfig, {
  get(_, prop) {
    if (!envInstance) {
      throw new Error(
        '❌ EnvConfig not initialized! Call setConfigService() in AppModule constructor or main.ts',
      )
    }
    return envInstance[prop as keyof EnvConfig]
  },
})
