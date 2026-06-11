import { NextResponse } from "next/server";

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID!;
const FORM_ID = process.env.HUBSPOT_FORM_ID!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            {
              name: "firstname",
              value: body.firstname,
            },
            {
              name: "lastname",
              value: body.lastname,
            },
            {
              name: "email",
              value: body.email,
            },
          ],
          context: {
            pageUri: body.pageUri,
            pageName: body.pageName,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}


{
  "context": {
    "hutk": "hubspot-cookie-value",
    "ipAddress": "1.2.3.4",
    "pageUri": "...",
    "pageName": "..."
  }
}