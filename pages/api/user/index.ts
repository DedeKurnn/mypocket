import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { verify, decode } from "jsonwebtoken";

const REFRESH_TOKEN_SECRET = process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { jwt } = req.cookies;

	if (!jwt || !verify(jwt, REFRESH_TOKEN_SECRET!)) {
		return res.json({
			error: "Unauthorized",
			status: 401,
		});
	}

	const userData = decode(jwt);
	console.log(userData);

	if (req.method === "GET") {
		const user = await prisma.user.findUnique({
			where: {
				id: userData.id?.toString(),
			},
		});

		if (user) {
			const { password, ...userWithoutPassword } = user;
			return res.json(userWithoutPassword);
		} else {
			return res.json({ status: 404, message: "User not found" });
		}
	}
}
