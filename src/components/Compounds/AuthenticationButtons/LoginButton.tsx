import { getAuthURL } from "@/api";
import { Button } from "@/components/Atoms";

export function LoginButton() {
  const handleLogin = async () => {
    const authURL = await getAuthURL();
    window.location.href = authURL;
  };

  return (
    <Button
      label={"Login To Spotify".toUpperCase()}
      onClick={handleLogin}
    />
  );
}
