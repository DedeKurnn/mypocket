// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { SyntheticEvent, useRef } from "react";

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
} from "@chakra-ui/react";

type DeleteModalProps = {
	onClose: () => void;
	isOpen: boolean;
	id: number;
	onDelete: (e: SyntheticEvent) => void;
};

const DeleteModal = ({ onClose, isOpen, onDelete }: DeleteModalProps) => {
	const cancelRef = useRef();
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
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={onDelete} ml={3}>
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
