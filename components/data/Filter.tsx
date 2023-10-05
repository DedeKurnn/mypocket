import { ChangeEvent, Dispatch } from "react";

import { Select } from "@chakra-ui/react";

type Props = {
	transactionType: string;
	setTransactionType: Dispatch<string>;
	filterByYear: string;
	setFilterByYear: Dispatch<string>;
	filterByMonth: string;
	setFilterByMonth: Dispatch<string>;
};

const Filter = ({
	transactionType,
	setTransactionType,
	filterByYear,
	setFilterByYear,
	filterByMonth,
	setFilterByMonth,
}: Props) => {
	return (
		<>
			<Select
				className="w-1/2"
				value={transactionType}
				onChange={(e: ChangeEvent<HTMLSelectElement>) =>
					setTransactionType(e.target.value)
				}
			>
				<option value="ALL">All</option>
				<option value="EXPENSE">Expense</option>
				<option value="INCOME">Income</option>
			</Select>
			<Select
				className="w-1/2"
				value={filterByYear}
				onChange={(e: ChangeEvent<HTMLSelectElement>) =>
					setFilterByYear(e.target.value)
				}
			>
				<option value="">Semua</option>
				<option value="2023">2023</option>
				<option value="2022">2022</option>
				<option value="2021">2021</option>
				<option value="2020">2020</option>
			</Select>
			<Select
				className="w-1/2"
				value={filterByYear ? filterByMonth : ""}
				onChange={(e: ChangeEvent<HTMLSelectElement>) =>
					setFilterByMonth(e.target.value)
				}
				disabled={filterByYear === ""}
			>
				<option value="">Semua</option>
				<option value="01">January</option>
				<option value="02">February</option>
				<option value="03">March</option>
				<option value="04">April</option>
				<option value="05">May</option>
				<option value="06">June</option>
				<option value="07">July</option>
				<option value="08">August</option>
				<option value="09">September</option>
				<option value="10">October</option>
				<option value="11">November</option>
				<option value="12">December</option>
			</Select>
		</>
	);
};

export default Filter;
