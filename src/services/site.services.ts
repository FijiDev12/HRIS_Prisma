import { prisma } from "../util/prisma.util";

interface SiteType {
    siteName: string;
    createdBy: number;
}

export async function createSiteService(data: SiteType) {
    const result = await prisma.site.create({ data });

    return result;
}

export async function getSitesService() {
    const result = await prisma.site.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getSiteByIdService(id: number) {
    const result = await prisma.site.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateSiteService(id: number, data: Partial<SiteType>) {
    const result = await prisma.site.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteSiteService(id: number) {
    const result = await prisma.site.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}