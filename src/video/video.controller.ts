import { Auth } from 'src/auth/decorators/auth.decorator'
import { VideoService } from './video.service'
import {
  Body,
  Controller,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Put,
  Patch,
  Query,
  Post,
  Delete
} from '@nestjs/common'
import { CurrentUser } from 'src/user/user.decorator'
import { VideoDto } from './video.dto'

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  //тут получаем конкретное video которое доступно только нашему user(для того чтобы этор видео отредактировать)
  @Get('get/private/:id') // это типа запрос в данным случае это GET
  @Auth() // потомучтоу нас это защищенный роутинг мы его берем из нашего файла auth.decorator.ts то есть показываем что доступ только для авторизированных пользователей
  async getVideoPrivate(@Param('id') id: string) {
    //@CurrentUser -мы взяли из нашего декоратора
  }

  //полуычение всех видео по поиску
  @Get()
  async getAllVideo(@Query('searchTerm') searchTerm?: string) {
    return this.videoService.getAll(searchTerm)
  }

  //полуычение всех видео по поиску
  @Get('most-popular')
  async getMostPopularByViews() {
    return this.videoService.getMostPopularByViews()
  }

  //получаем конкретное видео по id
  @Get(':id')
  async getVideo(@Param('id') id: string) {
    return this.videoService.byId(+id)
  }

  //создание видео
  @HttpCode(200)
  @Post()
  @Auth() //только для авторизированных пользователей
  async createVideo(@CurrentUser('id') id: number) {
    //@CurrentUser - тут берем конкретного user
    return this.videoService.create(id)
  }

  //обновление видео
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth() //только для авторизированных пользователей
  //@Body() - нужно для получения данных поотм их передает в наш валидатор
  async updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
    //@CurrentUser - тут берем конкретного user
    return this.videoService.update(+id, dto)
  }

  //удаление видео
  @HttpCode(200)
  @Delete(':id')
  @Auth() //только для авторизированных пользователей
  async deleteVideo(@Param('id') id: string) {
    //@CurrentUser - тут берем конкретного user
    return this.videoService.delete(+id)
  }

  //обновление просмотров
  @HttpCode(200)
  @Put('update-views/:videoId')
  async updateViews(@Param('videoId') videoId: string) {
    //@CurrentUser - тут берем конкретного user
    return this.videoService.updateCountViews(+videoId)
  }

  //обновление просмотров
  @HttpCode(200)
  @Put('update-likes/:likeId')
  async updateLikes(@Param('likeId') likeId: string) {
    //@CurrentUser - тут берем конкретного user
    return this.videoService.updateCountLikes(+likeId)
  }
}
