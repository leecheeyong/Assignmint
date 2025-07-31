export default function handler(req, res) {
  res.json({
    message: "Welcome to the AssignMint API 👋",
    endpoints: [
      "/api/auth",
      "/api/assignments",
      "/api/study-goals",
      "/api/group-promises",
      "/api/dashboard-summary"
    ]
  });
}