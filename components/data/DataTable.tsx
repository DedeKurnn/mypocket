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

type DataTableProps = {
	data: ICashFlow[];
	loading: boolean;
	pageNumber: number;
	setSkip: SetStateAction<any>;
	setNext: SetStateAction<any>;
	setPrev: SetStateAction<any>;
};

const DataTable = ({
	data,
	loading,
	pageNumber,
	setSkip,
	setNext,
	setPrev,
}: DataTableProps) => {
	return loading ? (
		<SkeletonTable />
	) : (
		<TableContainer className="my-4 bg-white py-4 rounded-lg">
			<Table variant="simple" size="md">
				<Thead>
					<Tr>
						<Th className="w-fit">Amount</Th>
						<Th className="w-full">Description</Th>
						<Th>Date</Th>
						<Th className="w-fit">Type</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
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
								<p className="flex justify-center py-4">
									No data
								</p>
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
			<div className="!flex content-center justify-center mt-4 gap-4">
				<Button onClick={setPrev}>
					<ChevronLeftIcon className="h-4 w-4" />
				</Button>
				<Input
					type="number"
					className="!w-12"
					value={pageNumber}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setSkip(Number(e.target.value))
					}
				/>
				<Button onClick={setNext}>
					<ChevronRightIcon className="h-4 w-4" />
				</Button>
			</div>
		</TableContainer>
	);
};

export default DataTable;
