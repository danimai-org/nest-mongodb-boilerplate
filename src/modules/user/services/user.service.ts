import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { UpdateUserRequestDto, UserCreateDto } from '../dto/user.request.dto';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { MediaService } from '../../media/services';
import { JwtPayload } from '../../auth/strategies/jwt.interface';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import User, { UserDocument } from '../../../models/user.model';
import { SessionThrough } from '../../../models/session.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private sessionService: SessionService,
    private jwtService: JwtService,
    private mediaService: MediaService,
  ) {}

  async create(userCreateDto: UserCreateDto) {
    const user = new this.userModel(userCreateDto);
    return user.save();
  }

  async update(
    jwtPayload: JwtPayload,
    avatar: Express.Multer.File,
    updateDto: UpdateUserRequestDto,
  ) {
    const updateData: Record<string, string> = {
      ...instanceToPlain(updateDto),
    };

    if (avatar) {
      updateData.avatar_id = (await this.mediaService.update(avatar)).id;
    }

    await this.userModel.updateOne(jwtPayload.id, updateData);
  }

  async createJwtToken(
    user: UserDocument,
    through: SessionThrough = SessionThrough.EMAIL,
  ) {
    const session = await this.sessionService.create(user, through);
    return this.jwtService.sign({
      id: user._id,
      is_active: user.is_active,
      email_verified_at: user.email_verified_at,
      session_token: session.token,
      role: user.role,
      timestamp: Date.now(),
    });
  }

  async login(
    user: UserDocument,
    through: SessionThrough = SessionThrough.EMAIL,
  ) {
    return this.createJwtToken(user, through);
  }

  async findOne(findOptions: FilterQuery<UserDocument>) {
    return this.userModel.findOne(findOptions);
  }

  async me(payload: JwtPayload) {
    return this.userModel.findOne({
      id: payload.id,
    });
  }
}
