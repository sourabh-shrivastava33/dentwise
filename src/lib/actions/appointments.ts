"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { AppointmentStatus } from "@prisma/client";

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
    return appointments.map(transformAppointments);
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

async function getBookedTimeSlots(doctorId: string, date: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: {
          in: ["COMPLETED", "CONFIRMED"],
        },
      },
      select: { time: true },
    });

    return appointments.map((appointment) => appointment.time);
  } catch (error) {
    const errorMessage = "Error while fetching booked time slots:";
    console.log(errorMessage, error);
    return [];
  }
}

interface BookAppointmentInput {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export {
  getAppointments,
  getUserAppointments,
  getUserAppointmentStats,
  getBookedTimeSlots,
};

export async function bookAppointment(input: BookAppointmentInput) {
  try {
    const { userId } = await auth();
    if (!userId)
      throw new Error("You must be logged in to book an appointment");

    if (!input.doctorId || !input.date || !input.time) {
      throw new Error("Doctor, date, and time are required");
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user)
      throw new Error(
        "User not found. Please ensure your account is properly set up."
      );

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: input.doctorId,
        date: new Date(input.date),
        time: input.time,
        reason: input.reason || "General consultation",
        status: "CONFIRMED",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: { select: { name: true, imageUrl: true } },
      },
    });

    return transformAppointments(appointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw new Error("Failed to book appointment. Please try again later.");
  }
}

export async function updateAppointmentStatus(input: {
  id: string;
  appointmentStatus: AppointmentStatus;
}) {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: input.id,
      },
      data: {
        status: input.appointmentStatus,
      },
    });
  } catch (error) {
    console.log("Error while updating appointment status");
    throw new Error(
      "Error while updating appointment status. Please try again"
    );
  }
}
