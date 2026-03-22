/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Supabase adapter for document CRUD + file storage.
 * Used by hooks when Supabase is configured.
 */
import { createClient } from "./client";

export interface StoreDocument {
  id: string;
  name: string;
  originalName?: string;
  mimeType: string;
  sizeBytes?: number;
  folderId?: string;
  ocrStatus: "pending" | "processing" | "completed" | "failed" | "error";
  ocrText?: string;
  tags?: string[];
  version?: number;
  previewUrl?: string;
  storagePath?: string;
  [key: string]: unknown;
}

export interface StoreFolder {
  id: string;
  name: string;
  color?: string;
  [key: string]: unknown;
}

function mapDocRow(row: any): StoreDocument {
  return {
    id: row.id,
    name: row.name,
    originalName: row.original_name ?? undefined,
    mimeType: row.mime_type,
    sizeBytes: row.size ?? 0,
    folderId: row.folder_id ?? undefined,
    ocrStatus: row.ocr_status ?? "pending",
    ocrText: row.ocr_text ?? undefined,
    tags: row.tags ?? [],
    version: row.version ?? 1,
    storagePath: row.storage_path ?? undefined,
    previewUrl: row.preview_url ?? undefined,
  };
}

export async function fetchDocuments(userId: string): Promise<StoreDocument[]> {
  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .is("root_id", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapDocRow);
}

export async function fetchFolders(userId: string): Promise<StoreFolder[]> {
  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    color: row.color ?? undefined,
  }));
}

export async function upsertDocument(userId: string, doc: StoreDocument, base64Data?: string): Promise<StoreDocument> {
  const supabase = createClient() as any;
  let storagePath: string | null = doc.storagePath ?? null;

  if (base64Data && doc.mimeType && !storagePath) {
    const byteChars = atob(base64Data);
    const byteNums = Array.from(byteChars, (c) => c.charCodeAt(0));
    const blob = new Blob([new Uint8Array(byteNums)], { type: doc.mimeType });
    const path = `${userId}/${doc.id}/${doc.originalName ?? doc.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, blob, { contentType: doc.mimeType, upsert: false });
    if (!uploadError) storagePath = path;
  }

  const { data, error } = await supabase
    .from("documents")
    .upsert({
      id: doc.id,
      user_id: userId,
      name: doc.name,
      original_name: doc.originalName ?? null,
      mime_type: doc.mimeType,
      size: doc.sizeBytes ?? 0,
      folder_id: doc.folderId ?? null,
      ocr_status: doc.ocrStatus === "error" ? "failed" : doc.ocrStatus,
      ocr_text: doc.ocrText ?? null,
      tags: doc.tags ?? [],
      version: doc.version ?? 1,
      storage_path: storagePath,
      preview_url: doc.previewUrl ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDocRow(data);
}

export async function patchDocument(docId: string, patch: Partial<StoreDocument>): Promise<void> {
  const supabase = createClient() as any;
  const update: Record<string, unknown> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.folderId !== undefined) update.folder_id = patch.folderId ?? null;
  if (patch.ocrStatus !== undefined) update.ocr_status = patch.ocrStatus === "error" ? "failed" : patch.ocrStatus;
  if (patch.ocrText !== undefined) update.ocr_text = patch.ocrText ?? null;
  if (patch.tags !== undefined) update.tags = patch.tags;
  if (patch.previewUrl !== undefined) update.preview_url = patch.previewUrl ?? null;
  await supabase.from("documents").update(update).eq("id", docId);
}

export async function removeDocument(docId: string): Promise<void> {
  const supabase = createClient() as any;
  await supabase.from("documents").delete().eq("id", docId);
}

export async function upsertFolder(userId: string, folder: StoreFolder): Promise<void> {
  const supabase = createClient() as any;
  await supabase.from("folders").upsert({
    id: folder.id,
    user_id: userId,
    name: folder.name,
    color: folder.color ?? null,
  });
}

export async function removeFolder(folderId: string): Promise<void> {
  const supabase = createClient() as any;
  await supabase.from("folders").delete().eq("id", folderId);
}

export async function logAuditEvent(
  userId: string,
  event: { action: string; detail: string; status: "success" | "warning" | "error"; user: string }
): Promise<void> {
  const supabase = createClient() as any;
  await supabase.from("audit_events").insert({
    user_id: userId,
    action: event.action,
    detail: event.detail,
    status: event.status,
    user_label: event.user,
  });
}

export async function getSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = createClient() as any;
  const { data } = await supabase.storage.from("documents").createSignedUrl(storagePath, 3600);
  return data?.signedUrl ?? null;
}
