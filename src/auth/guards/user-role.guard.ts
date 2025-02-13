import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector //*Ayuda a ver la info de los decoradores o la metadata 
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    let validRoles = this.reflector.get(META_ROLES, context.getHandler());

    if ( !validRoles || validRoles.length === 0 )
      return true;

    let request = context.switchToHttp().getRequest();

    let user = request.user;

    if ( !user )
        throw new BadRequestException('User not found');

    for (let role of user.roles){
      if ( validRoles.includes( role ) )
        return true;
    }

    throw new ForbiddenException('Unauthorized user, invalid role');

  }
}
