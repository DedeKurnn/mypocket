import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "@/lib/hooks/useAuth";

import {
	Input,
	FormControl,
	FormLabel,
	Button,
	Checkbox,
} from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import { CashFlowContext } from "@/context/cashFlowContext";

export default function Home() {
	const { setAuth, persist, setPersist }: any = useAuth();
	const { push } = useRouter();
	const [isRemember, setIsRemember] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { setUserData } = useContext(CashFlowContext);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		setIsLoading(true);
		event.preventDefault();

		const username = event.currentTarget.username.value;
		const password = event.currentTarget.password.value;
		try {
			const response = await axios.post(
				"/api/auth/loginx",
				JSON.stringify({ username, password }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);

			const result = response?.data;
			const { accessToken, userData } = result;
			console.log({ username, accessToken });
			sessionStorage.setItem("currentUser", )
			setAuth({ username, accessToken });
			setUserData(userData);
			push("/dashboard");
		} catch (e) {
			const error = e as AxiosError;

			alert(error.message);
		}
		setIsLoading(false);
	};

	const togglePersist = () => {
		setPersist((prev: any) => !prev);
	};

	useEffect(() => {
		localStorage.setItem("persist", persist);
	}, [persist]);

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
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							id="username"
							name="username"
							required
						/>
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
					<Checkbox
						className="mb-4"
						id="rememberMe"
						isChecked={persist}
						onChange={togglePersist}
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
					<p className="mt-4 text-gray-500">
						Doesn't have an account?{" "}
						<span className="underline hover:text-teal-500">
							<Link href="/auth/signup">Register here</Link>
						</span>
					</p>
				</form>
			</div>
		</main>
	);
}
