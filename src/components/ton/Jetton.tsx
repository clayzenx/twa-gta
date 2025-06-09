import { useTonConnect } from "../hooks/ton/useTonConnect";
import { useFaucetJettonContract } from "../hooks/ton/useFaucetJettonContract";
import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Ellipsis,
} from "./styled/styled";

export function Jetton() {
  const { connected } = useTonConnect();
  const { mint, jettonWalletAddress, balance } = useFaucetJettonContract();

  return (
    <Card title="Jetton">
      <FlexBoxCol>
        <h3>Faucet Jetton</h3>
        <FlexBoxRow>
          Wallet
          <Ellipsis>{jettonWalletAddress}</Ellipsis>
        </FlexBoxRow>
        <FlexBoxRow>
          Balance
          <div>{balance ?? "Loading..."}</div>
        </FlexBoxRow>
        <Button
          disabled={!connected}
          onClick={async () => {
            mint();
          }}
        >
          Get jettons from faucet
        </Button>
      </FlexBoxCol>
    </Card>
  );
}
