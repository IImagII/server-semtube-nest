//этот декоратор мы создаем для того чтобы понять с каким user мі имеем дело
//используя для этого токен
//есть на официальном сайте nest(то есть это стандартно)

import { UserEntity } from './user.entity'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  //мы получаем data это то что прокидывается во внутрь
  (data: keyof UserEntity, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user

    return data ? user[data] : user
  }
)
