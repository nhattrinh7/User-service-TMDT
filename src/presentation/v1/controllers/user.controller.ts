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
  Header,
  Delete,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UpdateAvatarCommand } from '~/application/commands/update-avatar/update-avatar.command'
import { GetProfileQuery } from '~/application/queries/get-profile/get-profile.query'
import type { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import type { ChangePasswordBodyDto, UpdateProfileBodyDto } from '~/presentation/dtos/user.dto'
import { UpdateProfileCommand } from '~/application/commands/update-profile/update-profile.command'
import { GetAddressesQuery } from '~/application/queries/get-addresses/get-addresses.query'
import { AddAddressBodyDto, UpdateAddressBodyDto } from '~/presentation/dtos/address.dto'
import { AddAddressCommand } from '~/application/commands/add-address/add-address.command'
import { DeleteAddressCommand } from '~/application/commands/delete-address/delete-address.command'
import { UpdateAddressCommand } from '~/application/commands/update-address/update-address.command'
import { SetDefaultAddressCommand } from '~/application/commands/set-default-address/set-default-address.command'
import { ChangePasswordCommand } from '~/application/commands/change-password/change-password.command'
import { GetDefaultAddressQuery } from '~/application/queries/get-default-address/get-default-address.command'

@Controller('v1/users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
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

  @Put(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordBodyDto,
    @Headers('x-user-id') userId: string,
  ): Promise<any> {
    await this.commandBus.execute(new ChangePasswordCommand(userId, body))
    return { message: 'Change password successful' }
  }
}
