import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interfaces/context';


@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // @UseGuards(AuthGuard('access')) // rest-api 에서의 인가 방식
  @UseGuards(GqlAuthGuard("access")) // graphql 에서의 인가 방식
  @Query(() => String)
  fetchUser(
    @Context() context: IContext 
  ): string {
    console.log(context.req.user)
    context.req.user.id
    return "Hello World!"
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number,
  ): Promise<User> {
    return this.usersService.create({ email, password, name, age });
  }
}