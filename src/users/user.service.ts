import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
// import {
//   CreateAccountInput,
//   CreateAccountInputEmail,
//   CreateAccountOutput,
// } from './dto/create-account-dto';
// import { LoginInput, LoginInputEmail } from './dto/login.dto';
// import { CreateUserDto, UserProfileOutput } from './dto/user-profile.dto';
import { User, UserRole } from './enities/user.entity';
// import { createWriteStream } from 'fs';
import { Verification } from './enities/verification.entity';
import { Groups } from './enities/groups.entity';
import { TableService } from 'src/tableService/table.service';
import { Contest } from './enities/contest.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { Services } from 'src/services/services.service';
import { Contests } from './enities/contests.entity';


@Injectable()
export class UserService {
  user: User;
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    @InjectRepository(Groups)
    private readonly groups: Repository<Groups>,
    @InjectRepository(Contest)
    private readonly contest: Contest,
    @InjectRepository(Contests)
    private readonly contests: Repository<Contests>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly tableService: TableService,
    private readonly jwtService: JwtService,
    // private readonly smsService: SmsService,
    // private readonly httpService: HttpService,
    private readonly servives: Services,
  ) {}

  public async auth(code, response): Promise<any> {
    try {
      // const saltOrRounds = 10;
      // const password = 'random_password';
      // const token = await bcrypt.hash(password, saltOrRounds) + "_" + user_id;
      console.log('authData', code);
      
      const authData = await this.servives.axios(null, code, 'http://127.0.0.1:8080/auth');
      console.log('authData.data.data', authData.data.data);
      const { access_token, expires_in, user_id, email } = authData.data.data.response;
      const hash = this.jwtService.sign(user_id);
      
      const { data } = await this.getAccount({access_token, user_id, fields: 'nickname,photo_100'});
      const { first_name, last_name, can_access_closed, is_closed, photo_100 } = data[0];

      const findUser = await this.users.findOne({
        where: { userUid: user_id }
      });
      console.log("findUserfindUserfindUser", findUser);
      
      response.cookie('hash', hash, {
        httpOnly: true, 
        secure: false       
      });
      
      const existTable = await this.tableService.tableExists('vk_groups', user_id);

      if(!findUser) {
        // const avatarNameImg = photo_100.split('/s/v1/ig2/')[1].split('-')[0];
        // const imageUrl = await this.downloadImage(photo_100, avatarNameImg + '.jpg');

       this.user = await this.users.save(this.users.create({ 
          access_token, 
          userUid: user_id, 
          userHash: hash,
          role: UserRole.Client,
          contest_count_test: 5,
          first_name, last_name, can_access_closed, is_closed, photo_100
        }));
        
        const params = { access_token, user_id }
        const userGroups =  await this.servives.axios('getGroups', params);
        if(!existTable) {
          await this.tableService.createGroupsTable('vk_groups', user_id);
          const groupTable = await this.tableService.getRepositoryForTable('vk_groups', user_id);

          for (const group of userGroups.data.data.data.items) {
            groupTable.query(
              `INSERT INTO ${'vk_groups'+ "_" + String(user_id)} ( 
                group_id,
                name,
                screen_name,
                description,
                has_photo,
                is_closed,
                photo_200,
                access_token,
                userKey
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9
              )`, 
              [ 
                String(group.id),  
                group.name,
                group.screen_name,
                group.description,
                Boolean(group.has_photo),
                Boolean(group.is_closed),
                group.photo_200,
                null,
                this.user.id 
              ], 
            );
          }
        }
          // for (const group of userGroups.data.data.data.items) {
          //   await this.groups.save(
          //     this.groups.create({ 
          //       group_id: String(group.id), 
          //       name: group.name, 
          //       has_photo: group.has_photo, 
          //       photo_100: group.photo_100,
          //       user_id: user_id,
          //       user: this.user  
          //     }))
          // }

        return {
          ok: true,
          data: { userId: user_id, hash }
        }
      } else {
        
        findUser.access_token = access_token;
        findUser.userHash = hash;
        await this.users.save(findUser);

        return {
          ok: true,
          data: { userId: findUser.userUid, hash: findUser.userHash, last_name: findUser.last_name, first_name: findUser.first_name }
        }
      }
    } catch (error) {
      console.log(error);
        return {
          ok: false,
          error
        }
    }
  }

  public async getMe(cookie: string): Promise<any> {
    const decoded: any = this.jwtService.verify(cookie.toString());
    try {
      const findUser = await this.users.findOne({
        where: {
          userUid: decoded['id']
        }
      });
      if(findUser) {
        return {
          ok: true,
          data: { photo_100: findUser.photo_100, first_name: findUser.first_name, last_name: findUser.last_name }
        }
      }
    } catch (error) {
      return {
        ok: false,
        error
      }
    }
  }

  public async findById(id): Promise<any> {
    try {
      const user = await this.users.findOneOrFail({ where: { userUid: id }});
      if (user) {
        return {
          ok: true,
          user,
        };
      }
    } catch (error) {
      return { ok: false, error: 'Пользователь не найден.' };
    }
  }

  public async addContest(options: any, name): Promise<any> {
      try {
        console.log("options__addContest", options);
        console.log("options__addContest22", typeof options.wall_id);
        
        // ???!!! добавить в user short_name для перехода поста
        const findUser = await this.users.findOne({
          where: {
            userHash: name
          }
        });

          console.log("options__addContestfindUser", findUser);
        
          let user_ids = options.winners.map((item) => item.id.toString()).join(',');
          const resultUsers = await this.servives.axios('getUsers', { user_ids, fields: 'photo_100', access_token: findUser.access_token });
          const existTable = await this.tableService.tableExists('vk_contests', findUser.userUid.toString());
          
          console.log('options_winners2', typeof options.winners);
          console.log('options_winners3', options.winners.length);

          // if(options.winners.length > 0) {
            for(let winner of options.winners) {
              console.log("resultUsers_data", resultUsers.data);
              
              const findWinner = resultUsers.data.data.find((item) => item.id == winner.id);
              console.log("findWinner__", findWinner);
              
              if(findWinner) {
                await this.contests.save(this.contests.create({
                  user_id: winner.id,
                  ownerId: Number(findUser.userUid),
                  contest_id: options.contest_id,
                  group_id: options.group_id,
                  wall_id: options.wall_id,
                  type: winner.type,
                  first_name: findWinner.first_name,
                  last_name: findWinner.last_name,
                  contest_type: options.contest_type,
                  user_photo: findWinner.photo_100,
                  loadingWinner: options.loadingWinner,
                  can_access_closed: winner.can_access_closed,
                  is_closed: winner.is_closed,
                  prizes_count: options.prizes_count,
                  prize_name: winner.prize_name
                }));
               
                console.log("findWinner1", findWinner);
                console.log("findWinner1winner", winner);
                
                if(!existTable) {
                    await this.tableService.createContestTable('vk_contests', findUser.userUid.toString());
                    const contest = await this.tableService.getRepositoryForTable('vk_contests', findUser.userUid.toString());
                    contest.query(
                      `INSERT INTO ${'vk_contests'+ "_" +findUser.userUid} (
                        user_id,
                        group_id,
                        type,
                        first_name,
                        last_name,
                        can_access_closed,
                        is_closed,
                        contest_id,
                        contest_type,
                        loadingWinner,
                        user_photo,
                        wall_id,
                        prizes_count,
                        prize_name,
                        userKey
                      ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
                      )`,
                      [
                        winner.id,
                        options.group_id,
                        winner.type,
                        findWinner.first_name,
                        findWinner.last_name,
                        findWinner.can_access_closed,
                        findWinner.is_closed,
                        options.contest_id,
                        options.contest_type,
                        options.loadingWinner,
                        findWinner.photo_100,
                        options.wall_id,
                        options.prizes_count,
                        winner.prize_name,
                        findUser.id
                      ],
                    );

                  // const entity = contest.create(options);
                  // const data = await contest.save(entity);
                  // await contest.save(contest.create(data))
                } else {
                      const contest = await this.tableService.getRepositoryForTable('vk_contests', findUser.userUid.toString());
                      // await this.connection.synchronize();
                      // const manager =  contest.manager;
                      await contest.query(
                        `INSERT INTO ${'vk_contests'+ "_" +findUser.userUid} (
                          user_id,
                          group_id,
                          type,
                          first_name,
                          last_name,
                          can_access_closed,
                          is_closed,
                          contest_id,
                          contest_type,
                          loadingWinner,
                          user_photo,
                          wall_id,
                          prizes_count,
                          prize_name,
                          userKey
                        ) VALUES (
                          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
                        )`,
                        [
                          winner.id,
                          options.group_id,
                          winner.type,
                          findWinner.first_name,
                          findWinner.last_name,
                          findWinner.can_access_closed,
                          findWinner.is_closed,
                          options.contest_id,
                          options.contest_type,
                          options.loadingWinner,
                          findWinner.photo_100,
                          options.wall_id,
                          options.prizes_count,
                          winner.prize_name,
                          findUser.id
                        ],
                      );
          
                      // await contest.query(
                      //   ` UPDATE ${'vk_contests'+ "_" +findUser.userUid} 
                      //     SET first_name = 'sdsada2'
                      //   WHERE contest_id LIKE '%${options.contest_id}%'
                      // `
                      // );
                      // const data: Contest = await contest.query(`SELECT * FROM vk_contests_${findUser.userUid} WHERE contest_id LIKE '%${options.contest_id}%' LIMIT 1`);
                }
              }
            }
        } catch (error) {
          console.log("addContest_error", error);
          return {
            ok: false,
            error
          }
        }
  }
  
  public async getAccount(options, name?: string): Promise<any> {
      try {
        const findUser = await this.users.findOne({where: {userUid: options.user_id}});
        const token = findUser ? findUser.access_token : options.access_token
        const authData =  await this.servives.axios('me', { ...options, access_token:token });
          return {
            ok: true,
            data: authData.data.data
          }
      } catch (error) {
          return {
            ok: false,
            error
          }
      }  
  }

  public async login(cookieName): Promise<any> {
    try {
        
        if(cookieName) {
            return {
              ok: true,
              isAuth: true
            }
            } else {
              return {
                ok: true,
                isAuth: false
              }
            }
    } catch (error) {
        return {
          ok: false,
          error
        }
    }
  }

  public async getGroups(cookie): Promise<any> {
    try {
      
      const findUser = await this.users.findOne({where: {userHash: cookie}}); 
      const groups = await this.tableService.getRepositoryForTable('vk_contests', findUser.userUid.toString());
      const dbGroups: any[] = await groups.query(`SELECT * FROM vk_groups_${findUser.userUid}`)
      const params = { access_token: findUser.access_token, user_id: findUser.userUid }
      const userGroups = await this.servives.axios('getGroups', params);

      const groupsIsAuth = userGroups.data.data.data.items.map((group) => {
        const findGroupDb = dbGroups.find((groupdDb) => Number(groupdDb.group_id) === Number(group.id))
        
        if(findGroupDb) {
          if(!findGroupDb.access_token) {
            return {
              ...group,
              isAuth: false
            }
          } else {
            return {
              ...group,
              isAuth: true
            }
          }
        }
        return { ...group, isAuth: false, error: "group is auth undefained" }
      })

        return {
          ok: true,
          data: groupsIsAuth
        }
    } catch (error) {
        console.log('error__getGroups', error);
        return {
          ok: false,
          error
        }
    }
  };

  public async getUsersCondition(condionData: any, cookie: string): Promise<any> {
    try {
      const findUser = await this.users.findOne({
        where: {
          userHash: cookie
        }
      }); 
      
      const params = { ...condionData, access_token: findUser.access_token, user_id: findUser.userUid }
      const userGroups =  await this.servives.axios('getUsersCondition', params);

      console.log("getUsersCondition", userGroups.data);
      
      return {
        ok: true,
        data: userGroups.data
      }
    } catch (error) {
      console.log("errors_getUsersCondition", error);
      return {
        ok: false,
        error
      }
    }
  }

  public async getGroup({ access_token, group_id, user_id }) {
      try {

        const params = { access_token, user_id, group_id }
        const group =  await this.servives.axios('getGroup', params);
        
          return {
            ok: true,
            data: group.data
          }
      } catch (error) {
          return {
            ok: false,
            error
          }
      }
  }

  public async getWall(wallData): Promise<any> {
      try {

        const findUser = await this.users.findOne({
          where: {
            userHash: wallData.cookie.value
          },
        });
        
        const group: any = await this.getGroup({ access_token: findUser.access_token, user_id: findUser.userUid,  group_id: wallData.group_id});

          const params = {
              group_id: group.data.data.id,
              domain: group.data.data.screen_name,
              count: 10, 
              access_token: findUser.access_token,
              offset: wallData.offset
          }
            const walls = await this.servives.axios('getWall', params);
            
          return {
            ok: true,
            data: walls.data.data.items
          }

      } catch (error) {
          return {
            ok: false, 
            error
          }
      }
  }

  public async getContests(contestData: User): Promise<any> {
    try {
      const user_id = contestData.userUid.toString();
      const existTable = await this.tableService.tableExists('vk_contests', user_id);
      if(existTable) {
        const contest: any = await this.tableService.getRepositoryForTable('vk_contests', user_id);
        const group = await this.tableService.getRepositoryForTable('vk_groups', user_id);
        const contests: any[] = await contest.query(`SELECT * FROM vk_contests_${user_id}`);
        const groups: Groups[] = await group.query(`SELECT * FROM vk_groups_${user_id}`);
        
        let contests_data = [];
        for(let contest of contests) {
          const findContest = contests_data.find((item) => contest.contest_id === item.contest_id);
          if(findContest) continue;
          const findGroup: any = groups.find((group) => Number(group.group_id) === Number(contest.group_id));

          delete findGroup.access_token;
          delete findGroup.userkey;
          delete contest.userkey;
          
          contests_data.push({
            id: contest.id,
            prizes_count: contest.prizes_count,
            createdAt: contest.createdat,
            wall_id: contest.wall_id,
            contest_id: contest.contest_id,
            contest_type: contest.contest_type,
            group: findGroup
          });
        }
        return {
          ok: true,
          data: contests_data.reverse(),
        }
      }
      return {
        ok: true,
        data: 'У вас нет проведенных розыгрышей',
      }
    } catch (error) {
        return {
          ok: false,
          error
        }
    }
  }

  public async getWinner({ contest_id }): Promise<any> {
    try {
      await this.waitForSpecificRecord({ contest_id });
      const dataWinners: any = await this.contests.find({ where: { contest_id } })
      console.log("dataWinner_dataWinner", dataWinners);
      const ownerId = dataWinners[0].ownerId;
      const group_id = dataWinners[0].group_id;
      const group = await this.tableService.getRepositoryForTable('vk_groups', ownerId.toString());
      let groupData: Groups = await group.query(`SELECT * FROM vk_groups_${ownerId} WHERE group_id = '${group_id}' LIMIT 1`);
      const data = groupData ? groupData : null

      // delete dataWinners.ownerId;
      delete groupData[0]['access_token'];
      
      return {  
        ok: true,
        data: { winners: dataWinners, group: data }
      }
    } catch (error) {
      console.log('error_getWinner', error);
      return {
        ok: false,
        error
      }
    }
  }

  public async addGroupToken(code: string, user: User): Promise<any> {
    try {
      const authData = await this.servives.axios(null, { code }, 'http://127.0.0.1:8080/authGroup');
      const groupDataAuth = authData.data.data.groups[0]
      const groups = await this.tableService.getRepositoryForTable('vk_contests', user.userUid.toString());
      await groups.query(
        ` UPDATE ${'vk_groups'+ "_" +user.userUid.toString()}
          SET access_token = '${groupDataAuth.access_token}'
          WHERE group_id LIKE '%${groupDataAuth.group_id.toString()}%'
        `
      );
      return {  
        ok: true
      }
    } catch (error) {
      console.log("error_addGroupToken", error);
      return {
        ok: false,
        error
      }
    }
  }

  public async createAccount(): Promise<any> {
    try {
      // const authToken = this.httpService.post('')
      // const exist = await this.users.findOne({ where: { accessToken }});
      // if (exist) {
      //   return {
      //     ok: false,
      //     error: 'Пользователь уже существует',
      //   };
      // }

      // const user = await this.users.save(
      //   this.users.create({ phone, password, role }),
      // );  

      // const verification = await this.verifications.save(
      //   this.verifications.create({
      //     user,
      //   }),
      // );

      return { ok: true };

    } catch (error) {
      return { ok: false, error: 'Не удалось создать учётную запись.' };
    }
  }

  public async generateFile(userData: any): Promise<any> {
    try {
      console.log('userData', userData);
      const userGroups =  await this.servives.axios('generate-file', {...userData, owner_id: -161250465});
      return {
        ok: true,
        data: []
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        data: []
      }
    }
  }

  private async waitForSpecificRecord({ contest_id }): Promise<void> {
    return new Promise<void>(resolve => {
        const interval = setInterval(async () => {
        const record = await this.contests.find({ where: { contest_id } });
        console.log("record__waitForSpecificRecord", record);
        let prizes_count = record[0].prizes_count
        console.log("prizes_count22", prizes_count);
        if (record.length >= prizes_count) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  // public async downloadImage(url: string, filename: string): Promise<string> {
  //   console.log("downloadImage____dirname", __dirname);
  //   try {
  //   const response = await this.httpService.get(url, { responseType: 'stream' }).toPromise();
  //   const imagePath = join('public', 'images', filename);
  //   response.data.pipe(createWriteStream(imagePath));
  //   console.log("imagePath_imagePath", imagePath);
    
  //     return imagePath;
  //   } catch (error) {
  //     console.log("eerrr", error);
  //     return error;
  //   }
  //   }

}