import { generateCodeVerifier, generateCodeChallenge } from "./pkce";
import { scopes } from "./scopes";

const RESPONSE_TYPE = "code";
const CODE_CHALLENGE_METHOD = "S256";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

export async function getAuthURL(): Promise<string> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store code verifier for later use in token exchange
  window.sessionStorage.setItem("code_verifier", codeVerifier);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    response_type: RESPONSE_TYPE,
    code_challenge_method: CODE_CHALLENGE_METHOD,
    code_challenge: codeChallenge,
    scope: scopes.join(" ")
  });

  return `${AUTH_ENDPOINT}?${params.toString()}`;
}
