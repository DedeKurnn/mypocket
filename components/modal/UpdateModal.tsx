import {
	ChangeEvent,
	memo,
	useState,
	useEffect,
	useContext,
	useRef,
} from "react";
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
		setIsAmountRequired(
			amount === 0 || amount === undefined || amount === null
		);
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
			<ModalContent className="dark:bg-container-dark">
				<ModalHeader className="dark:text-slate-200">
					Edit Cash Flow
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl isInvalid={isAmountRequired}>
						<FormLabel className="dark:text-slate-200">
							Amount
						</FormLabel>
						<CurrencyInput
							placeholder="Amount"
							defaultValue={amount}
							decimalsLimit={2}
							onValueChange={(value) => {
								setAmount(Number(value));
								handleAmountBlur();
							}}
							prefix="Rp"
							className={`border dark:border-slate-500 dark:bg-container-dark dark:text-white border-1 w-full h-10 rounded-md px-4 focus:outline-blue-500 ${
								isAmountRequired && "border-red-500 border-2"
							}`}
							required={true}
						/>
						{!isAmountRequired ? (
							<FormHelperText className="dark:text-slate-400">
								Enter the amount you want to track.
							</FormHelperText>
						) : (
							<FormErrorMessage className="dark:text-red-300">
								Amount is required.
							</FormErrorMessage>
						)}
					</FormControl>

					<FormControl mt={4} isInvalid={isDescriptionRequired}>
						<FormLabel className="dark:text-slate-200">
							Description
						</FormLabel>
						<Textarea
							value={description}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
								setDescription(e.target.value);
								handleDescriptionBlur();
							}}
							placeholder="Enter description"
							className="dark:border-slate-500 dark:bg-container-dark dark:text-white"
						/>
						{!isDescriptionRequired ? (
							<FormHelperText className="dark:text-slate-400">
								Enter the description.
							</FormHelperText>
						) : (
							<FormErrorMessage className="dark:text-red-300">
								Description is required.
							</FormErrorMessage>
						)}
					</FormControl>

					<Stack direction="row" spacing={4}>
						<FormControl mt={4} isInvalid={isCategoryRequired}>
							<FormLabel className="dark:text-slate-200">
								Category
							</FormLabel>
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
									handleCategoryBlur();
								}}
								className="dark:text-white dark:bg-container-dark dark:border-slate-500"
							>
								<option
									value="EXPENSE"
									className="dark:text-black"
								>
									Expense
								</option>
								<option
									value="INCOME"
									className="dark:text-black"
								>
									Income
								</option>
							</Select>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel className="dark:text-slate-200">
								Date
							</FormLabel>
							<div className="rounded-lg dark:bg-white">
								<SingleDatepicker
									name="date-input"
									date={date}
									onDateChange={setDate}
								/>
							</div>
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
