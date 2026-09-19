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
  if (status === "SOLD_OUT") return "badge-status badge-destructive";
  return "badge-status badge-success";
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
      return "badge-status badge-warning";
    case "CONTACTED":
      return "badge-status badge-info";
    case "SCHEDULED":
      return "badge-status badge-violet";
    case "COMPLETED":
      return "badge-status badge-success";
    case "CANCELLED":
      return "badge-status badge-destructive";
    default:
      return "badge-status";
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
      return "badge-status badge-warning";
    case "CONTACTED":
      return "badge-status badge-info";
    case "CALLBACK_SCHEDULED":
      return "badge-status badge-violet";
    case "COMPLETED":
      return "badge-status badge-success";
    case "CANCELLED":
      return "badge-status";
    default:
      return "badge-status";
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
      return "badge-status badge-info";
    case "DEFENCE_PERSONNEL":
      return "badge-status badge-warning";
    default:
      return "badge-status";
  }
}
