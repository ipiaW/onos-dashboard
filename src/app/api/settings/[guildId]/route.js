import { NextResponse } from "next/server";
import { getGuildConfig, updateGuildConfig } from "../../../../lib/discordConfigStore";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { guildId } = params;
  if (!guildId) {
    return NextResponse.json({ success: false, error: "Missing guildId" }, { status: 400 });
  }

  try {
    const data = await getGuildConfig(guildId);
    return NextResponse.json({ success: true, settings: data.config });
  } catch (err) {
    console.error("[Settings GET Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { guildId } = params;
  if (!guildId) {
    return NextResponse.json({ success: false, error: "Missing guildId" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ success: false, error: "Missing section or data" }, { status: 400 });
    }

    const updated = await updateGuildConfig(guildId, section, data);
    return NextResponse.json({
      success: true,
      message: `Pengaturan ${section} berhasil disimpan ke server Discord & disinkronkan ke bot.`,
      settings: updated
    });
  } catch (err) {
    console.error("[Settings POST Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
