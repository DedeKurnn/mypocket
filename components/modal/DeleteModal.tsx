// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { SyntheticEvent, useContext, useRef, useState } from "react";

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
} from "@chakra-ui/react";
import { CashFlowContext } from "@/context/cashFlowContext";

type DeleteModalProps = {
	onClose: () => void;
	isOpen: boolean;
	id: number;
};

const DeleteModal = ({ onClose, isOpen, id }: DeleteModalProps) => {
	const { handleDeleteData, setIsRefetch } = useContext(CashFlowContext);
	const cancelRef = useRef() as React.MutableRefObject<any>;
	const [isLoading, setIsLoading] = useState(false);

	const deleteData = async (e: SyntheticEvent) => {
		setIsLoading(true);
		e.preventDefault();
		const result = await handleDeleteData(e, id);

		if (result === 200) {
			setIsRefetch(true);
			onClose();
		}
		setIsLoading(false);
	};
	return (
		<>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent className="dark:bg-container-dark">
						<AlertDialogHeader
							fontSize="lg"
							fontWeight="bold"
							className="dark:text-slate-200"
						>
							Delete data
						</AlertDialogHeader>

						<AlertDialogBody className="dark:text-slate-300">
							Are you sure? You can't undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								onClick={onClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								onClick={deleteData}
								ml={3}
								isLoading={isLoading}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default DeleteModal;
