import { ApiProperty } from '@nestjs/swagger';

export class createAnswerDto {
  @ApiProperty({
    example: '1',
    description: 'ID пользователя - автора вопроса',
  })
  UserID: number;

  @ApiProperty({
    example: '1',
    description: 'ID сообщения, на который отвечают',
  })
  UserMessageID: number;

  @ApiProperty({
    example: 'Сколько будет стоить игра?',
    description: 'Текст вопроса',
  })
  readonly Text: string;
}
