import axios from "axios";
import { NextResponse } from "next/server";
import { getAccessTokenFromRefreshToken } from "../../../lib/googleBusiness";

export async function GET() {
  try {
    const token = await getAccessTokenFromRefreshToken();
    const accountId = process.env.GBP_ACCOUNT_ID;

    if (!accountId) {
      return NextResponse.json(
        { error: "Falta GBP_ACCOUNT_ID no .env.local" },
        { status: 500 }
      );
    }

    const resp = await axios.get(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(resp.data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message, details: err?.response?.data ?? null },
      { status: 500 }
    );
  }
}