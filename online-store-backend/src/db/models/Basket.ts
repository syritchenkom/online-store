import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany
  } from 'sequelize-typescript';
  import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
  
  @Table({ tableName: 'basket', timestamps: false })
  export class Basket extends Model<InferAttributes<Basket>, InferCreationAttributes<Basket>> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    })
    id!: CreationOptional<number>;
  
    @ForeignKey(() => require('./User').User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId!: number;
  
    @BelongsTo(() => require('./User').User)
    user?: import('./User').User;
  
    @HasMany(() => require('./BasketDevice').BasketDevice, {onDelete: 'CASCADE', foreignKey: 'basketId'})
    basketDevices?: CreationOptional<import('./BasketDevice').BasketDevice[]>;
  }
  