import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input, FormControl, FormLabel, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
	const { push } = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		setIsLoading(true);
		event.preventDefault();
		const payload = {
			username: event.currentTarget.username.value,
			password: event.currentTarget.password.value,
		};
		try {
			const { data } = await axios.post("/api/auth/login", payload);

			alert(JSON.stringify(data));

			// redirect the user to /dashboard
			if (data.status !== 401) {
				push("/dashboard");
			}
		} catch (e) {
			const error = e as AxiosError;

			alert(error.message);
		}
		setIsLoading(false);
	};

	return (
		<main
			className="bg-no-repeat bg-cover bg-center relative"
			style={{
				backgroundImage:
					"url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80)",
			}}
		>
			<div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center items-center">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-2 max-w-48 p-8 h-fit shadow-lg bg-white rounded-lg z-20"
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
