
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContestDatesProps {
  startDate?: string;
  endDate?: string;
}

const ContestDates = ({ startDate, endDate }: ContestDatesProps) => {
  if (!startDate || !endDate) return null;

  return (
    <div className="mt-4 text-sm text-gray-600">
      <p>Du {format(new Date(startDate), 'dd MMMM yyyy', { locale: fr })}</p>
      <p>Au {format(new Date(endDate), 'dd MMMM yyyy', { locale: fr })}</p>
    </div>
  );
};

export default ContestDates;
