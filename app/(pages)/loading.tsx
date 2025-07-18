import { Spinner } from "@/components/ui/spinner";

export default async function LoadingPage(p: {}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
