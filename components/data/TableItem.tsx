import { ICashFlow } from "@/lib/types/cash-flow";
import { CashFlowContext } from "@/context/cashFlowContext";
import { FC, SyntheticEvent, useContext } from "react";

import { Tr, Td, Button, useDisclosure } from "@chakra-ui/react";
import {
	ArrowUpIcon,
	ArrowDownIcon,
	TrashIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { UpdateModal } from "@/components/modal/UpdateModal";
import DeleteModal from "@/components/modal/DeleteModal";

const TableItem: FC<ICashFlow> = ({
	amount,
	transactionType,
	date,
	description,
	id,
}) => {
	const { handleDeleteData, userData } = useContext(CashFlowContext);

	const {
		isOpen: isOpenUpdateModal,
		onOpen: onOpenUpdateModal,
		onClose: onCloseUpdateModal,
	} = useDisclosure();
	const {
		isOpen: isOpenDeleteModal,
		onOpen: onOpenDeleteModal,
		onClose: onCloseDeleteModal,
	} = useDisclosure();

	const data = {
		amount: amount,
		transactionType: transactionType,
		date: date,
		description: description,
		id: id,
		userId: userData.id,
	};

	return (
		<>
			<UpdateModal
				onClose={onCloseUpdateModal}
				isOpen={isOpenUpdateModal}
				data={data}
			/>
			<DeleteModal
				onClose={onCloseDeleteModal}
				isOpen={isOpenDeleteModal}
				id={id}
				onDelete={(e: SyntheticEvent) => handleDeleteData(e, id)}
			/>
			<Tr className="border-b-[1px] dark:border-gray-700 border-gray-300">
				<Td className="dark:text-slate-300">
					Rp{amount.toLocaleString("id-ID")}
				</Td>
				<Td className="dark:text-slate-300 whitespace-normal">
					{description}
				</Td>
				<Td className="dark:text-slate-300">
					{date.toString().split("T")[0]}
				</Td>
				<Td className="dark:text-slate-300">
					<div
						className={`flex items-center justify-between mb-0 ${
							transactionType === "EXPENSE"
								? "text-red-500"
								: "text-green-500"
						}`}
					>
						<div>{transactionType}</div>
						{transactionType === "EXPENSE" ? (
							<ArrowUpIcon className="w-4 h-4" />
						) : (
							<ArrowDownIcon className="w-4 h-4" />
						)}
					</div>
				</Td>
				<Td>
					<div className="flex gap-2">
						<Button
							onClick={onOpenDeleteModal}
							className="dark:bg-slate-600 dark:text-white dark:hover:bg-slate-400"
						>
							<TrashIcon className="w-4 h-4" />
						</Button>
						<Button
							onClick={onOpenUpdateModal}
							className="dark:bg-slate-600 dark:text-white dark:hover:bg-slate-400"
						>
							<PencilSquareIcon className="w-4 h-4" />
						</Button>
					</div>
				</Td>
			</Tr>
		</>
	);
};

export default TableItem;
