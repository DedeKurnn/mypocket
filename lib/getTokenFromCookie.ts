export default function getTokenFromCookie(cookieName: string) {
	const cookies = document.cookie.split("; ");
	for (const cookie of cookies) {
		const [name, value] = cookie.split("=");
		if (name === cookieName) {
			return decodeURIComponent(value);
		}
	}
	return null;
}
