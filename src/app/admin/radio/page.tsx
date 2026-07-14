import { db } from "@/lib/db";
import { RadioConfigContent } from "./radio-config-content";

export const dynamic = "force-dynamic";

export default async function AdminRadioPage() {
  const config = await db.radioConfig.findFirst();
  return <RadioConfigContent config={config ? JSON.parse(JSON.stringify(config)) : null} />;
}
