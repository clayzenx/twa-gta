import "./App.css";
import { AppHeader } from "./components/AppHeader";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { FlexBoxCol } from "./components/styled/styled";
import "@twa-dev/sdk";
import { useInitApp } from '@/hooks/useInitApp'
import { UserContext } from "@/context/UserContext"

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
  const { user, setUser } = useInitApp()

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <StyledApp>
        <AppContainer>
          <FlexBoxCol>
            <AppHeader />
            <Counter />
            <TransferTon />
            <Jetton />
          </FlexBoxCol>
        </AppContainer>
      </StyledApp>
    </UserContext.Provider>
  );
}

export default App;
