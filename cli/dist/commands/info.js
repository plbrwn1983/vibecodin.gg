import { getContribution } from "../lib/api.js";
import { formatDetail, error } from "../lib/display.js";
export async function showInfo(id) {
    try {
        const c = await getContribution(id);
        if (!c) {
            error(`Contribution "${id}" not found.`);
            process.exit(1);
        }
        console.log(formatDetail(c));
    }
    catch (err) {
        error(err.message);
        process.exit(1);
    }
}
