import axios from "axios";
// const BASE_URL = "https://mypocket-wheat.vercel.app";

// export default axios.create({
// 	baseURL: BASE_URL,
// });

export const axiosPrivate = axios.create({
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});
