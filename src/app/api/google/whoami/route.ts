import axios from "axios";
import { NextResponse } from "next/server";
import { getAccessTokenFromRefreshToken } from "../../../lib/googleBusiness";

export async function GET() {
  try {
    const token = await getAccessTokenFromRefreshToken();

    const resp = await axios.get("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json({
      email: resp.data.email,
      name: resp.data.name,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message, details: err?.response?.data ?? null },
      { status: 500 }
    );
  }
}