// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CashFlow } from "@prisma/client";
import prisma from "@/lib/prisma";
import { verify } from "@/lib/jose";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await prisma.$connect();
	const { id, userIdQuery } = req.query;
	const { amount, description, date, transactionType, userId } =
		await req.body;

	const { AUTH_COOKIE } = req.cookies;

	if (!AUTH_COOKIE || !verify(AUTH_COOKIE)) {
		return res.json({
			error: "Unauthorized",
			status: 401,
		});
	}

	if (req.method === "GET") {
		const result = await prisma.cashFlow.findUnique({
			where: {
				id: Number(id),
				userId: userId!.toString(),
			},
		});

		return res.json(result);
	} else if (req.method === "PATCH") {
		const result: CashFlow = await prisma.cashFlow.update({
			where: {
				id: Number(id),
				userId: userId!.toString(),
			},
			data: {
				amount: amount,
				description: description,
				date: date,
				transactionType: transactionType,
				userId: userId,
			},
		});

		return res.json(result);
	} else if (req.method === "DELETE") {
		if (id) {
			const result = await prisma.cashFlow.delete({
				where: {
					id: Number(id),
					userId: userIdQuery!.toString(),
				},
			});

			return res.json({ message: "Successfull" });
		}
	}
}
