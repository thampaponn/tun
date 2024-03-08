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

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findByUserId(id);
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
