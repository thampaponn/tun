import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(private readonly repository: UsersRepository) { }

  async create(createUserDto: CreateUserDto) {
    return await this.repository.upsertOne(User.newInstanceFromDTO(createUserDto));
  }

  async login(email: string, password: string) {
    const loginUser = await this.repository.findByEmail(email);
    if (loginUser && loginUser.password === password) {
      return this.repository.login(email, password);
    }
  }

  findAll() {
    return this.repository.findAll();
  }

  findOneByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  findOneById(userId: string) {
    return this.repository.findByUserId(userId);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingObject = await this.repository.findByUserId(id);
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
