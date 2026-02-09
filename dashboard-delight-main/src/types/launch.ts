export interface LaunchData {
  id: string;
  name: string;
  date: string;
  totalResponses: number;
  utmSourceData: UTMData[];
  utmCampaignData: UTMData[];
  profileData: ProfileData[];
  stateData: StateData[];
}

export interface UTMData {
  name: string;
  count: number;
  percentage: number;
}

export interface ProfileData {
  name: string;
  value: number;
  percentage: number;
}

export interface StateData {
  name: string;
  value: number;
  percentage: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}
