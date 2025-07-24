import {
    Table,
    Column,
    Model,
    DataType,
    BelongsToMany,
    HasMany
  } from 'sequelize-typescript';
  import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
  
  @Table({ tableName: 'brand', timestamps: false })
  export class Brand extends Model<InferAttributes<Brand>, InferCreationAttributes<Brand>> {
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
  
    @BelongsToMany(() => require('./Type').Type, () => require('./TypeBrand').TypeBrand)
    types!: CreationOptional<import('./Type').Type[]>;
  }
  