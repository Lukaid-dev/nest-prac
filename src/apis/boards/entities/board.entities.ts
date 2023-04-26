import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// entity에는 s안붙음
@Entity() // for TypeORM, table
@ObjectType() // for GraphQL
export class Board {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int) // for GraphQL
  number: number;

  @Column()
  @Field(() => String) // for GraphQL
  writer: string;

  @Column()
  @Field(() => String) // for GraphQL
  title: string;

  @Column()
  @Field(() => String) // for GraphQL
  content: string;
}
