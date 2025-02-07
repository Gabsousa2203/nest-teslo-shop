import { Module } from '@nestjs/common';

import { ProductsModule } from 'src/products/products.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule,TypeOrmModule]
})
export class SeedModule {}
