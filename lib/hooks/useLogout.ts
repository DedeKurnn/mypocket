import axios from "@/lib/axios";
import useAuth from "@/lib/hooks/useAuth";

const useLogout = () => {
	const { setAuth }: any = useAuth();

	const logout = async () => {
		setAuth({});
		try {
			const response = await axios("/api/auth/logoutx", {
				withCredentials: true,
			});
		} catch (err) {
			console.error(err);
		}
	};

	return logout;
};

export default useLogout;
