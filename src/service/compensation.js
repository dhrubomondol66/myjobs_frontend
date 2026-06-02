import API from "./api";

// Create compensation entry
export const createCompensation = (data) => {
  console.log("🚀 Creating compensation with data:", JSON.stringify(data, null, 2));
  return API.post("/compensation/create/", data).catch((err) => {
    console.error("❌ Failed to create compensation:");
    console.error("  Status:", err.response?.status);
    console.error("  Error Details:", JSON.stringify(err.response?.data, null, 2));
    console.error("  Full Error:", err.message);
    throw err;
  });
};

// List compensation data
export const getCompensation = () => {
  console.log("🚀 Fetching compensation");
  return API.get("/compensation/").catch((err) => {
    console.error("❌ Failed to fetch compensation:", err.response?.data || err.message);
    throw err;
  });
};