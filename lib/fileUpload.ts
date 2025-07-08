/**
 * File upload utilities for Google Cloud Storage integration
 * Based on FILE_UPLOAD.md specifications
 */

// Get auth token helper
export const getAuthToken = (): string | null =>
  localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

// File validation utility
export const validateFile = (
  file: File,
  type: "image" | "document" = "document"
): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 5MB",
    };
  }

  const allowedTypes =
    type === "image"
      ? ["image/jpeg", "image/jpg", "image/png"]
      : [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

  if (!allowedTypes.includes(file.type)) {
    const typeLabels = allowedTypes.map((t) => t.split("/")[1]).join(", ");
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${typeLabels}`,
    };
  }

  return { valid: true };
};

// Profile picture upload function
export const uploadProfilePicture = async (
  file: File
): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/users/profile-picture", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }

  const result = await response.json();
  return result.data;
};

// Fetch user profile function
export const fetchUserProfile = async () => {
  const response = await fetch("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const result = await response.json();
  return result.data;
};

// Document upload function
export const uploadDocument = async (
  file: File,
  type: string,
  description: string = ""
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("description", description);

  const response = await fetch("/api/documents/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }

  const result = await response.json();
  return result.data;
};

// Get secure document download URL
export const getDocumentDownloadUrl = async (
  documentId: string
): Promise<string> => {
  const response = await fetch(`/api/documents/${documentId}/download`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get download URL");
  }

  const result = await response.json();
  return result.data.downloadUrl;
};

// Document types for uploads
export const DOCUMENT_TYPES = {
  ID_DOCUMENT: "ID_DOCUMENT",
  PASSPORT: "PASSPORT",
  UTILITY_BILL: "UTILITY_BILL",
  BANK_STATEMENT: "BANK_STATEMENT",
  SALARY_SLIP: "SALARY_SLIP",
  OTHER: "OTHER",
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPES;
