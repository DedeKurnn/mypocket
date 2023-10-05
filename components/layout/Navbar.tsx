import classNames from "classnames";
import { useRouter } from "next/router";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
	/**
	 * Allows the parent component to modify the state when the
	 * menu button is clicked.
	 */
	onMenuButtonClick(): void;
};

const Navbar = (props: Props) => {
	const router = useRouter();
	const paths = router.pathname.split("/").slice(1);
	const currentPage =
		paths[paths.length - 1].charAt(0).toUpperCase() +
		paths[paths.length - 1].slice(1);

	return (
		<nav
			className={classNames({
				"bg-white text-zinc-500 justify-center": true, // colors
				flex: true, // layout
				"w-screen md:w-full sticky z-10 px-4 shadow-sm h-[73px] top-0 ":
					true, //positioning & styling
			})}
		>
			<div className="flex flex-col justify-center text-sm">
				<div className="flex gap-2">
					<span>Pages /</span>
					{paths.map((path, index) => {
						const pathToCurrent = paths
							.slice(0, index + 1)
							.join("/");
						const href = `/${pathToCurrent}`;
						return (
							<div key={index}>
								{index > 0 && <span className="mr-1">/</span>}
								<Link href={href}>{path}</Link>
							</div>
						);
					})}
				</div>
				<div className="font-bold text-lg">{currentPage}</div>
			</div>
			<div className="flex-grow"></div>
			<button className="md:hidden" onClick={props.onMenuButtonClick}>
				<Bars3Icon className="h-6 w-6" />
			</button>
		</nav>
	);
};

export default Navbar;
