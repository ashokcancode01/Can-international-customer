interface DropdownItem {
  _id: string;
  name: string;
}

export const DocumentServiceType: DropdownItem[] = [
  { _id: "Express", name: "Express" },
  { _id: "Standard", name: "Standard" },
];

export const ParcelServiceType: DropdownItem[] = [
  { _id: "Express", name: "Express" },
  { _id: "Economy", name: "Economy" },
];

export const ShipmentType: DropdownItem[] = [
  { _id: "Document", name: "Document" },
  { _id: "Parcel", name: "Parcel" },
];

export const Handeling: DropdownItem[] = [
  { _id: "Fragile", name: "Fragile" },
  { _id: "Non-Fragile", name: "Non-Fragile" },
];

export const getServiceTypeOptions = (shipmentType: DropdownItem | null): DropdownItem[] => {
  if (!shipmentType) return [];
  return shipmentType._id === "Parcel" ? ParcelServiceType : DocumentServiceType;
};
