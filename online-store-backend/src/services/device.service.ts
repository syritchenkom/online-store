import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
import sequelize from '../db';
import { Device } from '../db/models/Device';
import { DeviceInfo } from '../db/models/DeviceInfo';
import { Brand } from '../db/models/Brand';
import { Type } from '../db/models/Type';
import ApiError from '../utils/ApiError';
import { InferCreationAttributes } from 'sequelize';



// EN: Interfaces for service method parameters to keep them clean and typed.
// PL: Interfejsy dla parametrów metod serwisu, aby utrzymać je czystymi i typowanymi.
interface DeviceCreationAttributes {
    name: string;
    price: number;
    brandId: number;
    typeId: number;
    info?: string; // JSON string
}

interface DeviceUpdateAttributes {
    name?: string;
    price?: number;
    brandId?: number;
    typeId?: number;
    info?: string; // JSON string
}

interface GetAllDevicesOptions {
    brandId?: number;
    typeId?: number;
    limit?: number;
    page?: number;
}

interface DeviceInfoAttribute {
    title: string;
    description: string;
}

type DeviceInfoInput = {
    title: string;
    description: string;
    deviceId: number;
  };

class DeviceService {
    public async create(data: DeviceCreationAttributes, img: UploadedFile): Promise<Device> {
        const { name, price, brandId, typeId, info } = data;

        // EN: Handle image upload and optimization. Always save as .webp for efficiency.
        // PL: Obsługa przesyłania i optymalizacji obrazów. Zawsze zapisuj jako .webp dla wydajności.
        const fileName = uuidv4() + '.webp';
        const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
        
        const transaction = await sequelize.transaction();
        try {
             // EN: Instead of just moving the file, we process it with sharp.
            // PL: Zamiast tylko przenosić plik, przetwarzamy go za pomocą sharp.
            await sharp(img.data)
                .resize(500, 500, { fit: 'inside', withoutEnlargement: true }) // Resize to max 500x500, don't enlarge small images
                .toFormat('webp', { quality: 80 }) // Convert to WebP format with 80% quality
                .toFile(filePath);

            const device = await Device.create({
                name,
                price,
                brandId,
                typeId,
                img: fileName,
                rating: 0
            }, { transaction });

            if (info) {
                const parsedInfo: DeviceInfoAttribute[] = JSON.parse(info);
                if (Array.isArray(parsedInfo)) {
                    const deviceInfoData = parsedInfo.map(item => ({
                        title: item.title,
                        description: item.description,
                        deviceId: device.id,
                    }));
                    if (deviceInfoData.length > 0) {
                        await DeviceInfo.bulkCreate(deviceInfoData, { transaction });
                    }
                }
            }

            await transaction.commit();
            // Refetch the device with its info to return the full object
            // EN: No need to refetch. Reload the instance with its associations to get the full object.
            // PL: Nie ma potrzeby ponownego pobierania. Załaduj ponownie instancję z jej powiązaniami, aby uzyskać pełny obiekt.
            await device.reload({ include: [{ model: DeviceInfo, as: 'info' }]});
            return device;
        } catch (e: any) {
            await transaction.rollback();
            // Clean up uploaded file on error
            await fs.unlink(filePath).catch(err => console.error(`Failed to cleanup file on error: ${filePath}`, err));
            
            if (e instanceof SyntaxError) { // JSON.parse error
                 throw ApiError.badRequest('Invalid format for device info');
            }
            throw ApiError.internal(`An error occurred while creating the device: ${e.message}`);
        }
    }

    public async getAll(options: GetAllDevicesOptions): Promise<{ count: number, rows: Device[] }> {
        const { brandId, typeId, limit = 9, page = 1 } = options;

        const offset = (page - 1) * limit;

        const whereClause: { brandId?: number; typeId?: number } = {};
        if (brandId) whereClause.brandId = brandId;
        if (typeId) whereClause.typeId = typeId;

        const devices = await Device.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            distinct: true,
            include: [
                { 
                    model: DeviceInfo, as: 'info', 
                    attributes: ['id', 'title', 'description']
                },
                { model: Brand, attributes: ['id', 'name'] },
                { model: Type, attributes: ['id', 'name'] }
            ],
            attributes: ['id', 'name', 'price', 'rating', 'img', 'brandId', 'typeId'],
            order: [['id', 'ASC']]
        });
        
        return devices;
    }

    public async getOne(id: number): Promise<Device> {
        const device = await Device.findOne({
            where: { id },
            include: [
                { model: DeviceInfo, as: 'info' },
                { model: Brand, attributes: ['id', 'name'] },
                { model: Type, attributes: ['id', 'name'] }
            ]
        });

        if (!device) {
            throw ApiError.notFound(`Device with id ${id} not found`);
        }

        return device;
    }

    public async update(id: number, data: DeviceUpdateAttributes, img?: UploadedFile): Promise<Device> {
        const transaction = await sequelize.transaction();
        try {
            const device = await Device.findByPk(id, { transaction });
            if (!device) {
                throw ApiError.notFound(`Device with id ${id} not found`);
            }

            const { name, price, brandId, typeId, info } = data;
            let newFileName = device.img;

            if (img) {
                // EN: Optimize the new image and prepare to save it as .webp.
                // PL: Zoptymalizuj nowy obraz i przygotuj go do zapisania jako .webp.
                newFileName = uuidv4() + '.webp';
                const newFilePath = path.resolve(__dirname, '..', '..', 'static', newFileName);
                await sharp(img.data)
                .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
                .toFormat('webp', { quality: 80 })
                .toFile(newFilePath);
            
                // EN: Delete the old image file after the new one is successfully saved.
                // PL: Usuń stary plik obrazu po pomyślnym zapisaniu nowego.
                const oldFilePath = path.resolve(__dirname, '..', '..', 'static', device.img);
                await fs.unlink(oldFilePath).catch(err => console.error(`Failed to delete old image file: ${oldFilePath}`, err));
            }

            await device.update({ name, price, brandId, typeId, img: newFileName }, { transaction });

            if (info) {
                await DeviceInfo.destroy({ where: { deviceId: id }, transaction });
                const parsedInfo: DeviceInfoAttribute[] = JSON.parse(info);
                if (Array.isArray(parsedInfo) && parsedInfo.length > 0) {
                    const deviceInfoData = parsedInfo.map(item => ({
                        title: item.title,
                        description: item.description,
                        deviceId: id,
                    }));
                    await DeviceInfo.bulkCreate(deviceInfoData, { transaction });
                }
            }

            await transaction.commit();
            // EN: Reload the updated instance instead of making a separate getOne call.
            // PL: Załaduj ponownie zaktualizowaną instancję zamiast wykonywać osobne wywołanie getOne.
            return device.reload({ include: [{ model: DeviceInfo, as: 'info' }]});

        } catch (e: any) {
            await transaction.rollback();
            if (e instanceof SyntaxError) { throw ApiError.badRequest('Invalid format for device info'); }
            throw ApiError.internal(`Error updating device: ${e.message}`);
        }
    }

    public async delete(id: number): Promise<{ message: string }> {
        const device = await Device.findByPk(id);
        if (!device) {
            throw ApiError.notFound(`Device with id ${id} not found`);
        }

        const imageFileName = device.img;
        await device.destroy();
        
        const imagePath = path.resolve(__dirname, '..', '..', 'static', imageFileName);
        await fs.unlink(imagePath).catch(err => console.error(`Failed to delete image file: ${imagePath}`, err));

        return { message: 'Device deleted successfully' };
    }
}

export default new DeviceService();