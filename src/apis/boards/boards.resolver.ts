import { Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //
  ) {}

  @Query(() => String, { nullable: true })
  getHello(): string {
    return this.boardsService.getHello();
  }
}
