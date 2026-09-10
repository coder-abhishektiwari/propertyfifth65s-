import {
  PropertyStatus,
  ConsultationRequestStatus,
  CallbackRequestStatus,
  CustomerCategory,
} from "@prisma/client";

export function getPropertyStatusLabel(status: PropertyStatus): string {
  const labels: Record<PropertyStatus, string> = {
    NEW_LAUNCH: "New Launch",
    UNDER_CONSTRUCTION: "Under Construction",
    READY_TO_MOVE: "Ready to Move",
    RESALE: "Resale",
    SOLD_OUT: "Sold Out",
    OTHER: "Other",
  };
  return labels[status] || status;
}

export function getPropertyStatusLabelClass(status: PropertyStatus): string {
  if (status === "SOLD_OUT") return "bg-red-50 text-red-700 border border-red-200";
  return "bg-green-50 text-green-700 border border-green-200";
}

export function getConsultationStatusLabel(
  status: ConsultationRequestStatus
): string {
  const labels: Record<ConsultationRequestStatus, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    SCHEDULED: "Scheduled",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
}

export function getConsultationStatusLabelClass(
  status: ConsultationRequestStatus
): string {
  switch (status) {
    case "NEW":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "CONTACTED":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "SCHEDULED":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    case "COMPLETED":
      return "bg-green-50 text-green-700 border border-green-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

export function getCallbackStatusLabel(
  status: CallbackRequestStatus
): string {
  const labels: Record<CallbackRequestStatus, string> = {
    NEW: "Pending",
    CONTACTED: "Contacted",
    CALLBACK_SCHEDULED: "Scheduled",
    COMPLETED: "Completed",
    CANCELLED: "Closed",
  };
  return labels[status] || status;
}

export function getCallbackStatusLabelClass(
  status: CallbackRequestStatus
): string {
  switch (status) {
    case "NEW":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "CONTACTED":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "CALLBACK_SCHEDULED":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    case "COMPLETED":
      return "bg-green-50 text-green-700 border border-green-200";
    case "CANCELLED":
      return "bg-gray-50 text-gray-600 border border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

export function getCategoryLabel(category: CustomerCategory): string {
  switch (category) {
    case "NRI_UHNI":
      return "NRI / UHNI";
    case "DEFENCE_PERSONNEL":
      return "Defence Personnel";
    default:
      return category;
  }
}

export function getCategoryLabelClass(category: CustomerCategory): string {
  switch (category) {
    case "NRI_UHNI":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "DEFENCE_PERSONNEL":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}
