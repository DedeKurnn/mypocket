import { SyntheticEvent, Dispatch, SetStateAction } from "react";
import { Session } from "next-auth";
import { JwtPayload } from "jsonwebtoken";

export type TransactionType = "INCOME" | "EXPENSE";

export interface ICashFlow {
	id: number;
	amount: number;
	description: string;
	transactionType: TransactionType;
	date: Date;
}

export type CashFlowContextType = {
	accessToken: string | null;
	userData: {
		createdAt: string;
		email: string;
		id: string;
		name: string;
		updatedAt: string;
	};
	setUserData: Dispatch<SetStateAction<any>>;
	isRefetch: boolean;
	setIsRefetch: Dispatch<SetStateAction<boolean>>;
	handleDeleteData: (e: SyntheticEvent, id: number) => void;
	handleEditData: (
		e: SyntheticEvent,
		id: number,
		amount: number,
		description: string,
		category: string,
		date: Date,
		userId: string
	) => void;
	handleCreateData: (
		amount: number,
		description: string,
		category: string,
		date: Date
	) => void;
};
