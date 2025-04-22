import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

const secret = process.env.TOKEN_SECRET ?? undefined
const expireTime = process.env.TOKEN_EXPIRE ?? '60s'

@Module({
  imports:[JwtModule.register({
    global: true,
    signOptions: {expiresIn: expireTime},
    secret: secret
  })],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
