import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
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
	if (req.method === "POST") {
		const body: IRequestBody = await req.body;
		const cookies = req.cookies;

		if (!body.username || !body.password)
			return res
				.status(400)
				.json({ message: "Username and password are required." });

		const user = await prisma.user.findFirst({
			where: {
				email: body.username,
			},
		});

		if (user && (await bcrypt.compare(body.password, user.password))) {
			const { password, ...userWithoutPassword } = user;

			const accessToken = jwt.sign(
				userWithoutPassword,
				ACCESS_TOKEN_SECRET!,
				{ expiresIn: "10s" }
			);
			const newRefreshToken = jwt.sign(
				userWithoutPassword,
				REFRESH_TOKEN_SECRET!,
				{ expiresIn: "1d" }
			);

			const userRefreshToken = await prisma.userRefreshToken.findMany({
				where: {
					userId: user.id,
				},
			});

			!cookies?.jwt
				? userRefreshToken
				: await prisma.userRefreshToken.deleteMany({
						where: {
							NOT: { token: cookies.jwt },
						},
				  });

			if (cookies?.jwt) {
				/* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
				const refreshToken = cookies.jwt;
				const foundToken = await prisma.userRefreshToken.findFirst({
					where: {
						userId: user.id,
						token: refreshToken,
					},
				});

				// Detected refresh token reuse!
				if (!foundToken) {
					console.log("attempted refresh token reuse at login!");
					// clear out ALL previous refresh tokens
					await prisma.userRefreshToken.deleteMany({});
				}

				res.setHeader(
					"Set-Cookie",
					serialize("jwt", "", {
						maxAge: -1,
						path: "/",
					})
				);
			}

			// Saving refreshToken with current user
			const userRT = await prisma.userRefreshToken.create({
				data: {
					userId: user.id,
					token: newRefreshToken,
				},
			});

			// Creates Secure Cookie with refresh token
			res.setHeader(
				"Set-Cookie",
				serialize("jwt", newRefreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					maxAge: 24 * 60 * 60 * 1000,
					path: "/",
				})
			);

			// Send authorization roles and access token to user
			res.json({ userWithoutPassword, accessToken });
		} else {
			return res.json({
				status: 401,
				message: "Unauthenticated",
			});
		}
	}
}
