import React from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { HomeIcon, WalletIcon, UserIcon } from "@heroicons/react/24/solid";

export type NavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
	disabled?: boolean;
};

export const defaultNavItems: NavItem[] = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: <HomeIcon className="w-4 h-4" />,
	},
	{
		label: "Cash Flow",
		href: "/dashboard/cashflow",
		icon: <ArrowsUpDownIcon className="w-4 h-4" />,
	},
	{
		label: "Budgeting (coming soon)",
		href: "/dashboard/budgeting",
		icon: <WalletIcon className="w-4 h-4" />,
		disabled: true,
	},
	{
		label: "Profile",
		href: "/dashboard/profile",
		icon: <UserIcon className="w-4 h-4" />,
	},
];
