import { AppProvider } from '@/providers/app';
import { AppRoutes } from '@/routes';
import { ThemeProvider } from './utils/themeContext';

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
