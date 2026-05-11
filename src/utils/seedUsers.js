import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    const adminEmail = 'admin@test.com';
    const existing = await userRepository.findByEmail(adminEmail);

    if (!existing) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash('Admin#123', saltRounds);

        const adminRole = await roleRepository.findByName('admin');
        const userRole = await roleRepository.findByName('user');

        await userRepository.create({
            email: adminEmail,
            password: hashed,
            name: 'Admin',
            lastName: 'Principal',
            phoneNumber: '999999999',
            birthdate: new Date('1990-01-01'),
            url_profile: '',
            address: 'Lima, Perú',
            roles: [adminRole._id, userRole._id]
        });
        console.log('Seeded admin user: admin@test.com / Admin#123');
    }
}
