import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
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

        // Optional: Größenlimit (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Max 10MB" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = crypto.randomBytes(16).toString("hex") + ".mp3";
        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        await writeFile(filePath, buffer);

        // 🔥 AUTO DELETE nach 1 Stunde
        setTimeout(async () => {
            try {
                await unlink(filePath);
                console.log("Deleted:", fileName);
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }, 60 * 60 * 1000); // 1 Stunde

        return NextResponse.json({
            url: `/uploads/${fileName}`,
            expiresIn: 3600,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}