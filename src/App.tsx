import "./App.css";
import { AppHeader } from "@/components/ui/AppHeader";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Loader } from "@react-three/drei"
import { FlexBoxCol, StyledApp, AppContainer } from "@/components/styled/styled";
import "@twa-dev/sdk";
import { UserProvider } from '@/context/UserContext';
import { ActivitiesProvider } from '@/context/ActivitiesContext';

function App() {
  return (
    <UserProvider>
      <ActivitiesProvider>
        <StyledApp>
          <Loader />
          <AppContainer>
            <FlexBoxCol>
              <AppHeader />
              <GameCanvas />
            </FlexBoxCol>
          </AppContainer>
        </StyledApp>
      </ActivitiesProvider>
    </UserProvider>
  );
}

export default App;
