"use server";

import { prisma } from "../prisma";

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
export { getAppointments };
