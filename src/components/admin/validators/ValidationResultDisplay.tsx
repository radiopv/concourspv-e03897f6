import { AlertCircle, CheckCircle, Clock, FileText, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ValidationResult {
  url?: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  type: 'link' | 'content' | 'seo';
  details?: string;
}

interface Props {
  results: ValidationResult[];
}

export const ValidationResultDisplay = ({ results }: Props) => {
  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: ValidationResult['type']) => {
    switch (type) {
      case 'link':
        return <Link2 className="w-4 h-4" />;
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'seo':
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div 
          key={index}
          className="flex items-start gap-4 p-4 border rounded-lg"
        >
          <div className="flex-shrink-0">
            {getStatusIcon(result.status)}
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="flex items-center gap-1">
                {getTypeIcon(result.type)}
                {result.type}
              </Badge>
              <span className="text-sm font-medium">{result.message}</span>
            </div>
            {result.url && (
              <p className="text-sm text-gray-500 break-all">{result.url}</p>
            )}
            {result.details && (
              <p className="text-sm text-gray-400 mt-1">{result.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};