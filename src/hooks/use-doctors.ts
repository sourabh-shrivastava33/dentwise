"use client";

import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "../lib/actions/doctors";

export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });

  return result;
}
