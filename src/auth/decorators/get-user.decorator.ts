import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator(
    ( data, ctx: ExecutionContext ) => {

        let request = ctx.switchToHttp().getRequest();

        let user = request.user;

        if ( data === 'email' ){
            return user.email;
        }

        if ( !user )
            throw new InternalServerErrorException('User not found');

        return user;
    }

)