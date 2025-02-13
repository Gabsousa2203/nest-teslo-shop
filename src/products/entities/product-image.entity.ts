import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name: 'product_images'})
export class ProductImage{

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    url: string;

    @ApiProperty()
    @ManyToOne(
        () => Product,
        ( product ) => product.images,
        { onDelete: 'CASCADE'}
    )
    product: Product;
}