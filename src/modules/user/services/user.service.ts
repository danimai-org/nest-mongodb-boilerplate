import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserRequestDto, UserCreateDto } from '../dto/user.request.dto';
import { SessionThrough, User } from '../entities';
import { JwtService } from '@nestjs/jwt';
import { UserSessionService } from './session.service';
import { MediaService } from '../../media/services';
import { JwtPayload } from '../../auth/strategies/jwt.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private sessionService: UserSessionService,
    private jwtService: JwtService,
    private mediaService: MediaService,
  ) {}

  async create(userCreateDto: UserCreateDto) {
    const user = User.create(instanceToPlain(userCreateDto));
    return this.userRepository.save(user);
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

    await this.userRepository.update(jwtPayload.id, updateData);
  }

  async createJwtToken(
    user: User,
    through: SessionThrough = SessionThrough.EMAIL,
  ) {
    const session = await this.sessionService.create(user, through);
    return this.jwtService.sign({
      id: user.id,
      is_active: user.is_active,
      email_verified_at: user.email_verified_at,
      session_token: session.token,
      role: user.role,
      timestamp: Date.now(),
    });
  }

  async login(user: User, through: SessionThrough = SessionThrough.EMAIL) {
    return this.createJwtToken(user, through);
  }

  async findOne(findOptions: FindOneOptions<User>) {
    return this.userRepository.findOne(findOptions);
  }

  async me(payload: JwtPayload) {
    return this.userRepository.findOneBy({
      id: payload.id,
    });
  }
}
