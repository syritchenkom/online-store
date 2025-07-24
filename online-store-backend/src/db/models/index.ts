import { User } from './User';
import { Basket } from './Basket';
import { BasketDevice } from './BasketDevice';
import { Rating } from './Rating';
import { Device } from './Device';
import { DeviceInfo } from './DeviceInfo';
import { Type } from './Type';
import { TypeBrand } from './TypeBrand';
import { Brand } from './Brand';
import { Order } from './Order';
import { OrderDetail } from './OrderDetail';

// Export all models from the current directory to be used in the Sequelize instance
export const models = [
    User,
    Basket,
    BasketDevice,
    Rating,
    Device,
    DeviceInfo,
    Brand,
    Type,
    TypeBrand,
    Order,
    OrderDetail
  ];

// Export individual models for easier imports in other files
  export {
    User,
    Basket,
    BasketDevice,
    Rating,
    Device,
    DeviceInfo,
    Brand,
    Type,
    TypeBrand,
    Order,
    OrderDetail
  };