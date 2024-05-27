import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Services {
  constructor(
    private readonly httpService: HttpService
  ){}

    // обязателен access_token в параметрах
    public async axios(prefix: string, params?: any, url?: string): Promise<any> {
    try {
        let data: any;
        if(url) {
          data = await this.httpService.axiosRef(url, {
            method: "POST",
            data: JSON.stringify(params),
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } else {
          data = await this.httpService.axiosRef('http://127.0.0.1:8080/' + prefix, {
            method: "POST",
            data: JSON.stringify({ ...params }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        return data;        
    } catch (error) {
        return error;
    }
    }
}
