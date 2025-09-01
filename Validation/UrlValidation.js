import { z } from "zod";

export const UrlValidation = z.object({
    url: z.url()
})