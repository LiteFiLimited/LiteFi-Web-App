// Chart color constants - using exact hex values
export const CHART_COLORS = {
  // Core chart colors
  purple: '#AF52DE',
  orange: '#FF9500',
  green: '#089600', // Green-500 color
  'green-500': '#089600',
  'green-400': '#00D09C',
  
  // Common UI colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Chart-specific colors
  grid: '#f0f0f0',
  tooltip: {
    border: '#e0e0e0',
    shadow: 'rgba(0,0,0,0.05)',
  },
  
  // Alpha variations for commonly used colors
  alpha: {
    green: {
      50: 'rgba(8, 150, 0, 0.05)', // Nearly transparent
      200: 'rgba(8, 150, 0, 0.2)',  // Low opacity
      500: 'rgba(8, 150, 0, 0.5)',  // Medium opacity
    }
  },
  
  // References to CSS variable names for easier reference
  'chart-purple': '#AF52DE',
  'chart-orange': '#FF9500',
  'chart-green': '#089600',
};
