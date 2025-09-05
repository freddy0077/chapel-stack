import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const uploadUrl = formData.get("uploadUrl") as string;

    if (!file || !uploadUrl) {
      return NextResponse.json(
        { error: "File and uploadUrl are required" },
        { status: 400 },
      );
    }

    // Upload the file to S3 using the presigned URL
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("S3 upload failed:", errorText);
      return NextResponse.json(
        {
          error: `S3 upload failed: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Proxy upload error:", error);
    return NextResponse.json(
      {
        error: `Proxy upload error: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}

// Increase the body size limit for file uploads to match backend (10GB)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "10gb",
  },
};
