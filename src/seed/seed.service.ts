import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"

@Injectable()
export class SeedService {
  
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ){}

  async runSeed(){
    await this.deleteTables();
    let admin = await this.insertUsers();
    this.insertNewProducts( admin );
    return 'SEED EXECUTED';
  }

  private async deleteTables(){

    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
    .delete()
    .where({})
    .execute();
  }

  private async insertUsers(){

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push( this.userRepository.create({ 
        ...user,
        password: bcrypt.hashSync( user.password, 10 ) 
      }) );
    });

    const dbUsers = await this.userRepository.save( users );

    return dbUsers[0];

  }

  private async insertNewProducts( user: User ){
    this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.productService.create( product, user ) );
    });

    await Promise.all( insertPromises );

    return true;
  }
}
