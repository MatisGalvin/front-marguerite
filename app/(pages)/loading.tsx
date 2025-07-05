import { Spinner } from "@/components/ui/spinner";

export default async function LoadingPage(p: {}) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  );
}
