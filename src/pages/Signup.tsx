import { RegisterForm } from "@/components/register/RegisterForm";
import Layout from "@/components/Layout";

const Signup = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Inscription</h1>
          <RegisterForm />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;