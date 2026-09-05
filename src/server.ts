import app from "./app";
import config from "./app/config";
import { transporter } from "./app/lib/nodemailer";
import { prisma } from "./app/lib/prisma";
import { redisClient } from "./app/lib/redis";
import { seedAdmin, seedCollector } from "./app/utils/seed";

async function main() {
	try {
		await prisma.$connect();
		console.log("Database Connect Successfully");
		await redisClient.connect();
		console.log("Redis Connect Successfully")
		await transporter.verify();
		console.log("Nodemailer Connect Successfully")
		seedAdmin();
		seedCollector();
		app.listen(config.port, () => {
			console.log(`Server Running int the port : ${config.port}`);
		});
	} catch (error) {
		console.log("Error Starting Server", error);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
