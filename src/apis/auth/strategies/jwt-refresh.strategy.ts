import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  // 토큰의 비밀번호와 유효시간 검증
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const accessToken = cookie.split(';').find((c) => c.trim().startsWith('refreshToken='));
        return accessToken?.split('=')[1];
      },
      secretOrKey: 'myRefresh',
    });
  }

  validate(payload) {
    // req.user에 저장됨 (이거도 django랑 비슷하네)
    return {
      id: payload.sub,
    };
  }
}