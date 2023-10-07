import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { email, password, username } = req.body;
	if (!email || !password)
		return res
			.status(400)
			.json({ message: "Username and password are required." });

	// check for duplicate usernames in the db
	const duplicate = await prisma.user.findFirst({
		where: {
			email: email,
		},
	});
	if (duplicate) return res.status(409); //Conflict

	try {
		//encrypt the password
		const hashedpassword = await bcrypt.hash(password, 10);

		//create and store the new user
		const user = await prisma.user.create({
			data: {
				name: username,
				email: email,
				password: await bcrypt.hash(password, 10),
			},
		});

		res.status(201).json({ success: `New user ${user} created!` });
	} catch (err) {
		res.status(500).json({ message: err });
	}
}
