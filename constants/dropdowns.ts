interface DropdownItem {
  _id: string;
  name: string;
}

export const Priority: DropdownItem[] = [
  { _id: "Normal", name: "Normal" },
  { _id: "High", name: "High" },
  { _id: "Urgent", name: "Urgent" },
] as const;
export const Handeling: DropdownItem[] = [
  { _id: "Fragile", name: "Fragile" },
  { _id: "Non-Fragile", name: "Non-Fragile" },
] as const;

export const ProductSellingUnits: DropdownItem[] = [
  { _id: "Piece", name: "Piece" },
  { _id: "Kilogram", name: "Kilogram" },
  { _id: "Gram", name: "Gram" },
  { _id: "Litre", name: "Litre" },
  { _id: "Millilitre", name: "Millilitre" },
  { _id: "Meter", name: "Meter" },
  { _id: "Centimeter", name: "Centimeter" },
  { _id: "Inch", name: "Inch" },
  { _id: "Foot", name: "Foot" },
  { _id: "Dozen", name: "Dozen" },
  { _id: "Pair", name: "Pair" },
  { _id: "Bundle", name: "Bundle" },
  { _id: "Set", name: "Set" },
  { _id: "Sheet", name: "Sheet" },
  { _id: "Roll", name: "Roll" },
  { _id: "Tube", name: "Tube" },
] as const;

export const commentTypes = [
  { _id: "Note", name: "Note" },
  { _id: "Call", name: "Call" },
  { _id: "Meeting", name: "Meeting" },
  { _id: "Email", name: "Email" },
  { _id: "Other", name: "Other" },
];

export const deliveryStatuses = [
  { _id: "Pickup Order Created", name: "Pickup Order Created" },
  { _id: "Order Created", name: "Order Created" },
  { _id: "Pickup Scheduled", name: "Pickup Scheduled" },
  { _id: "Pickup Confirmed", name: "Pickup Confirmed" },
];
