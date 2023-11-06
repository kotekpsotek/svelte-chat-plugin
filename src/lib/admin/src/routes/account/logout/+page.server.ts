import { SessionRead } from '$lib/session.js';
import { error } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const retObj = { loggedIn: false };
    const sessionCookieId = SessionRead.getSessionId(cookies);
    
    if (sessionCookieId && await SessionRead.alreadyLoggedin(sessionCookieId)) {
        retObj.loggedIn = true;
    }
    
    return retObj;
};
