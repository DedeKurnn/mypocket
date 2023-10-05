import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "@/lib/jose";

interface IRequestBody {
	id: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;

	const { AUTH_COOKIE } = req.cookies;

	if (!AUTH_COOKIE || !verify(AUTH_COOKIE)) {
		return res.json({
			error: "Unauthorized",
			status: 401,
		});
	}

	if (req.method === "GET") {
		const user = await prisma.user.findUnique({
			where: {
				id: id?.toString(),
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
