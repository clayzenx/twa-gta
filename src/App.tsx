import "./App.css";
import { AppHeader } from "@/components/ui/AppHeader";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Loader } from "@react-three/drei"
import { FlexBoxCol, StyledApp, AppContainer } from "@/components/styled/styled";
import "@twa-dev/sdk";
import { UserProvider } from '@/context/UserContext';
import { ActivitiesProvider } from '@/context/ActivitiesContext';
import { useGameStore } from "./store/gameStore";
import { selectGameRunning } from "./store/selectors";

function App() {
  const gameRunning = useGameStore(selectGameRunning)

  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default App;
