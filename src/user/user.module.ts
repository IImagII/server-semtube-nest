import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'

//это файл где у нас все сращивается
@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
