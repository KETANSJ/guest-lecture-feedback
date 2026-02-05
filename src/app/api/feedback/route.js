import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/* ✅ GET – browser test साठी */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Feedback API is working ✅",
  });
}

/* ✅ POST – form submit साठी */
export async function POST(req) {
  try {
    const body = await req.json();

    const { student, lecture, speaker, rating, comment } = body;

    const { error } = await supabase.from("feedback").insert([
      {
        student,
        lecture,
        speaker,
        rating,
        comment,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully ✅",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
