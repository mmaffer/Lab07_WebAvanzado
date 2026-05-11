import userRepository from '../repositories/UserRepository.js';

class UserService {

    async getAll() {
        const users = await userRepository.getAll();
        return users.map(u => ({
            id: u._id,
            email: u.email,
            name: u.name,
            lastName: u.lastName,
            phoneNumber: u.phoneNumber,
            birthdate: u.birthdate,
            age: u.age,
            url_profile: u.url_profile,
            address: u.address,
            roles: u.roles.map(r => r.name),
            createdAt: u.createdAt
        }));
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            age: user.age,
            url_profile: user.url_profile,
            address: user.address,
            roles: user.roles.map(r => r.name),
            createdAt: user.createdAt
        };
    }

    async updateById(id, data) {
        // No permitir actualizar password, email, roles desde aquí
        const { password, email, roles, ...safeData } = data;
        const user = await userRepository.updateById(id, safeData);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            age: user.age,
            url_profile: user.url_profile,
            address: user.address,
            roles: user.roles.map(r => r.name),
            createdAt: user.createdAt
        };
    }
}

export default new UserService();