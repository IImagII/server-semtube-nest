import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from 'src/config/jwt.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/user/user.entity'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // тут мы добавили нашу стратегию JwtStrategy ту что мы прописали
  //далее подключаем и делаем наши импорты
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    }),
    TypeOrmModule.forFeature([UserEntity])
  ]
})
export class AuthModule {}
