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
  
  @Table({ tableName: 'device', timestamps: false })
  export class Device extends Model<InferAttributes<Device>, InferCreationAttributes<Device>> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    })
    id!: CreationOptional<number>;
  
    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;
  
    @Column({ type: DataType.FLOAT, allowNull: false })
    price!: number;
  
    @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
    rating!: CreationOptional<number>;
  
    @Column({ type: DataType.STRING, allowNull: false })
    img!: string;
  
    @ForeignKey(() => require('./Brand').Brand)
    @Column({ type: DataType.INTEGER, allowNull: false })
    brandId!: number;
  
    @ForeignKey(() => require('./Type').Type)
    @Column({ type: DataType.INTEGER, allowNull: false })
    typeId!: number;
  
    @BelongsTo(() => require('./Brand').Brand)
    brand?: import('./Brand').Brand;

    @BelongsTo(() => require('./Type').Type)
    type?: import('./Type').Type;
  
    @HasMany(() => require('./DeviceInfo').DeviceInfo, { as: 'info' })
    info?: CreationOptional<import('./DeviceInfo').DeviceInfo[]>;

    @HasMany(() => require('./OrderDetail').OrderDetail, { foreignKey: 'deviceId' })
    orderDetails?: CreationOptional<import('./OrderDetail').OrderDetail[]>;
  }
  