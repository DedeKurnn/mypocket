import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import mapDataToMonths from "@/lib/mapDataToMonths";
import { CashFlow } from "@prisma/client";

type ChartProps = {
	expenseData: CashFlow[];
	incomeData: CashFlow[];
};

interface AxisFormatterContext {
	value: number;
	axis: {
		min: number;
		max: number;
	};
}

const Chart = ({ expenseData, incomeData }: ChartProps) => {
	const income = mapDataToMonths(incomeData);
	const expense = mapDataToMonths(expenseData);
	const difference = income.map(
		(incomeValue, index) => incomeValue - expense[index]
	);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	Highcharts.setOptions({
		lang: {
			numericSymbols: ["000", "Jt", "M", "T"],
		},
	});

	const options = {
		title: {
			text: "Data Tahunan",
		},
		chart: {
			type: "column",
			backgroundColor: "transparent",
			marker: {
				fillColor: "white",
				lineWidth: 2,
				radius: 3,
				lineColor: "#4E7DD9",
			},
			animation: {
				duration: 300,
			},
			zooming: {
				mouseWheel: false,
			},
			reflow: true,
		},
		xAxis: {
			categories: months,
			crosshair: true,
			accessibility: {
				description: "Countries",
			},
		},
		yAxis: {
			min: -500,
			title: {
				text: "Amount",
			},
			labels: {
				formatter: function (this: AxisFormatterContext): string {
					return Highcharts.numberFormat(this.value, 0);
				},
			},
			plotLines: [
				{
					value: 0,
					width: 1,
					color: "#aaa",
					zIndex: 10,
				},
			],
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0,
			},
		},
		series: [
			{
				name: "Pengeluaran",
				data: expense,
				color: "#FF6D60",
			},
			{
				name: "Pemasukan",
				data: income,
				color: "#00DFA2",
			},
			{
				name: "Bersih",
				data: difference,
				color: "#F0DE36",
			},
		],
		navigation: {
			enabled: false,
			buttonOptions: {
				enabled: false,
			},
		},
		rangeSelector: { enabled: false },
		tooltip: {
			animation: true,
			// xDateFormat: "",
			useHTML: true,
			backgroundColor: "rgba(255, 255, 255)",
			borderWidth: 1,
			borderRadius: 15,
			borderColor: "#B0C4DB",
			shadow: {
				offsetX: 1,
				offsetY: 2,
				width: 2,
				opacity: 0.05,
			},
			shape: "square",
			// split: true,
			hideDelay: 100,
			outside: false,
		},
	};

	return (
		<div className="my-4 p-4 bg-white rounded-lg">
			<HighchartsReact
				highcharts={Highcharts}
				options={options}
				constructorType="chart"
			/>
		</div>
	);
};

export default Chart;
