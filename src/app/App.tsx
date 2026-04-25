import { RouterProvider } from 'react-router';
import { router } from './routes';
import { GameStateProvider } from './context/GameStateContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <GameStateProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center" 
        expand={false} 
        richColors 
        closeButton
        theme="dark"
      />
    </GameStateProvider>
  );
}

export default App;
