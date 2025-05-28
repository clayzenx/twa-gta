import "./App.css";
import { AppHeader } from "./components/AppHeader";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { FlexBoxCol } from "./components/styled/styled";
import "@twa-dev/sdk";
import { UserProvider } from '@/context/UserContext';
import { ActivitiesProvider } from '@/context/ActivitiesContext';
import { useActivitiesContext } from '@/hooks/useActivitiesContext';
import { reward } from '@/api/activities';

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
          <AppContainer>
            <FlexBoxCol>
              <AppHeader />
              {/* Секция активностей */}
              <ActivitiesSection />
              <Counter />
              <TransferTon />
              <Jetton />
            </FlexBoxCol>
          </AppContainer>
        </StyledApp>
      </ActivitiesProvider>
    </UserProvider>
  );
}
/**
 * TODO: (времено) Секция для отображения списка активностей и отправки запроса на вознаграждение
 */
function ActivitiesSection() {
  const { activities, loading, error, getTokenById } = useActivitiesContext();
  if (loading) return <div>Загрузка активностей…</div>;
  if (error) return <div>Ошибка загрузки: {error.message}</div>;
  return (
    <ul>
      {activities.map((a) => (
        <li
          key={a.id}
          onClick={() => {
            const token = getTokenById(ActivityIds.WELCOME);
            if (token) reward(token);
          }}
        >
          {a.name}
        </li>
      ))}
    </ul>
  );
}

export default App;
