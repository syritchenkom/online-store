import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

@Table({ tableName: 'order_detail', timestamps: false })
export class OrderDetail extends Model<InferAttributes<OrderDetail>, InferCreationAttributes<OrderDetail>> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: CreationOptional<number>;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity!: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    price!: number; // Price at the time of purchase

    @ForeignKey(() => require('./Order').Order)
    @Column({ type: DataType.INTEGER, allowNull: false })
    orderId!: number;

    @ForeignKey(() => require('./Device').Device)
    @Column({ type: DataType.INTEGER, allowNull: false })
    deviceId!: number;

    @BelongsTo(() => require('./Order').Order)
    order?: import('./Order').Order;

    @BelongsTo(() => require('./Device').Device)
    device?: import('./Device').Device;
}