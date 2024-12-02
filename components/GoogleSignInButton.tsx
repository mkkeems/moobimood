import { Button } from "./ui/button";
import queryString from "query-string";
import { Icons } from "./ui/icons";
import { generateCSRFToken } from "@/utils/generateCSRFToken";

export const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      response_type: "code",
      scope: ["openid", "email", "profile"].join(" "),
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      state: generateCSRFToken(),
    };

    const url = `${rootUrl}?${queryString.stringify(options)}`;
    window.location.href = url; // Redirect to Google OAuth2
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200"
    >
      <Icons.google className="w-6 h-6" />
      <span>Continue with Google</span>
    </Button>
  );
};

export default GoogleSignInButton;
