import { Controller } from '@nestjs/common'
import { UserService } from './user.service'

//тут просто принимает данные валидирует данные и отдает данные
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
