import z from "zod";
import "rosetta";

export const buildZod = z.object({
	format: z.enum(["html", "pdf", "md"]).default("html"),
	out: z.string().min(1),
});
