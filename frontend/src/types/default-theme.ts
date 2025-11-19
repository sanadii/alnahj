export interface CustomShadowProps {
  z1: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  primary: string;
  secondary: string;
  orange: string;
  success: string;
  warning: string;
  error: string;
}

export interface BreakpointSpacing {
  base: string;
  xs: string;
  sm: string;
  md: string;
}

export interface LayoutSpacing {
  shell: {
    padding: BreakpointSpacing;
    marginX: BreakpointSpacing;
    paddingBottom: BreakpointSpacing;
  };
}