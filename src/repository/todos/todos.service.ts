import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, TaskStatus } from '@prisma/client';

@Injectable()
export class TodosService {
    private readonly prismaClient = new PrismaClient();

    async create_category(userId: number, name: string) {
        return this.prismaClient.category.create({
            data: {
                name: name,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }

    async find_category_by_id(id: number) {
        return this.prismaClient.category.findUnique({
            where: { id: id },
        });
    }

    async find_category_by_name(userId: number, name: string) {
        return this.prismaClient.category.findFirst({
            where: {
                name: name,
                userId: userId,
            },
        });
    }

    async find_all_categories(userId: number) {
        return this.prismaClient.category.findMany({
            where: {
                userId: userId,
            },
        });
    }

    async page_all_categories(userId: number, cursorId: number, take: number) {
        return this.prismaClient.category.findMany({
            where: {
                userId: userId,
                id: {
                    gt: cursorId,
                },
            },
            take: take,
        });
    }

    async update_category(id: number, name: string) {
        return this.prismaClient.category.update({
            where: { id: id },
            data: { name: name },
        });
    }

    async delete_category(id: number) {
        return this.prismaClient.category.delete({
            where: { id: id },
        });
    }

    async create_task(categoryId: number, content: string, status: TaskStatus, dueDate?: Date) {
        return this.prismaClient.task.create({
            data: {
                content: content,
                status: status,
                dueDate: dueDate,
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
            },
        });
    }

    async find_task_by_id(id: string) {
        return this.prismaClient.task.findUnique({
            where: { id: id },
        });
    }

    async page_all_tasks(categoryId: number, cursorTime: Date, take: number) {
        return this.prismaClient.task.findMany({
            where: {
                categoryId: categoryId,
                createdAt: {
                    gt: cursorTime,
                }
            },
            take: take,
        });
    }

    async page_all_tasks_by_status(categoryId: number, status: TaskStatus, cursorTime: Date, take: number) {
        return this.prismaClient.task.findMany({
            where: {
                categoryId: categoryId,
                status: status,
                createdAt: {
                    gt: cursorTime,
                }
            },
            take: take,
        });
    }

    async page_all_tasks_by_due_date(categoryId: number, dueDate: Date, cursorTime: Date, take: number) {
        return this.prismaClient.task.findMany({
            where: {
                categoryId: categoryId,
                dueDate: dueDate,
                createdAt: {
                    gt: cursorTime,
                }
            },
            take: take,
        });
    }
}
