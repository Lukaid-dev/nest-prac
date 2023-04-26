import { Injectable, Scope } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { IBoardsServiceCreate } from './interfaces/boards-service.interface';

// injection scope
// 1. Scope.DEFAULT: 기본값. singleton으로 동작한다. 생략가능.
// 2. Scope.REQUEST: 요청이 올 때마다 새로운 인스턴스를 생성한다.
// 3. Scope.TRANSIENT: 주입될 때마다 새로운 인스턴스를 생성한다.

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  findAll(): Board[] {
    // 1. 데이터를 조회하는 로직 => DB에 접속해서 데이터 꺼내오기

    // 2. 꺼내온 결과 응답 주기
    const result = [
      {
        number: 1,
        writer: '철수',
        title: '제목입니다~~',
        contents: '내용입니다!!!',
      },
      {
        number: 2,
        writer: '철수',
        title: '제목입니다~~',
        contents: '내용입니다!!!',
      },
      {
        number: 3,
        writer: '철수',
        title: '제목입니다~~',
        contents: '내용입니다!!!',
      },
    ];

    return result;
  }

  create({ createBoardInput }: IBoardsServiceCreate): string {
    // 1. 데이터를 등록하는 로직 => DB에 접속해서 데이터 저장하기
    console.log(createBoardInput.writer);
    console.log(createBoardInput.title);
    console.log(createBoardInput.contents);
    // 2. 저장 결과 응답 주기
    return '게시물 등록에 성공하였습니다!!';
  }
}
