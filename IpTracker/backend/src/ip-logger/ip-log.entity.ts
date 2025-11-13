import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'ip_logs' })
export class IpLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // store hashed_ip to reduce privacy risk; keep raw_ip only if you need it
  @Column({ length: 128, nullable: true })
  hashedIp?: string;

  @Column({ length: 45, nullable: true })
  rawIp?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  path?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
