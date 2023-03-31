import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { SubscriptionEntity } from './subscription.entity'
import { UserDto } from './user.dto'
import { genSalt, hash } from 'bcryptjs'

//этот файл содержит всю логику
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>
  ) {}

  //by-id(тут описываем метод поиска самогго пользователя)
  async byId(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        //сначало просто ищем по id
        id
      },
      //ищем связи(коментарии и т.д)
      relations: {
        videos: true,
        subscriptions: {
          toChannel: true
        }
      },
      //тут сразуделаем сортировку
      order: { createdAt: 'DESC' }
    })

    //если user не найден пишем ошибку
    if (!user) throw new NotFoundException('Такого user не существует')

    return user
  }

  //update
  async updateProfile(id: number, dto: UserDto) {
    //тут используем предыдущий метод поиска user byId() тот то мы уже написали выше
    const user = await this.byId(id)

    const isSameUser = await this.userRepository.findOneBy({ email: dto.email })

    //если такой user уже существует то выводиться ошибка
    if (isSameUser && id !== isSameUser.id)
      throw new BadRequestException('Email занят')

    //пароль
    if (dto.password) {
      //генерирукется непосредственно для пароля
      const salt = await genSalt(10)
      //меняем ему текущий пароль
      user.password = await hash(dto.password, salt)
    }
    //дополним другие поля
    user.email = dto.email
    user.name = dto.name
    user.description = dto.description
    user.avatarPath = dto.avatarPath

    return this.userRepository.save(user)
  }

  //subscribe(работа сподписками)
  async subscribe(id: number, channelId: number) {
    //id - это id пользователя, channelId - на какие каналы он подписан

    //это сделано для рефакторинга так как везде используется
    const data = {
      toChannel: { id: channelId },
      fromUser: { id }
    }

    //тут проверяем есть ли у нас подписка
    const isSubscribed = await this.subscriptionRepository.findOneBy(data)

    //пишем логику если не подписан
    if (!isSubscribed) {
      // если подписки нет то создаем ее
      const newSubscription = await this.subscriptionRepository.create(data)
      await this.subscriptionRepository.save(newSubscription)

      return true
    }

    //если же подписка у нас есть то мы тоггда подписку удаляем(будет происходить отписка)
    await this.subscriptionRepository.delete(data)
    return false
  }

  //getAll (тут нам при запросе отдадут всех наших пользователей)
  async getAll() {
    return this.userRepository.find()
  }
}
