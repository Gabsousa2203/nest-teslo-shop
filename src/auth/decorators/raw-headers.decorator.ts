import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
    ( data, ctx: ExecutionContext ) => {

        let request = ctx.switchToHttp().getRequest();
        
        return request.rawHeaders;
    }

)