import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = context['user'];
    const request = context.switchToHttp().getRequest();
    return request['user'];
  }
);

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// export const AuthUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const gglContext = ctx.create(context).getContext();
//     const user = gglContext['user'];
//     return user;
//   },
// );
