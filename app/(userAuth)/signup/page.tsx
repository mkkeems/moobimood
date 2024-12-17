import { getDecryptedGoogleAuthEmail } from "./getDecryptedGoogleAuthEmailAction";
import SignUpForm from "./SignupForm";

const Page = async () => {
  const googleAuthEmail = await getDecryptedGoogleAuthEmail();
  return <SignUpForm googleAuthEmail={googleAuthEmail} />;
};

export default Page;
