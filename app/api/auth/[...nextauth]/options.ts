import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                Elementmail: { label: "Email", type: "text"},
                Password: { label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    console.log("Authorize called with:", { identifier: credentials.identifier, hasPassword: !!credentials.password });
                    
                    const user = await UserModel.findOne({ 
                       $or: [
                        { email: credentials.identifier },
                        { username: credentials.identifier }
                       ] });
                    
                    console.log("User found:", user ? user.username : "No user found");

                    if (!user) {
                        throw new Error("User not found");
                    }
                    if (!user.isVerified) {
                        console.log("User not verified");
                        throw new Error("User is not verified");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    
                    console.log("Password correct:", isPasswordCorrect);

                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect password");
                    }
                } catch (error: any) {
                    console.error("Authorize error:", error.message);
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token._id) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};