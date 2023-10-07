import { useState, useEffect, ReactNode } from "react";
import useRefreshToken from "@/lib/hooks/useRefreshToken";
import useAuth from "@/lib/hooks/useAuth";

const PersistLogin = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth, persist }: any = useAuth();

	useEffect((): any => {
		let isMounted = true;

		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.error(err);
			} finally {
				isMounted && setIsLoading(false);
			}
		};

		// persist added here AFTER tutorial video
		// Avoids unwanted call to verifyRefreshToken
		!auth?.accessToken && persist
			? verifyRefreshToken()
			: setIsLoading(false);

		return () => (isMounted = false);
	}, []);

	useEffect(() => {
		console.log(`isLoading: ${isLoading}`);
		console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
	}, [isLoading]);

	return <>{children}</>;
};

export default PersistLogin;
