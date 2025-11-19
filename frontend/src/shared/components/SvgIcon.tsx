import React from 'react';
import { SvgIcons } from 'shared/constants';

interface SvgIconProps {
  icon: string; // Icon name
}

const SvgIcon: React.FC<SvgIconProps> = ({ icon }) => {
  const iconData = SvgIcons[icon]; // Fetch icon data based on icon name

  if (!iconData) {
    return null; // Return null if icon data is not found
  }

  const { viewBox, pathData } = iconData;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="16" height="16">
      <path fill="none" fillRule="evenodd" stroke="#13846e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={pathData} />
    </svg>
  );
};

export default SvgIcon;
