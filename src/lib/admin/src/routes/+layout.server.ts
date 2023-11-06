import * as session from "../lib/session";
import { redirect } from "@sveltejs/kit";
import { loadLayoutServer } from "../../../as-plugin"

export const load = ({ url, cookies }) => {
    const sesId = session.SessionRead.getSessionId(cookies);
    if (!url.pathname.includes("logout") && (!url.pathname.includes("account") && (!sesId || !session.SessionRead.alreadyLoggedin(sesId)))) {
        throw redirect(301, "/account/signin?not_logged");
    }

    return {
        ...loadLayoutServer()
    }
}