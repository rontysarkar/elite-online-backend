import z from "zod";

export const CreatePaymentByCollectorSchema = z.object({
	billId: z.string("BillId Is Required"),
});
