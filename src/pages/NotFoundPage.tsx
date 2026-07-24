import { TriangleAlert } from "lucide-react";
import Button from "../shared/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <TriangleAlert className="h-16 w-16 text-orange-500" />

      <h1 className="text-3xl font-bold">404</h1>

      <p className="text-gray-500">
        Page not exist
      </p>

      
      <Button href="/">Go back to home page</Button>
    </div>
  );
}