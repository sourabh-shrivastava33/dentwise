"use server";

import { Gender } from "@prisma/client";
import { prisma } from "../prisma";
import { generateAvatar } from "../utils";

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.log("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}
interface createDoctorInput {
  name: string;
  email: string;
  speciality: string;
  phone: string;
  gender: Gender;
  isActive: boolean;
}

export async function createDoctor(input: createDoctorInput) {
  try {
    if (!input.name || !input.email)
      throw new Error("Name and Email are required");

    await prisma.doctor.create({
      data: { ...input, imageUrl: generateAvatar(input.name, input.gender) },
    });
  } catch (error) {
    console.log("Error Creating doctor", error);
    throw new Error("Failed to create doctor");
  }
}

interface updateDoctorInput extends Partial<createDoctorInput> {
  id: string;
}
export async function updateDoctor(input: updateDoctorInput) {
  try {
    if (!input.name || !input.email)
      throw new Error("Name and Email are required");

    const currentDoctor = await prisma.doctor.findFirst({
      where: { id: input.id },
    });

    if (!currentDoctor) throw new Error("Doctor not found");

    if (input.email !== currentDoctor.email) {
      const emailExists = await prisma.doctor.findFirst({
        where: {
          email: input.email,
        },
      });
      if (emailExists) throw new Error("Email already in use");
    }

    const doctor = await prisma.doctor.update({
      where: { id: input.id },
      data: {
        name: input.name,
        email: input.email,
        speciality: input.speciality,
        phone: input.phone,
        gender: input.gender,
        isActive: input.isActive,
      },
    });
    return doctor;
  } catch (error) {
    console.log("Error fetching doctors:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update doctor's info"
    );
  }
}
