import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import axios from "@/lib/axios";
import { useRouter } from "next/router";

import { defaultNavItems, NavItem } from "./DefaultNavItems";
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { CashFlowContext } from "@/context/cashFlowContext";
import { Spinner } from "@chakra-ui/react";
import useGreetings from "@/lib/hooks/useGreetings";

type Props = {
	collapsed: boolean;
	navItems?: NavItem[];
	setCollapsed(collapsed: boolean): void;
	shown: boolean;
};

const Sidebar = ({
	collapsed,
	navItems = defaultNavItems,
	shown,
	setCollapsed,
}: Props) => {
	const router = useRouter();
	const imageLoader = ({ src }: { src: string }) => {
		return src;
	};

	const greeting = useGreetings();

	const [isLoading, setIsLoading] = useState(false);

	const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
	const { userData } = useContext(CashFlowContext);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`/api/auth/logout?id=${userData.id}`
			);

			console.log(response.status);
			if (response.status !== 302) {
				return;
			}
		} catch {
			router.replace("/auth/signin");
		}
		setIsLoading(false);
	};

	return (
		<aside
			className={classNames({
				"bg-white text-slate-700 fixed md:relative md:translate-x-0 z-20 dark:bg-container-dark":
					true,
				"transition-all duration-300 ease-in-out": true,
				"w-[300px] shrink-1": !collapsed,
				"w-16": collapsed,
				"-translate-x-full": !shown,
			})}
		>
			<div
				className={classNames({
					"flex flex-col justify-between h-screen inset-0 md:sticky top-0 ":
						true,
				})}
			>
				{/* logo and collapse button */}
				<div
					className={classNames({
						"flex items-center transition-none": true,
						"p-4 justify-between": !collapsed,
						"py-4 justify-center": collapsed,
					})}
				>
					{!collapsed && (
						<span className="whitespace-nowrap dark:text-slate-300">
							My Logo
						</span>
					)}
					<button
						className="grid w-10 h-10 rounded-full opacity-0 place-content-center hover:bg-indigo-400 md:opacity-100"
						onClick={() => setCollapsed(!collapsed)}
					>
						<Icon className="w-5 h-5 dark:text-slate-300" />
					</button>
				</div>
				<nav className="flex-grow">
					<ul
						className={classNames({
							"my-2 flex flex-col gap-2 items-stretch": true,
						})}
					>
						<div
							className={classNames({
								"grid place-content-stretch p-4 ": true,
							})}
						>
							<div className="flex items-center gap-4 overflow-hidden">
								<Image
									loader={imageLoader}
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									height={24}
									width={24}
									alt="profile image"
									className={classNames({
										"rounded-full ": true,
										"w-12 h-12": !collapsed,
									})}
								/>
								{!collapsed && (
									<div className="flex flex-col justify-center">
										<span className="-mb-1 dark:text-slate-400">
											{greeting}
										</span>
										<span className="my-0 font-semibold text-slate-700 dark:text-slate-300">
											{userData?.name}
										</span>
									</div>
								)}
							</div>
						</div>
						{navItems.map((item, index) => {
							return (
								<li
									key={index}
									className={classNames({
										"text-slate-700 dark:text-slate-300 dark:hover:bg-indigo-800 relative hover:bg-indigo-300 flex justify-center items-center":
											true, //colors
										"transition-colors duration-300": true, //animation
										"rounded-md mx-3 gap-4 ": !collapsed,
										"rounded-full mx-3 w-10 h-10 flex":
											collapsed,
										"bg-indigo-100 dark:bg-indigo-950":
											router.pathname === item.href,
										"!text-slate-400 dark:!text-slate-700 pointer-events-none":
											item.disabled,
									})}
								>
									<Link
										href={item.href}
										className={classNames({
											"flex items-center w-full h-full p-2":
												true,
											"gap-4": !collapsed,
											"justify-center": collapsed,
										})}
									>
										<div
											className={classNames({
												"text-indigo-700 dark:text-indigo-500":
													router.pathname ===
													item.href,
											})}
										>
											{item.icon}
										</div>
										{!collapsed && (
											<span className="whitespace-nowrap">
												{item.label}
											</span>
										)}
									</Link>
								</li>
							);
						})}
						<li
							className={classNames({
								"text-slate-700 dark:text-slate-300 hover:bg-indigo-300 dark:hover:bg-indigo-700 flex justify-center items-center hover:cursor-pointer":
									true, //colors
								"transition-colors duration-300": true, //animation
								"rounded-md mx-3 gap-4 ": !collapsed,
								"rounded-full mx-3 w-10 h-10 flex": collapsed,
							})}
							onClick={handleLogout}
						>
							<div
								className={classNames({
									"flex items-center w-full h-full p-2": true,
									"gap-4": !collapsed,
									"justify-center": collapsed,
								})}
							>
								<div>
									{isLoading ? (
										<Spinner className="w-4 h-4" />
									) : (
										<ArrowLeftOnRectangleIcon className="w-4 h-4" />
									)}
								</div>
								{!collapsed && (
									<span className="whitespace-nowrap">
										{!collapsed && "Log out"}
									</span>
								)}
							</div>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	);
};
export default Sidebar;
