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
		<Stat className="p-4 bg-white rounded-lg">
			<StatLabel>{label}</StatLabel>
			<StatNumber
				className={`${
					type === "decrease" ? "text-red-700" : "text-green-700"
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
