"use client";

import { getAppointments } from "@/lib/actions/appointments";
import { useQuery } from "@tanstack/react-query";

export function useAppointments() {
  const appointments = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  return appointments;
}
