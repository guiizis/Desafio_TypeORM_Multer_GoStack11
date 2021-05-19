import { Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from "typeorm"
import category from './Category'
@Entity("transactions")
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column('decimal')
  value: number;

  @ManyToOne(() => category) //pontuando que sera uma relacao manytoone com a tabela de category
  @JoinColumn({ name: "category_id" }) //juntando as colunas de category_id de "transactions" e "category"
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
