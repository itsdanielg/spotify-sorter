import { useCurrentUser, useCurrentUserReturn } from "@/api";
import { UserContext } from "@/context";
import { AppRoutes } from "./AppRoutes";
import { Navigation } from "./Layouts";
import { Page } from "./Templates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function AppAuthenticated() {
  const { data, error } = useCurrentUser();

  if (error) return <Page error={error} />;

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={data as useCurrentUserReturn}>
        <div className="flex flex-col w-full h-screen overflow-x-hidden">
          <Navigation />
          <AppRoutes />
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
