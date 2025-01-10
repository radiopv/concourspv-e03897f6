import QuestionsList from './questions/QuestionsList';

interface EditQuestionsListProps {
  contestId: string;
}

const EditQuestionsList = ({ contestId }: EditQuestionsListProps) => {
  return <QuestionsList contestId={contestId} />;
};

export default EditQuestionsList;