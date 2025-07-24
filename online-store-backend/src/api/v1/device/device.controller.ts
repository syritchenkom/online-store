import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import deviceService from '../../../services/device.service';
import ApiError from '../../../utils/ApiError';

export const createDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files || !req.files.img) {
            return next(ApiError.badRequest('Image file was not uploaded'));
        }
        const img = req.files.img as UploadedFile;
        const deviceData = {
            ...req.body,
            price: Number(req.body.price),
            brandId: Number(req.body.brandId),
            typeId: Number(req.body.typeId),
        };
        const newDevice = await deviceService.create(deviceData, img);
        return res.json(newDevice);
    } catch (e) {
        next(e);
    }
};

export const getAllDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { brandId, typeId, limit, page } = req.query;
        const options = {
            brandId: brandId ? Number(brandId) : undefined,
            typeId: typeId ? Number(typeId) : undefined,
            limit: limit ? Number(limit) : undefined,
            page: page ? Number(page) : undefined,
        };
        const devices = await deviceService.getAll(options);
        return res.json(devices);
    } catch (e) {
        next(e);
    }
};

export const getOneDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const device = await deviceService.getOne(Number(id));
        return res.json(device);
    } catch (e) {
        next(e);
    }
};

export const updateDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const img = req.files?.img as UploadedFile | undefined;
        const deviceData = {
            ...req.body,
            price: req.body.price ? Number(req.body.price) : undefined,
            brandId: req.body.brandId ? Number(req.body.brandId) : undefined,
            typeId: req.body.typeId ? Number(req.body.typeId) : undefined,
        };
        const updatedDevice = await deviceService.update(Number(id), deviceData, img);
        return res.json(updatedDevice);
    } catch (e) {
        next(e);
    }
};

export const deleteDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await deviceService.delete(Number(id));
        return res.json(result);
    } catch (e) {
        next(e);
    }
};