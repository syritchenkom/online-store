import {
    Table,
    Column,
    Model,
    DataType,
    HasOne,
    HasMany,
    ForeignKey
  } from 'sequelize-typescript';
  import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { on } from 'events';
  
  @Table({ tableName: 'user', timestamps: false })
  export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    })
    id!: CreationOptional<number>;
  
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email!: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;
  
    @Column({ type: DataType.STRING, defaultValue: 'USER' })
    role!: CreationOptional<string>;
  
    @HasOne(() => require('./Basket').Basket, {onDelete: 'CASCADE', foreignKey: 'userId'})
    basket!: CreationOptional<import('./Basket').Basket>;
  
    @HasMany(() => require('./Rating').Rating, {onDelete: 'CASCADE', foreignKey: 'userId'})
    ratings!: CreationOptional<import('./Rating').Rating[]>;

    @HasMany(() => require('./Order').Order, { onDelete: 'CASCADE', foreignKey: 'userId' })
    orders!: CreationOptional<import('./Order').Order[]>;
  }
  