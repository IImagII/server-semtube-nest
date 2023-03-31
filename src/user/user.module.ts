import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionEntity } from './subscription.entity'

//это файл где у нас все сращивается
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity, SubscriptionEntity])]
})
export class UserModule {}
