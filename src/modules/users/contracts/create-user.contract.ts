import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '@users-dtos';

import { Contract } from '@shared';
import { FluentValidator } from '@utils';

@Injectable()
export class CreateUserContract implements Contract {
  errors: any[];
  constructor() {}

  validate(model: CreateUserDto): boolean {
    const contract = new FluentValidator();

    contract.isEmail(model.email, 'formato de e-mail inválido');
    contract.hasMinLen(
      model.password,
      6,
      'Senha precisa conter pelo menos 6 caracteres',
    );

    this.errors = contract.errors;

    return contract.isValid();
  }
}
