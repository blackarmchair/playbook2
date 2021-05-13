import React from "react";
import { ThemeProvider } from "@material-ui/core";
import theme from "../theme";
import TopBar from "../components/TopBar";
import { TeamProvider } from "../contexts/team";
import { RosterProvider } from "../contexts/roster";
import { UserProvider } from "../contexts/user";
import "../styles.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <TeamProvider>
                    <RosterProvider>
                        <TopBar />
                        <Component {...pageProps} />
                    </RosterProvider>
                </TeamProvider>
            </UserProvider>
        </ThemeProvider>
    );
}
