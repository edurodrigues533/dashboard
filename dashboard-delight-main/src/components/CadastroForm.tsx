import { useState } from 'react';
import { Calendar, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import { parseExcelFile } from '@/lib/excelParser';
import { LaunchData } from '@/types/launch';

interface CadastroFormProps {
  onLaunchCreated: (launch: LaunchData) => void;
}

const CadastroForm = ({ onLaunchCreated }: CadastroFormProps) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome do lançamento",
        variant: "destructive"
      });
      return;
    }

    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo Excel",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const parsedData = await parseExcelFile(file);
      
      const launch: LaunchData = {
        id: Date.now().toString(),
        name: name.trim(),
        date: date || new Date().toISOString().split('T')[0],
        totalResponses: parsedData.totalResponses,
        utmSourceData: parsedData.utmSourceData,
        utmCampaignData: parsedData.utmCampaignData,
        profileData: parsedData.profileData,
        stateData: parsedData.stateData
      };

      onLaunchCreated(launch);
      
      toast({
        title: "Sucesso!",
        description: `Lançamento "${name}" criado com ${parsedData.totalResponses.toLocaleString('pt-BR')} registros`,
      });

      // Reset form
      setName('');
      setDate('');
      setFile(null);
    } catch (error) {
      toast({
        title: "Erro ao processar arquivo",
        description: "Verifique se o arquivo está no formato correto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground mb-6">Novo Lançamento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Lançamento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: PALI06 - Lançamento Março"
              className="bg-muted border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data do Lançamento</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-muted border-border pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Arquivo de Dados</Label>
            <FileUpload 
              onFileSelect={setFile}
              isLoading={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Lançamento
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CadastroForm;
