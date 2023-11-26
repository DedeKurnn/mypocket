import Image from "next/image";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { CashFlowContext } from "@/context/cashFlowContext";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { AxiosError } from "axios";

import Icon from "@/public/icon-192x192.png";
import {
	Button,
	ButtonGroup,
	FormControl,
	FormErrorMessage,
	useToast,
	FormLabel,
	Input,
} from "@chakra-ui/react";
import EditableInputComponent from "@/components/form/EditableInput";
import useHandleError, { Error } from "@/lib/hooks/useHandleError";

type Payload = {
	email?: string;
	username?: string;
	currentPassword?: string;
	newPassword?: string;
};

const Profile = () => {
	const { userData } = useContext(CashFlowContext);
	const router = useRouter();
	const toast = useToast();
	const checkError = useHandleError();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();
	const [email, setEmail] = useState(userData.email);
	const [username, setUsername] = useState(userData.name);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true);

	useEffect(() => {
		if (newPassword !== confirmPassword) {
			setPasswordsMatch(false);
		} else {
			setPasswordsMatch(true);
		}
	}, [newPassword, confirmPassword]);

	useEffect(() => {
		setEmail(userData.email);
		setUsername(userData.name);
	}, [userData]);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/api/auth/logout");
			if (response.status !== 302) {
				return;
			}
		} catch {
			router.replace("/auth/signin");
		}
		setIsLoading(false);
	};

	const handleUserEdit = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			const payload: Payload = {
				email: email !== userData.email ? email : undefined,
				username: username ? username : undefined,
				currentPassword: currentPassword ? currentPassword : undefined,
				newPassword: passwordsMatch ? newPassword : undefined,
			};

			setIsLoading(true);
			const response = await axios.put("/api/user", payload);
			if (response.status === 200 && passwordsMatch && newPassword) {
				await handleLogout();
			}

			if (response.status === 200) {
				router.replace(router.asPath);
			}
		} catch (e) {
			const err = e as AxiosError;
			setError(checkError(err.response!.status!));
		}
		setIsLoading(false);
	};

	const handleCancel = (e: SyntheticEvent) => {
		e.preventDefault();

		setEmail(userData.email);
		setUsername(userData.name);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};

	console.log(error);

	return (
		<section className="flex flex-col items-center justify-center gap-4 p-8 m-4 bg-white rounded-lg shadow-md md:gap-8 md:items-start md:flex-row dark:bg-container-dark">
			<div className="">
				<Image
					src={Icon}
					alt="Profile Picture"
					className="object-cover w-48 rounded-full aspect-square"
				/>
			</div>
			<div className="w-full">
				<h2 className="mb-2 text-3xl font-semibold text-center md:ml-4 md:text-start md:mt-8 dark:text-slate-200">
					{userData.name}
				</h2>
				<form action="submit" className="flex flex-col mt-8">
					<h2 className="mb-2 ml-4 text-lg font-semibold dark:text-slate-300">
						Information
					</h2>
					<div className="flex flex-col gap-4 mb-4 lg:flex-row">
						<FormControl>
							<EditableInputComponent
								value={username}
								label="Name"
								onChange={setUsername}
							/>
						</FormControl>
						<FormControl isInvalid={error?.isBadRequest}>
							<EditableInputComponent
								value={email}
								label="Email"
								onChange={setEmail}
								type="email"
							/>
							{error?.isBadRequest && (
								<FormErrorMessage>
									Email is used in another account
								</FormErrorMessage>
							)}
						</FormControl>
					</div>
					<h2 className="mb-2 ml-4 text-lg font-semibold dark:text-slate-300">
						Change Password
					</h2>
					<div className="flex flex-col gap-4 mb-4 lg:flex-row">
						<FormControl isInvalid={error?.isUnauthorized}>
							<Input
								type="password"
								id="password"
								name="password"
								onChange={(e) =>
									setCurrentPassword(e.target.value)
								}
								placeholder="Current password"
								className="dark:border-slate-500 dark:text-slate-300"
							/>
							{error?.isUnauthorized && (
								<FormErrorMessage>
									Invalid password
								</FormErrorMessage>
							)}
						</FormControl>
						<FormControl>
							<Input
								type="password"
								id="password"
								name="password"
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="New password"
								className="dark:border-slate-500 dark:text-slate-300"
							/>
						</FormControl>
						<FormControl isInvalid={!passwordsMatch}>
							<Input
								type="password"
								id="password"
								name="password"
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								placeholder="Confirm password"
								className="dark:border-slate-500 dark:text-slate-300"
							/>
							{!passwordsMatch && (
								<FormErrorMessage>
									Password does not match
								</FormErrorMessage>
							)}
						</FormControl>
					</div>
					<ButtonGroup className="flex self-end gap-1">
						<Button
							className="mt-2 w-fit"
							colorScheme="red"
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button
							className="mt-2 w-fit"
							onClick={handleUserEdit}
							isDisabled={
								newPassword.length !== 0 && !passwordsMatch
							}
						>
							Save Changes
						</Button>
					</ButtonGroup>
				</form>
			</div>
		</section>
	);
};

export default Profile;
