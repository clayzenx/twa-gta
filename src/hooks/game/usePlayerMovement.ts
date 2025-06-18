import { useGameStore } from "@/store/gameStore";
import { selectInput, selectPlayer, selectPlayerGameState, selectUpdatePlayerPosition } from "@/store/selectors";
import { useFrame } from "@react-three/fiber";

const TAG = '[usePlayerMovement]'

export function usePlayerMovement() {
  const input = useGameStore(selectInput);
  const playerGameState = useGameStore(selectPlayerGameState);
  const player = useGameStore(selectPlayer);
  const updatePlayerPosition = useGameStore(selectUpdatePlayerPosition);

  if (!player) throw new Error(`${TAG}: player does not exist`)
  if (!playerGameState) throw new Error(`${TAG}: player hame state does not exist`)

  useFrame((_, delta) => {
    if (!input.isMoving) return;
    console.log('usePlayerMovement')

    const speed = playerGameState.isAttacking ? player.movementSpeed / 1.4 : player.movementSpeed;
    const newPosition = {
      x: playerGameState.position.x + input.movement.x * speed * delta,
      z: playerGameState.position.z + input.movement.z * speed * delta,
    };
    updatePlayerPosition(newPosition);
  });
}

