import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpException,
  HttpStatus,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ValidatorInterceptor } from '@users-interceptors';
import { AuthService, HttpTransformResponse, JwtAuthGuard } from '@shared';

import { CreateUserContract } from '@users-contracts';
import { CreateUserDto } from '@users-dtos';
import { UserModel } from '@users-models';

import { ConfigService } from '@nestjs/config';
import { UsersService } from '@users-services';
import { encrypt } from '@utils';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  @ApiTags('authenticate')
  @ApiOperation({ summary: 'Authenticate user - JWT Strategy' })
  @ApiOkResponse({
    description: `{
      message: 'Usuário autenticado com sucesso',
      success: true,
      data: { token: string },
      errors: null
    }`,
  })
  @ApiBadRequestResponse({
    description: `{
      message: 'Ops, algo saiu errado',
      success: false,
      data: null,
      errors: string[]
    }`,
  })
  @ApiNotFoundResponse({
    description: `{
      message: 'Usuário ou senha inválidos',
      success: false,
      data: null,
      errors: null
    }`,
  })
  @Post('authenticate')
  @HttpCode(200)
  @UseInterceptors(new ValidatorInterceptor(new CreateUserContract()))
  public async authenticate(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.authenticate(createUserDto);

    if (!user) {
      throw new HttpException(
        new HttpTransformResponse(
          'Usuário ou senha inválidos',
          false,
          null,
          null,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    const token = await this.authService.createToken(user.email);

    return new HttpTransformResponse(
      'Usuário autenticado com sucesso',
      true,
      {
        token,
      },
      null,
    );
  }

  @ApiTags('authenticate')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Refresh token - JWT Strategy',
    description: 'Enter an access token to re-authenticate to the system',
  })
  @ApiOkResponse({
    description: `{
      message: 'Usuário autenticado com sucesso',
      success: true,
      data: { token: string },
      errors: null
    }`,
  })
  @ApiUnauthorizedResponse({
    description: `{
      message: 'Acesso restrito',
      success: false,
      data: null,
      errors: null
    }`,
  })
  @Post('/authenticate/refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  public async refreshToken(@Req() request): Promise<any> {
    const token = await this.authService.createToken(request.user.email);
    return new HttpTransformResponse(
      'Usuário autenticado com sucesso',
      true,
      {
        token,
      },
      null,
    );
  }

  @ApiTags('users')
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({
    description: `{
      message: 'Usuário cadastrado com sucesso!',
      success: true,
      data: null,
      errors: null
    }`,
  })
  @ApiBadRequestResponse({
    description: `{
      message: 'Ops, algo saiu errado',
      success: false,
      data: null,
      errors: string[]
    }`,
  })
  @ApiForbiddenResponse({
    description: `{
      message: 'Usuário já cadastrado!',
      success: false,
      data: null,
      errors: null
    }`,
  })
  @Post()
  @UseInterceptors(new ValidatorInterceptor(new CreateUserContract()))
  public async create(@Body() createUserDto: CreateUserDto) {
    const passwordEncrypted = await encrypt(
      `${createUserDto.password}${this.configService.get('secretKey')}`,
    );

    const userExists = await this.usersService.findOne(createUserDto.email);

    if (userExists) {
      throw new HttpException(
        new HttpTransformResponse('Usuário já cadastrado!', false, null, null),
        HttpStatus.FORBIDDEN,
      );
    }

    await this.usersService.create(
      new UserModel(createUserDto.email, passwordEncrypted),
    );

    return new HttpTransformResponse(
      'Usuário cadastrado com sucesso',
      true,
      null,
      null,
    );
  }
}
