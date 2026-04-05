import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get the contribution to determine type
  const { data: contribution, error } = await supabase
    .from("contributions")
    .select("id, type, name")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !contribution) {
    return NextResponse.json(
      { error: "Contribution not found" },
      { status: 404 }
    );
  }

  const storagePath = `contributions/${contribution.type}s/${id}`;

  // List files in storage
  const { data: files } = await supabase.storage
    .from("contributions")
    .list(storagePath);

  if (!files || files.length === 0) {
    // Fallback: serve the raw_readme as a downloadable README.md
    const { data: full } = await supabase
      .from("contributions")
      .select("raw_readme, skill_fields, agent_fields")
      .eq("id", id)
      .single();

    if (!full?.raw_readme) {
      return NextResponse.json(
        { error: "No files available for download" },
        { status: 404 }
      );
    }

    return new NextResponse(full.raw_readme, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${id}-README.md"`,
      },
    });
  }

  // If single file, download directly
  if (files.length === 1) {
    const { data: fileData } = await supabase.storage
      .from("contributions")
      .download(`${storagePath}/${files[0].name}`);

    if (!fileData) {
      return NextResponse.json(
        { error: "File download failed" },
        { status: 500 }
      );
    }

    return new NextResponse(fileData, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${files[0].name}"`,
      },
    });
  }

  // Multiple files: create a simple tar-like concatenation isn't ideal,
  // so we'll return a zip. Since we can't easily zip server-side without
  // a dependency, we'll redirect to download individual files as a zip
  // using a simple approach: return JSON with download URLs
  const downloadUrls = files.map((f) => ({
    name: f.name,
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/contributions/${storagePath}/${f.name}`,
  }));

  // For now, download the README.md (primary file)
  const readmeFile = files.find((f) => f.name === "README.md") ?? files[0];
  const { data: fileData } = await supabase.storage
    .from("contributions")
    .download(`${storagePath}/${readmeFile.name}`);

  if (!fileData) {
    return NextResponse.json(
      { error: "File download failed" },
      { status: 500 }
    );
  }

  // If there are multiple files, add a header listing all files
  const headers: Record<string, string> = {
    "Content-Type": "text/markdown",
    "Content-Disposition": `attachment; filename="${id}-${readmeFile.name}"`,
  };

  if (files.length > 1) {
    headers["X-Additional-Files"] = JSON.stringify(
      downloadUrls.filter((f) => f.name !== readmeFile.name)
    );
  }

  return new NextResponse(fileData, { headers });
}
