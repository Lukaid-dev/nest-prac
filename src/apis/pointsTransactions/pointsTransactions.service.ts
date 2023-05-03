import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POINT_TRANSACTION_STATUS_ENUM, PointTransaction } from './entities/pointTransaction.entity';
import { IPointsTransactionsServiceCreate } from './interfaces/points-transactions-service.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create({ impUid, amount, user: _user }: IPointsTransactionsServiceCreate): Promise<PointTransaction> {
    // this.pointsTransactionsRepository.create(); // 등록을 위한 빈 객체 만들기
    // this.pointsTransactionsRepository.insert(); // 결과는 못 받는 등록 방법
    // this.pointsTransactionsRepository.update(); // 결과는 못 받는 수정 방법

    // 1. PointTransaction 테이블에 거래기록 1줄 생성
    const pointTransaction = this.pointsTransactionsRepository.create({
      impUid,
      amount,
      user: _user,
      status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    })
    await this.pointsTransactionsRepository.save(pointTransaction);

    
    // 2. 유저의 돈 찾아오기     // 반드시 서비스를 타야하는것은 아님, 이렇게도 가능
    //                      // 하지만, 더나은 구조를 위해서 서비스 타고 가는게 좋음 - 포트폴리오에는 여러분이 생각하는 규모에 맞게 선택해서 설정
    const user = await this.usersRepository.findOne({
      where: { id: _user.id },
    });


    // 3. 유저의 돈 업데이트     // 반드시 서비스를 타야하는것은 아님, 이렇게도 가능
    //                       // 하지만, 더나은 구조를 위해서 서비스 타고 가는게 좋음 - 포트폴리오에는 여러분이 생각하는 규모에 맞게 선택해서 설정
    await this.usersRepository.update(
      { id: _user.id },
      { point: user.point + amount },
    );

    // 4. 최종결과 브라우저에 돌려주기
    return pointTransaction;
  }
}
