import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ValidatorInterceptor } from '@users-interceptors';
import { HttpTransformResponse } from '@shared';

import { CreateUserContract } from '@users-contracts';
import { CreateUserDto } from '@users-dtos';
import { UserModel } from '@users-models';

import { ConfigService } from '@nestjs/config';
import { UsersService } from '@users-services';
import { encrypt } from '@utils';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({
    description: 'Usuário cadastrado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Não possível cadastrar seu usuário usuário',
  })
  @Post()
  @UseInterceptors(new ValidatorInterceptor(new CreateUserContract()))
  public async create(@Body() createUserDto: CreateUserDto) {
    try {
      const passwordEncrypted = await encrypt(
        `${createUserDto.password}${this.configService.get('secretKey')}`,
      );

      await this.usersService.create(
        new UserModel(createUserDto.email, passwordEncrypted),
      );

      return new HttpTransformResponse(
        'Usuário cadastrado com sucesso',
        true,
        null,
        null,
      );
    } catch (error) {
      throw new HttpException(
        new HttpTransformResponse(
          'Não possível cadastrar seu usuário usuário',
          false,
          null,
          error,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
