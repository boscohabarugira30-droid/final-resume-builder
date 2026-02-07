import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Your verified API Key
const genAI = new GoogleGenerativeAI("AIzaSyAh2GGwlTYYPIz1iMkXzqY8h9BabYMsH-Y");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Using gemini-1.5-flash-latest to ensure v1beta compatibility
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}