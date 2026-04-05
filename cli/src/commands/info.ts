import { getContribution } from "../lib/api.js";
import { formatDetail, error } from "../lib/display.js";

export async function showInfo(id: string) {
  try {
    const c = await getContribution(id);
    if (!c) {
      error(`Contribution "${id}" not found.`);
      process.exit(1);
    }
    console.log(formatDetail(c));
  } catch (err) {
    error((err as Error).message);
    process.exit(1);
  }
}
