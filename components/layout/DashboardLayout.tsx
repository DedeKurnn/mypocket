import classNames from "classnames";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Inter } from "next/font/google";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const inter = Inter({ subsets: ["latin"] });

const DashboardLayout = (props: PropsWithChildren) => {
	const [collapsed, setSidebarCollapsed] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);

	useEffect(() => {
		if (window.innerWidth > 768) {
			setShowSidebar(true);
		}
	}, []);

	return (
		<div
			className={classNames({
				"grid bg-zinc-100 min-h-screen min-w-full": true,
				"md:grid-cols-sidebar grid-cols-1": !collapsed,
				"md:grid-cols-sidebar-collapsed grid-cols-1": collapsed,
				"transition-[grid-template-columns] duration-300 ease-in-out":
					true,
				inter,
			})}
		>
			<Sidebar
				collapsed={collapsed}
				setCollapsed={setSidebarCollapsed}
				shown={showSidebar}
			/>
			<div className="dark:bg-main-dark">
				<Navbar
					onMenuButtonClick={() => setShowSidebar((prev) => !prev)}
				/>
				{props.children}
			</div>
		</div>
	);
};

export default DashboardLayout;
