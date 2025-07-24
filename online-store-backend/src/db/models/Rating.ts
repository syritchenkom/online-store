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
  
  @Table({ tableName: 'rating', timestamps: false })
  export class Rating extends Model<
    InferAttributes<Rating>,
    InferCreationAttributes<Rating>
  > {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    })
    id!: CreationOptional<number>;
  
    @Column({ type: DataType.INTEGER, allowNull: false })
    rate!: number;
  
    @ForeignKey(() => require('./User').User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId!: number;
  
    @ForeignKey(() => require('./Device').Device)
    @Column({ type: DataType.INTEGER, allowNull: false })
    deviceId!: number;
  
    @BelongsTo(() => require('./User').User)
    user?: import('./User').User;
  
    @BelongsTo(() => require('./Device').Device)
    device?: import('./Device').Device;
  }
  