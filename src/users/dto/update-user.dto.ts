import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto){
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @MaxLength(30)
    password: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @MaxLength(30)
    confirmPassword: string;
}
