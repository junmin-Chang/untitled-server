import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class BookService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async getBooksByValue(value: string): Promise<any> {
    const result = await lastValueFrom(
      this.httpService.get(
        this.configService.get('NAVER_SEARCH_API') +
          `query=${decodeURI(encodeURI(value))}`,
        {
          headers: {
            'X-Naver-Client-Id': this.configService.get('NAVER_CLIENT_ID'),
            'X-Naver-Client-Secret': this.configService.get(
              'NAVER_CLIENT_SECRET',
            ),
          },
        },
      ),
    );

    return result.data.items;
  }
}
