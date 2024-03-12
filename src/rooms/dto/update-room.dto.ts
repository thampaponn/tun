import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @ApiProperty({ type: 'boolean'})
    @IsNotEmpty()
    status: boolean;
}
