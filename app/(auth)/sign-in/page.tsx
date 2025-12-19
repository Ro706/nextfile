'use client'
import { useSession,signIn,signOut } from "next-auth/react";

export default function component(){
    const {data: session} = useSession()
    if (session){
        return (
        <>
            <p>Signed in as, {session.user.email}</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded" onClick={() => signOut()}>Sign Out</button>
        </>)
    }
    return (
        <>
            <p>Not signed in</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded" onClick={() => signIn()}>Sign In</button>
        </>
    )
}
