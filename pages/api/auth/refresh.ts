import prisma from "@/lib/prisma";
import { sign, decrypt } from "@/lib/jose";
import type { NextApiRequest, NextApiResponse } from "next";

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { AUTH_COOKIE } = req.cookies;

	if (!AUTH_COOKIE) return res.status(401);

	const refreshToken = AUTH_COOKIE;

	const user = await prisma.user.findFirst({
		where: {
			refreshToken: refreshToken,
		},
	});

	if (!user) return res.status(403);

	const decodedRefreshToken = await decrypt(
		refreshToken,
		REFRESH_TOKEN_SECRET!
	);
	if (!decodedRefreshToken) return res.status(403);

	const accessToken = await sign(
		decodedRefreshToken,
		ACCESS_TOKEN_SECRET!,
		30
	);
	return res.json({ accessToken });
}
