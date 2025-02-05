import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product, ProductImage } from './entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID} from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor( //* Estamos usando aqui el patron repositorio
    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,

    @InjectRepository( ProductImage )
    private readonly productImageRepository: Repository<ProductImage>,


    private readonly dataSource: DataSource

  ){}
  
  async create(createProductDto: CreateProductDto) {
    try{

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create( {
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image,  }) ),
      } ); //* Esta funcion tiene 3 formas de usarse

      await this.productRepository.save( product );

      return {...product, images};

    }catch( error ){
      this.handleDBExceptions( error );
    }
  }

  async findAll(paginationDto: PaginationDto) {
   
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map( product => ({
      ...product,
      images: product.images.map( img => img.url )
    }))
  }

  async findOne(term: string) {
    let product: Product;
    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term });
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }
    if( !product ) throw new NotFoundException(`Product with ${ term } not found`);
    
    return product;
  }

  async findOnePlain ( term:string ){
    const { images = [], ...rest } = await this.findOne( term );
    return {
      ...rest,
      images: images.map( image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const { images, ...toUpdate } = updateProductDto;
    
    const product = await this.productRepository.preload({ id, ...toUpdate });

    if( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    //Create Query Runner //!Siempre hacerlo afuer del try, para poder meterlo en el catch
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); //* Conectamos el Query Runner
    await queryRunner.startTransaction();//* Activamos el Query Runner

    try{
      if( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id } }); //* Puedes poner tanto product como productId(de la tabla ProductImage)
        product.images = images.map( 
          image => this.productImageRepository.create({ url: image })
        )
      }
      await queryRunner.manager.save( product ); //* Cuando usamos el manager no impacta todavia en la BD, es decir, no se hace el commit
      await queryRunner.commitTransaction(); //* Hacemos commit de todas las transacciones 
      await queryRunner.release(); //* Desactivamos el Query Runner
      return this.findOnePlain( id );
    }catch(error){
      await queryRunner.rollbackTransaction(); //* Esto es para echar para atras todo si hay un error
      await queryRunner.release();
      this.handleDBExceptions( error );
    }
  }

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.productRepository.delete( id );
  }

  private handleDBExceptions( error ){
    this.logger.error( error );
    throw new InternalServerErrorException( 'Unexpected error, check server logs' );
  }

  async deleteAllProducts(){
    const query = this.productImageRepository.createQueryBuilder('product');

    try{
      return await query
      .delete()
      .where({})
      .execute();

    }catch( error ){
      this.handleDBExceptions( error );
    }
  }

  
}
