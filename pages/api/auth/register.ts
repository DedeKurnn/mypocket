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
			return res
				.status(200)
				.json({ message: "User created successfully" });
		} else {
			return res.status(500).json({
				message: "Internal Server Error: Failed to create a new user.",
			});
		}
	}
}
