import { MaterialIcons } from "@expo/vector-icons";

interface IconConfig {
  as: typeof MaterialIcons;
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
}

interface DropdownItem {
  _id: string;
  name: string;
  icon?: IconConfig;
}

export const DocumentServiceType: DropdownItem[] = [
  { 
    _id: "Express", 
    name: "Express",
    icon: { as: MaterialIcons, name: "flash-on", size: 16, color: "#666" }
  },
  { 
    _id: "Standard", 
    name: "Standard",
    icon: { as: MaterialIcons, name: "schedule", size: 16, color: "#666" }
  },
];

export const ParcelServiceType: DropdownItem[] = [
  { 
    _id: "Express", 
    name: "Express",
    icon: { as: MaterialIcons, name: "flash-on", size: 16, color: "#666" }
  },
  { 
    _id: "Economy", 
    name: "Economy",
    icon: { as: MaterialIcons, name: "savings", size: 16, color: "#666" }
  },
];

export const ShipmentType: DropdownItem[] = [
  { 
    _id: "Document", 
    name: "Document",
    icon: { as: MaterialIcons, name: "description", size: 16, color: "#666" }
  },
  { 
    _id: "Parcel", 
    name: "Parcel",
    icon: { as: MaterialIcons, name: "inventory-2", size: 16, color: "#666" }
  },
];

export const Handeling: DropdownItem[] = [
  { _id: "Fragile", name: "Fragile" },
  { _id: "Non-Fragile", name: "Non-Fragile" },
];

export const getServiceTypeOptions = (shipmentType: DropdownItem | null): DropdownItem[] => {
  if (!shipmentType) return [];
  return shipmentType._id === "Parcel" ? ParcelServiceType : DocumentServiceType;
};
