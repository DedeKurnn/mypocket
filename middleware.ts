import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const token = req.cookies.get("AUTH_COOKIE");

	// If user is accessing the root path
	if (url.pathname === "/") {
		// Redirect to dashboard if there's an authentication cookie
		if (token) {
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		} else {
			// Redirect to sign in page if there's no authentication cookie
			url.pathname = "/auth/signin";
			return NextResponse.redirect(url);
		}
	}

	// If there's no authentication cookie and user is not on the sign-in page, redirect to sign in page
	// if (!token && url.pathname !== "/auth/signin") {
	// 	url.pathname = "/auth/signin";
	// 	return NextResponse.redirect(url);
	// }

	return NextResponse.next();
}

export const config = {
	matchers: ["/dashboard/:path*"],
};
