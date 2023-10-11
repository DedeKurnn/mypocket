import {
	ReactNode,
	createContext,
	SyntheticEvent,
	useState,
	useEffect,
} from "react";
import { CashFlowContextType } from "@/lib/types/cash-flow";
import axios from "@/lib/axios";

export const CashFlowContext = createContext<CashFlowContextType>({
	userData: {
		createdAt: "",
		email: "",
		id: "",
		name: "",
		updatedAt: "",
	},
	isDarkMode: false,
	setIsDarkMode: () => {},
	setUserData: () => {},
	isRefetch: false,
	setIsRefetch: () => {},
	handleCreateData: async (
		amount: number,
		description: string,
		category: string,
		date: Date
	) => {},

	handleDeleteData: async (e: SyntheticEvent, id: number) => {},

	handleEditData: async (
		e: SyntheticEvent,
		id: number,
		amount: number,
		description: string,
		category: string,
		date: Date,
		userId: string
	) => {},
});

export const CashFlowContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [isRefetch, setIsRefetch] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [userData, setUserData] = useState<CashFlowContextType["userData"]>({
		createdAt: "",
		email: "",
		id: "",
		name: "",
		updatedAt: "",
	});

	useEffect(() => {
		if (isDarkMode) {
			document.querySelector("html")?.classList.add("dark");
		} else {
			document.querySelector("html")?.classList.remove("dark");
		}
	}, [isDarkMode]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`/api/user`);
				setUserData(response.data);
			} catch (error: any) {
				if (error.name === "AbortError") {
					console.log("Request aborted");
				} else {
					console.error(error);
				}
			}
		};
		fetchData();
	}, []);

	const handleCreateData: CashFlowContextType["handleCreateData"] = async (
		amount: number,
		description: string,
		category: string,
		date: Date
	) => {
		const dateOffset = new Date(
			date.getTime() - date.getTimezoneOffset() * 60000
		);

		await axios.post(`/api/cashflow`, {
			amount: amount,
			description: description,
			date: dateOffset,
			transactionType: category,
			userId: userData.id,
		});

		setIsRefetch(true);
	};

	const handleDeleteData: CashFlowContextType["handleDeleteData"] = async (
		e: SyntheticEvent,
		id: number
	) => {
		e.preventDefault();
		await axios.delete(`/api/cashflow/${id}?userIdQuery=${userData.id}`);
		setIsRefetch(true);
	};

	const handleEditData: CashFlowContextType["handleEditData"] = async (
		e: SyntheticEvent,
		id: number,
		amount: number,
		description: string,
		category: string,
		date: Date,
		userId: string
	) => {
		e.preventDefault();
		const dateOffset = new Date(
			date.getTime() - date.getTimezoneOffset() * 60000
		);
		await axios.patch(`/api/cashflow/${id}`, {
			amount: amount,
			description: description,
			date: dateOffset,
			transactionType: category,
			userId: userId,
		});
		setIsRefetch(true);
	};

	return (
		<CashFlowContext.Provider
			value={{
				userData,
				isRefetch,
				setIsRefetch,
				handleCreateData,
				handleEditData,
				handleDeleteData,
				setUserData,
				isDarkMode,
				setIsDarkMode,
			}}
		>
			{children}
		</CashFlowContext.Provider>
	);
};
