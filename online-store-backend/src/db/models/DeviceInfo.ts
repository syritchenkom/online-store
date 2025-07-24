import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript';
  import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
  
  @Table({ tableName: 'device_info', timestamps: false })
  export class DeviceInfo extends Model<InferAttributes<DeviceInfo>, InferCreationAttributes<DeviceInfo>> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    })
    id!: CreationOptional<number>;
  
    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    description!: string;
  
    @ForeignKey(() => require('./Device').Device)
    @Column({ type: DataType.INTEGER, allowNull: false })
    deviceId!: number;
  
    @BelongsTo(() => require('./Device').Device)
    device?: import('./Device').Device;
  }
  