
import {lazy, Suspense} from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";

const DashboardContent = lazy(() => import("@/components/dashboard/dashboard-content"))


export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<p>Loading dashboard...</p>}>
        <DashboardContent />
      </Suspense>    
    </ProtectedRoute>
  )
}
