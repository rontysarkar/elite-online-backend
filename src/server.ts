import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database Connect Successfully");
    app.listen(3000, () => {
      console.log(`Server Running int the port : ${PORT}`);
    });
  } catch (error) {
    console.log("Error Starting Server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
