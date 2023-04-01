import { UserEntity } from 'src/user/user.entity'
import { Base } from 'src/utils/base'
import { VideoEntity } from 'src/video/video.entity'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'

@Entity('Comment')
export class CommentEntity extends Base {
  @Column({ type: 'text' }) // text - выдается больше места вбазе данных
  message: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' }) // это мы конкретно задали имя как оно будет называться в базе данных
  user: UserEntity

  @ManyToOne(() => VideoEntity, video => video.comments)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity
}
