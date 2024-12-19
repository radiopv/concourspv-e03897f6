import { useNavigate } from "react-router-dom";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description: string;
  };
  onSelect: (contestId: string) => void;
}

const ContestCard = ({ contest, onSelect }: ContestCardProps) => {
  const navigate = useNavigate();
  
  const handleParticipate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/contests/${contest.id}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200" onClick={handleParticipate}>
      <h3 className="text-lg font-semibold">{contest.title}</h3>
      <p className="text-gray-600">{contest.description}</p>
      <button onClick={handleParticipate} className="mt-2 text-blue-500 hover:underline">
        Participer
      </button>
    </div>
  );
};

export default ContestCard;
