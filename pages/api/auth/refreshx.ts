import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import prisma from "@/lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(401);
	const refreshToken = cookies.jwt;
	res.setHeader(
		"Set-Cookie",
		serialize("jwt", "", {
			maxAge: -1,
			path: "/",
			secure: true,
		})
	);

	const foundToken = await prisma.userRefreshToken.findFirst({
		where: {
			token: refreshToken,
		},
	});

	const foundUser = await prisma.user.findFirst({
		where: {
			id: foundToken?.userId!,
		},
	});

	// Detected refresh token reuse!
	if (!foundUser) {
		jwt.verify(
			refreshToken,
			process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET!,
			async (err, decoded) => {
				if (err) return res.status(403); //Forbidden
				console.log("attempted refresh token reuse!");
				const hackedUser = await prisma.user.findFirst({
					where: {
						name: decoded!.username,
					},
				});
				await prisma.userRefreshToken.deleteMany({});
			}
		);
		return res.status(403); //Forbidden
	}

	await prisma.userRefreshToken.deleteMany({
		where: {
			NOT: { token: cookies.jwt },
		},
	});

	// evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET!,
		async (err, decoded) => {
			if (err) {
				console.log("expired refresh token");
			}
			if (err || foundUser.name !== decoded!.username)
				return res.status(403);

			// Refresh token was still valid
			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: decoded,
					},
				},
				process.env.NEXT_AUTH_SECRET_KEY!,
				{ expiresIn: "10s" }
			);
			const { password, ...userWithoutPassword } = foundUser;
			const newRefreshToken = jwt.sign(
				userWithoutPassword,
				process.env.NEXT_AUTH_REFRESH_TOKEN_SECRET!,
				{ expiresIn: "1d" }
			);
			// Saving refreshToken with current user
			const userRT = await prisma.userRefreshToken.create({
				data: {
					userId: foundUser.id,
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

			res.json({ accessToken });
		}
	);
}
