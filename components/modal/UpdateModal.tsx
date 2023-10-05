import { ChangeEvent, memo, useState, useEffect, useContext } from "react";
import { CashFlowContext } from "@/context/cashFlowContext";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	Button,
	FormLabel,
	Textarea,
	Select,
	Stack,
	FormHelperText,
	FormErrorMessage,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import CurrencyInput from "react-currency-input-field";

type UpdateModalProps = {
	isOpen: boolean;
	onClose: () => void;
	data: any;
};

function UpdateModalMemoized({ isOpen, onClose, data }: UpdateModalProps) {
	const { handleEditData } = useContext(CashFlowContext);

	const [date, setDate] = useState(new Date(data.date));
	const [amount, setAmount] = useState(data.amount);
	const [description, setDescription] = useState(data.description!);
	const [category, setCategory] = useState<"INCOME" | "EXPENSE">(
		data.transactionType
	);

	const [isDisabled, setIsDisabled] = useState(true);
	const [isAmountRequired, setIsAmountRequired] = useState(false);
	const [isDescriptionRequired, setIsDescriptionRequired] = useState(false);
	const [isCategoryRequired, setIsCategoryRequired] = useState(false);

	const handleAmountBlur = () => {
		setIsAmountRequired(amount === 0);
	};

	const handleDescriptionBlur = () => {
		setIsDescriptionRequired(description.trim().length === 0);
	};

	const handleCategoryBlur = () => {
		setIsCategoryRequired(category.trim().length === 0);
	};

	useEffect(() => {
		if (isAmountRequired || isDescriptionRequired || isCategoryRequired) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [isAmountRequired, isDescriptionRequired, isCategoryRequired]);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Cash Flow</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl isInvalid={isAmountRequired}>
						<FormLabel>Amount</FormLabel>
						<CurrencyInput
							placeholder="Amount"
							defaultValue={amount}
							decimalsLimit={2}
							onValueChange={(value) => {
								setAmount(Number(value));
							}}
							prefix="Rp"
							className={`border border-1 w-full h-10 rounded-md px-4 focus:outline-blue-500 ${
								isAmountRequired && "border-red-500 border-2"
							}`}
							onBlur={handleAmountBlur}
						/>
						{!isAmountRequired ? (
							<FormHelperText>
								Enter the amount you want to track.
							</FormHelperText>
						) : (
							<FormErrorMessage>
								Amount is required.
							</FormErrorMessage>
						)}
					</FormControl>

					<FormControl mt={4} isInvalid={isDescriptionRequired}>
						<FormLabel>Description</FormLabel>
						<Textarea
							value={description}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
								setDescription(e.target.value);
							}}
							placeholder="Enter description"
							onBlur={handleDescriptionBlur}
						/>
						{!isDescriptionRequired ? (
							<FormHelperText>
								Enter the description.
							</FormHelperText>
						) : (
							<FormErrorMessage>
								Description is required.
							</FormErrorMessage>
						)}
					</FormControl>

					<Stack direction="row" spacing={4}>
						<FormControl mt={4} isInvalid={isCategoryRequired}>
							<FormLabel>Category</FormLabel>
							<Select
								value={category}
								onChange={(
									e: ChangeEvent<HTMLSelectElement>
								) => {
									const selectedCategory:
										| "EXPENSE"
										| "INCOME" = e.target.value as
										| "EXPENSE"
										| "INCOME";
									setCategory(selectedCategory);
								}}
								onBlur={handleCategoryBlur}
							>
								<option value="EXPENSE">Expense</option>
								<option value="INCOME">Income</option>
							</Select>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Date</FormLabel>
							<SingleDatepicker
								name="date-input"
								date={date}
								onDateChange={setDate}
							/>
						</FormControl>
					</Stack>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={(e) => {
							handleEditData(
								e,
								data.id,
								amount,
								description,
								category,
								date,
								data.userId
							);
							onClose();
						}}
						isDisabled={isDisabled}
						loadingText="Saving"
					>
						Save
					</Button>
					<Button onClick={onClose}>Cancel</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export const UpdateModal = memo(UpdateModalMemoized);
