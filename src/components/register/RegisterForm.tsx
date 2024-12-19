import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { NotificationPreferences } from "./NotificationPreferences";
import { SharingPreferences } from "./SharingPreferences";
import { RegisterFormFields } from "./RegisterFormFields";
import { useRegisterForm } from "./useRegisterForm";

export const RegisterForm = () => {
  const { form, handleRegistration } = useRegisterForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-6">
        <RegisterFormFields form={form} />
        <ProfilePhotoUpload />
        <NotificationPreferences />
        <SharingPreferences />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          S'inscrire
        </Button>
      </form>
    </Form>
  );
};