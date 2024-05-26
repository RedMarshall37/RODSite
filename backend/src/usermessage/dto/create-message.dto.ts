import { ApiProperty } from '@nestjs/swagger';

export class createMessageDto {
  @ApiProperty({
    example: '1',
    description: 'ID пользователя - автора вопроса',
  })
  UserID: number;

  @ApiProperty({
    example: 'Сколько будет стоить игра?',
    description: 'Текст вопроса',
  })
  readonly Text: string;
}
