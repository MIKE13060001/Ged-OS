
export type Role = 'admin' | 'manager' | 'member' | 'viewer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  settings: Record<string, any>;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: Role;
  permissions: string[];
  mfaEnabled: boolean;
  createdAt: string;
}

export interface Folder {
  id: string;
  tenantId: string;
  parentId?: string;
  name: string;
  path: string;
  color?: string;
  icon?: string;
  createdBy: string;
  createdAt: string;
}

export type OCRStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Document {
  id: string;
  tenantId: string;
  folderId?: string;
  name: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  previewUrl?: string; // Nouvelle propriété pour l'affichage
  version: number;
  ocrStatus: OCRStatus;
  ocrText?: string;
  extractedData: Record<string, any>;
  tags: string[];
  metadata: Record<string, any>;
  createdBy: string;
  createdAt: string;
}

export interface AudioRecording {
  id: string;
  tenantId: string;
  name: string;
  storagePath: string;
  durationSeconds: number;
  transcriptionStatus: OCRStatus;
  transcriptionText?: string;
  aiSummary?: string;
  aiActionItems: any[];
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: any[];
  generatedFiles?: any[];
  pendingActions?: any[];
  createdAt: string;
}
