import {
	ChangeEvent,
	SyntheticEvent,
	memo,
	useState,
	useEffect,
	useContext,
	SetStateAction,
	Dispatch,
} from "react";

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

import { CashFlowContext } from "@/context/cashFlowContext";

type AddModalProps = {
	isOpen: boolean;
	onClose: () => void;
	refetch: Dispatch<SetStateAction<any>>;
};

function AddModalMemoized({ isOpen, onClose, refetch }: AddModalProps) {
	const { handleCreateData } = useContext(CashFlowContext);

	const [date, setDate] = useState(new Date());
	const [amount, setAmount] = useState(0);
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [isDisabled, setIsDisabled] = useState(true);
	const [isAmountRequired, setIsAmountRequired] = useState(false);
	const [isDescriptionRequired, setIsDescriptionRequired] = useState(false);
	const [isCategoryRequired, setIsCategoryRequired] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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

	const postData = async (e: SyntheticEvent) => {
		setIsLoading(true);
		e.preventDefault();
		const result = await handleCreateData(
			amount,
			description,
			category,
			date
		);

		if (result === 200) {
			refetch(true);
			onClose();
		}

		setDescription("");
		setAmount(0);
		setCategory("");
		setIsLoading(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent className="dark:bg-container-dark">
				<ModalHeader className="dark:text-slate-200">
					Add Cash Flow
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl isInvalid={isAmountRequired}>
						<FormLabel className="dark:text-slate-200">
							Amount
						</FormLabel>
						<CurrencyInput
							placeholder="Amount"
							defaultValue={0}
							decimalsLimit={2}
							onValueChange={(value) => {
								if (
									value !== null &&
									value !== undefined &&
									value !== ""
								) {
									setAmount(Number(value));
								} else {
									setAmount(0);
								}
							}}
							prefix="Rp"
							className={`border dark:border-slate-500 dark:bg-container-dark dark:text-white border-1 w-full h-10 rounded-md px-4 focus:outline-blue-500 ${
								isAmountRequired && "border-red-500 border-2"
							}`}
							onBlur={handleAmountBlur}
							required
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
							}}
							placeholder="Enter description"
							onBlur={handleDescriptionBlur}
							className="dark:text-white dark:border-slate-500"
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
								onChange={(e: ChangeEvent<HTMLSelectElement>) =>
									setCategory(e.target.value)
								}
								onBlur={handleCategoryBlur}
								className="dark:text-white dark:bg-container-dark dark:border-slate-500"
							>
								<option value="" className="dark:text-black">
									-Select category-
								</option>
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
							{!isCategoryRequired ? (
								<FormHelperText className="dark:text-slate-400">
									Select category
								</FormHelperText>
							) : (
								<FormErrorMessage className="dark:text-red-300">
									Category is required
								</FormErrorMessage>
							)}
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
						onClick={postData}
						isDisabled={isDisabled}
						isLoading={isLoading}
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

export const AddModal = memo(AddModalMemoized);
