"use client";

import {
  getAppointments,
  getUserAppointments,
  getUserAppointmentStats,
} from "@/lib/actions/appointments";
import { useQuery } from "@tanstack/react-query";

export function useAppointments() {
  const appointments = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  return appointments;
}

export function useUserAppointments() {
  const userAppointments = useQuery({
    queryKey: ["getUserAppointments"],
    queryFn: getUserAppointments,
  });

  return userAppointments;
}
export function useUserAppointmentsStats() {
  const userAppointments = useQuery({
    queryKey: ["getUserAppointmentsStats"],
    queryFn: getUserAppointmentStats,
  });

  return userAppointments;
}
