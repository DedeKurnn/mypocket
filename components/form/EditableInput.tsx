import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
	Editable,
	EditableInput,
	EditablePreview,
	FormControl,
	useEditableControls,
	ButtonGroup,
	IconButton,
	Tooltip,
	Input,
	useColorModeValue,
	FormLabel,
} from "@chakra-ui/react";
import {
	CheckIcon,
	XMarkIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";

type EditableProps = {
	value: string;
	label?: string;
	onChange: Dispatch<SetStateAction<any>>;
	placeholder?: string;
	type?: string;
};

const EditableInputComponent = ({
	value,
	label,
	onChange,
	placeholder,
	type = "text",
}: EditableProps) => {
	const [inputValue, setInputValue] = useState(value);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	function EditableControls() {
		const {
			isEditing,
			getSubmitButtonProps,
			getCancelButtonProps,
			getEditButtonProps,
		} = useEditableControls();

		return isEditing ? (
			<ButtonGroup
				className="items-center justify-center ml-2 mr-1"
				size="sm"
			>
				<IconButton
					className="dark:bg-slate-600 dark:text-white dark:hover:bg-slate-400"
					aria-label="Save changes"
					icon={<CheckIcon className="w-4 h-4" />}
					{...getSubmitButtonProps()}
				/>
				<IconButton
					className="dark:bg-slate-600 dark:text-white dark:hover:bg-slate-400"
					aria-label="Cancel changes"
					icon={<XMarkIcon className="w-4 h-4" />}
					{...getCancelButtonProps()}
					onClick={() => setInputValue(value)}
				/>
			</ButtonGroup>
		) : (
			<div className="items-center justify-center mr-1">
				<IconButton
					className="dark:bg-slate-600 dark:text-white dark:hover:bg-slate-400"
					aria-label="Edit button"
					size="sm"
					icon={<PencilSquareIcon className="w-4 h-4" />}
					{...getEditButtonProps()}
				/>
			</div>
		);
	}

	return (
		<FormControl className="w-full mb-2">
			<FormLabel className="ml-4 dark:text-slate-400">{label}</FormLabel>
			<Editable
				className="flex items-center justify-between w-full border rounded-md dark:text-slate-300 dark:border-slate-500"
				value={inputValue}
				defaultValue={value}
				isPreviewFocusable={true}
				selectAllOnFocus={false}
				placeholder={placeholder}
				onSubmit={() => onChange(inputValue)}
			>
				<Tooltip label="Click to edit" shouldWrapChildren={true}>
					<EditablePreview py={2} px={4} />
				</Tooltip>
				<Input
					py={2}
					px={4}
					as={EditableInput}
					value={inputValue}
					type={type}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<EditableControls />
			</Editable>
		</FormControl>
	);
};

export default EditableInputComponent;
