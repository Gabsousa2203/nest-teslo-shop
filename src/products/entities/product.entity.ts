import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name: 'products'}) //* Siempre que se quiera asingar como una entity tenemos que aplicarle el decorador
export class Product { //* Un entity es una tabla

    @ApiProperty({
        example: 'c1b0b1e0-0b1c-4b1c-8b1c-0b1c0b1c0b1c',
        description: 'Product Id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title'
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price'
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: ' Is a t-shirt with a tesla logo',
        description: 'Product description'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'T-Shrit Teslo',
        description: 'Product slug - for CEO'
    })
    @Column('text',{
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','L','XL'],
        description: 'Product sizes'
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['pipi'],
        description: 'Product tags'
    })
    @Column('text',{
        array: true,
        default:{},
    })
    tags: string[];
    
    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @OneToMany(
        () => ProductImage,
        ( productImage ) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.title
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
          }else{
            this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
          }
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }

}
