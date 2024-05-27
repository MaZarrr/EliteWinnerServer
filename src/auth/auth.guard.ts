import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/users/user.service';
import { AllowedRoles } from './role.decorator';
// import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService    
    ){}

  public async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',  
      context.getHandler());
      
     if(!roles) {
      return true
    }
    
    // если запрос сервера Next coolie устанавливаются в headers
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    // console.log("hash___", request);
    // console.log("hash___response", response);
    
    const cookie = request.headers['set-cookie'][0].split('=')[1];
    const token = request.cookies || request.headers['set-cookie'][0].split('=')[1]
    const hash = token['hash'] || cookie
    
    if(hash){
      let decoded;
      if(cookie) {
        decoded = this.jwtService.verify(hash.toString());
      } else {
        decoded = this.jwtService.verify(hash.toString());
      }
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
      if (!user) {
        return false; 
      }
      
      // context['user'] = user;
      request['user'] = user;

      if(roles.includes('Any')) {
        return true
      }
      if(!roles.includes(user.role)) {
        // this.sendUnauthorizedResponse(response, 'Вы не авторизованы!')
        this.sendUnauthorizedResponse()
      }
      return roles.includes(user.role)

      } else {
        return false
      }
    } else {
      return false;
    }

  }
  private sendUnauthorizedResponse(): void {
    throw new UnauthorizedException();
    // private sendUnauthorizedResponse(response, message: string): void {
    // response.status(200).json({ message });
  }
}
