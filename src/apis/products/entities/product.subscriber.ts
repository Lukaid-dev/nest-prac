import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  // entity가 등록되고 나서 실행되는 메소드
  afterInsert(event: InsertEvent<any>): void | Promise<any> {
    console.log(event); // event.entity.price, event.entity.isSoldout, ...

    const id = event.entity.id;
    const name = event.entity.name;
    const description = event.entity.description;
    const price = event.entity.price;
    const isSoldout = event.entity.isSoldout;

    console.log(`${id} ${name} ${description} ${price} ${isSoldout}`); // 빅쿼리나 엘라스틱서치에 담기

    // 1. 트리거는 언제 사용하면 안될까?
    // 트랜잭션으로 연결된 중요한 내용들...

    // 2. 어떤 것들을 사용하면 좋을까?
    // 메인 로직에 큰 피해를 안끼치는 로직들...(통계 계산하기(.count() 비효율적), 로그 쌓아놓기)
  }
}