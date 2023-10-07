import React from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { HomeIcon, WalletIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
// define a NavItem prop
export type NavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
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
		label: "Analytics",
		href: "/dashboard/analytics",
		icon: <ChartBarIcon className="w-4 h-4" />,
	},
	{
		label: "Budgeting (TBA)",
		href: "/dashboard/budgeting",
		icon: <WalletIcon className="w-4 h-4" />,
	},
];
