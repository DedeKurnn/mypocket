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
	const { handleDeleteData, currentUserId } = useContext(CashFlowContext);

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
		userId: currentUserId.id,
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
			<Tr>
				<Td>Rp{amount.toLocaleString("id-ID")}</Td>
				<Td>{description}</Td>
				<Td>{date.toString().split("T")[0]}</Td>
				<Td>
					<div
						className={`flex items-center justify-between mb-0 ${
							transactionType === "EXPENSE"
								? "text-red-500"
								: "text-green-500"
						}`}
					>
						<div>{transactionType}</div>
						{transactionType === "EXPENSE" ? (
							<ArrowUpIcon className="h-4 w-4" />
						) : (
							<ArrowDownIcon className="h-4 w-4" />
						)}
					</div>
				</Td>
				<Td>
					<div className="flex gap-2">
						<Button onClick={onOpenDeleteModal}>
							<TrashIcon className="h-4 w-4" />
						</Button>
						<Button onClick={onOpenUpdateModal}>
							<PencilSquareIcon className="h-4 w-4" />
						</Button>
					</div>
				</Td>
			</Tr>
		</>
	);
};

export default TableItem;
