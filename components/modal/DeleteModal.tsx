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
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete data
						</AlertDialogHeader>

						<AlertDialogBody>
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
