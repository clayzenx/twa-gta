import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxRow } from "@/components/styled/styled";
import { Avatar } from "@/components/ui/Avatar";
import { CHAIN } from "@tonconnect/protocol";

import { useTonConnect } from "@/hooks/ton/useTonConnect";
import { useUser } from "@/context/UserContext"

export function AppHeader() {
  const { network } = useTonConnect();
  const { user } = useUser()

  return (
    <FlexBoxRow>
      <Avatar firstName={user?.firstName} photoUrl={user?.photoUrl} />
      <span className="ml-3 mr-3">{user?.username}</span>
      <span>{user?.balance}</span>
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
