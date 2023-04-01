import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { VideoEntity } from './video.entity'
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm'
import { VideoDto } from './video.dto'

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>
  ) {}

  //by-id(тут описываем метод поиска самого video)
  async byId(id: number, isPublic = false) {
    //isPublic - нужен для получения не только публичных но и других видео
    const video = await this.videoRepository.findOne({
      //тут делаем проверку какое именно видео мы ищем или публичное или не публичное в зависимотси от этого будет разный поиск
      where: isPublic
        ? {
            id,
            isPublic: true
          }
        : {
            //потом просто ищем по id
            id
          },
      //ищем связи(коментарии и т.д)
      relations: {
        user: true,
        comments: {
          user: true
        }
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          subscribersCount: true,
          subscriptions: true
        },
        comments: {
          message: true,
          id: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true,
            subscribersCount: true
          }
        }
      }
    })

    //если video не найден пишем ошибку
    if (!video) throw new NotFoundException('Такого video не найдено')
    return video
  }

  //обновление видео(update video)
  async update(id: number, dto: VideoDto) {
    //тут используем предыдущий метод поиска video byId() тот то мы уже написали выше
    const video = await this.byId(id)

    return this.videoRepository.save({
      //тут мы развернули старые поля и перезаписали их новыми полями и взялиих из dto
      ...video,
      ...dto
    })
  }

  //получене всех video
  async getAll(searchTerm?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {}

    if (searchTerm)
      options = {
        name: ILike('%searchTerm%') // тут мы организовали поиск использу typeorm
      }
    return this.videoRepository.find({
      where: {
        ...options,
        isPublic: true
      },
      //это сортировка по дате
      order: {
        createdAt: 'DESC'
      },
      relations: {
        user: true,
        comments: {
          user: true
        }
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true
        }
      }
    })
  }

  //список популярных видео исходя из их просмотров
  async getMostPopularByViews() {
    return this.videoRepository.find({
      where: {
        //тут мы показываем что если будт 0 то показывать вообще не будет
        views: MoreThan(0)
      },
      relations: {
        user: true,
        comments: {
          user: true
        }
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true
        }
      },
      //тут сортируем по просмотрам
      order: {
        views: -1
      }
    })
  }
  //создание видео
  //сгачало создаем экземпляр поотм его наполняем
  async create(userId: number) {
    /* снчало создаем экземпляр потом получаем id а потом просто редактируем id*/
    const defaultValue = {
      name: '',
      user: { id: userId },
      videoPath: '',
      description: '',
      thumbnailPath: ''
    }

    //далее создаем нового user
    const newVideo = this.videoRepository.create(defaultValue)
    //далее сохраняем нового user
    const video = await this.videoRepository.save(newVideo)
    //отдаем именно id
    return video.id
  }

  //удаление video
  async delete(id: number) {
    return this.videoRepository.delete({ id })
  }

  //обновление просмотров(увеличение просмотров)
  async updateCountViews(id: number) {
    //получаем видео
    const video = await this.byId(id)
    //тут мы увеличиваем то олекоотрое относиться к просмотрам видео
    video.views++
    return this.videoRepository.save(video)
  }

  //обновление лайков(like)(увеличение просмотров)
  async updateCountLikes(id: number) {
    //получаем видео
    const video = await this.byId(id)
    //тут мы увеличиваем то олекоотрое относиться к просмотрам видео
    video.likes++
    return this.videoRepository.save(video)
  }
}
