// eslint-disable-next-line import/no-extraneous-dependencies
import createPrismaMock from 'prisma-mock';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { appRouter } from '..';
import { Context } from '../context';

export const genericTeam = { name: 'Burnside X', id: '4067X' };
export const genericOrganisation = { name: 'Burnside Robotics', description: 'A cool organisation', location: 'Christchurch' };

export function serverTestEnvironment() {
    const prisma = createPrismaMock<PrismaClient>({}, Prisma.dmmf.datamodel);

    const context: Context = {
        req: undefined!,
        res: undefined!,
        storage: undefined!,

        database: prisma,
        session: null,
    };

    const caller = appRouter.createCaller(context);

    return [caller, prisma] as const;
}

export async function authServerTestEnvironment() {
    const prisma = createPrismaMock<PrismaClient>({}, Prisma.dmmf.datamodel);

    const context = {
        req: undefined!,
        res: undefined!,
        storage: undefined!,

        database: prisma,
        session: {
            expires: '',
            user: await prisma.user.create({
                data: {
                    email: 'jsmith@tardis.com',
                    name: 'John Smith',
                    image: '',
                },
            }),
        },
    } satisfies Context; // Satisfies operator ensures type does not collapse to Context, but ensures object fits within Context

    const caller = appRouter.createCaller(context);

    return [caller, prisma, context.session.user, context] as const;
}

export function createUser(prisma: PrismaClient): Promise<User> {
    return prisma.user.create({
        data: {
            email: randomUUID(),
            name: randomUUID(),
            image: '',
        },
    });
}
