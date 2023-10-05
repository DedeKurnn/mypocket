import classNames from "classnames";
import React, { PropsWithChildren, useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { CashFlowContextProvider } from "@/context/cashFlowContext";

const DashboardLayout = (props: PropsWithChildren) => {
	const [collapsed, setSidebarCollapsed] = useState(false);
	const [showSidebar, setShowSidebar] = useState(true);
	return (
		<CashFlowContextProvider>
			<div
				className={classNames({
					"flex bg-zinc-100 min-h-screen min-w-full": true,
					"grid-cols-sidebar": !collapsed,
					"grid-cols-sidebar-collapsed": collapsed,
					"transition-[grid-template-columns] duration-300 ease-in-out":
						true,
				})}
			>
				<Sidebar
					collapsed={collapsed}
					setCollapsed={setSidebarCollapsed}
					shown={showSidebar}
				/>
				<div className="w-full">
					<Navbar
						onMenuButtonClick={() =>
							setShowSidebar((prev) => !prev)
						}
					/>
					{props.children}
				</div>
			</div>
		</CashFlowContextProvider>
	);
};

export default DashboardLayout;
