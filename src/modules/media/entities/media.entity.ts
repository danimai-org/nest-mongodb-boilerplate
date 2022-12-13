import { Column, Entity, OneToMany } from 'typeorm';
import { EntityHelper } from '../../../utils/typeorm/entity.util';
import { User } from '../../user/entities';

export enum StorageType {
  LOCAL = 'LOCAL',
  S3 = 'S3',
}

@Entity({ name: 'media' })
export class Media extends EntityHelper {
  @Column({ type: 'varchar', length: 150 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 150 })
  mimetype: string;

  @Column({ type: 'enum', enum: StorageType, default: StorageType.LOCAL })
  storage_type: StorageType;

  @Column({ type: 'int' })
  size: number;

  @OneToMany(() => User, (user) => user.avatar)
  avatars: User;
}
