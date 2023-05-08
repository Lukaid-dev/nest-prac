// pointsTransactions.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';
import { IPointsTransactionsServiceCreate } from './interfaces/points-transactions-service.interface';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: IPointsTransactionsServiceCreate): Promise<PointTransaction> {
    // this.pointsTransactionsRepository.create(); // 등록을 위한 빈 객체 만들기
    // this.pointsTransactionsRepository.insert(); // 결과는 못 받는 등록 방법
    // this.pointsTransactionsRepository.update(); // 결과는 못 받는 수정 방법

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // 1. PointTransaction 테이블에 거래기록 1줄 생성
      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      // await this.pointsTransactionsRepository.save(pointTransaction);
      await queryRunner.manager.save(pointTransaction);

      // 2. 유저의 돈 찾아서 업데이트하기   // 숫자일 때 가능 => 숫자가 아니면?? (ex, 좌석 등)? 직접 lock 걸기! (service2 파일 참고)
      const id = _user.id;
      await queryRunner.manager.increment(User, { id }, 'point', amount);
      await queryRunner.commitTransaction();

      // 3. 최종결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release(); // release가 없으면, commit 끝나도 커넥션이 안끊겨서 문제됨 (하지만, 에러나면 자동끊김)
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import { POINT_TRANSACTION_STATUS_ENUM, PointTransaction } from './entities/pointTransaction.entity';
// import { IPointsTransactionsServiceCreate } from './interfaces/points-transactions-service.interface';
// import { User } from '../users/entities/user.entity';

// @Injectable()
// export class PointsTransactionsService {
//   constructor(
//     @InjectRepository(PointTransaction)
//     private readonly pointsTransactionsRepository: Repository<PointTransaction>,

//     @InjectRepository(User)
//     private readonly usersRepository: Repository<User>,

//     private readonly dataSource: DataSource,
//   ) {}

//   async create({ impUid, amount, user: _user }: IPointsTransactionsServiceCreate): Promise<PointTransaction> {
//     // this.pointsTransactionsRepository.create(); // 등록을 위한 빈 객체 만들기
//     // this.pointsTransactionsRepository.insert(); // 결과는 못 받는 등록 방법
//     // this.pointsTransactionsRepository.update(); // 결과는 못 받는 수정 방법 

//     const queryRunner = this.dataSource.createQueryRunner(); // 트랜잭션을 위한 쿼리 러너 만들기
//     await queryRunner.connect(); // 쿼리 러너 연결하기
//     await queryRunner.startTransaction(); // 쿼리 러너 트랜잭션 시작하기
 
//     try{
//       // 1. PointTransaction 테이블에 거래기록 1줄 생성
//       const pointTransaction = this.pointsTransactionsRepository.create({
//         impUid,
//         amount,
//         user: _user,
//         status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
//       })
//       // await this.pointsTransactionsRepository.save(pointTransaction);
//       await queryRunner.manager.save(pointTransaction); // 쿼리 러너를 통해 저장하기
      
//       // 2. 유저의 돈 찾아오기     // 반드시 서비스를 타야하는것은 아님, 이렇게도 가능
//       //                      // 하지만, 더나은 구조를 위해서 서비스 타고 가는게 좋음 - 포트폴리오에는 여러분이 생각하는 규모에 맞게 선택해서 설정
//       // const user = await this.usersRepository.findOne({
//       //   where: { id: _user.id },
//       // });
//       const user = await queryRunner.manager.findOne(User, { 
//         where: { id: _user.id },
//       });

//       // 3. 유저의 돈 업데이트     // 반드시 서비스를 타야하는것은 아님, 이렇게도 가능
//       //                       // 하지만, 더나은 구조를 위해서 서비스 타고 가는게 좋음 - 포트폴리오에는 여러분이 생각하는 규모에 맞게 선택해서 설정
//       // await this.usersRepository.update(
//       //   { id: _user.id },
//       //   { point: user.point + amount },
//       // );
//       const updatedUser = this.usersRepository.create({
//         ...user,
//         point: user.point + amount,
//       })
//       await queryRunner.manager.save(updatedUser); // 쿼리 러너를 통해 저장하기
//       await queryRunner.commitTransaction(); // 쿼리 러너 트랜잭션 커밋하기

//       // 4. 최종결과 브라우저에 돌려주기
//       return pointTransaction;
//     } catch (error) {
//       await queryRunner.rollbackTransaction(); // 쿼리 러너 트랜잭션 롤백하기
//       throw error;
//     } finally {
//       await queryRunner.release(); // 쿼리 러너 해제하기
//     }
//   }
// }
