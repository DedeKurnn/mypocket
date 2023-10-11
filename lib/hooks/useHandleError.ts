export type Error = {
	isAlreadyExist: boolean;
	isInternalError: boolean;
	isNotFound: boolean;
	isUnauthorized: boolean;
};

const useHandleError = () => {
	const checkError = (status: number) => {
		const error = {
			isAlreadyExist: false,
			isInternalError: false,
			isNotFound: false,
			isUnauthorized: false,
		};

		if (status === 404) {
			error.isNotFound = true;
		} else if (status === 500) {
			error.isInternalError = true;
		} else if (status === 401) {
			error.isUnauthorized = true;
		} else if (status === 400) {
			error.isAlreadyExist = true;
		}

		return error;
	};
	return checkError;
};

export default useHandleError;
