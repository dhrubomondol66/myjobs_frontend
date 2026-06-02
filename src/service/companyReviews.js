import API from "./api";

// Create review
export const createReview = (data) => {
  console.log("🚀 Creating review with data:", JSON.stringify(data, null, 2));
  return API.post("/reviews/create/", data).catch((err) => {
    console.error("❌ Failed to create review:");
    console.error("  Status:", err.response?.status);
    console.error("  Error Details:", JSON.stringify(err.response?.data, null, 2));
    console.error("  Full Error:", err.message);
    throw err;
  });
};


export const getReviews = () => {
  console.log("🚀 Fetching reviews");
  return API.get("/reviews/").catch((err) => {
    console.error("❌ Failed to fetch reviews:", err.response?.data || err.message);
    throw err;
  });
};