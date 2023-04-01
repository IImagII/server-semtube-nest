import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { writeFile, ensureDir } from 'fs-extra'
import { IMediaResponse } from './media.interface'

@Injectable()
export class MediaService {
  async saveMedia(
    //тут мы получаем медиа файл конкретный
    mediaFile: Express.Multer.File, //это файл который мы получаем
    folder = 'default' // получаем папку коотрую будем грузить на сервер
  ): Promise<IMediaResponse> {
    const uploadFolder = `${path}/uploads/${folder}` // тут формируем путь к папке
    await ensureDir(uploadFolder) //создаем папку если ее у нас нет

    //записываем файл
    await writeFile(
      `${uploadFolder}/${mediaFile.originalname}`, //тут указывам путь куда записываем и название файла
      mediaFile.buffer
    )
    return {
      url: `/uploads/${folder}/${mediaFile.originalname}`,
      name: mediaFile.originalname
    }
  }
}
