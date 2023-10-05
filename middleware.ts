import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "@/lib/jose";

export default async function middleware(req: NextRequest) {
	const { cookies } = req;

	const token = cookies.get("AUTH_COOKIE");
	const url = req.url;
	if (url.includes("/dashboard")) {
		if (token === undefined) {
			return NextResponse.redirect("http://localhost:3000/auth/signin");
		}

		try {
			const result = await verify(token.value);
			return NextResponse.next();
		} catch (error) {
			console.log(error);
			return NextResponse.redirect("http://localhost:3000/auth/signin");
		}
	}

	return NextResponse.next();
}
