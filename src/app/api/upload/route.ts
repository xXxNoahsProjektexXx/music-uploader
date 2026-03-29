import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!file.name.endsWith(".mp3")) {
            return NextResponse.json({ error: "Only MP3 allowed" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = crypto.randomBytes(16).toString("hex") + ".mp3";
        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            url: `/uploads/${fileName}`,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}