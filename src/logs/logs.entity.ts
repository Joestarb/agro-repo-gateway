import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
//comentario
@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  context: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  ip: string;

  @Column({ type: 'text', nullable: true })
  stack: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
