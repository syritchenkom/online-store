import bcrypt from 'bcrypt';
import { User } from './models/User';
import { Basket } from './models/Basket';

const BCRYPT_SALT_ROUNDS = 10;

export const seedAdmin = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.log('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env, skipping admin seed.');
        return;
    }

    try {
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            console.log(`Creating admin user: ${adminEmail}`);
            const hashPassword = await bcrypt.hash(adminPassword, BCRYPT_SALT_ROUNDS);
            
            const adminUser = await User.create({
                email: adminEmail,
                password: hashPassword,
                role: 'ADMIN' // Directly set the role to ADMIN
            });

            await Basket.create({ userId: adminUser.id });
            console.log('Admin user and basket created successfully.');
        }
    } catch (error) {
        console.error('Error during admin seeding:', error);
    }
};