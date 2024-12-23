import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createHash, hash, randomBytes } from 'crypto';

@Injectable()
export class UsersService {
    private readonly prismaClient = new PrismaClient();
    private readonly firstStep = 'sha512';
    private readonly secondStep = 'sha256';

    async make_salt(): Promise<string> {
        return randomBytes(16).toString('hex');
    }

    async hash_password(password: string, salt: string): Promise<string> {
        const firstHash = createHash(this.firstStep);
        const secondHash = createHash(this.secondStep);

        firstHash.update(password + salt);
        secondHash.update(firstHash.digest('hex'));
        return secondHash.digest('hex');
    }

    async find_user_by_id(id: number) {
        return this.prismaClient.user.findUnique({
            where: { id: id },
        });
    }

    async find_user_by_email(email: string) {
        return this.prismaClient.user.findUnique({
            where: { email: email },
        });
    }

    async create_user(data: { name: string, email: string; password: string }) {
        const salt = await this.make_salt();
        const hashedPassword = await this.hash_password(data.password, salt);

        return this.prismaClient.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: {
                    create: {
                        salt: salt,
                        hash: hashedPassword,
                    },
                },
            },
        });
    }

    async update_user(id: number, data: { name?: string, email?: string }) {
        return this.prismaClient.user.update({
            where: { id: id },
            data: {
                name: data.name,
                email: data.email,
            },
        });
    }

    async delete_user(id: number) {
        return this.prismaClient.user.delete({
            where: { id: id },
        });
    }

    async check_password(email: string, password: string): Promise<boolean> {
        const user = await this.prismaClient.user.findUnique({
            where: { email: email },
            include: {
                password: true,
            },
        });

        if (!user) {
            throw new Error(`User of ${email} not found`);
        }

        if (!user.password) {
            throw new Error(`Password of ${email} not found`);
        }

        const hashedPassword = await this.hash_password(password, user.password.salt);

        return hashedPassword === user.password.hash;
    }

    async change_password(email: string, password: string) {
        const salt = await this.make_salt();
        const hashedPassword = await this.hash_password(password, salt);

        return this.prismaClient.user.update({
            where: { email: email },
            data: {
                password: {
                    update: {
                        salt: salt,
                        hash: hashedPassword,
                    },
                },
            },
        });
    }

    async find_sessions_by_user_id(userId: number) {
        return this.prismaClient.session.findMany({
            where: { userId: userId },
        });
    }

    async create_session(userId: number, token: string) {
        return this.prismaClient.session.create({
            data: {
                token: token,
                userId: userId,
            },
        });
    }

    async delete_session(token: string) {
        return this.prismaClient.session.delete({
            where: { token: token },
        });
    }

    async delete_sessions_by_user_id(userId: number) {
        return this.prismaClient.session.deleteMany({
            where: { userId: userId },
        });
    }

    async check_session(token: string) {
        const session = await this.prismaClient.session.findUnique({
            where: { token: token },
            include: {
                user: true,
            }
        });

        if (!session) {
            throw new Error(`Session of ${token} not found`);
        }

        return session;
    }
}
