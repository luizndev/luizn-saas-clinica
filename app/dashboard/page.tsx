import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import SingOutButton from "./_components/singout-button";

const DashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

  return (
    <div>
        {session?.user?.email}
        {session?.user?.name}
        <SingOutButton />
    </div>
  )
}

export default DashboardPage