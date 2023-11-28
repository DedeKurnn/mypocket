import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CashFlow } from "@prisma/client";
import { useQuery } from "react-query";
import { CashFlowContext } from "@/context/cashFlowContext";

import { StatGroup, useToast } from "@chakra-ui/react";
import DataStat from "@/components/data/DataStat";
import Chart from "@/components/data/Chart";
import Filter from "@/components/data/Filter";

const Overview = () => {
	const { isRefetch, setIsRefetch, userData } = useContext(CashFlowContext);
	const toast = useToast();

	const [transactionType, setTransactionType] = useState("ALL");
	const [filterByYear, setFilterByYear] = useState("");
	const [filterByMonth, setFilterByMonth] = useState("");

	const [pageNumber, setPageNumber] = useState(1);

	const isYear = filterByYear
		? `&year=${filterByYear}${
				filterByMonth ? `&month=${filterByMonth}` : ""
		  }`
		: "&year=2023";

	const {
		isLoading,
		isError,
		data: data,
		isFetching,
		refetch,
	} = useQuery(
		[
			"/api/cashflow",
			pageNumber,
			filterByYear,
			filterByMonth,
			transactionType,
		],
		() =>
			axios.get(
				`/api/cashflow?page=1${isYear}&transactionType=${transactionType}&userId=${userData?.id}`
			),
		{
			keepPreviousData: true,
			refetchInterval: 5000,
			refetchIntervalInBackground: true,
			enabled: false,
		}
	);

	useEffect(() => {
		if (isError) {
			toast({
				title: "An error occured",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	}, [isError]);

	useEffect(() => {
		if (isRefetch || userData?.id !== "") refetch();
		setIsRefetch(false);
	}, [
		userData,
		isRefetch,
		filterByYear,
		filterByMonth,
		transactionType,
		pageNumber,
	]);

	const expenseData =
		data &&
		data?.data.result.filter(
			(item: CashFlow) =>
				item.transactionType === "EXPENSE" && item.amount
		);

	const incomeData =
		data &&
		data?.data.result.filter(
			(item: CashFlow) => item.transactionType === "INCOME" && item.amount
		);

	const totalExpense =
		data &&
		expenseData.reduce((acc: number, item: CashFlow) => {
			return (acc += item.amount);
		}, 0);

	const totalIncome =
		incomeData &&
		incomeData.reduce((acc: number, item: CashFlow) => {
			return (acc += item.amount);
		}, 0);

	const totalDifference = totalIncome - totalExpense;

	return (
		<section className="p-4">
			<div className="flex flex-wrap w-full gap-2 p-4 bg-white rounded-lg shadow-sm dark:bg-container-dark sm:flex-nowrap">
				<Filter
					transactionType={transactionType}
					setTransactionType={setTransactionType}
					filterByYear={filterByYear}
					setFilterByYear={setFilterByYear}
					filterByMonth={filterByMonth}
					setFilterByMonth={setFilterByMonth}
					currentYear={true}
				/>
			</div>
			<StatGroup className="flex-col w-full gap-4 mt-4 lg:flex-row">
				<DataStat
					label="Total pemasukan"
					type="increase"
					number={totalIncome}
					arrow={false}
				/>
				<DataStat
					label="Total pengeluaran"
					type="decrease"
					number={totalExpense}
					arrow={false}
				/>
				<DataStat
					label="Bersih"
					type={totalDifference > 0 ? "increase" : "decrease"}
					number={totalDifference}
					arrow={true}
				/>
			</StatGroup>
			{expenseData !== undefined &&
				incomeData !== undefined &&
				!isLoading &&
				!isFetching && (
					<Chart expenseData={expenseData} incomeData={incomeData} />
				)}
		</section>
	);
};

export default Overview;
