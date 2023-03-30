//декоратор нужен для того чтобы одной строкой показывать что доступно для авторизитованных пользователей

import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export const Auth = () => UseGuards(AuthGuard('jwt'))
