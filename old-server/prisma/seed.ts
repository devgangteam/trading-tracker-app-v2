import { PrismaClient, Role } from "@prisma/client"
import { hashPassword } from "../src/utils/hasher.util";

const prisma = new PrismaClient();

const { DEFAULT_ADMIN, DEFAULT_ADMIN_PASS, DEFAULT_ADMIN_EMAIL } = process.env;
async function main() {
    await prisma.user.create({
        data: {
            username: DEFAULT_ADMIN,
            password: await hashPassword(DEFAULT_ADMIN_PASS),
            email: DEFAULT_ADMIN_EMAIL,
            role: Role.ADMIN
        }
    });

    const leader = await prisma.user.create({
        data: {
            username: 'seedingleader1',
            password: await hashPassword('p@ssw0rd'),
            email: 'seedingleader1@trading-tracker.com',
            role: Role.LEADER
        }
    });

    await prisma.user.create({
        data: {
            username: 'seedinguser1',
            password: await hashPassword('p@ssw0rd'),
            email: 'seedinguser1@trading-tracker.com',
            leaderId: leader.id
        }
    });

    await prisma.user.create({
        data: {
            username: 'seedinguser2',
            password: await hashPassword('p@ssw0rd'),
            email: 'seedinguser2@trading-tracker.com',
            leaderId: leader.id
        }
    });

    await prisma.user.create({
        data: {
            username: 'seedinguser3',
            password: await hashPassword('p@ssw0rd'),
            email: 'seedinguser3@trading-tracker.com',
            leaderId: leader.id
        }
    });
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })