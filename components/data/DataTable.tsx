import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Button,
	Input,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { ChangeEvent, SetStateAction, memo } from "react";
import SkeletonTable from "@/components/data/SkeletonTable";
import TableItem from "@/components/data/TableItem";
import { ICashFlow } from "@/lib/types/cash-flow";
import SkeletonTableItem from "./SkeletonTableItem";

type DataTableProps = {
	data: ICashFlow[];
	loading: boolean;
	pageNumber: number;
	setSkip: SetStateAction<any>;
	setNext: SetStateAction<any>;
	setPrev: SetStateAction<any>;
	isRefetching: boolean;
};

const DataTable = ({
	data,
	loading,
	pageNumber,
	setSkip,
	setNext,
	setPrev,
	isRefetching,
}: DataTableProps) => {
	return loading ? (
		<SkeletonTable />
	) : (
		<TableContainer className="my-4 bg-white dark:bg-container-dark py-4 rounded-lg">
			<Table variant="unstyled" size="md">
				<Thead>
					<Tr>
						<Th className="w-fit dark:text-slate-400">Amount</Th>
						<Th className="w-full dark:text-slate-400">
							Description
						</Th>
						<Th className="dark:text-slate-400">Date</Th>
						<Th className="w-fit dark:text-slate-400">Type</Th>
						<Th className="dark:text-slate-400">Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{isRefetching && <SkeletonTableItem />}
					{data !== null &&
					data !== undefined &&
					data.length !== 0 ? (
						data.map((item) => (
							<TableItem
								key={item.id}
								id={item.id}
								amount={item.amount}
								description={item.description!}
								date={item.date}
								transactionType={item.transactionType!}
							/>
						))
					) : (
						<Tr>
							<Td colSpan={5}>
								<p className="flex justify-center py-4 dark:text-slate-400">
									No data
								</p>
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
			<div className="!flex content-center justify-center mt-4 gap-4">
				<Button onClick={setPrev} className="dark:bg-slate-600">
					<ChevronLeftIcon className="h-4 w-4" />
				</Button>
				<Input
					type="number"
					className="!w-12 dark:text-white dark:border-slate-400"
					value={pageNumber}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setSkip(Number(e.target.value))
					}
				/>
				<Button onClick={setNext} className="dark:bg-slate-600">
					<ChevronRightIcon className="h-4 w-4" />
				</Button>
			</div>
		</TableContainer>
	);
};

export default DataTable;
