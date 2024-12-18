import { motion } from "framer-motion";

interface ContestHeaderProps {
  title: string;
  description: string;
}

const ContestHeader = ({ title, description }: ContestHeaderProps) => {
  return (
    <div className="text-center animate-fadeIn">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-xl text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default ContestHeader;