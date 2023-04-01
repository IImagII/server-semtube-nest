import { Auth } from 'src/auth/decorators/auth.decorator'
import { CommentService } from './comment.service'
import {
  Body,
  Controller,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Post
} from '@nestjs/common'
import { CommentDto } from './comment.dto'
import { CurrentUser } from 'src/user/user.decorator'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  //Созданеи коментария
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth() //только для авторизированных пользователей
  //@Body() - нужно для получения данных поотм их передает в наш валидатор
  async createComment(@CurrentUser('id') id: string, @Body() dto: CommentDto) {
    //@CurrentUser - тут берем конкретного user
    return this.commentService.create(+id, dto)
  }
}
