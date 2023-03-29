import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

//настраиваем базу данных
export const getTypeOrmConfig = async (
  //configService -библиотека которая  позволяет обращатьсяк файлу .env
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: 'localhost',
  port: configService.get('PORT'),
  database: configService.get('DATABASE'),
  username: configService.get('USERNAME'),
  password: configService.get('PASSWORD'),
  autoLoadEntities: true, // чтобы автоматически загружались
  synchronize: true //для синхронизации
})
