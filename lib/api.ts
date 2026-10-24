export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

export type Attending = "yes" | "maybe" | "no";
export type Phase = "before" | "after";
export type OutfitType =
  | "lehenga"
  | "saree"
  | "anarkali"
  | "sharara"
  | "kurta"
  | "sherwani"
  | "nehru-jacket"
  | "indo-western";

export type RsvpSummary = {
  total: number;
  headcount: number;
  counts: Record<Attending, number>;
  wall: { id: string; name: string; attending: Attending; message?: string; createdAt: string }[];
};

export type OutfitPick = {
  id: string;
  name: string;
  outfit: OutfitType;
  color: string;
  accent: string;
  vibe?: string;
  createdAt: string;
};

export type Photo = {
  id: string;
  url: string;
  uploader: string;
  phase: Phase;
  caption?: string;
  createdAt: string;
};

async function errorMessage(res: Response) {
  try {
    const body = await res.json();
    const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    if (msg) return String(msg);
  } catch {
    // body wasn't JSON — fall through to the generic message
  }
  return `Request failed (${res.status})`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
  } catch {
    throw new Error("Can't reach the party server — is the backend running?");
  }
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json() as Promise<T>;
}

const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  rsvpSummary: () => request<RsvpSummary>("/rsvp"),
  rsvp: (body: { name: string; attending: Attending; plusOnes: number; message?: string }) =>
    request("/rsvp", json(body)),

  outfits: () =>
    request<{ items: OutfitPick[]; stats: { byOutfit: Record<string, number>; byColor: Record<string, number> } }>(
      "/outfits",
    ),
  saveOutfit: (body: Omit<OutfitPick, "id" | "createdAt">) => request<OutfitPick>("/outfits", json(body)),

  photos: (phase?: Phase) => request<Photo[]>(`/photos${phase ? `?phase=${phase}` : ""}`),

  // XHR instead of fetch so we can show real upload progress
  uploadPhoto(
    data: { file: File; uploader: string; phase: Phase; caption?: string },
    onProgress?: (pct: number) => void,
  ) {
    return new Promise<Photo>((resolve, reject) => {
      const form = new FormData();
      form.append("uploader", data.uploader);
      form.append("phase", data.phase);
      if (data.caption) form.append("caption", data.caption);
      form.append("file", data.file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_URL}/photos`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        let body: { message?: string | string[] } & Partial<Photo> = {};
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          // non-JSON response handled below
        }
        if (xhr.status >= 200 && xhr.status < 300) resolve(body as Photo);
        else {
          const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
          reject(new Error(msg || `Upload failed (${xhr.status})`));
        }
      };
      xhr.onerror = () => reject(new Error("Can't reach the party server — is the backend running?"));
      xhr.send(form);
    });
  },
};
