import React, { useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Gender } from "@prisma/client";
import { formatPhoneNumber } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateDoctor } from "@/hooks/use-doctors";

interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddDoctorDialog({ isOpen, onClose }: AddDoctorDialogProps) {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    speciality: "",
    gender: "MALE" as Gender,
    phone: "",
    isActive: true,
  });

  function handlePhoneChange(value: string) {
    const formattedPhone = formatPhoneNumber(value);
    setNewDoctor((nd) => ({ ...nd, phone: formattedPhone }));
  }

  function handleClose() {
    setNewDoctor({
      name: "",
      email: "",
      speciality: "",
      gender: "MALE" as Gender,
      phone: "",
      isActive: true,
    });
    onClose();
  }

  const createDoctorMutation = useCreateDoctor();

  const handleSave = () => {
    createDoctorMutation.mutate({ ...newDoctor }, { onSuccess: handleClose });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add new Doctor</DialogTitle>
          <DialogDescription>
            Add a new doctor to your practice
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_name">Name *</Label>
              <Input
                id="new_name"
                placeholder="Dr. Sushil Kumar"
                onChange={(e) =>
                  setNewDoctor((nd) => ({ ...nd, name: e.target.value }))
                }
                value={newDoctor.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_speciality">Speciality *</Label>
              <Input
                id="new_speciality"
                placeholder="Cancer Specialist"
                onChange={(e) =>
                  setNewDoctor((nd) => ({ ...nd, speciality: e.target.value }))
                }
                value={newDoctor.speciality}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_email">Email *</Label>
            <Input
              id="new_email"
              placeholder="doctor@example.com"
              type="email"
              value={newDoctor.email}
              onChange={(e) =>
                setNewDoctor((nd) => ({ ...nd, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_phone_number">Phone</Label>
            <Input
              id="new_phone_number"
              placeholder="(555) 123-4567"
              value={newDoctor.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {" "}
              <Label htmlFor="new-gender">Gender</Label>
              <Select
                value={newDoctor.gender || ""}
                onValueChange={(value) =>
                  setNewDoctor({ ...newDoctor, gender: value as Gender })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-status">Status</Label>
              <Select
                value={newDoctor.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setNewDoctor({ ...newDoctor, isActive: value === "active" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={
              !newDoctor.name ||
              !newDoctor.email ||
              !newDoctor.speciality ||
              createDoctorMutation.isPending
            }
          >
            {createDoctorMutation.isPending ? "Adding..." : "Add Doctor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddDoctorDialog;
