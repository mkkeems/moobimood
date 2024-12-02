import { useEffect } from "react";
// import { Button } from "./ui/button";

type GoogleSignInButtonProps = {
  redirectPath?: string;
  text?: string;
  icon?: React.ReactNode;
};

declare global {
  interface Window {
    google: any;
  }
}

export const GoogleSignInButton = ({
  redirectPath = "/",
}: // text = "Continue with Google",
// icon,
GoogleSignInButtonProps) => {
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: async (response: any) => {
              const { credential } = response;

              console.log(response);

              // Send the token to your backend for verification and session creation
              const res = await fetch("/api/auth/google/callback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credential, redirectPath }),
              });

              const data = await res.json();

              if (data.success) {
                window.location.href = redirectPath || "/";
              } else {
                console.error("Google Sign-In failed:", data.error);
              }
            },
            auto_select: false, // Prevent automatic sign-in
            // ux_mode: "popup", // Redirect instead of popup
          });

          window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            { theme: "outline", size: "large", text: "continue_with" }
          );
        }
      };

      document.body.appendChild(script);
    };
    if (!window.google) {
      loadGoogleScript();
    }
  }, [redirectPath]);

  //// Uncomment below for a custom button --not working rn though
  // const handleButtonClick = () => {
  //   if (window.google) {
  //     console.log(window.google);
  //     window.google.accounts.id.prompt(); // Open Google Sign-In popup
  //   } else {
  //     console.error("Google Identity Services not loaded.");
  //   }
  // };

  // return (
  //   <Button
  //     onClick={handleButtonClick}
  //     className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200"
  //   >
  //     {icon && <span>{icon}</span>}
  //     <span>{text}</span>
  //   </Button>
  // );
  return <div id="google-signin-button"></div>;
};

export default GoogleSignInButton;
