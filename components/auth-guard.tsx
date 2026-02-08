import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

interface AuthGuardProps {
    children: React.ReactNode;
    currentPath: string;
}

export async function AuthGuard({ children, currentPath }: AuthGuardProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isAuthPage = currentPath.startsWith("/auth");
    const isDashboardPage = currentPath.startsWith("/dashboard");

    // Se estiver na página de auth e tiver sessão, redireciona para dashboard
    if (isAuthPage && session) {
        redirect("/dashboard");
    }

    // Se estiver em página protegida (dashboard) e não tiver sessão, redireciona para auth
    if (isDashboardPage && !session) {
        redirect("/auth");
    }

    return <>{children}</>;
}
