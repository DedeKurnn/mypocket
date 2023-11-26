import { Td, Tr, Button, SkeletonText } from "@chakra-ui/react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const SkeletonTableItem = () => {
	return (
		<Tr className="border-b-[1px] dark:border-gray-700 border-gray-300">
			<Td className="dark:text-slate-300">
				<SkeletonText skeletonHeight="4" />
			</Td>
			<Td className="dark:text-slate-300 whitespace-normal">
				<SkeletonText skeletonHeight="4" />
			</Td>
			<Td className="dark:text-slate-300">
				<SkeletonText skeletonHeight="4" />
			</Td>
			<Td className="dark:text-slate-300">
				<SkeletonText skeletonHeight="4" />
			</Td>
			<Td>
				<div className="flex gap-2">
					<Button className="dark:bg-slate-600 dark:text-white dark:hover:bg-slate-400">
						<TrashIcon className="w-4 h-4" />
					</Button>
					<Button className="dark:bg-slate-600 dark:text-white dark:hover:bg-slate-400">
						<PencilSquareIcon className="w-4 h-4" />
					</Button>
				</div>
			</Td>
		</Tr>
	);
};

export default SkeletonTableItem;
