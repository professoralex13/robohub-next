import { MembershipType } from '@/common';
import { authServerTestEnvironment, genericOrganisation, genericTeam } from '.';
import { getOrganisation, getTeam, transformUrlName } from '../utils';

describe('getOrganisation', () => {
    it('Get organisation as member', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        expect(await getOrganisation(context, organisation.id)).toMatchObject(organisation);
    });

    it('Fail to get organiastion as non member', async () => {
        const [_, prisma, _1, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
            },
        });

        await expect(getOrganisation(context, organisation.id)).rejects.toBeDefined();
    });

    it('Get organisation as non member when requiring non member', async () => {
        const [_, prisma, _1, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
            },
        });

        expect(await getOrganisation(context, organisation.id, MembershipType.None)).toMatchObject(organisation);
    });

    it('Get organisation as admin when requiring admin', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: true,
                    },
                },
            },
        });

        expect(await getOrganisation(context, organisation.id, MembershipType.Admin)).toMatchObject(organisation);
    });

    it('Fail to get organiastion as member when requiring admin', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        await expect(getOrganisation(context, organisation.id, MembershipType.Admin)).rejects.toBeDefined();
    });
});

describe('getTeam', () => {
    it('Get team as member', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        const team = await prisma.team.create({
            data: {
                ...genericTeam,
                organisationId: organisation.id,
                users: {
                    create: {
                        userId: myself.id,
                        isLeader: false,
                    },
                },
            },
        });

        expect(await getTeam(context, team.id)).toMatchObject(team);
    });

    it('Fail to get team as non member', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        const team = await prisma.team.create({
            data: {
                ...genericTeam,
                organisationId: organisation.id,
            },
        });

        await expect(getTeam(context, team.id)).rejects.toBeDefined();
    });

    it('Get team as non member when requiring non member', async () => {
        const [_, prisma, _1, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
            },
        });

        const team = await prisma.team.create({
            data: {
                ...genericTeam,
                organisationId: organisation.id,
            },
        });

        expect(await getTeam(context, team.id, MembershipType.None)).toMatchObject(team);
    });

    it('Get team as admin of team when requiring admin', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        const team = await prisma.team.create({
            data: {
                ...genericTeam,
                organisationId: organisation.id,
                users: {
                    create: {
                        userId: myself.id,
                        isLeader: true,
                    },
                },
            },
        });

        expect(await getTeam(context, team.id, MembershipType.Admin)).toMatchObject(team);
    });

    it('Get team as admin of organisation when requiring admin', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: true,
                    },
                },
            },
        });

        const team = await prisma.team.create({
            data: {
                ...genericTeam,
                organisationId: organisation.id,
                users: {
                    create: {
                        userId: myself.id,
                        isLeader: false,
                    },
                },
            },
        });

        expect(await getTeam(context, team.id, MembershipType.Admin)).toMatchObject(team);
    });

    it('Fail to get team as member when requiring admin', async () => {
        const [_, prisma, myself, context] = await authServerTestEnvironment();

        const organisation = await prisma.organisation.create({
            data: {
                ...genericOrganisation,
                urlName: transformUrlName(genericOrganisation.name),
                users: {
                    create: {
                        userId: myself.id,
                        isAdmin: false,
                    },
                },
            },
        });

        const team = await prisma.team.create({
            data: {
                ...genericTeam,
                organisationId: organisation.id,
                users: {
                    create: {
                        userId: myself.id,
                        isLeader: false,
                    },
                },
            },
        });

        await expect(getTeam(context, team.id, MembershipType.Admin)).rejects.toBeDefined();
    });
});
