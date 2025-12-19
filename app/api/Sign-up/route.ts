import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendverificationEmail";

export async function POST(request: Request){
  await dbConnect();
    try {  
      const { Username, Email, Password } = await request.json();
      const existingUserVerifiedByUsername = await UserModel.findOne({
        Username,
        isverified: true
      })
      if (existingUserVerifiedByUsername) {
        return Response.json({
          success: false,
          message: 'Username already in use',
        },
          {
            status: 400
          }
        );
      }
      else {
        const existingUserVerifiedByEmail = await UserModel.findOne({Email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserVerifiedByEmail) {
          if (existingUserVerifiedByEmail.isverified) {
            return Response.json({
              success: false,
              message: 'Email already in use',
            },
              {
                status: 400
              }
            );
          }else{
            //Update existing unverified user with new details
            const hashedPassword = await bcrypt.hash(Password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            existingUserVerifiedByEmail.Username = Username;
            existingUserVerifiedByEmail.Password = hashedPassword;
            existingUserVerifiedByEmail.verifyCode = verifyCode;
            existingUserVerifiedByEmail.verifyCodeExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

            //Send Verification Email
            await existingUserVerifiedByEmail.save();
          }
        }else{
          const hashedPassword = await bcrypt.hash(Password, 10);
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);

          const newUser =new UserModel({
                Username: Username,
                Email: Email,
                Password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpire: expiryDate,
                isverified: false,
                isAcceptingMessage: true,
                Messages: []
          })
          await newUser.save();
          //Send Verification Email
          const emailResponse = await sendVerificationEmail(Username, Email, verifyCode);
          if(!emailResponse.success){
            return Response.json({
              success: false,
              message: emailResponse.message,
            },
              {
                status: 500
              }
            );
          }
          return Response.json({
            success: true,
            message: 'User Registered Successfully. Verification Email Sent.',  
          },
            {
              status: 201
            }
        );
        }
      }
      } catch (error) {
      console.error('Error in sign-up route:', error);
      return Response.json({
        success: false,
        message: 'Error Registering User',
      },
        {
          status: 500
        }
      );
    }
}