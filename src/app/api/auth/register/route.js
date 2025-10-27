import bcrypt from "bcryptjs";

import prisma from "@/lib/db/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        emailVerified: new Date(),
        name,
        password: hashedPassword,
      },
      select: {
        createdAt: true,
        email: true,
        id: true,
        image: true,
        name: true,
      },
    });
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
