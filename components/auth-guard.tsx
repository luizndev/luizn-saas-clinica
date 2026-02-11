import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

interface AuthGuardProps {
    children: React.ReactNode;
    currentPath?: string;
}

export async function AuthGuard({ children, currentPath }: AuthGuardProps) {
    const headerList = await headers();
    const pathname = currentPath || headerList.get("x-pathname") || "/";

    const session = await auth.api.getSession({
        headers: headerList,
    });

    const isAuthPage = pathname.startsWith("/auth");
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isSubscriptionPage = pathname.startsWith("/subscription");
    const isHomePage = pathname === "/";

    const isPublicPage = isAuthPage || isHomePage;

    if (isAuthPage && session) {
        redirect("/dashboard");
    }

    if (isDashboardPage && !session) {
        redirect("/auth");
    }

    if (
        session?.user.plan === "free" &&
        !isSubscriptionPage &&
        !isPublicPage
    ) {
        redirect("/subscription");
    }

    return <>{children}</>;
}
