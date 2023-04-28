import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  // 토큰의 비밀번호와 유효시간 검증
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myPassword',
    });
  }

  validate(payload) {
    // req.user에 저장됨 (이거도 django랑 비슷하네)
    return {
      id: payload.sub,
    };
  }
}