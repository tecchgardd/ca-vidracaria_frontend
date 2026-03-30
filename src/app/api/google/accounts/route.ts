import { NextResponse } from "next/server";
import { listAllReviews } from "../../../lib/googleBusiness";

export async function GET() {
  try {
    const reviews = await listAllReviews();

    return NextResponse.json({
      count: reviews.length,
      reviews,
      debug: {
        hasAccountId: !!process.env.GBP_ACCOUNT_ID && process.env.GBP_ACCOUNT_ID !== "SEU_ACCOUNT_ID",
        hasLocationId: !!process.env.GBP_LOCATION_ID && process.env.GBP_LOCATION_ID !== "SEU_LOCATION_ID",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || "Erro desconhecido",
        details: err?.response?.data ?? null,
        debug: {
          projectHint:
            err?.response?.data?.error?.details?.[0]?.metadata?.containerInfo ||
            err?.response?.data?.error?.details?.[0]?.metadata?.consumer ||
            null,
        },
      },
      { status: 500 }
    );
  }
}