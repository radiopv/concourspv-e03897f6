import LoginForm from "@/components/login/LoginForm";

const Login = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
      <LoginForm />
    </div>
  );
};

export default Login;