import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "@/lib/jose";
import * as bcrypt from "bcrypt";
import type { User } from "@prisma/client";

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_ACCESS_TOKEN_SECRET;

interface JWTPayload {
	id: string;
}
interface IRequestBody {
	currentPassword?: string;
	newPassword?: string;
	username?: string;
	email?: string;
}

function isJWTPayload(obj: any): obj is JWTPayload {
	return "id" in obj;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { AUTH_COOKIE } = req.cookies;
	const body: IRequestBody = req.body;
	const userData = await verify(AUTH_COOKIE!, ACCESS_TOKEN_SECRET!);

	if (!AUTH_COOKIE || !isJWTPayload(userData)) {
		return res.json({
			error: "Unauthorized",
			status: 401,
		});
	}

	const user = await prisma.user.findFirst({
		where: {
			id: userData.id.toString(),
		},
	});

	if (req.method === "GET") {
		if (user) {
			const { password, ...userWithoutPassword } = user;
			return res.json(userWithoutPassword);
		} else {
			return res.json({ status: 404, message: "User not found" });
		}
	} else if (req.method === "PUT") {
		const { currentPassword, newPassword, username, email } = body;

		// Prepare the data object with existing user data
		const data: Partial<User> = {
			name: user?.name,
			email: user?.email,
		};

		// If newPassword and currentPassword are provided, update password if currentPassword is correct
		if (currentPassword && newPassword && user) {
			const passwordMatch = await bcrypt.compare(
				currentPassword,
				user?.password
			);

			if (passwordMatch) {
				data.password = await bcrypt.hash(newPassword, 10);
			} else {
				return res.status(401).json({
					message: "Unauthorized: Current password is incorrect.",
				});
			}
		}

		// Update name and email if provided in the request body
		if (username) {
			data.name = username;
		}

		if (email) {
			data.email = email;
			const existingUser = await prisma.user.findUnique({
				where: {
					email: data.email,
				},
			});

			if (existingUser) {
				return res.status(400).json({
					message: "Bad Request: Email is already registered.",
				});
			}
		}

		// Update the user in the database
		const updatedUser = await prisma.user.update({
			where: {
				id: user?.id,
			},
			data: data,
		});

		if (!updatedUser) {
			return res.status(500).json({ message: "Internal server error" });
		}

		// Return the updated user without the password
		const { password, ...updatedUserWithoutPassword } = updatedUser;
		return res.status(200).json(updatedUserWithoutPassword);
	}
}
