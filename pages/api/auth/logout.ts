import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import prisma from "@/lib/prisma";
import { verify } from "@/lib/jose";

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_ACCESS_TOKEN_SECRET;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { AUTH_COOKIE } = req.cookies;
	const { id } = req.query;

	if (!AUTH_COOKIE || !verify(AUTH_COOKIE, ACCESS_TOKEN_SECRET!)) {
		return res.json({
			error: "Unauthorized",
			status: 401,
		});
	}

	await prisma.user.update({
		where: {
			id: id?.toString(),
		},
		data: {
			refreshToken: null,
		},
	});

	res.setHeader("Set-Cookie", [
		serialize("AUTH_COOKIE", "", {
			maxAge: -1,
			path: "/",
		}),
	]);

	// Redirect the user to the sign-in page or any other desired location
	res.status(302).send("Signed Out");
}
