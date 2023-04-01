import {
  Body,
  Controller,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Post,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common'
import { MediaService } from './media.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  //Загрузка файла

  @HttpCode(200)
  @Post()
  @Auth() //только для авторизированных пользователей
  @UseInterceptors(FileInterceptor('media')) // в библиотеке nest необходимо для загрузки файлов "media" обязателен
  async uploadMediaFile(
    @UploadedFile() mediaFile: Express.Multer.File, //указываем с помощью декоратора @UploadedFile() тот самый загружный файл
    @Query('folder') folder?: string // через @Query-получаем тут папку в которую нужно загрузить либо  по default она будет "default"
  ) {
    return this.mediaService.saveMedia(mediaFile, folder)
  }
}
