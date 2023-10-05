import {
	ReactNode,
	createContext,
	SyntheticEvent,
	useState,
	useEffect,
} from "react";
import axios from "axios";
import { CashFlowContextType } from "@/lib/types/cash-flow";
import jwt, { JwtPayload } from "jsonwebtoken";
import getTokenFromCookie from "@/lib/getTokenFromCookie";
import getUserData from "@/lib/getUserData";

export const CashFlowContext = createContext<CashFlowContextType>({
	currentUserId: {
		id: "",
	},
	userData: {
		createdAt: "",
		email: "",
		id: "",
		name: "",
		updatedAt: "",
	},
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
	const [currentUserId, setCurrentUserId] = useState<JwtPayload>({
		id: "",
	});
	const [userData, setUserData] = useState<CashFlowContextType["userData"]>({
		createdAt: "",
		email: "",
		id: "",
		name: "",
		updatedAt: "",
	});

	useEffect(() => {
		const isJwtPayload = (data: any): data is JwtPayload => {
			return typeof data === "object" && "id" in data;
		};
		// Get the token from your storage (cookie, localStorage, etc.)
		const authToken = getTokenFromCookie("AUTH_COOKIE");
		if (authToken) {
			const decodedToken = jwt.decode(authToken);
			if (isJwtPayload(decodedToken)) {
				setCurrentUserId(decodedToken);
			}
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getUserData(currentUserId.id);
				setUserData(response);
				console.log(userData);
			} catch (error: any) {
				if (error.name === "AbortError") {
					console.log("Request aborted");
				} else {
					console.error(error);
				}
			}
		};

		if (currentUserId.id) {
			fetchData();
		}
	}, [currentUserId]);

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
			userId: currentUserId.id,
		});

		setIsRefetch(true);
	};

	const handleDeleteData: CashFlowContextType["handleDeleteData"] = async (
		e: SyntheticEvent,
		id: number
	) => {
		e.preventDefault();
		await axios.delete(
			`/api/cashflow/${id}?userIdQuery=${currentUserId.id}`
		);
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
				currentUserId,
				isRefetch,
				setIsRefetch,
				handleCreateData,
				handleEditData,
				handleDeleteData,
				userData,
			}}
		>
			{children}
		</CashFlowContext.Provider>
	);
};
