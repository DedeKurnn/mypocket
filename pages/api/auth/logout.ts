import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// Clear the authentication cookie by setting an expired date
	res.setHeader("Set-Cookie", [
		serialize("AUTH_COOKIE", "", {
			maxAge: -1,
			path: "/",
		}),
		serialize("REFRESH_COOKIE", "", {
			maxAge: -1,
			path: "/",
		}),
	]);

	// Redirect the user to the sign-in page or any other desired location
	res.status(302).send("Signed Out");
}
