import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserService } from './user.service'
import {
  Body,
  Controller,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Put,
  Patch
} from '@nestjs/common'
import { CurrentUser } from './user.decorator'
import { UserDto } from './user.dto'

//тут просто принимает данные валидирует данные и отдает данные
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //делаем наши endpoint те которіе мі описівали в лоики user.service.ts
  //тут получаем конкретного user
  @Get('profile') // это типа запрос в данным случае это GET
  @Auth() // потомучтоу нас это защищенный роутинг мы его берем из нашего файла auth.decorator.ts то есть показываем что доступ только для авторизированных пользователей
  async getProfile(@CurrentUser('id') id: number) {
    //@CurrentUser -мы взяли из нашего декоратора

    return this.userService.byId(id)
  }

  //by-id (получение страницы канала)
  @Get('by-id/:id')
  async getUser(@Param('id') id: string) {
    //@Param - поотмучто мы должны получить наш id

    return this.userService.byId(+id)
  }

  //update(обновление пользователя)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth() //только для авторизированных пользователей
  //@Body() - нужно для получения данных поотм их передает в наш валидатор
  async updateUser(@Param('id') id: string, @Body() dto: UserDto) {
    return this.userService.updateProfile(+id, dto)
  }

  //subscribe(работа сподписками)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch('subscribe/:channelId') // если вы редактируете не польностью а частично например в нашем случае редактируем поле подписки и все
  @Auth() //только для авторизированных пользователей
  //@Body() - нужно для получения данных поотм их передает в наш валидатор
  async subscribeToChannel(
    @CurrentUser('id') id: number, // это мы берем непосредственно нашего текущего юзера
    @Param('channelId') channelId: string
  ) {
    return this.userService.subscribe(id, +channelId)
  }

  //getAll (запрос с помощью коотрого будм получать всех user)
  @Get()
  async getUSers() {
    return this.userService.getAll()
  }
}
