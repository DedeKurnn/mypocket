import { useEffect, useState, useContext } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { CashFlowContext } from "@/context/cashFlowContext";
import axios from "axios";

import { Button, useToast } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AddModal } from "@/components/modal/AddModal";
import DataTable from "@/components/data/DataTable";
import Filter from "@/components/data/Filter";

const CashFlow = () => {
	const { isRefetch, setIsRefetch, userData } = useContext(CashFlowContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

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
		data: data,
		refetch,
		isRefetching,
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
				`/api/cashflow?page=${pageNumber}${isYear}&transactionType=${transactionType}&take=${dataPerPage}&userId=${userData?.id}`
			),
		{
			keepPreviousData: true,
			refetchInterval: 10000,
			refetchIntervalInBackground: true,
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

	const handlePrev = () => {
		if (pageNumber === 1) return;
		setPageNumber(pageNumber - 1);
	};

	const handleNext = () => {
		if (pageNumber <= data?.data.totalPages) {
			setPageNumber(pageNumber + 1);
		}
	};

	return (
		<>
			<AddModal
				isOpen={isOpen}
				onClose={onClose}
				refetch={setIsRefetch}
			/>
			<section className="p-4">
				<div className="flex flex-wrap w-full gap-2 p-4 bg-white rounded-lg dark:bg-container-dark md:items-end sm:flex-nowrap">
					<div className="flex flex-wrap items-end w-full bg-white rounded-lg shadow-sm dark:bg-container-dark sm:flex-nowrap">
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
				<DataTable
					data={data?.data.result}
					loading={isLoading}
					isRefetching={isRefetching}
					setSkip={setPageNumber}
					setPrev={handlePrev}
					setNext={handleNext}
					pageNumber={pageNumber}
				/>
			</section>
		</>
	);
};

export default CashFlow;
