import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import NextNProgress from "nextjs-progressbar";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { CashFlowContextProvider } from "@/context/cashFlowContext";
import { ReactElement, ReactNode } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function MyApp({
	Component,
	pageProps,
	...appProps
}: AppPropsWithLayout) {
	const router = useRouter();
	const getContent = () => {
		// array of all the paths that doesn't need layout
		if (router.pathname.startsWith(`/dashboard`)) {
			return (
				<DashboardLayout>
					<Component {...pageProps} />
				</DashboardLayout>
			);
		} else {
			return <Component {...pageProps} />;
		}
	};

	return (
		<QueryClientProvider client={queryClient}>
			<CashFlowContextProvider>
				<ChakraProvider>
					<NextNProgress />
					{getContent()}
				</ChakraProvider>
			</CashFlowContextProvider>
		</QueryClientProvider>
	);
}
