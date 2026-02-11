import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FONT_CSS: Record<string, string> = {
  july: `@font-face {
  font-family: 'July';
  src: url('https://abdullah.ami.bd/fonts/July-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'July';
  src: url('https://abdullah.ami.bd/fonts/July-Italic.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'July';
  src: url('https://abdullah.ami.bd/fonts/July-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'July';
  src: url('https://abdullah.ami.bd/fonts/July-Bold-Italic.ttf') format('truetype');
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const apiKey = url.searchParams.get("key");
    const fontId = url.searchParams.get("font") || "july";

    if (!apiKey) {
      return new Response("/* ERROR: API key required. Get one at https://abdullah.ami.bd/F */", {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    }

    if (!FONT_CSS[fontId]) {
      return new Response(`/* ERROR: Unknown font '${fontId}' */`, {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: keyRecord, error } = await supabase
      .from("font_api_keys")
      .select("id, is_active, user_id")
      .eq("api_key", apiKey)
      .single();

    if (error || !keyRecord) {
      return new Response("/* ERROR: Invalid API key */", {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    }

    if (!keyRecord.is_active) {
      return new Response("/* ERROR: API key is disabled. Contact admin. */", {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    }

    // Check if this key has permission for the requested font
    const { data: fontPerm } = await supabase
      .from("font_api_key_fonts")
      .select("id")
      .eq("api_key_id", keyRecord.id)
      .eq("font_id", fontId)
      .single();

    if (!fontPerm) {
      return new Response(`/* ERROR: Your API key does not have access to the '${fontId}' font. Contact admin. */`, {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    }

    // Update last_used_at
    await supabase
      .from("font_api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyRecord.id);

    return new Response(FONT_CSS[fontId], {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    return new Response(`/* Server error */`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/css" },
    });
  }
});
