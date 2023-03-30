import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // async login(dto: AuthDto) {
  //   const user = await this.authService.validateUser(dto)
  //   const token = this.authService.generateToken(user)
  //   return { user, token }
  // }
}
