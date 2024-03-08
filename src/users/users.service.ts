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
        throw new UnauthorizedException('User is not exists');
      }

      if (loginDto.password !== user.password) {
        throw new UnauthorizedException('Password is invalid');
      }

      return true
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(HttpStatus.BAD_REQUEST, error);
    }
  }

  findAll() {
    return this.repository.findAll();
  }

  findOneByEmail(id: string) {
    return this.repository.findByEmail(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingObject = await this.repository.findByEmail(id);
    if (updateUserDto.password) {
      existingObject.password = updateUserDto.password;
    }
    existingObject.updatedAt = new Date();

    return this.repository.upsertOne(existingObject);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
