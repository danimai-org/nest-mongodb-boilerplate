import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { UserService } from '../../user/services';
import { UserDocument } from '../../../models/user.model';
import { SessionThrough } from '../../../models/session.model';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const clientID = this.configService.get('google_auth.client_id');
    const clientSecret = this.configService.get('google_auth.client_secret');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;

    try {
      const user = await this.userService.findOne({ email });
      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) {
        throw new error();
      }

      return this.registerUser(token, email);
    }
  }

  async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const name = userData.name;

    const user = await this.createWithGoogle(email, name);

    return this.handleRegisteredUser(user);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async handleRegisteredUser(user: UserDocument) {
    const jwtToken = await this.userService.login(user, SessionThrough.GOOGLE);
    return { auth_token: jwtToken };
  }

  async createWithGoogle(email: string, name: string) {
    let first_name: string;
    let last_name: string;

    if (name.split(' ').length === 1) {
      first_name = name;
    } else if (name.split(' ').length === 2) {
      first_name = name.split(' ')[0];
      last_name = name.split(' ')[1];
    } else {
      first_name = name.split(' ')[0];
      last_name = name.split(' ').slice(1).join(' ');
    }
    return this.userService.create({
      email,
      first_name,
      last_name,
    });
  }
}
