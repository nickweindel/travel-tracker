"use client";

import { PageHeader } from "@/components/shared/page-header";

export default function PageClient({ user }: { user: any }) {
  return (
    <div>
      <PageHeader user={user} />
      <div className="flex flex-row gap-3 p-3">
        Hello World
      </div>
    </div>
  );
}