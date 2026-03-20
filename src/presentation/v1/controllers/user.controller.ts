import {
  Controller,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
  Headers,
  Get,
  Body,
  Put,
  Post,
  Delete,
} from '@nestjs/common'
import { CacheTTL } from '@nestjs/cache-manager'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UpdateAvatarCommand } from '~/application/commands/update-avatar/update-avatar.command'
import { GetProfileQuery } from '~/application/queries/get-profile/get-profile.query'
import { GetWalletBalanceQuery } from '~/application/queries/get-wallet-balance/get-wallet-balance.query'
import type { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import type { ChangePasswordBodyDto, UpdateProfileBodyDto, CreatePassCodeBodyDto, ChangePassCodeBodyDto, ResetPassCodeBodyDto } from '~/presentation/dtos/user.dto'
import { UpdateProfileCommand } from '~/application/commands/update-profile/update-profile.command'
import { GetAddressesQuery } from '~/application/queries/get-addresses/get-addresses.query'
import { AddAddressBodyDto, UpdateAddressBodyDto } from '~/presentation/dtos/address.dto'
import { AddAddressCommand } from '~/application/commands/add-address/add-address.command'
import { DeleteAddressCommand } from '~/application/commands/delete-address/delete-address.command'
import { UpdateAddressCommand } from '~/application/commands/update-address/update-address.command'
import { SetDefaultAddressCommand } from '~/application/commands/set-default-address/set-default-address.command'
import { ChangePasswordCommand } from '~/application/commands/change-password/change-password.command'
import { CreatePassCodeCommand } from '~/application/commands/create-pass-code/create-pass-code.command'
import { ChangePassCodeCommand } from '~/application/commands/change-pass-code/change-pass-code.command'
import { RequestPassCodeResetCommand } from '~/application/commands/request-pass-code-reset/request-pass-code-reset.command'
import { ResetPassCodeCommand } from '~/application/commands/reset-pass-code/reset-pass-code.command'
import { CheckPassCodeQuery } from '~/application/queries/check-pass-code/check-pass-code.query'
import { GetDefaultAddressQuery } from '~/application/queries/get-default-address/get-default-address.command'
import { CountCartItemsQuery } from '~/application/queries/count-cart-items/count-cart-items.query'
import { GetCartQuery } from '~/application/queries/get-cart/get-cart.query'
import { AddToCartBodyDto, DeleteCartItemsBodyDto, UpdateCartQuantityBodyDto } from '~/presentation/dtos/cart.dto'
import { AddToCartCommand } from '~/application/commands/add-to-cart/add-to-cart.command'
import { DeleteCartItemsCommand } from '~/application/commands/delete-cart-items/delete-cart-items.command'
import { UpdateCartQuantityCommand } from '~/application/commands/update-cart-quantity/update-cart-quantity.command'
import { CustomCacheInterceptor } from '~/infrastructure/cache/custom-cache.interceptor'
import { CacheType } from '~/infrastructure/cache/cache-type.decorator'
import { CacheResource } from '~/infrastructure/cache/cache-prefix.decorator'
import { CACHE_TYPE, CACHE_RESOURCE } from '~/common/constants/cache.constant'

@Controller('v1/users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ===== STATIC ROUTES (pháº£i Ä‘áº·t TRÆ¯á»šC :id routes) =====

  @Put('add-to-cart')
  async addToCart(
    @Body() body: AddToCartBodyDto,
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    const result = await this.commandBus.execute(
      new AddToCartCommand(userId, body.productVariantId, body.quantity)
    )
    
    return { message: 'Add to cart successful', data: result }
  }

  @Patch('delete-cart-items')
  async deleteCartItems(
    @Body() body: DeleteCartItemsBodyDto,
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    const result = await this.commandBus.execute(
      new DeleteCartItemsCommand(userId, body.productVariantIds)
    )
    
    return { message: 'Delete cart items successful', data: result }
  }

  @Put('update-cart-quantity')
  async updateCartQuantity(
    @Body() body: UpdateCartQuantityBodyDto,
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    const result = await this.commandBus.execute(
      new UpdateCartQuantityCommand(userId, body.productVariantId, body.quantity)
    )
    
    return { message: 'Update cart quantity successful', data: result }
  }

  @Put('address/:id')
  async updateAddress(
    @Param('id') id: string,
    @Body() body: UpdateAddressBodyDto, 
  ): Promise<any> {
    await this.commandBus.execute(new UpdateAddressCommand(id, body))
    return { message: 'Update address successful' }
  }

  @Delete('address/:id')
  async deleteAddress(
    @Param('id') id: string
  ): Promise<any> {
    await this.commandBus.execute(new DeleteAddressCommand(id))
    return { message: 'Delete address successful' }
  }

  @Patch('address/:id/set-default')
  async setDefaultAddress(
    @Param('id') id: string
  ): Promise<any> {
    await this.commandBus.execute(new SetDefaultAddressCommand(id))
    return { message: 'Set default address successful' }
  }

  // ===== PASSCODE ENDPOINTS =====

  @Get('check-pass-code')
  async checkPassCode(
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    return this.queryBus.execute(new CheckPassCodeQuery(userId))
  }

  @Post('pass-code')
  async createPassCode(
    @Body() body: CreatePassCodeBodyDto,
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    await this.commandBus.execute(new CreatePassCodeCommand(userId, body))
    return { message: 'Create passcode successful' }
  }

  @Put('change-pass-code')
  async changePassCode(
    @Body() body: ChangePassCodeBodyDto,
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    await this.commandBus.execute(new ChangePassCodeCommand(userId, body))
    return { message: 'Change passcode successful' }
  }

  @Post('request-pass-code-reset')
  async requestPassCodeReset(
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    await this.commandBus.execute(new RequestPassCodeResetCommand(userId))
    return { message: 'OTP Ä‘Ã£ Ä‘Æ°á»£c gá»­i Ä‘áº¿n email cá»§a báº¡n' }
  }

  @Put('reset-pass-code')
  async resetPassCode(
    @Body() body: ResetPassCodeBodyDto,
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    await this.commandBus.execute(new ResetPassCodeCommand(userId, body))
    return { message: 'Reset passcode successful' }
  }

  @Get('wallet')
  async getWalletBalance(
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    return this.queryBus.execute(new GetWalletBalanceQuery(userId))
  }


  // ===== DYNAMIC :id ROUTES (Ä‘áº·t SAU cÃ¡c static routes) =====

  @Get(':id')
  @UseInterceptors(CustomCacheInterceptor)
  @CacheType(CACHE_TYPE.PERSONAL)
  @CacheResource(CACHE_RESOURCE.USERS)
  @CacheTTL(600_000) // 10 phÃºt
  async getProfile(@Param('id') id: string): Promise<any> {
    const result = await this.queryBus.execute(new GetProfileQuery(id))
    
    return { message: 'Get profile successful', data: result }
  }

  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') roleId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const result = await this.commandBus.execute(new UpdateAvatarCommand(id, file))

    return { message: 'Update avatar successful', data: result }
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() body: UpdateProfileBodyDto
  ): Promise<any> {
    const result = await this.commandBus.execute(new UpdateProfileCommand(id, body))

    return { message: 'Update profile successful', data: result }
  }

  @Get(':id/address')
  async getAddresses(@Param('id') userId: string): Promise<any> {
    const result = await this.queryBus.execute(new GetAddressesQuery(userId))
    
    return { message: 'Get addresses successful', data: result }
  }

  @Get(':id/address/default')
  async getDefaultAddress(@Param('id') userId: string): Promise<any> {
    const result = await this.queryBus.execute(new GetDefaultAddressQuery(userId))
    
    return { message: 'Get default address successful', data: result }
  }

  @Post(':id/address')
  async addAddress(
    @Param('id') userId: string,
    @Body() body: AddAddressBodyDto,
  ): Promise<any> {
    const address = await this.commandBus.execute(new AddAddressCommand(userId, body))
    return { message: 'Add address successful', data: address }
  }

  @Put(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordBodyDto, 
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    await this.commandBus.execute(new ChangePasswordCommand(userId, body))
    return { message: 'Change password successful' }
  }

  @Get(':id/count-cart-items')
  async countCartItems(
    @Param('id') userId: string
  ): Promise<any> {
    const result = await this.queryBus.execute(new CountCartItemsQuery(userId))
    
    return { message: 'Count cart items successful', data: result }
  }

  @Get(':id/cart')
  async getCart(
    @Param('id') userId: string
  ): Promise<any> {
    const result = await this.queryBus.execute(new GetCartQuery(userId))
    
    return { message: 'Get cart successful', data: result }
  }
  
}


