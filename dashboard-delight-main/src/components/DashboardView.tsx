import { Users, FileBarChart, Globe, Target } from 'lucide-react';
import { LaunchData, ChartDataItem } from '@/types/launch';
import StatCard from './StatCard';
import DataTable from './DataTable';
import PieChartCard from './PieChartCard';

interface DashboardViewProps {
  launches: LaunchData[];
}

const DashboardView = ({ launches }: DashboardViewProps) => {
  const currentLaunch = launches[launches.length - 1];
  const previousLaunch = launches.length > 1 ? launches[launches.length - 2] : null;

  if (!currentLaunch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <FileBarChart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Nenhum lançamento encontrado</h2>
        <p className="text-muted-foreground max-w-md">
          Vá para a aba "Cadastro" para criar seu primeiro lançamento e visualizar os dados aqui.
        </p>
      </div>
    );
  }

  const totalResponses = launches.reduce((acc, l) => acc + l.totalResponses, 0);
  const totalSources = new Set(launches.flatMap(l => l.utmSourceData.map(s => s.name))).size;
  const totalCampaigns = new Set(launches.flatMap(l => l.utmCampaignData.map(c => c.name))).size;

  const convertToChartData = (data: { name: string; value?: number; count?: number }[]): ChartDataItem[] => {
    return data.map((item, index) => ({
      name: item.name,
      value: item.value || item.count || 0,
      fill: ''
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{currentLaunch.name}</h1>
          <p className="text-muted-foreground">Dashboard de Pesquisa</p>
        </div>
        <div className="glass-card rounded-xl px-6 py-4 text-right">
          <p className="text-sm text-muted-foreground">Respostas</p>
          <p className="text-4xl font-bold text-primary">
            {currentLaunch.totalResponses.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Respostas" 
          value={totalResponses} 
          icon={Users}
          variant="primary"
        />
        <StatCard 
          title="Fontes de Tráfego" 
          value={totalSources} 
          icon={Globe}
          variant="secondary"
        />
        <StatCard 
          title="Campanhas" 
          value={totalCampaigns} 
          icon={Target}
          variant="accent"
        />
        <StatCard 
          title="Lançamentos" 
          value={launches.length} 
          icon={FileBarChart}
        />
      </div>

      {/* UTM Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable 
          title="utm_source" 
          data={currentLaunch.utmSourceData} 
        />
        <PieChartCard 
          title="Distribuição por Fonte" 
          data={convertToChartData(currentLaunch.utmSourceData)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable 
          title="utm_campaign" 
          data={currentLaunch.utmCampaignData} 
        />
        <PieChartCard 
          title="Distribuição por Campanha" 
          data={convertToChartData(currentLaunch.utmCampaignData)}
        />
      </div>

      {/* Profile and State Comparison */}
      {currentLaunch.profileData.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Em que perfil você se encaixa hoje?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PieChartCard 
              title="Perfil" 
              subtitle="Lançamento atual"
              data={convertToChartData(currentLaunch.profileData)}
            />
            {previousLaunch && previousLaunch.profileData.length > 0 && (
              <PieChartCard 
                title="Perfil" 
                subtitle="Lançamento anterior"
                data={convertToChartData(previousLaunch.profileData)}
              />
            )}
          </div>
        </div>
      )}

      {currentLaunch.stateData.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Estado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PieChartCard 
              title="Estado" 
              subtitle="Lançamento atual"
              data={convertToChartData(currentLaunch.stateData)}
            />
            {previousLaunch && previousLaunch.stateData.length > 0 && (
              <PieChartCard 
                title="Estado" 
                subtitle="Lançamento anterior"
                data={convertToChartData(previousLaunch.stateData)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
