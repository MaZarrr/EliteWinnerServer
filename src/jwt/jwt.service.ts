import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions,
  ) {}

  public sign(userId: number): string {
    console.log("ksdwdw", jwt.sign({ id: userId }, this.options.privateKey));
     
    return jwt.sign({ id: userId }, this.options.privateKey);
  }

  public verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
