import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import mapDataToMonths from "@/lib/mapDataToMonths";
import { CashFlow } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { CashFlowContext } from "@/context/cashFlowContext";

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
	const [theme, setTheme] = useState("light");
	const { isDarkMode } = useContext(CashFlowContext);

	const difference = income.map(
		(incomeValue, index) => incomeValue - expense[index]
	);
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const [options, setOptions]: any = useState({
		title: {
			text: "",
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
			labels: {
				style: {
					color: "#868686",
				},
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
				style: {
					color: "#868686",
				},
			},
			plotLines: [
				{
					value: 0,
					width: 1,
					color: "#0a0a",
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
	});

	useEffect(() => {
		setOptions((prevOptions: any) => ({
			...prevOptions,
			legend: {
				itemStyle: { color: isDarkMode ? "#aaa" : "#000" },
			},
			yAxis: {
				...prevOptions.yAxis,
				labels: {
					...prevOptions.yAxis.labels,
					style: {
						color: isDarkMode ? "#aaa" : "#000", // Change label color based on isDarkMode
					},
				},
			},
			xAxis: {
				...prevOptions.xAxis,
				labels: {
					...prevOptions.xAxis.labels,
					style: {
						color: isDarkMode ? "#aaa" : "#000", // Change label color based on isDarkMode
					},
				},
				lineColor: isDarkMode ? "#aaa" : "#000",
			},
		}));
	}, [isDarkMode]);

	return (
		<div
			className="grid w-full grid-cols-1 my-4 bg-white rounded-lg shadow-sm highcharts-dark dark:bg-container-dark place-content-center w-p-4"
			id="highchart"
		>
			<h2 className="my-8 ml-8 font-semibold text-20xl dark:text-slate-300">
				Yearly Data
			</h2>
			<div className="px-4">
				<HighchartsReact
					highcharts={Highcharts}
					options={options}
					constructorType="chart"
				/>
			</div>
		</div>
	);
};

export default Chart;
