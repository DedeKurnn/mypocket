import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sign } from "@/lib/jose";
import type { NextApiRequest, NextApiResponse } from "next";

interface IRequestBody {
	username: string;
	password: string;
}

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const cookie = req.cookies;

	if (!cookie.AUTH_COOKIE) return res.status(401);

	const refreshToken = cookie.AUTH_COOKIE;

	const user = await prisma.user.findFirst({
		where: {
			refreshToken: refreshToken,
		},
	});

	if (!user) return res.status(403);
	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!, (err, decoded) => {
		if (err || !decoded) return res.status(403);
		const accessToken = sign({ decoded }, ACCESS_TOKEN_SECRET!, 30);
		return res.json({ accessToken });
	});
}
