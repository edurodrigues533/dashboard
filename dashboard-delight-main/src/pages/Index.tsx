import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CadastroForm from '@/components/CadastroForm';
import DashboardView from '@/components/DashboardView';
import { LaunchData } from '@/types/launch';

const exampleLaunch: LaunchData = {
  id: 'example-1',
  name: 'MVP - DASHBOARD',
  date: '2024-03-15',
  totalResponses: 2398,
  utmSourceData: [
    { name: 'Orgânico', count: 701, percentage: 29.2 },
    { name: 'Google', count: 340, percentage: 14.2 },
    { name: 'Instagram', count: 268, percentage: 11.2 },
    { name: 'Facebook', count: 241, percentage: 10.1 },
    { name: 'YouTube', count: 222, percentage: 9.3 },
    { name: 'TikTok', count: 196, percentage: 8.2 },
    { name: 'LinkedIn', count: 174, percentage: 7.3 },
    { name: 'E-mail', count: 83, percentage: 3.5 }, 
    { name: 'WhatsApp', count: 77, percentage: 3.2 },
    { name: 'Twitter', count: 96, percentage: 4.0 },
  ],
  utmCampaignData: [
    { name: 'Orgânico', count: 701, percentage: 29.2 },
    { name: 'Campanha Meta', count: 524, percentage: 21.9 },
    { name: 'Campanha Instagram', count: 241, percentage: 10.1 },
    { name: 'Lista de Espera', count: 222, percentage: 9.3 },
    { name: 'Remarketing', count: 196, percentage: 8.2 },
    { name: 'Campanha YouTube', count: 185, percentage: 7.7 },
    { name: 'Lookalike Meta', count: 169, percentage: 7.0 },
    { name: 'Lookalike YouTube', count: 155, percentage: 6.5 },
  ],
  profileData: [
    { name: 'Iniciante buscando conhecimento', value: 1278, percentage: 53.3 },
    { name: 'Profissional experiente', value: 317, percentage: 13.2 },
    { name: 'Empreendedor iniciando negócio', value: 302, percentage: 12.6 },
    { name: 'Estudante universitário', value: 271, percentage: 11.3 },
    { name: 'Outros', value: 230, percentage: 9.6 },
  ],
  stateData: [
    { name: 'São Paulo', value: 542, percentage: 22.6 },
    { name: 'Rio de Janeiro', value: 489, percentage: 20.4 },
    { name: 'Minas Gerais', value: 216, percentage: 9.0 },
    { name: 'Bahia', value: 144, percentage: 6.0 },
    { name: 'Paraná', value: 120, percentage: 5.0 },
    { name: 'Rio Grande do Sul', value: 108, percentage: 4.5 },
    { name: 'Santa Catarina', value: 96, percentage: 4.0 },
    { name: 'Goiás', value: 72, percentage: 3.0 },
    { name: 'Pernambuco', value: 48, percentage: 2.0 },
    { name: 'Outros', value: 563, percentage: 23.5 },
  ],
};

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'cadastro'>('dashboard');
  const [launches, setLaunches] = useState<LaunchData[]>([exampleLaunch]);

  // Load launches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-launches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setLaunches(parsed);
        }
      } catch (e) {
        console.error('Error loading saved launches');
      }
    }
  }, []);

  // Save launches to localStorage when updated
  useEffect(() => {
    if (launches.length > 0) {
      localStorage.setItem('dashboard-launches', JSON.stringify(launches));
    }
  }, [launches]);

  const handleLaunchCreated = (launch: LaunchData) => {
    setLaunches(prev => [...prev, launch]);
    setCurrentPage('dashboard');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-auto">
        {currentPage === 'cadastro' ? (
          <CadastroForm onLaunchCreated={handleLaunchCreated} />
        ) : (
          <DashboardView launches={launches} />
        )}
      </main>
    </div>
  );
};

export default Index;
