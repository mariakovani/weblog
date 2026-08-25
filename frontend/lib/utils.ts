export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("el-GR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function getDisplayDate(createdAt: string, updatedAt: string | null): string {
  const isEdited = !!updatedAt && updatedAt !== createdAt;
  const dateToShow = isEdited ? updatedAt! : createdAt;
  const label = isEdited ? "Edited" : "Posted";
  return `${label} on ${formatDate(dateToShow)}`;
}