import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxRow } from "@/components/styled/styled";
import { Avatar } from "@/components/Avatar";
import { CHAIN } from "@tonconnect/protocol";

import { useTonConnect } from "@/hooks/useTonConnect";
import { useUser } from "@/context/UserContext"

export function AppHeader() {
  const { network } = useTonConnect();
  const { user } = useUser()

  return (
    <FlexBoxRow>
      <Avatar name={user?.first_name} photoUrl={user?.photo_url} />
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
