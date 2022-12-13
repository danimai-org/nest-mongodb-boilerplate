import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EntityHelper } from '../../../utils/typeorm/entity.util';
import { UserSession } from './session.entity';
import { Token } from './user_token.entity';
import * as bcrypt from 'bcryptjs';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Media } from '../../media/entities';
import { RoleType } from '../../../contants/role-type';

@Entity({ name: 'users' })
export class User extends EntityHelper {
  @ApiProperty({ example: 'Danimai' })
  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @ApiProperty({ example: 'Mandal' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  last_name: string;

  @ApiProperty({ example: 'example@danimai.com' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @ApiHideProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  email_verified_at: Date;

  @ApiHideProperty()
  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @ApiHideProperty()
  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @ApiHideProperty()
  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @ApiHideProperty()
  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @ApiHideProperty()
  @ManyToOne(() => Media, (media) => media.avatars)
  @JoinColumn({ name: 'avatar_id' })
  avatar: Media;

  @ApiHideProperty()
  @Column({ type: 'uuid', nullable: true })
  avatar_id: string;

  @ApiHideProperty()
  public previousPassword: string;

  @AfterLoad()
  removePassword() {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
    this.email = this.email.toLowerCase();
  }

  comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
