const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require('../models/models'); // Assuming you have a Device model defined in models/models.js
const ApiError = require('../error/ApiError'); // Assuming you have an ApiError class for error handling

class DeviceController {
    async create(req, res, next) {
        try {
            // EN: Destructure required fields from the request body.
            // PL: Dekonstrukcja wymaganych pól z ciała żądania.
            let { name, price, brandId, typeId, info } = req.body
            // EN: Basic validation for required fields.
            // PL: Podstawowa walidacja wymaganych pól.
            if (!name || price === undefined || !brandId || !typeId) {
                return next(ApiError.badRequest('Brakuje wymaganych pól: nazwa, cena, brandId lub typeId'));
            }

            // EN: Check if file upload exists and contains the 'img' file.
            // PL: Sprawdź, czy przesłano plik i czy zawiera plik 'img'.
            if(!req.files || !req.files.img) {
                return next(ApiError.badRequest('Plik obrazu nie został dostarczony'));
            }
            
            // EN: Get the image file from req.files.
            // PL: Pobierz plik obrazu z req.files.
            const { img } = req.files;
            // EN: Generate a unique file name and define the file path.
            // PL: Wygeneruj unikalną nazwę pliku i zdefiniuj ścieżkę pliku.
            let fileName = uuid.v4() + ".jpg"
            const filePath = path.resolve(__dirname, '..', 'static', fileName);

            // EN: Move the file to the static directory. Use await as it's an asynchronous operation.
            // PL: Przenieś plik do katalogu statycznego. Użyj await, ponieważ jest to operacja asynchroniczna.
            await img.mv(filePath);
            // EN: Create the device record in the database.
            // PL: Utwórz rekord urządzenia w bazie danych.
            const device = await Device.create({ name, price, brandId, typeId, img: fileName })    
            
            // EN: Process additional information if provided.
            // PL: Przetwórz dodatkowe informacje, jeśli zostały dostarczone.
            if(info){
                try {
                    // EN: Parse the JSON string 'info'.
                    // PL: Parsuj ciąg znaków JSON 'info'.
                    const parsedInfo = JSON.parse(info);

                    // EN: Check if parsedInfo is an array and create DeviceInfo records for each item.
                    // PL: Sprawdź, czy parsedInfo jest tablicą i utwórz rekordy DeviceInfo dla każdego elementu.
                    if (Array.isArray(parsedInfo)) {
                        // EN: Use Promise.all to wait for all DeviceInfo creations to complete.
                        // PL: Użyj Promise.all, aby poczekać na zakończenie wszystkich operacji tworzenia DeviceInfo.
                        await Promise.all(parsedInfo.map(item =>
                            DeviceInfo.create({
                                title: item.title,
                                description: item.description,
                                deviceId: device.id
                            })
                        ));
                    } else {
                         // EN: Log a warning if info is not a valid JSON array, but don't necessarily fail the request.
                         // PL: Zaloguj ostrzeżenie, jeśli info nie jest prawidłową tablicą JSON, ale niekoniecznie przerywaj żądanie.
                         console.warn('Ostrzeżenie: Pole info nie jest prawidłową tablicą JSON:', info);
                    }
                } catch (parseError) {
                    // EN: Handle JSON parsing errors for the 'info' field.
                    // PL: Obsłuż błędy parsowania JSON dla pola 'info'.
                    console.error('Błąd parsowania JSON dla pola info:', parseError);
                    // EN: Optionally return a bad request error to the client.
                    // PL: Opcjonalnie zwróć błąd bad request do klienta.
                    // return next(ApiError.badRequest('Nieprawidłowy format JSON dla pola info'));
                }
            }
      
            // EN: Return the created device object.
            // PL: Zwróć utworzony obiekt urządzenia.
            return res.json(device)
            
        } catch (error) {    
            // EN: Log the error for server-side debugging.
            // PL: Zaloguj błąd w celu debugowania po stronie serwera.
            console.error('Błąd w deviceController.create:', error);
            // EN: Pass the error to the error handling middleware. Use ApiError.internal for unexpected errors.
            // PL: Przekaż błąd do middleware obsługi błędów. Użyj ApiError.internal dla nieoczekiwanych błędów.
            next(ApiError.internal('Wystąpił błąd podczas tworzenia urządzenia'));
        }
    }
    async getAll(req, res, next) {
        try {
            let { brandId, typeId, limit, page } = req.query
            
            page = parseInt(page) || 1
            limit = parseInt(limit) || 9

            if(page <= 0) page = 1
            if(limit <= 0) limit = 9

            // EN: Calculate offset for pagination.
            // PL: Oblicz przesunięcie dla paginacji.
            let offset = (page - 1) * limit
            
            // EN: Build the where clause based on provided brandId and typeId.
            // PL: Zbuduj klauzulę where na podstawie dostarczonych brandId i typeId.
            const whereClause = {}
            if (brandId) whereClause.brandId = brandId
            if (typeId) whereClause.typeId = typeId

            // EN: Find devices with pagination and filtering.
            // PL: Znajdź urządzenia z paginacją i filtrowaniem.
            const devices = await Device.findAndCountAll({ where: whereClause, limit, offset })
            return res.json(devices) // EN: Return devices and count. PL: Zwróć urządzenia i ich liczbę.            
        } catch (error) {
            next(ApiError.internal(error.message))
            
        }
    }

    async getOne(req, res, next) { 
        try {
            // EN: Get device ID from request parameters.
            // PL: Pobierz ID urządzenia z parametrów żądania.
            const { id } = req.params
            // EN: Find the device by ID and include related info.
            // PL: Znajdź urządzenie po ID i dołącz powiązane informacje.
            const device = await Device.findOne({
                where: { id },
                include: [{ model: DeviceInfo, as: 'info' }] // EN: Include device info. PL: Dołącz informacje o urządzeniu.
            })
            // EN: If device is not found, return a not found error.
            // PL: Jeśli urządzenie nie zostało znalezione, zwróć błąd not found.
            if (!device) {
                return next(ApiError.notFound(`Urządzenie o id ${id} nie zostało znalezione`))
            }
            return res.json(device)
        } catch (e) {
            next(ApiError.internal(`Error fetching device: ${e.message}`))
        };
    }
}

module.exports = new DeviceController()
