import React from 'react';
import { useForm } from 'react-hook-form';
import { Question, QuestionFormProps } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const QuestionForm: React.FC<QuestionFormProps> = ({
  initialQuestion,
  contestId,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Question, "id">>({
    defaultValues: initialQuestion || {
      contest_id: contestId,
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
      article_url: '',
      type: 'multiple_choice',
      image_url: '',
      status: 'available',
    },
  });

  const onSubmitForm = (data: Omit<Question, "id">) => {
    onSubmit({
      ...data,
      contest_id: contestId,
      type: 'multiple_choice',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Question</label>
        <Textarea {...register('question_text', { required: true })} />
        {errors.question_text && (
          <span className="text-red-500">Ce champ est requis</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Options</label>
        {[0, 1, 2, 3].map((index) => (
          <Input
            key={index}
            {...register(`options.${index}`, { required: true })}
            className="mt-2"
            placeholder={`Option ${index + 1}`}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bonne réponse</label>
        <Input {...register('correct_answer', { required: true })} />
        {errors.correct_answer && (
          <span className="text-red-500">Ce champ est requis</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL de l'article (optionnel)</label>
        <Input {...register('article_url')} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL de l'image (optionnel)</label>
        <Input {...register('image_url')} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialQuestion ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;