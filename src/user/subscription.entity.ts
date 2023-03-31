//это для того чтобы отображать кто на кого подписан
import { Base } from 'src/utils/base'
import { Entity, ManyToMany, JoinColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('Subscription')
export class SubscriptionEntity extends Base {
  @ManyToMany(() => UserEntity, user => user.subscriptions)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: UserEntity

  @ManyToMany(() => UserEntity, user => user.subscriptions)
  @JoinColumn({ name: 'to_channel_id' })
  toChannel: UserEntity
}
