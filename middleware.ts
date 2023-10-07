import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();

	if (url.pathname === "/") {
		url.pathname = "/dashboard";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}
