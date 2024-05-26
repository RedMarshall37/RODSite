import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty({ example: 'Nickname', description: 'Имя пользователя' })
  readonly Nickname: string;

  @ApiProperty({ example: '123456789', description: 'Пароль' })
  Password: string;

  @ApiProperty({ example: 'test@mail.ru', description: 'Почта' })
  readonly Email: string;
}
