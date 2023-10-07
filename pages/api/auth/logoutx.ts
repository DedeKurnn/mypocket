import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { serialize } from "cookie";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(204); //No content
	const refreshToken = cookies.jwt;

	// Is refreshToken in db?
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

	if (!foundUser) {
		res.setHeader(
			"Set-Cookie",
			serialize("jwt", "", {
				maxAge: -1,
				path: "/",
			})
		);
		return res.status(204);
	}

	// Delete refreshToken in db
	const RT = await prisma.userRefreshToken.deleteMany({
		where: {
			NOT: {
				token: refreshToken,
			},
		},
	});
	console.log(RT);

	res.setHeader(
		"Set-Cookie",
		serialize("jwt", "", {
			maxAge: -1,
			path: "/",
			secure: true,
		})
	);
	res.status(204);
}
