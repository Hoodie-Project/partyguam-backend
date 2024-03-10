import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';
import { KakaoLoginCommand } from './kakao-data.command';
import { PlatformEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';

@Injectable()
@CommandHandler(KakaoLoginCommand)
export class KakaoLoginHandler implements ICommandHandler<KakaoLoginCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ code }: KakaoLoginCommand) {
    const kakao_api_url = await axios.get(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_url=${process.env.KAKAO_REDIRECT_URI}&code=${code}&client_secret=${process.env.KAKAO_CLIENT_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );
    const kakaoData = await kakao_api_url.data;
    console.log('kakao_api_url.data', kakao_api_url.data);

    const kakaoAccessToken = kakaoData.access_token;
    const kakaoRefreshToken = kakaoData.refresh_token;

    const kakaoUserInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const externalId: string = kakaoUserInfo.data.id;
    const email = kakaoUserInfo.data.kakao_account.email;

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (oauth && !oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken, email };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(externalId, PlatformEnum.KAKAO, kakaoAccessToken);

      const encryptOauthId = await this.authService.encrypt(String(createOauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken, email };
    }

    if (oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));

      const accessToken = await this.authService.createAccessToken(encryptOauthId);
      const refreshToken = await this.authService.createRefreshToken(encryptOauthId);

      this.authService.saveRefreshToken(oauth.userId, refreshToken);

      return { type: 'login', accessToken, refreshToken };
    }
  }
}
