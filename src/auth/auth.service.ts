import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt"
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly jwtService: JwtService
) {}

  async create(createUserDto: CreateUserDto) {
    try{

      let {password, ...userData } = createUserDto;

      let user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      delete user.password;

      return {
        user,
        token: this.getJwtToken({ id: user.id })
      };

    }catch(e){
      this.handleDBError(e);
    }
  }

  async login( loginUserDto: LoginUserDto ){
    try{

      let {password, email} = loginUserDto;

      let user = await this.userRepository.findOneBy({email});

      if(!user)
        throw new UnauthorizedException('Invalid credentials, the user does not exist');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Invalid password');

      return {
        email: user.email,
        token: this.getJwtToken({ id: user.id })
      };

    }catch(e){
      this.handleDBError(e);
    }
  }

  async checkAuthStatus( user: User ){
    try{

      return {
        user,
        token: this.getJwtToken({ id: user.id })
      };

    }catch(e){
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getJwtToken( payload: JwtPayload ){
    return this.jwtService.sign(payload);
  }

  private handleDBError(e: any){
    if (e.code === '23505') 
      throw new BadRequestException( e.detail );

    console.log(e);

    throw new InternalServerErrorException('Please check server logs');
    
  }

}
