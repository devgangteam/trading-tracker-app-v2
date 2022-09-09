import { PrismaService } from "@/modules/prisma/PrismaService";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { User } from "@prisma/client";
import _ from "lodash";
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService, private readonly httpService: HttpService) {}

    async findOne(email: string): Promise<User | undefined> {
        return this.prismaService.user.findUnique({
            where: {
                email
            }
        });
    }

    async verifyUserExistanceOrCreateNew(userId: string): Promise<User> {
        const existedUser = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });

        if (existedUser) {
            return existedUser;
        }


    }
}