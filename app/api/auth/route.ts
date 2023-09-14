import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { identifier, password } = reqBody;
    const result = await axios.post(`http://127.0.0.1:1337/api/auth/local`, {
      identifier: identifier,
      password: password,
    });
    console.log(result);
    if (result.status === 200) {
      const token = result.data.jwt;
      const response = NextResponse.json({
        ...result.data,
        message: "Login successful",
        success: true,
      });
      response.cookies.set("token", token, {
        httpOnly: true,
        // maxAge: 100,
      });
      return response;
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error: any) {
    console.error("Authentication error:", error.response.data);
    return NextResponse.json(error.response.data);
  }
}

export const GET = async (req: NextRequest, res: NextResponse) => {
  const token = req.cookies.get("token");
  const result = await axios.get(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  console.log(result.data);

  return NextResponse.json({ ...result.data, token, status: 200 });
};
