// pages/api/customer/register.js
import supabase from "@/lib/createClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Customer creation using Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role: "customer",
        },
      },
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Customer registered successfully. Please check your email.",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}