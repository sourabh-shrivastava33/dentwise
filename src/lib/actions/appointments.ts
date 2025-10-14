"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

function transformAppointments(appointment: any) {
  return {
    ...appointment,
    patientName: `${appointment?.user?.firstName || ""} ${
      appointment?.user?.lastName || ""
    }`.trim(),
    patientEmail: appointment.user.email,
    doctorName: appointment.doctor.name,
    doctorImageUrl: appointment.doctor.imageUrl || "",
    date: appointment.date.toISOString().split("T")[0],
  };
}

async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: {
          select: { name: true, phone: true, email: true, isActive: true },
        },
      },
    });
    return appointments;
  } catch (error) {
    console.log("Error fetching appointments:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}

async function getUserAppointments() {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("You must be Logged in to view appointments");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user)
      throw new Error(
        "User not found, Please ensure your account is properly setup"
      );

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return appointments.map(transformAppointments);
  } catch (error) {
    let errorMessage = "Error getting user's Appointment details";
    console.log(errorMessage);
    throw new Error(error instanceof Error ? error.message : errorMessage);
  }
}

async function getUserAppointmentStats() {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("You must be Logged in to view appointments");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user)
      throw new Error(
        "User not found, Please ensure your account is properly setup"
      );

    const [totalCount, completedCount] = await Promise.all([
      prisma.appointment.count({
        where: { userId: user.id },
      }),
      prisma.appointment.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
      }),
    ]);

    return {
      totalAppointments: totalCount,
      completedAppointments: completedCount,
    };
  } catch (error) {
    let errorMessage = "Error getting user's Appointment stats";
    console.log(errorMessage);
    throw new Error(error instanceof Error ? error.message : errorMessage);
  }
}

export { getAppointments, getUserAppointments, getUserAppointmentStats };
