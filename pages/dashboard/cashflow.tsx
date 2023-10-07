import { useEffect, useState, useContext, ReactElement } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { CashFlowContext } from "@/context/cashFlowContext";
import useAxiosPrivate from "@/lib/hooks/useAxiosPrivate";

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
	const axiosPrivate = useAxiosPrivate();

	const { isRefetch, setIsRefetch, userData } = useContext(CashFlowContext);
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
			axiosPrivate.get(
				`/api/cashflow?page=${pageNumber}${isYear}&transactionType=${transactionType}&take=${dataPerPage}&userId=${userData?.id}`
			),
		{
			keepPreviousData: true,
			enabled: false,
		}
	);

	useEffect(() => {
		if (isRefetch || userData.id !== "") refetch();
		setIsRefetch(false);
	}, [
		userData,
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
				<div className="flex flex-wrap w-full gap-2 p-4 bg-white dark:bg-container-dark rounded-lg md:items-end sm:flex-nowrap">
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
						New entry
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
