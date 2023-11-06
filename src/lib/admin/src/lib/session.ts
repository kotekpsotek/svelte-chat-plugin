import { randomUUID } from "crypto";
import type { Cookies } from "@sveltejs/kit";
import * as mongodb from "../../../../server/databases/mogodb.js";
import { Schema } from "mongoose";

export class SessionDestroy {
    static async destroy(sessionId: string) {

    }
}

export class SessionWrite extends SessionDestroy {
    constructor(cookies: Cookies, locals: App.Locals, email: string) {
        const sessionId = randomUUID();
        const expDate = new Date(Date.now() + (24 * 60 * 60 * 1_000));
        
        // Save in databse
        mongodb.sessionAdminCookiesModel.create({
            sess_id: sessionId,
            expiration_date: expDate,
            email
        })

        // For client
        cookies.set("sess", sessionId, {
            expires: expDate,
            path: "/",
            httpOnly: true,
        });

        // For app routing
        locals.login = true;

        // Initialize extend classes
        super();
    }
}

export class SessionRead {
    constructor(cookies: Cookies, locals: App.Locals) {
        const cookieSes = cookies.get("sess");

        if (cookieSes) {
            // Check in databse
            mongodb.sessionAdminCookiesModel.exists({ 
                sess_id: cookieSes,
                expiration_date: { $gte: new Date() }
            }).then(async res => {
                if (res) {
                    locals.login = true

                    // Update session expiration data
                    const expDate = new Date(Date.now() + (24 * 60 * 60 * 1_000));
                        // ...Databse
                    await mongodb.sessionAdminCookiesModel.findOneAndUpdate({
                        sess_id: cookieSes
                    }, {
                        expiration_date: expDate,
                        date_set: new Date()
                    });
                        // ...Client side
                    cookies.set("sess", cookieSes, {
                        expires: expDate,
                        path: "/",
                        httpOnly: true
                    });
                }
            })
            
        }
    }

    // Get actual session ID
    static getSessionId(cookies: Cookies) {
        const sess = cookies.get("sess");
        return sess || undefined;
    }

    /** Check session id is in database and is actual */
    static async alreadyLoggedin(sessionId: string): Promise<boolean> {
        return await mongodb.sessionAdminCookiesModel.exists({
            sess_id: sessionId,
            expiration_date: { $gt: new Date() }
        }) != null;
    }

    /** Logout user */
    static async logout(cookies: Cookies): Promise<boolean> {
        const sessionCookieId = SessionRead.getSessionId(cookies);

        // When login
        if (sessionCookieId && await SessionRead.alreadyLoggedin(sessionCookieId)) {
            const sessDeleted = mongodb.sessionAdminCookiesModel.findOneAndDelete({
                sess_id: sessionCookieId
            });
            return true
        }

        // Default
        return false;
    }
}