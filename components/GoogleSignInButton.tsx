import { Button } from "./ui/button";
import { Icons } from "./ui/icons";

export const GoogleSignInButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch("/api/auth/google/init");
      const { redirectUrl } = await response.json();

      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.error("Failed to retrieve Google OAuth URL");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during Google Sign-In initialization:", error);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200"
    >
      <Icons.google className="w-6 h-6" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
