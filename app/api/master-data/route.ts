import { NextResponse } from "next/server";
import { getMasterData } from "@/lib/supabase/mybottle";

export async function GET() {
  const data = await getMasterData();
  return NextResponse.json(data);
}
