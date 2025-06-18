import "./App.css";
import { AppHeader } from "@/components/ui/AppHeader";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Loader } from "@react-three/drei"
import { FlexBoxCol, StyledApp, AppContainer } from "@/components/styled/styled";
import "@twa-dev/sdk";
import { AppInitProvider } from '@/components/providers/AppInitProvider';
import { ActivitiesProvider } from '@/context/ActivitiesContext';
import { useGameStore } from "./store/gameStore";
import { selectGameRunning } from "./store/selectors";

function App() {
  const gameRunning = useGameStore(selectGameRunning)

  return (
    <AppInitProvider>
      <ActivitiesProvider>
        <StyledApp>
          <Loader />
          <AppContainer>
            <FlexBoxCol>
              <AppHeader />
              {gameRunning && <GameCanvas />}
            </FlexBoxCol>
          </AppContainer>
        </StyledApp>
      </ActivitiesProvider>
    </AppInitProvider>
  );
}

export default App;
