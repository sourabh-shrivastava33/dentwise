import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import AdminDashboardClient from "./AdminDashboardClient";
async function AdminDashboard() {
  const user = await currentUser();

  console.log("current user:", user);

  if (!user) redirect("/");
  debugger;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const userEmail = user.emailAddresses[0]?.emailAddress;

  console.log("current user email", userEmail);

  if (userEmail !== adminEmail) redirect("/dashboard");

  return <AdminDashboardClient />;
}

export default AdminDashboard;
