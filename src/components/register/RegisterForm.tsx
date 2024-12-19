import React from 'react';
import { useForm } from 'react-hook-form';
import ProfilePhotoUpload from "./ProfilePhotoUpload";

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle registration logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="username"
          type="text"
          {...register("username", { required: "Username is required" })}
          className={`mt-1 block w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-opacity-50`}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message?.toString()}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
          className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-opacity-50`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message?.toString()}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
          className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-opacity-50`}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message?.toString()}</p>}
      </div>

      <ProfilePhotoUpload />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Register</button>
    </form>
  );
};

export default RegisterForm;