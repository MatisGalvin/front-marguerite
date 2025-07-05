import { AuthContext } from "@/components/providers/AuthProvider";
import { useSafeContext } from "./contexts";

export const useAuthContext = () => {
  return useSafeContext(AuthContext);
};
