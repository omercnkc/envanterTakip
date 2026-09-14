// Supabase Edge Function: send-warranty-notifications
// Her gün otomatik çalışarak garantisi 30, 7 veya 1 gün kalmış ürünleri tespit eder
// ve Expo Push API üzerinden kullanıcıların telefonlarına uzaktan bildirim gönderir.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushMessage {
  to: string;
  sound: "default";
  title: string;
  body: string;
  data: Record<string, unknown>;
}

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Sunucu ortam değişkenleri eksik." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Tarih referansları (Bugün + 30 gün, + 7 gün, + 1 gün)
    const now = new Date();
    const formatISODate = (d: Date) => d.toISOString().split("T")[0];

    const date30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const date7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const date1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    const targetDates = [
      { dateStr: formatISODate(date30Days), days: 30, title: "🔔 Garanti Hatırlatması", getBody: (n: string) => `${n} ürününüzün garanti süresinin bitmesine 30 gün kaldı.` },
      { dateStr: formatISODate(date7Days), days: 7, title: "⚠️ Garanti Süresi Yaklaşıyor!", getBody: (n: string) => `${n} ürününüzün garantisi 7 gün sonra sona eriyor.` },
      { dateStr: formatISODate(date1Day), days: 1, title: "🚨 Garanti Yarın Bitiyor!", getBody: (n: string) => `${n} ürününüzün garanti süresi yarın sona eriyor!` },
    ];

    const targetDateStrings = targetDates.map((t) => t.dateStr);

    // Eşleşen ürünleri ve kullanıcı tokenlarını çek
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, warranty_end_date, user_id, profiles!inner(expo_push_token)")
      .in("warranty_end_date", targetDateStrings);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const messages: PushMessage[] = [];

    for (const item of products || []) {
      const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
      const pushToken = profile?.expo_push_token;

      if (pushToken && pushToken.startsWith("ExponentPushToken")) {
        const milestone = targetDates.find((t) => t.dateStr === item.warranty_end_date);
        if (milestone) {
          messages.push({
            to: pushToken,
            sound: "default",
            title: milestone.title,
            body: milestone.getBody(item.name),
            data: {
              productId: item.id,
              productName: item.name,
              daysRemaining: milestone.days,
              type: "warranty_alert",
            },
          });
        }
      }
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "Bugün bildirim gönderilecek ürün bulunamadı.", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Expo Push API'ye toplu gönderim
    const pushResponse = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });

    const pushResult = await pushResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        sent: messages.length,
        expoResponse: pushResult,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
