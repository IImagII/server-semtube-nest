//тут записываются правила для валидации
//dto - необходитмо для того чтобы контролировать что конкретно нам приходит то есть валидировать строки
//например чтобы пришло именно email и т.д
//тут пишем правила для валидации
//и потом каждое создание в базу данных нового пользователя будет происходить через наш созданный dto
import { IsEmail, IsString } from 'class-validator'

export class UserDto {
  @IsEmail()
  email: string

  password?: string

  @IsString()
  name: string

  @IsString()
  description: string

  @IsString()
  avatarPath: string
}
