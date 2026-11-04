import { AppRoutes } from './routes/AppRoutes';
import { AppErrorBoundary } from './components/common/AppErrorBoundary';

export function App() {
  return (
    <AppErrorBoundary>
      <AppRoutes />
    </AppErrorBoundary>
  );
}

export default App;
