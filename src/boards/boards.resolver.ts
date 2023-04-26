import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entities';
import { CreateBoardInput } from './dto/createBoard.input';

@Resolver()
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  // @Query(() => String)
  // getHello() {
  //   return this.boardsService.aaa();
  // }

  @Query(() => [Board])
  fetchBoards() {
    return this.boardsService.findAll();
  }

  @Mutation(() => String)
  createBoard(
    @Args('writer') writer: string,
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ) {
    return this.boardsService.create({
      writer,
      title,
      contents,
      createBoardInput,
    });
  }
}
