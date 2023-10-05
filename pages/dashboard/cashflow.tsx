import { useEffect, useState, useContext, ReactElement } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { CashFlowContext } from "@/context/cashFlowContext";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";

import { Button, Divider } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AddModal } from "@/components/modal/AddModal";
import DataTable from "@/components/data/DataTable";
import Filter from "@/components/data/Filter";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { NextPageWithLayout } from "../_app";

type Cookie = {
	email: string;
	id: string;
	name: string;
};

const CashFlow: NextPageWithLayout = () => {
	const router = useRouter();

	const { isRefetch, setIsRefetch, currentUserId } =
		useContext(CashFlowContext);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [transactionType, setTransactionType] = useState("ALL");
	const [filterByYear, setFilterByYear] = useState("");
	const [filterByMonth, setFilterByMonth] = useState("");

	const [pageNumber, setPageNumber] = useState(1);
	const dataPerPage = 10;

	const isYear = filterByYear
		? `&year=${filterByYear}${
				filterByMonth ? `&month=${filterByMonth}` : ""
		  }`
		: "";

	const {
		isLoading,
		isError,
		error,
		data: data,
		isFetching,
		isPreviousData,
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
				`/api/cashflow?page=${pageNumber}${isYear}&transactionType=${transactionType}&take=${dataPerPage}&userId=${currentUserId?.id}`
			),
		{
			keepPreviousData: true,
			enabled: false,
		}
	);

	useEffect(() => {
		if (isRefetch || currentUserId.id !== "") refetch();
		setIsRefetch(false);
	}, [
		currentUserId,
		isRefetch,
		filterByYear,
		filterByMonth,
		transactionType,
		pageNumber,
	]);

	const handlePrev = () => {
		if (pageNumber === 1) return;
		setPageNumber(pageNumber - 1);
	};

	const handleNext = () => {
		if (pageNumber >= data?.data.totalPages) {
			setPageNumber(pageNumber + 1);
		}
	};

	return (
		<>
			<AddModal isOpen={isOpen} onClose={onClose} refetch={refetch} />
			<section className="p-4">
				<div className="flex w-full flex-wrap sm:flex-nowrap gap-2 bg-white p-4 rounded-lg">
					<div className="flex w-full gap-2 sm:w-3/4">
						<Filter
							transactionType={transactionType}
							setTransactionType={setTransactionType}
							filterByYear={filterByYear}
							setFilterByYear={setFilterByYear}
							filterByMonth={filterByMonth}
							setFilterByMonth={setFilterByMonth}
						/>
					</div>
					<Button
						className="w-full sm:w-1/4"
						rightIcon={<PlusIcon />}
						colorScheme="teal"
						onClick={onOpen}
					>
						Add
					</Button>
				</div>
				{data && (
					<DataTable
						data={data?.data.result}
						loading={isLoading}
						setSkip={setPageNumber}
						setPrev={handlePrev}
						setNext={handleNext}
						pageNumber={pageNumber}
					/>
				)}
			</section>
		</>
	);
};

CashFlow.getLayout = (page: ReactElement) => {
	return <DashboardLayout>{page}</DashboardLayout>;
};

export default CashFlow;
