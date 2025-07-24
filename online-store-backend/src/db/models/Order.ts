import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
  } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

@Table({ tableName: 'order', timestamps: true }) // Enable timestamps
export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: CreationOptional<number>;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'pending' // e.g., 'pending', 'completed', 'shipped', 'cancelled'
    })
    status!: CreationOptional<string>;

    @Column({
        type: DataType.STRING,
        allowNull: true, // Will be set after PayU order creation
    })
    extOrderId?: string; // External order ID from PayU or other payment provider

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    totalAmount!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    notes?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,

    })
    firstName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    lastName?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    paymentMethod!: string; // e.g., 'credit_card', 'paypal', 'bank_transfer'

    @ForeignKey(() => require('./User').User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId!: number;

    @BelongsTo(() => require('./User').User)
    user?: import('./User').User;

    @HasMany(() => require('./OrderDetail').OrderDetail, { onDelete: 'CASCADE', foreignKey: 'orderId' })
    orderDetails?: CreationOptional<import('./OrderDetail').OrderDetail[]>;
}