import { getDecryptedGoogleAuthEmail } from "./getDecryptedGoogleAuthEmailAction";
import SignUpForm from "./SignupForm";

const Page = async () => {
  const googleAuthResponse = await getDecryptedGoogleAuthEmail();
  console.log("=======googleAuthResponse", googleAuthResponse);

  return <SignUpForm googleAuthResponse={googleAuthResponse} />;
};

export default Page;
