import { HttpService } from "@nestjs/axios";

export class UtilsService {
  constructor(
    private readonly httpService: HttpService
  ){}

    // обязателен access_token в параметрах
    public async axios(prefix: string, url?: string, params?: any): Promise<any> {
      let data: any;
      if(url) {
        data = await this.httpService.axiosRef('http://127.0.0.1:8080/me', {
          method: "POST",
          data: JSON.stringify({ ...params }),
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
    }

}

export function getRandomArbitrary(min: number, max: number): number {
  return Math.ceil(Math.random() * (max - min) + min);
}
// "testRegex": ".*\\.spec\\.ts$",
// "testRegex": ".spec.ts$",
// "coveragePathIgnorePatterns": [
//   "node_modules",
//   ".entity.ts",
//   ".constants.ts"
// ]

