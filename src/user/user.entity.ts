//это так называемые model просто они так называются в typeorm

import { Base } from 'src/utils/base'
import { VideoEntity } from 'src/video/video.entity'
import { Entity, Column, OneToMany } from 'typeorm'
import { SubscriptionEntity } from './subscription.entity'

@Entity('User')
export class UserEntity extends Base {
  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column({ default: '' })
  name: string

  @Column({ default: false, name: 'is_verified' }) // name- мы переназначаем как у нас будет называться в базе данных
  isVerified: boolean

  @Column({ default: 0, name: 'subscribers_count' })
  subscribersCount?: number

  @Column({ default: '', type: 'text' }) // text - выдается больше места вбазе данных
  description: string

  @Column({ default: '', name: 'avatar_path' })
  avatarPath: string

  //связываемые поля
  //это мы делаем например для того чтобы получить все идео данного пользователя для этого применяется связывание
  @OneToMany(() => VideoEntity, video => video.user)
  videos: VideoEntity[]

  @OneToMany(() => SubscriptionEntity, sub => sub.fromUser)
  subscriptions: SubscriptionEntity[] // подписки

  @OneToMany(() => SubscriptionEntity, sub => sub.toChannel)
  subscribers: SubscriptionEntity[] // подписчики
}
