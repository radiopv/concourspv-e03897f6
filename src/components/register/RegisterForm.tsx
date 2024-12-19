import React from 'react';
import { useForm } from 'react-hook-form';
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import { useRegisterForm } from "./useRegisterForm";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  prefilledData?: {
    name?: string;
    email?: string;
  };
}

const RegisterForm = ({ prefilledData }: RegisterFormProps) => {
  const { form, handleRegistration } = useRegisterForm();

  return (
    <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
        <input
          id="firstName"
          type="text"
          {...form.register("firstName")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
        {form.formState.errors.firstName && (
          <p className="text-red-500 text-sm">{form.formState.errors.firstName.message?.toString()}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          id="lastName"
          type="text"
          {...form.register("lastName")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
        {form.formState.errors.lastName && (
          <p className="text-red-500 text-sm">{form.formState.errors.lastName.message?.toString()}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          defaultValue={prefilledData?.email}
          {...form.register("email")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">{form.formState.errors.email.message?.toString()}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          id="password"
          type="password"
          {...form.register("password")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">{form.formState.errors.password.message?.toString()}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Numéro de téléphone (optionnel)</label>
        <input
          id="phoneNumber"
          type="tel"
          {...form.register("phoneNumber")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
        {form.formState.errors.phoneNumber && (
          <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message?.toString()}</p>
        )}
      </div>

      <ProfilePhotoUpload />

      <Button type="submit" className="w-full">
        S'inscrire
      </Button>
    </form>
  );
};

export default RegisterForm;