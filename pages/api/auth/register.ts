import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { serialize } from "cookie";
import { sign } from "@/lib/jose";
import type { NextApiRequest, NextApiResponse } from "next";

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_ACCESS_TOKEN_SECRET;
interface IRequestBody {
	username: string;
	email: string;
	password: string;
}

const MAX_AGE = 60 * 60 * 24 * 30;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const body: IRequestBody = await req.body;

		const existingUser = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});

		if (existingUser) {
			return res.status(400).json({
				message: "Bad Request: Email is already registered.",
			});
		}

		const user = await prisma.user.create({
			data: {
				name: body.username,
				email: body.email,
				password: await bcrypt.hash(body.password, 10),
			},
		});

		if (user) {
			const { ...userWithoutPassword } = user;
			const accessToken = await sign(
				userWithoutPassword,
				ACCESS_TOKEN_SECRET!,
				MAX_AGE
			);

			const serialized = serialize("AUTH_COOKIE", accessToken, {
				httpOnly: false,
				sameSite: "strict",
				maxAge: MAX_AGE,
				path: "/",
			});

			return res.setHeader("Set-Cookie", serialized).status(200).json({
				message: "Authenticated",
			});
		} else {
			return res.status(500).json({
				message: "Internal Server Error: Failed to create a new user.",
			});
		}
	}
}
