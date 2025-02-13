import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterHelper,fileNamer} from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, //*Aqui se le dice a nest que Yo voy a manejar la respuesta
    @Param('imageName') imageName: string
  ){
    
    let path = this.filesService.getStaticProductImage(imageName);

    res.sendFile( path );
  }

  @Post("product")
  @UseInterceptors( FileInterceptor('file',
    { fileFilter: fileFilterHelper,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer
      })
     }
  ) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File ) {
    
      if ( !file ) 
        throw new BadRequestException('Make sure that file is an image');
    
      const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${file.filename}`;

      return {secureUrl};
  }

}
