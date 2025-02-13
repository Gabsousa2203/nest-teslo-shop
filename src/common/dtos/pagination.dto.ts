import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @ApiProperty({
        default: 10,
        description: 'how many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //* Es lo mismo que hacer enableImplicitConversions: true
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'how many rows do you want to skip'
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number) //* Es lo mismo que hacer enableImplicitConversions: true
    offset?: number;

}