import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { serialize } from "cookie";
import { sign } from "@/lib/jose";
import type { NextApiRequest, NextApiResponse } from "next";

interface IRequestBody {
	username: string;
	password: string;
	remember: string;
}

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_MAX_AGE = 10;

const REFRESH_TOKEN_MAX_AGE = 10;

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

			const serializedAccessToken = serialize(
				"AUTH_COOKIE",
				accessToken,
				{
					httpOnly: true,
					sameSite: "strict",
					maxAge: ACCESS_TOKEN_MAX_AGE,
					path: "/",
				}
			);

			let serializedRefreshToken = "";

			if (body.remember) {
				serializedRefreshToken = serialize(
					"REFRESH_COOKIE",
					refreshToken,
					{
						httpOnly: true,
						sameSite: "strict",
						maxAge: REFRESH_TOKEN_MAX_AGE,
						path: "/",
					}
				);
			}

			return res
				.setHeader("Set-Cookie", [
					serializedAccessToken,
					serializedRefreshToken,
				])
				.json({
					staus: 200,
					message: "Authenticated",
					data: { ...userWithoutPassword },
				});
		} else {
			return res.json({
				status: 401,
				message: "Unauthenticated",
			});
		}
	}
}
