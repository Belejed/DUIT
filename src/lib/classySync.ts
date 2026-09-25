import { ClassProfile, Student } from "@/types";

const FIREBASE_PROJECT_ID = "noted-7deda";
const FIREBASE_API_KEY = "AIzaSyAmTz5EH4Iy-CubYMuKcCwhhnltxbEmDs0";

export interface ClassyWorkspace {
  id: string;
  name: string;
  classIdentifier: string;
  academicPeriod: string;
  inviteCode: string;
  members: Array<{
    name: string;
    role: string;
    phoneNumber?: string;
    email?: string;
    userId?: string;
  }>;
}

/**
 * Fetches workspaces and class members directly from Classy's database (Firestore)
 */
export async function fetchClassyClasses(): Promise<ClassyWorkspace[]> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/workspaces?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch Classy data: HTTP ${res.status}`);
    }

    const data = await res.json();
    const documents = data.documents || [];

    const workspaces: ClassyWorkspace[] = documents.map((doc: any) => {
      const id = doc.name.split("/").pop() || "";
      const fields = doc.fields || {};

      let meta: any = {};
      try {
        if (fields.description?.stringValue?.startsWith("{")) {
          meta = JSON.parse(fields.description.stringValue);
        }
      } catch (err) {}

      const rawMembers = fields.members?.arrayValue?.values || [];
      const members = rawMembers
        .map((m: any) => {
          const f = m.mapValue?.fields || {};
          return {
            name: f.name?.stringValue || f.displayName?.stringValue || "Mahasiswa",
            role: f.role?.stringValue || "student",
            phoneNumber: f.phoneNumber?.stringValue || "",
            email: f.email?.stringValue || "",
            userId: f.userId?.stringValue || f.uid?.stringValue || "",
          };
        })
        .filter((m: any) => m.name && m.role !== "superadmin");

      return {
        id,
        name: fields.name?.stringValue || "Kelas Classy",
        classIdentifier: meta.classIdentifier || fields.description?.stringValue || "",
        academicPeriod: meta.academicPeriod || "Semester 1",
        inviteCode: fields.invite_code?.stringValue || "",
        members,
      };
    });

    return workspaces;
  } catch (err) {
    console.error("Error fetching Classy classes:", err);
    return [];
  }
}

/**
 * Converts Classy members into DUIT Student format sorted alphabetically
 */
export function convertClassyMembersToStudents(members: ClassyWorkspace["members"]): Student[] {
  // Sort alphabetically by name
  const sorted = [...members].sort((a, b) => a.name.localeCompare(b.name, "id"));

  return sorted.map((m, index) => {
    // Format phone to clean WhatsApp standard
    let cleanPhone = (m.phoneNumber || "").replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.slice(1);
    }

    return {
      id: m.userId || `classy-s-${index + 1}`,
      attendance_number: index + 1,
      name: m.name,
      gender: "L", // default
      phone_number: cleanPhone || undefined,
      is_active: true,
    };
  });
}
