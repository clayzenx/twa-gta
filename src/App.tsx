import "./App.css";
import { AppHeader } from "@/components/AppHeader";
import { GameCanvas } from "@/components/GameCanvas";
import { Loader } from "@react-three/drei"
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "@/components/styled/styled";
import "@twa-dev/sdk";
import { UserProvider } from '@/context/UserContext';
import { ActivitiesProvider } from '@/context/ActivitiesContext';
import { reward } from '@/api/activities';
import { ActivityIds } from "@/types/activities";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

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
              <FlexBoxRow>
                <Button
                  className={'Button Active'}
                  onClick={() => {
                    reward(ActivityIds.WELCOME);
                  }}
                >
                  Welcome Bonus
                </Button>
                <Button
                  className={'Button Active'}
                  onClick={() => {
                    reward(ActivityIds.DAILY_LOGIN);
                  }}
                >
                  Daily Login
                </Button>
                <Button
                  className={'Button Active'}
                  onClick={() => {
                    reward(ActivityIds.REFERRAL, { referrerTelegramId: 1337 });
                  }}
                >
                  Referral to 1337
                </Button>
                <Button
                  className={'Button Active'}
                  onClick={() => {
                    reward(ActivityIds.REFERRAL, { referrerTelegramId: 1234567890 });
                  }}
                >
                  Referral to 1234567890
                </Button>
              </FlexBoxRow>
            </FlexBoxCol>
          </AppContainer>
        </StyledApp>
      </ActivitiesProvider>
    </UserProvider>
  );
}

export default App;
