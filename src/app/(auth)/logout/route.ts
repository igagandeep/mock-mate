import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from "@/firebase/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Clear the session cookie
        res.setHeader('Set-Cookie', 'session=; Max-Age=0; path=/; HttpOnly; Secure; SameSite=Lax');

        // Optionally, revoke the Firebase session
        const sessionCookie = req.cookies.session;
        if (sessionCookie) {
            const decodedClaims = await auth.verifySessionCookie(sessionCookie);
            await auth.revokeRefreshTokens(decodedClaims.sub);
        }

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}