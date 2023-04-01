import { Module } from '@nestjs/common'
import { MediaService } from './media.service'
import { MediaController } from './media.controller'
import { path } from 'app-root-path'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
  imports: [
    //тут указываем что папка должна быть статичная и к ней был легкий доступ
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`, //сам путь к папке
      serveRoot: '/uploads' // указываем на каком пути она будет открываться на сервере
    })
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
