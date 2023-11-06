import { SessionRead } from "$lib/session";
import { error, text } from "@sveltejs/kit";

export const POST = async ({ cookies }) => {
    const actionDeleteSuccess = await SessionRead.logout(cookies);

    // Return status codes: success when success, 'not authorized' when not permitted to fullfill action 
    if (actionDeleteSuccess) {
        cookies.delete("sess");
        cookies.delete("user_id");
        return text("", { status: 200 })
    }
    else throw error(401)
}