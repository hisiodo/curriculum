import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'authors' })
export class Author extends Model<Author> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  id: number;

  @Column({ allowNull: false })
  public name: string;

  @Column({ allowNull: false })
  public lastName: string;

  @Column({ type: DataType.DATE, allowNull: false })
  public birthDate: Date;
}
