import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/user/user.entity'
import { Repository } from 'typeorm'

//стандартная стратегия для jwt токена
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, //тут мы получаем configservice

    @InjectRepository(UserEntity) // подключаем репозиторий для того чтобы работать сбазой данных
    private readonly userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // тут прописываем откуда мы берем jwt тут мі вітаскиваем наш токен
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET') //тут мы берем наш секретный ключ
    })
  }
  async validate({ id }: Pick<UserEntity, 'id'>) {
    // мы тут получаем наш id и прописывается тип нашего id

    return this.userRepository.findBy({ id }) // в нашем случае мы ищем в базе по id и передать потом в validate
  }
}
