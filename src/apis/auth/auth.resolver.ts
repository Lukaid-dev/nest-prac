import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { IContext } from "src/commons/interfaces/context";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  login(
    @Args("email") email: string,
    @Args("password") password: string,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.login({ email, password, context });
  }
}