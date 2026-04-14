import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ALL_MOCK_DOCUMENTS, MOCK_FOLDERS } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Check if already seeded
    const { count } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count && count > 0) {
      return NextResponse.json({ message: `Déjà seedé (${count} documents)`, seeded: false });
    }

    // Insert folders
    const folderIdMap: Record<string, string> = {};
    for (const folder of MOCK_FOLDERS) {
      const { data } = await supabase
        .from("folders")
        .insert({
          user_id: user.id,
          name: folder.name,
          color: folder.color,
        })
        .select("id")
        .single();

      if (data) {
        folderIdMap[folder.id] = data.id;
      }
    }

    // Insert documents
    let inserted = 0;
    for (const doc of ALL_MOCK_DOCUMENTS) {
      const folderId = doc.folderId ? folderIdMap[doc.folderId] : null;

      const { error } = await supabase.from("documents").insert({
        user_id: user.id,
        name: doc.name,
        original_name: doc.originalName,
        mime_type: doc.mimeType,
        size: doc.sizeBytes,
        folder_id: folderId,
        ocr_status: doc.ocrStatus || "completed",
        ocr_text: doc.ocrText || null,
        tags: doc.tags || [],
        version: doc.version || 1,
        storage_path: doc.storagePath || null,
      });

      if (!error) inserted++;
    }

    return NextResponse.json({
      message: `${inserted} documents et ${Object.keys(folderIdMap).length} dossiers créés`,
      seeded: true,
      documents: inserted,
      folders: Object.keys(folderIdMap).length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Erreur lors du seed" }, { status: 500 });
  }
}
