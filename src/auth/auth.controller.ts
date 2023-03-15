import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwtAuth.guard';
import { LocalAuthGuard } from './guard/localAuth.guard';
import { RequestWithUser } from './request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.createUser(createUserDto);
    return newUser;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const token = await this.authService.generateAccessToken(user.id);

    return {
      user,
      token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async profile(@Req() request: RequestWithUser) {
    const { user } = request;

    return user;
  }
}
