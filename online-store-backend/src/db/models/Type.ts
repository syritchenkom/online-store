import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    BelongsToMany
  } from 'sequelize-typescript';
  import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
  
  @Table({ tableName: 'type', timestamps: false })
  export class Type extends Model<InferAttributes<Type>, InferCreationAttributes<Type>> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false
    })
    id!: CreationOptional<number>;
  
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name!: string;
  
    @HasMany(() => require('./Device').Device)
    devices!: CreationOptional<import('./Device').Device[]>;
  
    @BelongsToMany(() => require('./Brand').Brand, () => require('./TypeBrand').TypeBrand)
    brands!: CreationOptional<import('./Brand').Brand[]>;
  }
  