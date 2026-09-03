import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";

async function main() {
	try {
		await prisma.$connect();
		console.log("Database Connect Successfully");
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
