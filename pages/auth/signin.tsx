import axios, { AxiosError } from "axios";
import { useState } from "react";
import Link from "next/link";
import useHandleError, { Error } from "@/lib/hooks/useHandleError";

import {
	Input,
	FormControl,
	FormLabel,
	Button,
	Checkbox,
	FormErrorMessage,
	useToast,
} from "@chakra-ui/react";

const SignIn = () => {
	const toast = useToast();
	const checkError = useHandleError();
	const [isRemember, setIsRemember] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		setIsLoading(true);
		event.preventDefault();

		const payload = {
			email: event.currentTarget.email.value,
			password: event.currentTarget.password.value,
			remember: isRemember,
		};

		try {
			const response = await axios.post("/api/auth/login", payload);
			if (response.status === 200) {
				window.location.href = "/dashboard";
			}
		} catch (e) {
			const err = e as AxiosError;
			setError(checkError(err.response?.status!));

			if (error?.isInternalError) {
				toast({
					title: "Something's not right",
					description: err.message,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		}
		setIsLoading(false);
	};

	return (
		<main
			className="relative bg-center bg-no-repeat bg-cover"
			style={{
				backgroundImage:
					"url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80)",
			}}
		>
			<div className="items-center justify-center min-h-screen mx-0 sm:flex sm:flex-row">
				<form
					onSubmit={handleSubmit}
					className="z-20 flex flex-col gap-2 p-8 bg-white rounded-lg shadow-lg max-w-48 h-fit"
				>
					<div className="mb-4">
						<h1 className="mb-2">Sign In</h1>
						<p>Please sign in to your account</p>
					</div>
					<FormControl isInvalid={error?.isNotFound}>
						<FormLabel>Email</FormLabel>
						<Input type="email" id="email" name="email" required />
						{error?.isNotFound && (
							<FormErrorMessage>
								User not found or email is invalid
							</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={error?.isUnauthorized}>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							id="password"
							name="password"
							required
						/>
						{error?.isUnauthorized && (
							<FormErrorMessage>
								Password is invalid
							</FormErrorMessage>
						)}
					</FormControl>
					<Checkbox
						className="mb-4"
						id="rememberMe"
						isChecked={isRemember}
						onChange={() => setIsRemember(!isRemember)}
					>
						Trust this device
					</Checkbox>
					<Button
						type="submit"
						variant="solid"
						colorScheme="teal"
						isLoading={isLoading}
						loadingText="Signing in"
					>
						Sign in
					</Button>
					<p className="mt-4 text-center text-gray-500">
						Doesn't have an account?{" "}
						<span className="underline hover:text-teal-500">
							<Link href="/auth/signup">Register here</Link>
						</span>
					</p>
				</form>
			</div>
		</main>
	);
};

export default SignIn;
