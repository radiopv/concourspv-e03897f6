import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import { RegisterFormFields } from "./RegisterFormFields";
import { useRegisterForm } from "./useRegisterForm";

const RegisterForm = () => {
  const form = useForm();
  const { handleRegister } = useRegisterForm();

  return (
    <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
      <RegisterFormFields form={form} />
      <ProfilePhotoUpload />
      <Button type="submit">Register</Button>
    </form>
  );
};

export default RegisterForm;