//dto - необходитмо для того чтобы контролировать что конкретно нам приходит то есть валидировать строки
//например чтобы пришло именно email и т.д
//тут пишем правила для валидации
//и потом каждое создание в базу данных нового пользователя будет происходить через наш созданный dto
import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  email: string

  @MinLength(6, {
    message: 'Не менее  6 символов'
  })
  @IsString()
  password: string
}
