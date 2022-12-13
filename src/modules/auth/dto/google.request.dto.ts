import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleOAuthRequestDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
