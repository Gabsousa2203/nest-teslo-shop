import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type(() => Number) //* Es lo mismo que hacer enableImplicitConversions: true
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) //* Es lo mismo que hacer enableImplicitConversions: true
    offset?: number;

}