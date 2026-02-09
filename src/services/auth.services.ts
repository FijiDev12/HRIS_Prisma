import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../util/prisma.util";
import { redis } from "../util/redis.util";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXP = "15m";
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
const REFRESH_EXP = "7d";

interface UserPayload {
    id: number;
    role: number;
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
    });

    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const payload: UserPayload = { id: user.id, role: user.roleId };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXP });

    await redis.set(`refresh:${user.id}`, refreshToken, "EX", 7 * 24 * 3600);

    return { accessToken, refreshToken, user };
}

export async function refreshToken(oldToken: string) {
    try {
        const decoded: any = jwt.verify(oldToken, REFRESH_SECRET);

        const savedToken = await redis.get(`refresh:${decoded.id}`);
        if (!savedToken || savedToken !== oldToken) throw new Error("Invalid refresh token");

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true },
        });

        if (!user) throw new Error("User not found");

        const payload: UserPayload = { id: user.id, role: user.roleId };

        const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
        const newRefreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXP });

        await redis.set(`refresh:${user.id}`, newRefreshToken, "EX", 7 * 24 * 3600);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
    } catch (err) {
        throw new Error("Invalid refresh token");
    }
}

export async function logout(userId: number, accessToken: string, refreshToken?: string) {
    const decoded: any = jwt.decode(accessToken);
    if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        await redis.set(`bl:${accessToken}`, "1", "EX", ttl);
    }

    if (refreshToken) {
        const savedToken = await redis.get(`refresh:${userId}`);
        if (savedToken === refreshToken) {
            await redis.del(`refresh:${userId}`);
        }
    } else {
        await redis.del(`refresh:${userId}`);
    }
}