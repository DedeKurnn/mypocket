import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/system";
import theme from "@/lib/theme";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/icon.png"></link>
				<meta name="theme-color" content="#fff" />
			</Head>
			<body className="overflow-y-scroll">
				<ColorModeScript
					initialColorMode={theme.config.initialColorMode}
				/>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
