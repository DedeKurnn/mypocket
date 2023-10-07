import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import NextNProgress from "nextjs-progressbar";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { CashFlowContextProvider } from "@/context/cashFlowContext";
import { ReactElement, ReactNode } from "react";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import PersistLogin from "@/components/PersistLogin";
const queryClient = new QueryClient();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => page);
	return getLayout(
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<PersistLogin>
					<CashFlowContextProvider>
						<ChakraProvider>
							<NextNProgress />
							<Component {...pageProps} />
						</ChakraProvider>
					</CashFlowContextProvider>
				</PersistLogin>
			</AuthProvider>
		</QueryClientProvider>
	);
}
