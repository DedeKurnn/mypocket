import axios from "@/lib/axios";
import useAuth from "@/lib/hooks/useAuth";

const useRefreshToken = () => {
	const { setAuth }: any = useAuth();

	const refresh = async () => {
		const response = await axios.get("api/auth/refreshx", {
			withCredentials: true,
		});
		setAuth((prev: any) => {
			console.log(JSON.stringify(prev));
			console.log(response.data.accessToken);
			return {
				...prev,
				roles: response.data.roles,
				accessToken: response.data.accessToken,
			};
		});
		return response.data.accessToken;
	};
	return refresh;
};

export default useRefreshToken;
