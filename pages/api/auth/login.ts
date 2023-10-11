import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { serialize } from "cookie";
import { sign } from "@/lib/jose";
import type { NextApiRequest, NextApiResponse } from "next";

interface IRequestBody {
	email: string;
	password: string;
	remember: string;
}

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30 * 6;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const body: IRequestBody = await req.body;
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		});

		console.log(user);

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		if (!(await bcrypt.compare(body.password, user.password))) {
			return res.status(401).json({
				message: "Password invalid",
			});
		}

		const { password, ...userWithoutPassword } = user;
		const accessToken = await sign(
			userWithoutPassword,
			ACCESS_TOKEN_SECRET!,
			ACCESS_TOKEN_MAX_AGE
		);

		const refreshToken = await sign(
			userWithoutPassword,
			REFRESH_TOKEN_SECRET!,
			REFRESH_TOKEN_MAX_AGE
		);

		const serializedAccessToken = serialize("AUTH_COOKIE", accessToken, {
			httpOnly: true,
			sameSite: "strict",
			maxAge: ACCESS_TOKEN_MAX_AGE,
			secure: true,
			path: "/",
		});

		if (body.remember) {
			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					refreshToken: refreshToken,
				},
			});
		}

		return res
			.setHeader("Set-Cookie", serializedAccessToken)
			.status(200)
			.json({
				message: "Authenticated",
				data: { ...userWithoutPassword },
			});
	}
}
