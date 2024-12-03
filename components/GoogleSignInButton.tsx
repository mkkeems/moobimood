import { generateGoogleUrl } from "@/lib/google/generateGoogleUrl";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";

export const GoogleSignInButton = () => {
  const handleGoogleSignIn = async () => {
    const googleUrlWithToken = await generateGoogleUrl();
    // const response = await fetch(googleUrlWithToken);
    // console.log(response, response.json());
    // const { redirectUrl } = await response.json();
    window.location.href = googleUrlWithToken;
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
