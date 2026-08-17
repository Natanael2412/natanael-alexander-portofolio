import { Metadata } from "next";
import InfiniteArchiveGrid from "@/components/sections/InfiniteArchiveGrid";

export const metadata: Metadata = {
  title: "Archive — Natanael Alexander",
  description: "Complete archive of selected works.",
};

export default function WorkPage() {
  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      <InfiniteArchiveGrid />
    </main>
  );
}
