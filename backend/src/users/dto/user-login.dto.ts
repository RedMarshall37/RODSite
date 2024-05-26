import { ApiProperty } from '@nestjs/swagger';

export class userLoginDto {
  @ApiProperty({ example: 'Nickname', description: 'Имя пользователя' })
  readonly Nickname: string;

  @ApiProperty({ example: '123456789', description: 'Пароль' })
  Password: string;
}
