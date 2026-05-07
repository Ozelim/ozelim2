export const dynamic = "force-dynamic";

import ResortsAdminClient from "./ResortsAdminClient";
import { listDirections, listBases, listServices } from "@/lib/resort-directions";

export default async function ResortsAdminPage() {
  const [directions, bases, services] = await Promise.all([
    listDirections(),
    listBases(),
    listServices(),
  ]);

  return (
    <ResortsAdminClient
      initialDirections={directions}
      initialBases={bases}
      initialServices={services}
    />
  );
}
