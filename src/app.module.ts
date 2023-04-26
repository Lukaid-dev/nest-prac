import { Module } from '@nestjs/common';
import { BoardsModule } from './apis/boards/boards.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    BoardsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // docker시에는 name resolution
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'myProject',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      // logging: true,
    }),
  ],
})
export class AppModule {}
