import { serverTestEnvironment, genericOrganisation, genericTeam, authServerTestEnvironment, createUser } from '.';
import { transformUrlName } from '../utils';

describe('idTaken', () => {
    it('Return False', async () => {
        const [caller] = serverTestEnvironment();

        expect(await caller.teams.idTaken('4067X')).toBe(false);
    });

    it('Return True', async () => {
        const [caller, prisma] = await serverTestEnvironment();

        await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                teams: {
                    create: genericTeam,
                },
            },
        });
        expect(await caller.teams.idTaken(genericTeam.id)).toBe(true);
    });
});

describe('addUser', () => {
    it('Add User in organisation', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                teams: {
                    create: {
                        ...genericTeam,
                    },
                },
                users: {
                    createMany: {
                        data: [{
                            userId: myself.id,
                            isAdmin: true,
                        }, {
                            userId: user.id,
                            isAdmin: false,
                        }],
                    },
                },
            },
        });

        await caller.teams.addUser({ userId: user.id, teamId: genericTeam.id });
        expect((await prisma.team.findFirstOrThrow({ where: { id: genericTeam.id }, include: { users: { include: { user: true } } } }))?.users[0].user).toMatchObject(user);
    });

    it('Try add user not in organisation', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                teams: {
                    create: {
                        ...genericTeam,
                    },
                },
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: true,
                    },
                },
            },
        });

        await expect(caller.teams.addUser({ userId: user.id, teamId: genericTeam.id })).rejects.toBeDefined();
    });

    it('Cannot add user as non admin', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                teams: {
                    create: {
                        ...genericTeam,
                        users: {
                            create: {
                                userId: myself.id,
                                isLeader: false,
                            },
                        },
                    },
                },
                users: {
                    createMany: {
                        data: [{
                            userId: myself.id,
                            isAdmin: false,
                        }, {
                            userId: user.id,
                            isAdmin: false,
                        }],
                    },
                },
            },
        });

        await expect(caller.teams.addUser({ userId: user.id, teamId: genericTeam.id })).rejects.toBeDefined();
    });
});

describe('removeUser', () => {
    it('Remove user', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                teams: {
                    create: {
                        ...genericTeam,
                        users: {
                            create: {
                                isLeader: false,
                                userId: user.id,
                            },
                        },
                    },
                },
                users: {
                    createMany: {
                        data: [{
                            userId: myself.id,
                            isAdmin: true,
                        }, {
                            userId: user.id,
                            isAdmin: false,
                        }],
                    },
                },
            },
        });

        await caller.teams.removeUser({ userId: user.id, teamId: genericTeam.id });
        expect((await prisma.team.findFirstOrThrow({ where: { id: genericTeam.id }, include: { users: { include: { user: true } } } }))?.users).toHaveLength(0);
    });

    it('Cannot remove user not in team', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                teams: {
                    create: {
                        ...genericTeam,
                    },
                },
                users: {
                    createMany: {
                        data: [{
                            userId: myself.id,
                            isAdmin: true,
                        }, {
                            userId: user.id,
                            isAdmin: false,
                        }],
                    },
                },
            },
        });

        await expect(caller.teams.removeUser({ userId: user.id, teamId: genericTeam.id })).rejects.toBeDefined();
    });
});
