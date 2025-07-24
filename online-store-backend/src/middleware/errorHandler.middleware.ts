import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }

    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'Internal server error' });
    } else {
        return res.status(500).json({ message: err.message || 'Unknown server error' });
    }
}