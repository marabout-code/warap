import type { Database } from "./database";

export type { Database };

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];

export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type ApplicationUpdate = Database["public"]["Tables"]["applications"]["Update"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
