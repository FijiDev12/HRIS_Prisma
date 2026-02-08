import { prisma } from "../util/prisma.util";

type AuditParams = {
    userId: number
    action: string
    tableName: string
    recordId: number
    request?: any
    response?: any
}

export async function createAuditLogs(data: AuditParams) {
    return prisma.auditLog.create({
        data: {
            userId: data.userId,
            action: data.action,
            tableName: data.tableName,
            recordId: data.recordId,
            request: data.request,
            response: data.response,
        }
    })
}