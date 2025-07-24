import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  
  @Table({ tableName: 'basket_device', timestamps: false })
  export class BasketDevice extends Model<
    InferAttributes<BasketDevice>,
    InferCreationAttributes<BasketDevice, { omit: 'basket' | 'device' }>
  > {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    })
    id!: CreationOptional<number>;
  
    @ForeignKey(() => require('./Basket').Basket)
    @Column({ type: DataType.INTEGER, allowNull: false })
    basketId!: number;
  
    @ForeignKey(() => require('./Device').Device)
    @Column({ type: DataType.INTEGER, allowNull: false })
    deviceId!: number;
  
    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    quantity!: CreationOptional<number>;
  
    @BelongsTo(() => require('./Basket').Basket)
    basket?: import('./Basket').Basket;
  
    @BelongsTo(() => require('./Device').Device)
    device?: import('./Device').Device;
  }
  