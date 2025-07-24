import { Request, Response, NextFunction } from 'express';
import brandService from '../../../services/brand.service';

// EN: Type for the request body when creating a brand.
// PL: Typ dla ciała żądania podczas tworzenia marki.
interface CreateBrandRequestBody {
    name: string;
}

// EN: Method to create a new brand.
// PL: Metoda do tworzenia nowej marki.
export const createBrand = async (req: Request<{}, {}, CreateBrandRequestBody>, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const brand = await brandService.create(name);
        return res.json(brand);
    } catch (error) {
        next(error);
    }
}

// EN: Method to get all brands.
// PL: Metoda do pobierania wszystkich marek.
export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brands = await brandService.getAll();
        return res.json(brands);
    } catch (error) {
        next(error);
    }
}

// EN: Method to delete a brand by its ID.
// PL: Metoda do usuwania marki po jej ID.
export const deleteBrand = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await brandService.delete(Number(id));
        return res.json(result);
    } catch (error) {
        next(error);
    }
}

// EN: Method to update a brand by its ID.
// PL: Metoda do aktualizacji marki po jej ID.
export const updateBrand = async (req: Request<{ id: string }, {}, { name: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedBrand = await brandService.update(Number(id), name);
        return res.json(updatedBrand);
    } catch (error) {
        next(error);
    }
}
