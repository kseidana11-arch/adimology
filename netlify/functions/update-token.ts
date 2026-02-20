import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function handler(event: any) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { token } = JSON.parse(event.body);

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No token provided" }),
      };
    }

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "stockbit_token", value: token });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
