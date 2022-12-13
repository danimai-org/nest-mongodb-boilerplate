import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EntityHelper } from '../../../utils/typeorm/entity.util';
import { User } from './user.entity';

export enum SessionThrough {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

@Entity({ name: 'sessions' })
export class UserSession extends EntityHelper {
  @Column({ type: 'varchar', length: 100 })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  logged_out_at: Date;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'enum', enum: SessionThrough, default: SessionThrough.EMAIL })
  through: SessionThrough;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeInsert()
  async generateToken() {
    this.token = `${randomStringGenerator()}-${randomStringGenerator()}`;
  }
}
