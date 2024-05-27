import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { IUser } from './interfaces/user.interface';
import { Response, Request} from 'express'
import { CookieExists } from 'src/auth/cookie.decorator';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './enities/user.entity';

@Controller()
export class UserController {

  public isAuth: boolean
  public phoneCheck: number

  constructor(
    private userService: UserService,
    ) {}

  @Post('auth')
  public async authUser(@Body() authData, @Res({ passthrough: true }) response: Response, @Req() request: Request): Promise<any> {
//  console.log('authData', authData);
 
    // public async authUser(@Body() authData: { code: string }, @Res({ passthrough: true }) response: Response, @Req() request: Request): Promise<any> {
    return this.userService.auth(authData, response);
  }

  @Post('getGroups')
  @Role(['Client'])
  public async getGroups(@AuthUser() user: any,  @Body() userData: string, @CookieExists('hash') name: Request): Promise<any> {
    console.log("dsadsadsadsdasdsaad", name);
    
    return await this.userService.getGroups(name)
  }

  @Post('generate-file')
  @Role(['Client'])
  public async generateFile(@AuthUser() user: any): Promise<{ok: boolean, data: any}> {
    return await this.userService.generateFile(user);
  }

  @Post('getWinner')
  public async getWinner(@Body() contest): Promise<any> {
    return await this.userService.getWinner(contest)
  }

  @Post('addGroupto')
  @Role(['Client'])
  public async addGroupto(@AuthUser() user: User, @Body() authData): Promise<any> {
    return await this.userService.addGroupToken(authData.code, user)
  }

  

// 
  // @Get()
  // async findAll(@Res({ passthrough: true }) response: Response): Promise<any> {
  //   const saltOrRounds = 10;
  //   const password = 'random_password';
  //   const hash = await bcrypt.hash(password, saltOrRounds);
  //   response.cookie('hash', hash, { domain: '127.0.0.1:3000', path: '/' }).send({ status: 'ok' });;
  //   return "cookie";
  //   // return this.userService.findAll();
  // }

  @Post('getWall')
  public async getWall(@Body() wallData: string, @CookieExists('hash') name: Request): Promise<any> {
      return await this.userService.getWall(wallData)
  }

  //  Функция поиска всех пользователей подходящих под настройки розыгрыша
  @Post('getUsersCondition')
  public async getUsersCondition(@Body() conditionData: any, @CookieExists('hash') name: string): Promise<any> {
      return await this.userService.getUsersCondition(conditionData, name)
  }

  @Post('getUserAccount')
  public async getUserAccount(@Body() userData: any, @CookieExists('hash') name): Promise<any> {
    return this.userService.getAccount(userData, name);
  }

  @Post('addContest')
  public async addContest(@Body() userData: any, @CookieExists('hash') name): Promise<any> {
    return this.userService.addContest(userData, name);
  }

  @Post('me')
  @Role(['Client', 'Owner'])
  getMe(@AuthUser() userData: User) {
    if(userData) {
      return { first_name: userData.first_name, photo_100: userData.photo_100 }
    } else {
        throw new UnauthorizedException();
    }
  }

  @Post('getContests')
  @Role(['Client'])
  getContests(@AuthUser() userData: any) {
    return this.userService.getContests(userData)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: any) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
