import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../App";
import QuestionBankImport from "../components/admin/question-bank/QuestionBankImport";
import QuestionBankList from "../components/admin/question-bank/QuestionBankList";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['question-bank'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredQuestions = questions?.filter(q => 
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Banque de Questions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importer des Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <QuestionBankImport />
          
          <div className="mt-6">
            <Input
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            
            {isLoading ? (
              <div>Chargement...</div>
            ) : (
              <QuestionBankList 
                questions={filteredQuestions || []} 
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionBank;