import { ReactNode, createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [auth, setAuth] = useState({});
	const [persist, setPersist] = useState(false);
	console.log(auth);

	useEffect(() => {
		const persistedData = localStorage.getItem("persist");
		if (persistedData) {
			try {
				setPersist(JSON.parse(persistedData));
			} catch (error) {
				console.error("Error parsing persisted data:", error);
			}
		}
	}, []);

	return (
		<AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
