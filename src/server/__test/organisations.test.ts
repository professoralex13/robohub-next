import { authServerTestEnvironment, createUser, serverTestEnvironment, genericTeam, genericOrganisation } from '.';
import { transformUrlName } from '../utils';

describe('nameTaken', () => {
    it('Return False', async () => {
        const [caller] = serverTestEnvironment();

        expect(await caller.organisation.nameTaken('Burnside Robotics')).toBe(false);
    });

    it('Return True', async () => {
        const [caller] = await authServerTestEnvironment();

        await caller.organisation.create(genericOrganisation);

        expect(await caller.organisation.nameTaken('Burnside Robotics')).toBe(true);
    });
});

describe('teamNameTaken', () => {
    it('Return False with team in different organisation', async () => {
        const [caller] = await authServerTestEnvironment();

        const organisation = await caller.organisation.create(genericOrganisation);

        await caller.organisation.createTeam({ organisationId: organisation.id, ...genericTeam });

        expect(await caller.organisation.teamNameTaken({ organisationId: 69, teamName: genericTeam.name })).toBe(false);
    });

    it('Return True', async () => {
        const [caller] = await authServerTestEnvironment();

        const organisation = await caller.organisation.create(genericOrganisation);

        await caller.organisation.createTeam({ organisationId: organisation.id, ...genericTeam });

        expect(await caller.organisation.teamNameTaken({ organisationId: organisation.id, teamName: genericTeam.name })).toBe(true);
    });
});

describe('create', () => {
    it('Create Valid Organisation', async () => {
        const [caller, prisma, user] = await authServerTestEnvironment();

        const organisation = await caller.organisation.create(genericOrganisation);

        expect(await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { users: true } })).toMatchObject({
            ...genericOrganisation,
            urlName: transformUrlName(genericOrganisation.name),
            users: [{
                userId: user.id,
                isAdmin: true,
            }],
        });
    });

    // This can be a test of private procedures requiring auth in general
    it('Require Login', async () => {
        const [caller] = serverTestEnvironment();

        await expect(caller.organisation.create(genericOrganisation)).rejects.toBeDefined();
    });
});

describe('inviteUser', () => {
    it('Invite user normally as admin', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const organisation = await caller.organisation.create(genericOrganisation);

        const user = await createUser(prisma);

        await caller.organisation.inviteUser({ organisationId: organisation.id, userId: user.id });

        expect(await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { userInvites: true } })).toMatchObject({
            userInvites: [{
                userId: user.id,
                inviterId: myself.id,
                isAdmin: false,
            }],
        });
    });

    it('Cannot invite user as non admin', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        isAdmin: false,
                        user: {
                            connect: myself,
                        },
                    },
                },
            },
        });

        const user = await createUser(prisma);

        await expect(caller.organisation.inviteUser({ organisationId: organisation.id, userId: user.id })).rejects.toBeDefined();
    });

    it('Cannot invite existing member', async () => {
        const [caller, prisma] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: 'Burnside-Robotics',
                users: {
                    create: {
                        isAdmin: false,
                        userId: user.id,
                    },
                },
            },
        });

        await expect(caller.organisation.inviteUser({ organisationId: organisation.id, userId: user.id })).rejects.toBeDefined();
    });
});

describe('cancelInvite', () => {
    it('Cancels invites', async () => {
        const [caller, prisma] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        const organisation = await caller.organisation.create(genericOrganisation);

        await caller.organisation.inviteUser({ organisationId: organisation.id, userId: user.id });

        await caller.organisation.cancelInvite({ organisationId: organisation.id, userId: user.id });

        expect((await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { userInvites: true } }))?.userInvites).toHaveLength(0);
    });
});

describe('respondToInvite', () => {
    it('Accepts invite', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        isAdmin: true,
                        userId: user.id,
                    },
                },
                userInvites: {
                    create: {
                        inviterId: user.id,
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        await caller.organisation.respondToInvite({ organisationId: organisation.id, accept: true });

        expect((await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { userInvites: true } }))?.userInvites).toHaveLength(0);
        expect((await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { users: true } }))?.users).toHaveLength(2);
    });

    it('Declines invite', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        isAdmin: true,
                        userId: user.id,
                    },
                },
                userInvites: {
                    create: {
                        inviterId: user.id,
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        await caller.organisation.respondToInvite({ organisationId: organisation.id, accept: false });

        expect((await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { userInvites: true } }))?.userInvites).toHaveLength(0);
        expect((await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { users: true } }))?.users).toHaveLength(1);
    });
});

describe('removeUser', () => {
    it('Removes Member', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const user = await createUser(prisma);

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    createMany: {
                        data: [{
                            isAdmin: false,
                            userId: user.id,
                        }, {
                            isAdmin: true,
                            userId: myself.id,
                        }],
                    },
                },
            },
        });

        await caller.organisation.removeUser({ organisationId: organisation.id, userId: user.id });

        expect((await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { users: true } }))?.users).toHaveLength(1);
    });
});

describe('createTeam', () => {
    it('Creates Team', async () => {
        const [caller, prisma, myself] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        isAdmin: true,
                        userId: myself.id,
                    },
                },
            },
        });

        await prisma.organisation.create({
            data: {
                name: 'Burnside Robotics 2',
                urlName: transformUrlName('Burnside Robotics 2'),
                description: 'A cooler organisation',
                location: 'Christchurch as well',
                users: {
                    create: {
                        isAdmin: true,
                        userId: myself.id,
                    },
                },
                // teams: {
                //     // Should be able to create team with same name in diff org
                //     create: {
                //         id: '3029X',
                //         name: genericTeam.name,
                //     },
                // },
            },
        });

        await caller.organisation.createTeam({ ...genericTeam, organisationId: organisation.id });

        expect((await prisma.organisation.findFirst({ where: { id: organisation.id }, include: { teams: true } }))?.teams[0]).toMatchObject(genericTeam);
    });

    /** THESE TESTS DONT PASS BECAUSE PRISMA MOCK DOES NOT DO UNIQUENESS CHECKS */

    // it('Cannot create team with duplicate id', async () => {
    //     const [caller, prisma, myself] = await authServerTestEnvironment();

    //     const organisation = await prisma.organisation.create({
    //         data: {
    //             ...genericOrganisation,
    //             urlName: transformUrlName(genericOrganisation.name),
    //             users: {
    //                 create: {
    //                     isAdmin: true,
    //                     userId: myself.id,
    //                 },
    //             },
    //         },
    //     });

    //     await prisma.organisation.create({
    //         data: {
    //             name: 'Burnside Robotics 2',
    //             urlName: transformUrlName('Burnside Robotics 2'),
    //             description: 'A cooler organisation',
    //             location: 'Christchurch as well',
    //             teams: {
    //                 create: genericTeam,
    //             },
    //         },
    //     });

    //     await expect(caller.organisation.createTeam({ organisationId: organisation.id, id: genericTeam.id, name: 'A different name' })).rejects.toBeDefined();
    // });

    // it('Cannot create team with duplicate name in same org', async () => {
    //     const [caller, prisma, myself] = await authServerTestEnvironment();

    //     const organisation = await prisma.organisation.create({
    //         data: {
    //             ...genericOrganisation,
    //             urlName: transformUrlName(genericOrganisation.name),
    //             users: {
    //                 create: {
    //                     isAdmin: true,
    //                     userId: myself.id,
    //                 },
    //             },
    //             teams: {
    //                 create: genericTeam,
    //             },
    //         },
    //     });

    //     await expect(caller.organisation.createTeam({ organisationId: organisation.id, id: '4067A', name: genericTeam.name })).rejects.toBeDefined();
    // });
});
