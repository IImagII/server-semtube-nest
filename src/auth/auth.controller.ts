import {
  Body,
  Controller,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //делаем наши endpoint

  //первый endpoint login
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  //@Body() - нужно для получения данных поотм их передает в наш валидатор
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  //второй endpoint register
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  //@Body() - нужно для получения данных поотм их передает в наш валидатор
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto)
  }
}
