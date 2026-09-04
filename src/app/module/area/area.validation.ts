import { z } from "zod";

export const CreateAreaPayloadSchema = z.object({
  name: z.string("Area name is required").min(1, "Area name cannot be empty"),
  collectorId: z.string("Collector ID is required").min(1, "Collector ID cannot be empty"),
});



