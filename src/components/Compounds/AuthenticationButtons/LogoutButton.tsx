import { useToken } from "@/api";
import { Button } from "@/components/Atoms";

export function LogoutButton() {
  const { removeToken } = useToken();

  return (
    <Button
      label="Log Out"
      onClick={removeToken}
    />
  );
}
