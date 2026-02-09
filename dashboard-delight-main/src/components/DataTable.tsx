import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UTMData } from '@/types/launch';

interface DataTableProps {
  title: string;
  data: UTMData[];
}

const DataTable = ({ title, data }: DataTableProps) => {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="max-h-80 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">{title}</TableHead>
              <TableHead className="text-right text-muted-foreground">Record Count ↓</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow 
                key={index} 
                className="border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {item.name}
                </TableCell>
                <TableCell className="text-right text-foreground font-mono">
                  {item.count.toLocaleString('pt-BR')}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-border bg-muted/30">
              <TableCell className="font-bold text-foreground">Total geral</TableCell>
              <TableCell className="text-right font-bold text-foreground font-mono">
                {total.toLocaleString('pt-BR')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="p-3 border-t border-border text-center text-sm text-muted-foreground">
        1 - {data.length} / {data.length}
      </div>
    </div>
  );
};

export default DataTable;
