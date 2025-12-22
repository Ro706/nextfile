import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { UsernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: UsernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const result = UsernameQuerySchema.safeParse({ username });

    if (!result.success) {
      const errors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: errors.length ? errors.join(", ") : "Invalid username",
        },
        { status: 400 }
      );
    }

    // ✅ CASE-INSENSITIVE + VERIFIED CHECK
    const verifiedUser = await UserModel.findOne({
      username: new RegExp(`^${result.data.username}$`, "i"),
      isVerified: true, // ✅ FIXED FIELD NAME
    });

    if (verifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}