import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { log } from 'console';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {

  constructor(private readonly repository: UsersRepository) { }

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    
    const existingUser = await this.repository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('Email already exists', 400);
    }
    return await this.repository.upsertOne(User.newInstanceFromDTO(createUserDto));
  }

  async login(loginDto: LoginDto) {
    try {
      console.log(loginDto);
      
      const user = await this.repository.findByEmail(loginDto.email);
      if (!user) {
        throw new HttpException('User is not exists', 400);
      }

      if (loginDto.password !== user.password) {
        throw new HttpException('Password is invalid', 400);
      }

      return true
    } catch (error) {
      console.log(error);
      throw new HttpException('Email or password is invalid', 400);
    }
  }

  findAll() {
    return this.repository.findAll();
  }

  findOneByEmail(id: string) {
    return this.repository.findByEmail(id);
  }

  async updatePasswordByEmail(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.password !== updateUserDto.confirmPassword) {
        return false
    }

    user.password = updateUserDto.password;
    user.updatedAt = new Date();

    await this.repository.updatePassword(email, user.password);

    return 'Password updated successfully';
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
