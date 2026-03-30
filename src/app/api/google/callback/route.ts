import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return NextResponse.json(
      {
        error:
          "Falta GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET ou GOOGLE_REDIRECT_URI no .env.local",
      },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing ?code" }, { status: 400 });
  }

  try {
    const tokenResp = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const refreshToken = tokenResp.data.refresh_token as string | undefined;

    return new NextResponse(
      `
      <html>
        <body style="font-family: Arial; padding: 24px;">
          <h2>OAuth OK ✅</h2>
          <p>Copie o <b>refresh_token</b> e cole no seu <code>.env.local</code> em <code>GOOGLE_REFRESH_TOKEN</code>.</p>
          <pre style="background:#f5f5f5; padding:12px; border-radius:8px; white-space:pre-wrap;">${
            refreshToken || "NÃO VEIO (revogue o app na Conta Google e autorize novamente)"
          }</pre>
          <p>Depois reinicie o Next.</p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err: any) {
  return NextResponse.json(
    {
      error: "Erro ao trocar code por token",
      message: err?.message,
      google: err?.response?.data, // ✅ mostra o motivo exato do 400
      status: err?.response?.status,
    },
    { status: 500 }
  );
}
}