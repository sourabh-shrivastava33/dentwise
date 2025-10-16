// selectedDentistId
// selectedDate
// selectedTime
// selectedType
// isBooking
// onBack
// onModify
// onConfirm

interface BookingConfirmationStepProps {
  selectedDentistId: string;
  selectedDate: string;
  selectedTime: string;
  selectedType: string;
  onBack: () => void;
  onModify: () => void;
  onConfirm: () => void;
  isBooking: boolean;
}

import { APPOINTMENT_TYPES } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DoctorInfo from "./DoctorInfo";

function BookingConfirmationStep({
  onBack,
  onConfirm,
  onModify,
  selectedDate,
  selectedDentistId,
  selectedTime,
  selectedType,
  isBooking,
}: BookingConfirmationStepProps) {
  const appointmentType = APPOINTMENT_TYPES.filter(
    (t) => t.id === selectedType
  )?.[0];

  return (
    <div className="space-y-6">
      {/* header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h2 className="text-2xl font-semibold">Confirm Your Appointment</h2>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Appointment summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <DoctorInfo selectedDentistId={selectedDentistId} />
          {/* appointment details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Appointment Type</p>
              <p className="font-medium">{appointmentType?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{appointmentType?.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{selectedTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">Dental Center</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost</p>
              <p className="font-medium text-primary">
                {appointmentType?.price}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onModify}>
          Modify Appointment
        </Button>
        <Button onClick={onConfirm} className="bg-primary" disabled={isBooking}>
          {isBooking ? "Booking..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}

export default BookingConfirmationStep;
