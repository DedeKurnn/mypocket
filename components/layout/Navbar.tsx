import classNames from "classnames";
import { useRouter } from "next/router";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useState, useEffect } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

type Props = {
	/**
	 * Allows the parent component to modify the state when the
	 * menu button is clicked.
	 */
	onMenuButtonClick(): void;
};

const Navbar = (props: Props) => {
	const router = useRouter();
	const [isDarkMode, setIsDarkMode] = useState(false);

	const paths = router.pathname.split("/").slice(1);
	const currentPage =
		paths[paths.length - 1].charAt(0).toUpperCase() +
		paths[paths.length - 1].slice(1);

	useEffect(() => {
		if (isDarkMode) {
			document.querySelector("html")?.classList.add("dark");
		} else {
			document.querySelector("html")?.classList.remove("dark");
		}
	}, [isDarkMode]);

	return (
		<nav
			className={classNames({
				"bg-white dark:bg-container-dark text-slate-500 dark:text-slate-300 justify-center":
					true, // colors
				flex: true, // layout
				"w-screen md:w-full sticky z-10 px-4 shadow-sm h-[73px] top-0 ":
					true, //positioning & styling
			})}
		>
			<div className="flex flex-col justify-center text-sm">
				<Breadcrumb>
					{paths.map((path, index) => {
						const pathToCurrent = paths
							.slice(0, index + 1)
							.join("/");
						const href = `/${pathToCurrent}`;
						return (
							<BreadcrumbItem key={index}>
								<BreadcrumbLink href={href}>
									{path}
								</BreadcrumbLink>
							</BreadcrumbItem>
						);
					})}
				</Breadcrumb>
				<div className="text-lg font-bold">{currentPage}</div>
			</div>
			<div className="flex-grow"></div>
			<div className="flex items-center gap-4">
				<DarkModeSwitch
					checked={isDarkMode}
					onChange={() => setIsDarkMode(!isDarkMode)}
					sunColor="#3730a3"
					moonColor="#c7d2fe"
				/>
				<button className="md:hidden" onClick={props.onMenuButtonClick}>
					<Bars3Icon className="w-6 h-6" />
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
