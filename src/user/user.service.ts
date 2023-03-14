import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
      newUser.password = undefined;

      return newUser;
    } catch (error) {
      throw new HttpException(
        'Username is already exist.',
        HttpStatus.CONFLICT,
      );
    }
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) return user;

    throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (user) return user;

    throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
  }
}
