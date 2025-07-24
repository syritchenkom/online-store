import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey
  } from 'sequelize-typescript';
  import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
  
  @Table({ tableName: 'type_brand', timestamps: false })
  export class TypeBrand extends Model<InferAttributes<TypeBrand>, InferCreationAttributes<TypeBrand>> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    })
    id!: CreationOptional<number>;
  
    @ForeignKey(() => require('./Type').Type)
    @Column({ type: DataType.INTEGER, allowNull: false })
    typeId!: number;
  
    @ForeignKey(() => require('./Brand').Brand)
    @Column({ type: DataType.INTEGER, allowNull: false })
    brandId!: number;
  }
  