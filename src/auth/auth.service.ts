import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);
    return newUser;
  }

  async login(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      throw new HttpException('Password not matched', HttpStatus.CONFLICT);

    return user;
  }

  async generateAccessToken(id: string) {
    const payload: TokenPayload = { id };
    const token = this.jwtService.sign(payload);

    return token;
  }
}
