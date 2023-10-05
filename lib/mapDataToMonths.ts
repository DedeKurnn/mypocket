import { CashFlow } from "@prisma/client";

export default function mapDataToMonths(data: any) {
	const monthlyData = Array.from({ length: 12 }, () => 0);

	data.forEach((item: any) => {
		const date = new Date(item.date);
		const monthIndex = date.getMonth();
		monthlyData[monthIndex] += item.amount;
	});

	return monthlyData;
}
