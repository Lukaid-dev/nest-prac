import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { IAuthServiceGetAccessToken, IAuthServiceLogin } from "./interfaces/auth-service.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  
    async login({ email, password }: IAuthServiceLogin): Promise<string> {

      const user = await this.usersService.findOneByEmail({ email });
      if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

      const isAuth = await bcrypt.compare(password, user.password);
      if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

      return this.getAccessToken({ user });
    }

    getAccessToken({ user }: IAuthServiceGetAccessToken): string {
      return this.jwtService.sign({ sub: user.id }, { secret: 'myPassword', expiresIn: '1h' })
    }
}

