import { ApiProperty } from "@nestjs/swagger";

export class CreateImageDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Image file' })
    image: any;
}
