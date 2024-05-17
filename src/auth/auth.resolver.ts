import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { User } from 'src/user/models/user.model';
import { AuthService } from './auth.service';
import SignUpInput from './dto/sign-up.input';
import SignInInput from './dto/sign-in.input';
import RefreshTokenInput from './dto/refresh-token.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signUp(@Args('signUpInput') { email, password, name }: SignUpInput) {
    const { accessToken, refreshToken } = await this.auth.signUp({
      email: email.toLowerCase(),
      password,
      name,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async signIn(@Args('signInInput') { email, password }: SignInInput) {
    const { accessToken, refreshToken } = await this.auth.signIn(
      email.toLowerCase(),
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args('refreshTokenInput') { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}