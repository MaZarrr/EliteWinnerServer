import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CookieExists = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const cookies = request.cookies;
    console.log("cookies_______", cookies);
    
    
    // if (!cookies || Object.keys(cookies).length === 0) {
    //   throw new Error('Authorization failed: Cookies are missing.');
    // }
    if(!cookies) {
      throw new UnauthorizedException();
    }
    return cookies[data];
  },
);