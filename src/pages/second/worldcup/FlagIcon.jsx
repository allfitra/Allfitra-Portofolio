import React from 'react';

const FLAG_MAPPING = {
  'United States': '01_USA',
  'Canada': '02_Canada',
  'Mexico': '03_Mexico',
  'Japan': '04_Japan',
  'Iran': '05_Iran',
  'South Korea': '06_South_Korea',
  'Australia': '07_Australia',
  'Saudi Arabia': '08_Saudi_Arabia',
  'Qatar': '09_Qatar',
  'Uzbekistan': '10_Uzbekistan',
  'Jordan': '11_Jordan',
  'Iraq': '12_Iraq',
  'Argentina': '13_Argentina',
  'Brazil': '14_Brazil',
  'Uruguay': '15_Uruguay',
  'Colombia': '16_Colombia',
  'Ecuador': '17_Ecuador',
  'Paraguay': '18_Paraguay',
  'New Zealand': '19_New_Zealand',
  'Morocco': '20_Morocco',
  'Senegal': '21_Senegal',
  'Egypt': '22_Egypt',
  'Algeria': '23_Algeria',
  'Tunisia': '24_Tunisia',
  'South Africa': '25_South_Africa',
  'Ivory Coast': '26_Ivory_Coast',
  'Ghana': '27_Ghana',
  'Cape Verde': '28_Cape_Verde',
  'DR Congo': '29_DR_Congo',
  'England': '30_England',
  'France': '31_France',
  'Spain': '32_Spain',
  'Germany': '33_Germany',
  'Portugal': '34_Portugal',
  'Netherlands': '35_Netherlands',
  'Belgium': '36_Belgium',
  'Croatia': '37_Croatia',
  'Switzerland': '38_Switzerland',
  'Austria': '39_Austria',
  'Scotland': '40_Scotland',
  'Norway': '41_Norway',
  'Bosnia and Herzegovina': '42_Bosnia_and_Herzegovina',
  'Sweden': '43_Sweden',
  'Turkiye': '44_Turkiye',
  'Czech Republic': '45_Czechia',
  'Panama': '46_Panama',
  'Curacao': '47_Curacao',
  'Haiti': '48_Haiti'
};

export const getFlagUrl = (teamName) => {
  const fileName = FLAG_MAPPING[teamName];
  if (!fileName) return '';
  return new URL(`../../../assets/NegaraDunia/${fileName}.svg`, import.meta.url).href;
};

export const FlagIcon = ({ teamName, className = "w-5.5 h-4" }) => {
  const url = getFlagUrl(teamName);
  if (!url) return null;
  return (
    <img 
      src={url} 
      alt={teamName} 
      className={`rounded-sm object-cover flex-shrink-0 border border-white/10 shadow-sm ${className}`}
    />
  );
};

export default FlagIcon;
