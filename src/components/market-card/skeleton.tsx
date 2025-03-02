import { Card } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg overflow-hidden border border-indigo-500/20 animate-pulse">
      <div className="p-6 relative">
        <div className="h-7 bg-indigo-500/10 rounded-md w-3/4 mb-2"></div>
        <div className="h-5 bg-indigo-500/10 rounded-md w-1/2 mb-4"></div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-800/50 border border-indigo-500/20"
            >
              <div className="h-4 w-4 bg-indigo-500/20 rounded-full mb-2"></div>
              <div className="h-4 bg-indigo-500/20 rounded-md w-16 mb-1"></div>
              <div className="h-3 bg-indigo-500/20 rounded-md w-12"></div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-indigo-500/10 rounded-full w-16"></div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 pt-0">
        <div className="h-10 bg-indigo-500/20 rounded-md w-full"></div>
      </div>
    </Card>
  );
}