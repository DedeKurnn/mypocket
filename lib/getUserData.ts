import axios from "axios";

const getUserData = async (userId: string) => {
	try {
		const response = await axios.get(`/api/user/${userId}`);
		return response.data;
	} catch (error: any) {
		throw error;
	}
};

export default getUserData;
