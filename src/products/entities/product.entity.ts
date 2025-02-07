import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";


@Entity({name: 'products'}) //* Siempre que se quiera asingar como una entity tenemos que aplicarle el decorador
export class Product { //* Un entity es una tabla

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text',{
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column('text',{
        array: true,
        default:{},
    })
    tags: string[];
    

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
