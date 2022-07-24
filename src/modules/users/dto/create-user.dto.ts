import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Enter a valid email',
    nullable: false,
    required: true,
  })
  public email: string;

  @ApiProperty({
    description: 'Enter a password',
    minLength: 6,
    nullable: false,
    required: true,
  })
  public password: string;
}
