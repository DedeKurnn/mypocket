import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import useHandleError, { Error } from "@/lib/hooks/useHandleError";

import {
	Input,
	FormControl,
	FormLabel,
	Button,
	useToast,
	FormErrorMessage,
} from "@chakra-ui/react";

const SignUp = () => {
	const toast = useToast();
	const checkError = useHandleError();
	const { push } = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		setIsLoading(true);
		event.preventDefault();
		const payload = {
			username: event.currentTarget.username.value,
			email: event.currentTarget.email.value,
			password: event.currentTarget.password.value,
		};
		try {
			const response = await axios.post("/api/auth/register", payload);

			if (response.status === 200) {
				push("/dashboard");
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
						<h1 className="mb-2">Register new account</h1>
						<p>Fill out the form below to register</p>
					</div>
					<FormControl>
						<FormLabel>Username</FormLabel>
						<Input
							type="text"
							id="username"
							name="username"
							required
						/>
					</FormControl>
					<FormControl isInvalid={error?.isAlreadyExist}>
						<FormLabel>Email</FormLabel>
						<Input type="email" id="email" name="email" required />
						{error?.isAlreadyExist && (
							<FormErrorMessage>
								Email already registered
							</FormErrorMessage>
						)}
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							id="password"
							name="password"
							required
						/>
					</FormControl>

					<Button
						type="submit"
						variant="solid"
						colorScheme="teal"
						isLoading={isLoading}
						loadingText="Signing up"
					>
						Sign up
					</Button>
					<p className="mt-4 text-center text-gray-500">
						Already have an account?{" "}
						<span className="underline hover:text-teal-500">
							<Link href="/auth/signin">Sign in here</Link>
						</span>
					</p>
				</form>
			</div>
		</main>
	);
};

export default SignUp;
