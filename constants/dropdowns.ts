interface DropdownItem {
  _id: string;
  name: string;
}

export const ServiceType: DropdownItem[] = [
  { _id: "Express", name: "Express" },
  { _id: "Standard", name: "Standard" },
] as const;
export const ShipmentType: DropdownItem[] = [
  { _id: "Document", name: "Document" },
  { _id: "Parcel", name: "Parcel" },
] as const;
export const Handeling: DropdownItem[] = [
  { _id: "Fragile", name: "Fragile" },
  { _id: "Non-Fragile", name: "Non-Fragile" },
] as const;

