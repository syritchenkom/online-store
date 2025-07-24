import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from '../utils/ApiError';

export default function authMiddleware (req: Request, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization?.split(' ')[1] // Bearer <token>
        if (!token) {
            return next(ApiError.unauthorized('No token'));
        }

        if(!process.env.SECRET_KEY) {
          console.error('CRITICAL: SECRET_KEY environment variable is not defined!');
          return next(ApiError.internal('Server configuration error'));
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;
        req.user = decoded

        next()
    } catch (e: any) {
        if (e instanceof jwt.JsonWebTokenError) {
            return next(ApiError.unauthorized('Invalid Token'));
        }
        if (e instanceof jwt.TokenExpiredError) {
          return next(ApiError.unauthorized('Token expired'));
      }
      return next(ApiError.unauthorized('Authentication error'));
  

    }
};

