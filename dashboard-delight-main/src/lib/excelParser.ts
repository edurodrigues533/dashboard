import * as XLSX from 'xlsx';
import { UTMData, ProfileData, StateData } from '@/types/launch';

export const parseExcelFile = (file: File): Promise<{
  utmSourceData: UTMData[];
  utmCampaignData: UTMData[];
  profileData: ProfileData[];
  stateData: StateData[];
  totalResponses: number;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Record<string, string | number>[];
        
        // Process UTM Source
        const utmSourceMap = new Map<string, number>();
        const utmCampaignMap = new Map<string, number>();
        const profileMap = new Map<string, number>();
        const stateMap = new Map<string, number>();
        
        jsonData.forEach((row) => {
          // UTM Source
          const source = String(row['utm_source'] || row['UTM_SOURCE'] || row['source'] || 'null');
          utmSourceMap.set(source, (utmSourceMap.get(source) || 0) + 1);
          
          // UTM Campaign
          const campaign = String(row['utm_campaign'] || row['UTM_CAMPAIGN'] || row['campaign'] || 'null');
          utmCampaignMap.set(campaign, (utmCampaignMap.get(campaign) || 0) + 1);
          
          // Profile
          const profile = String(row['perfil'] || row['profile'] || row['PERFIL'] || 'Outros');
          profileMap.set(profile, (profileMap.get(profile) || 0) + 1);
          
          // State
          const state = String(row['estado'] || row['state'] || row['ESTADO'] || row['uf'] || 'Outros');
          stateMap.set(state, (stateMap.get(state) || 0) + 1);
        });
        
        const totalResponses = jsonData.length;
        
        const processMap = (map: Map<string, number>): UTMData[] => {
          const entries = Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
          
          return entries.map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / totalResponses) * 1000) / 10
          }));
        };
        
        const processMapAsProfile = (map: Map<string, number>): ProfileData[] => {
          const entries = Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
          
          return entries.map(([name, value]) => ({
            name: name.length > 30 ? name.substring(0, 30) + '...' : name,
            value,
            percentage: Math.round((value / totalResponses) * 1000) / 10
          }));
        };
        
        resolve({
          utmSourceData: processMap(utmSourceMap),
          utmCampaignData: processMap(utmCampaignMap),
          profileData: processMapAsProfile(profileMap),
          stateData: processMapAsProfile(stateMap) as StateData[],
          totalResponses
        });
      } catch (error) {
        reject(new Error('Erro ao processar arquivo Excel'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
};
