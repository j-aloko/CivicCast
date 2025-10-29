import React from "react";

import { getServerSession } from "next-auth/next";

import DashboardContainer from "@/containers/dashboard-container/DashboardContainer";
import authOptions from "@/lib/auth/options";

export const metadata = {
  description: "Manage your polls and track engagement",
  title: "Dashboard - QuickPoll",
};

async function DashboardPage() {
  const session = await getServerSession(authOptions);
  return <DashboardContainer session={session} />;
}

export default DashboardPage;
