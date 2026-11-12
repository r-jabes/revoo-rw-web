import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export default function NotFound() {
  return (
    <PagePlaceholder
      eyebrow="404"
      title="Off route."
      note="That page doesn't exist. Head back to the start and pick up the ride."
    />
  );
}
