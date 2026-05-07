
import mongoose from "mongoose";
import dns from "dns";

const setDnsServersForSrv = () => {
  const uri = process.env.MONGO_URI;
  if (uri && uri.startsWith("mongodb+srv://")) {
    const dnsServers = ["8.8.8.8", "1.1.1.1"];
    dns.setServers(dnsServers);
    console.log(
      "\x1b[36mUsing fallback DNS servers for MongoDB SRV lookup:\x1b[0m",
      dnsServers.join(", ")
    );
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    setDnsServersForSrv();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("\x1b[32mMongoDB Connected Successfully\x1b[0m");
  } catch (error) {
    // console.error("\x1b[31mMongoDB Connection Failed\x1b[0m", error);
    process.exit(1);
  }
};

export default connectDB;

