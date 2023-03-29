import { CommentEntity } from 'src/comment/comment.entity'
import { UserEntity } from 'src/user/user.entity'
import { Base } from 'src/utils/base'
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

@Entity('Video')
export class VideoEntity extends Base {
  @Column({ default: '' })
  name: string

  @Column({ default: false, name: 'is_public' }) // name- мы переназначаем как у нас будет называться в базе данных
  isPublic: boolean

  @Column({ default: 0 })
  views?: number

  @Column({ default: 0 })
  likes?: number

  @Column({ default: 0 })
  duration?: number

  @Column({ default: '', type: 'text' }) // text - выдается больше места вбазе данных
  description: string

  @Column({ default: '', name: 'video_path' })
  videoPath: string

  @Column({ default: '', name: 'thumbnail_path' })
  thumbnailPath: string

  @ManyToOne(() => UserEntity, user => user.videos)
  @JoinColumn({ name: 'user_id' }) // это мы конкретно задали имя как оно будет называться в базе данных
  user: UserEntity

  @OneToMany(() => CommentEntity, comment => comment.video)
  comments: CommentEntity[]
}
