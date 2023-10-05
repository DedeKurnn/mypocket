
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { serialize } from "cookie";
import { sign } from "@/lib/jose";
import type { NextApiRequest, NextApiResponse } from "next";

interface IRequestBody {
	username: string;
	password: string;
}

const MAX_AGE = 4 * 60 * 60;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const body: IRequestBody = await req.body;

		const user = await prisma.user.findFirst({
			where: {
				email: body.username,
			},
		});

		if (user && (await bcrypt.compare(body.password, user.password))) {
			const { password, ...userWithoutPassword } = user;
			const accessToken = await sign(userWithoutPassword);

			const serialized = serialize("AUTH_COOKIE", accessToken, {
				httpOnly: false,
				sameSite: "strict",
				maxAge: MAX_AGE,
				path: "/",
			});

			return res.setHeader("Set-Cookie", serialized).json({
				status: 200,
				message: "Authenticated",
			});
		} else {
			return res.json({
				status: 401,
				message: "Unauthenticated",
			});
		}
	}
}
