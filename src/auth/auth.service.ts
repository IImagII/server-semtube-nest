import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './auth.dto'
import { compare, genSalt, hash } from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  //пишем нашу непосредственно авторизацию
  async login(dto: AuthDto) {
    //приходят данные мы их проверяем
    const user = await this.validateUser(dto)

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id)
    }
  }

  //пишем регитсрацию
  async register(dto: AuthDto) {
    const oldUser = await this.userRepository.findOneBy({ email: dto.email })

    //если такой user уже существует то выводиться ошибка
    if (oldUser)
      throw new BadRequestException('Такой пользователь уже существует')

    //генерирукется непосредственно для пароля
    const salt = await genSalt(10)

    //создадим нового user
    const newUser = await this.userRepository.create({
      email: dto.email,
      password: await hash(dto.password, salt)
    })

    //сохраняем нашего пользователя в базе данных
    const user = await this.userRepository.save(newUser)
    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id)
    }
  }

  //для валидации нашего user для сверки пароля и т.д тут мы подключаем те привила что мы  написали
  async validateUser(dto: AuthDto) {
    //ищем нашего user
    const user = await this.userRepository.findOne({
      where: {
        // тут показываем что ищем именно по email
        email: dto.email
      },
      select: ['id', 'email', 'password'] // тут конкретно выводим
    })

    //если user не нашли
    if (!user) throw new NotFoundException('Пользователь не найден')

    //проверяем наш пароль
    const usValidPassword = await compare(dto.password, user.password)
    if (!usValidPassword) throw new UnauthorizedException('Не правильныйпароль')

    //если все без ошибок то
    return user
  }

  //в нашем случае мы делаем один токен
  async issueAccessToken(userId: number) {
    const data = {
      id: userId
    }
    return await this.jwtService.signAsync(data, {
      expiresIn: '31d'
    })
  }
  //тут то чтоы мы будем отдаавть
  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email
    }
  }
}
