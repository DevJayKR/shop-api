import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { TokenPayload } from './token-payload.interface';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

  async welcomeEmailSend(email: string) {
    const text = `저희 서비스에 오신것을 환영합니다!`;

    const mailOption = {
      to: email,
      subject: 'Welcome to our service',
      text,
    };

    return await this.emailService.sendMail(mailOption);
  }
}
