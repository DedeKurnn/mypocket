import { ChangeEvent, Dispatch } from "react";

import { Select, FormLabel } from "@chakra-ui/react";

type Props = {
	transactionType: string;
	setTransactionType: Dispatch<string>;
	filterByYear: string;
	setFilterByYear: Dispatch<string>;
	filterByMonth: string;
	setFilterByMonth: Dispatch<string>;
	currentYear?: boolean;
};

const Filter = ({
	transactionType,
	setTransactionType,
	filterByYear,
	setFilterByYear,
	filterByMonth,
	setFilterByMonth,
	currentYear = false,
}: Props) => {
	return (
		<>
			<div className="w-full sm:w-1/2">
				<FormLabel fontSize={14} className="text-slate-400">
					Transaction type
				</FormLabel>
				<Select
					className="dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300"
					value={transactionType}
					onChange={(e: ChangeEvent<HTMLSelectElement>) =>
						setTransactionType(e.target.value)
					}
				>
					<option className="dark:text-slate-700" value="ALL">
						All
					</option>
					<option className="dark:text-slate-700" value="EXPENSE">
						Expense
					</option>
					<option className="dark:text-slate-700" value="INCOME">
						Income
					</option>
				</Select>
			</div>
			<div className="w-full sm:w-1/2">
				<FormLabel fontSize={14} className="text-slate-400">
					Year
				</FormLabel>
				<Select
					className="dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300"
					value={filterByYear}
					onChange={(e: ChangeEvent<HTMLSelectElement>) =>
						setFilterByYear(e.target.value)
					}
				>
					<option className="dark:text-slate-700" value="">
						{currentYear ? "This year" : "All"}
					</option>
					<option className="dark:text-slate-700" value="2023">
						2023
					</option>
					<option className="dark:text-slate-700" value="2022">
						2022
					</option>
					<option className="dark:text-slate-700" value="2021">
						2021
					</option>
					<option className="dark:text-slate-700" value="2020">
						2020
					</option>
				</Select>
			</div>
			<div className="w-full sm:w-1/2">
				<FormLabel fontSize={14} className="text-slate-400">
					Month
				</FormLabel>
				<Select
					className="dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300"
					value={filterByYear ? filterByMonth : ""}
					onChange={(e: ChangeEvent<HTMLSelectElement>) =>
						setFilterByMonth(e.target.value)
					}
					disabled={filterByYear === ""}
				>
					<option className="dark:text-slate-700" value="">
						All
					</option>
					<option className="dark:text-slate-700" value="01">
						January
					</option>
					<option className="dark:text-slate-700" value="02">
						February
					</option>
					<option className="dark:text-slate-700" value="03">
						March
					</option>
					<option className="dark:text-slate-700" value="04">
						April
					</option>
					<option className="dark:text-slate-700" value="05">
						May
					</option>
					<option className="dark:text-slate-700" value="06">
						June
					</option>
					<option className="dark:text-slate-700" value="07">
						July
					</option>
					<option className="dark:text-slate-700" value="08">
						August
					</option>
					<option className="dark:text-slate-700" value="09">
						September
					</option>
					<option className="dark:text-slate-700" value="10">
						October
					</option>
					<option className="dark:text-slate-700" value="11">
						November
					</option>
					<option className="dark:text-slate-700" value="12">
						December
					</option>
				</Select>
			</div>
		</>
	);
};

export default Filter;
