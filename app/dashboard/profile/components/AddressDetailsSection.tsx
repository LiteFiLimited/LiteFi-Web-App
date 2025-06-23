import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  states,
  homeOwnershipOptions,
} from '@/lib/data/states';
import { FormData, FormField } from './types';

interface AddressDetailsSectionProps {
  formData: FormData;
  handleChange: (field: FormField, value: string) => void;
  showErrors: Record<string, boolean>;
  validations: Record<string, boolean>;
  selectedState: string;
  handleStateChange: (value: string) => void;
  availableLgas: string[];
}

export function AddressDetailsSection({
  formData,
  handleChange,
  showErrors,
  validations,
  selectedState,
  handleStateChange,
  availableLgas,
}: AddressDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Address Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Street No</Label>
          <Input
            name="streetNo"
            value={formData.streetNo}
            onChange={(e) => handleChange("streetNo", e.target.value)}
            className={showErrors.streetNo && !validations.streetNo ? "border-red-500" : ""}
            placeholder="Enter street number"
          />
        </div>

        <div className="space-y-4">
          <Label>Street Name</Label>
          <Input
            name="streetName"
            value={formData.streetName}
            onChange={(e) => handleChange("streetName", e.target.value)}
            className={showErrors.streetName && !validations.streetName ? "border-red-500" : ""}
            placeholder="Enter street name"
          />
        </div>

        <div className="space-y-4">
          <Label>Nearest Bus Stop</Label>
          <Input
            name="nearestBusStop"
            value={formData.nearestBusStop}
            onChange={(e) => handleChange("nearestBusStop", e.target.value)}
            className={showErrors.nearestBusStop && !validations.nearestBusStop ? "border-red-500" : ""}
            placeholder="Enter nearest bus stop"
          />
        </div>

        <div className="space-y-4">
          <Label>State</Label>
          <Select
            name="state"
            value={formData.state}
            onValueChange={handleStateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.alias} value={state.state}>
                  {state.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Local Government</Label>
          <Select
            name="localGovernment"
            value={formData.localGovernment}
            onValueChange={(value) => handleChange("localGovernment", value)}
            disabled={!selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedState ? "Select LGA" : "Select state first"} />
            </SelectTrigger>
            <SelectContent>
              {availableLgas.map((lga) => (
                <SelectItem key={lga} value={lga}>
                  {lga}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Home Ownership</Label>
          <Select
            name="homeOwnership"
            value={formData.homeOwnership}
            onValueChange={(value) => handleChange("homeOwnership", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select home ownership" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(homeOwnershipOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Years at Current Address</Label>
          <Input
            name="yearsInCurrentAddress"
            value={formData.yearsInCurrentAddress}
            onChange={(e) => handleChange("yearsInCurrentAddress", e.target.value)}
            type="number"
            className={showErrors.yearsInCurrentAddress && !validations.yearsInCurrentAddress ? "border-red-500" : ""}
            placeholder="Enter number of years"
          />
        </div>
      </div>
    </div>
  );
} 