// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { CashFlow } from "@prisma/client";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.NEXT_AUTH_SECRET_KEY;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await prisma.$connect();
	const body: CashFlow = await req.body;
	const {
		year,
		month,
		transactionType,
		page,
		totalTransaction,
		take,
		userId,
	} = req.query;
	const token = req.headers.authorization;
	console.log(token);
	if (!token || !verify(token, ACCESS_TOKEN_SECRET!)) {
		return res.json({
			error: "Unauthorized",
			status: 401,
		});
	}

	if (req.method === "POST") {
		const result: CashFlow = await prisma.cashFlow.create({
			data: {
				amount: body.amount,
				description: body.description,
				date: body.date,
				transactionType: body.transactionType,
				userId: body.userId,
			},
		});
		return res.json(result);
	} else if (req.method === "GET" && totalTransaction) {
		if (totalTransaction === "true") {
			const result: [{ totalExpense: number; totalIncome: number }] =
				await prisma.$queryRaw`
    SELECT SUM(CASE WHEN transactionType = 'EXPENSE' THEN amount ELSE 0 END) as totalExpense, SUM(CASE WHEN transactionType = 'INCOME' THEN amount ELSE 0 END) as totalIncome FROM cashflow
  `;
			return res.json(result);
		}
	} else if (req.method === "GET") {
		const result = await prisma.cashFlow.findMany({
			...(take
				? {
						skip:
							Number(page) > 1
								? Number(page) * Number(take) - Number(take)
								: 0,
						take: Number(take),
				  }
				: {}),
			orderBy: {
				date: "desc",
			},
			where: {
				...(year ?? month
					? {
							date: {
								gte: new Date(
									`${year}-${month || "01"}-01T00:00:00.000Z`
								),
								lte: new Date(
									`${year}-${month || "12"}-31T23:59:59.999Z`
								),
							},
					  }
					: {}),
				...(transactionType === "INCOME"
					? { transactionType: "INCOME" }
					: transactionType === "EXPENSE"
					? { transactionType: "EXPENSE" }
					: transactionType === "ALL" && {}),
				userId: userId?.toString(),
			},
		});

		const totalPages: number = await prisma.$queryRaw`
SELECT CEIL(COUNT(*) / ${Number(take)}) as totalPages FROM cashflow
`;

		return res.json({
			result: result,
			totalPages,
		});
	}
}
