import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/react";

type DataStatProps = {
	label: string;
	number: number;
	type: "increase" | "decrease";
	arrow: boolean;
};

const DataStat = ({ number, label, type, arrow = true }: DataStatProps) => {
	const formattedCurrency = new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(number);

	return (
		<Stat className="w-full p-4 bg-white rounded-lg shadow-sm dark:bg-container-dark">
			<StatLabel className="dark:text-slate-400">{label}</StatLabel>
			<StatNumber
				className={`${
					type === "decrease"
						? "text-red-700 dark:text-red-400"
						: "text-green-700 dark:text-green-400"
				}`}
			>
				<Skeleton isLoaded={!isNaN(number)}>
					{formattedCurrency}
				</Skeleton>
			</StatNumber>
		</Stat>
	);
};

export default DataStat;
