import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxRow } from "@/components/styled/styled";
import { Avatar } from "@/components/ui/Avatar";
import { CHAIN } from "@tonconnect/protocol";

import { useTonConnect } from "@/hooks/ton/useTonConnect";
import { useGameStore } from "@/store/gameStore";
import { selectStartGame, selectStopGame, selectGameRunning } from "@/store/selectors";
import { selectUser } from "@/store/selectors/playerSelectors";

export function AppHeader() {
  const { network } = useTonConnect();
  const user = useGameStore(selectUser)

  const gameRunning = useGameStore(selectGameRunning)
  const startGame = useGameStore(selectStartGame)
  const stopGame = useGameStore(selectStopGame)

  return (
    <FlexBoxRow>
      <Avatar firstName={user?.firstName} photoUrl={user?.photoUrl} />
      <span className="ml-3 mr-3">{user?.username}</span>
      <span>{user?.balance}</span>
      <Button onClick={gameRunning ? stopGame : startGame}>
        {gameRunning ? 'stopGame' : 'startGame'}
      </Button>
      <TonConnectButton />
      <Button>
        {network
          ? network === CHAIN.MAINNET
            ? "mainnet"
            : "testnet"
          : "N/A"}
      </Button>
      <pre>{JSON.stringify(user)}</pre>
    </FlexBoxRow>
  )

}
