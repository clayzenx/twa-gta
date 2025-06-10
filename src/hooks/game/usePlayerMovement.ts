import { useGameStore } from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";

export function usePlayerMovement() {
  const input = useGameStore((s) => s.input);
  const player = useGameStore((s) => s.player);
  const updatePlayerPosition = useGameStore((s) => s.updatePlayerPosition);

  useFrame((_, delta) => {
    if (!input.isMoving) return;

    const speed = player.isAttacking ? player.speed / 1.4 : player.speed;
    const newPosition = {
      x: player.position.x + input.movement.x * speed * delta,
      z: player.position.z + input.movement.z * speed * delta,
    };
    updatePlayerPosition(newPosition);
  });
}

