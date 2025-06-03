import { useMemo } from 'react'

export function Terrain() {
  const hills = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 40,
        Math.random() * 0.5,
        (Math.random() - 0.5) * 40
      ] as [number, number, number],
      geometry: [Math.random() * 3 + 1, Math.random() * 4 + 2, Math.random() * 2 + 1, 8] as [number, number, number, number]
    }))
  }, [])

  const rocks = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 45,
        Math.random() * 0.3,
        (Math.random() - 0.5) * 45
      ] as [number, number, number],
      size: Math.random() * 0.8 + 0.3
    }))
  }, [])

  return (
    <group>
      {/* Основная земля */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a5d23" />
      </mesh>

      {/* Небольшие холмы для интереса */}
      {hills.map((hill) => (
        <mesh
          key={hill.id}
          castShadow
          receiveShadow
          position={hill.position}
        >
          <cylinderGeometry args={hill.geometry} />
          <meshStandardMaterial color="#3a4d1a" />
        </mesh>
      ))}

      {/* Камни */}
      {rocks.map((rock) => (
        <mesh
          key={`rock-${rock.id}`}
          castShadow
          receiveShadow
          position={rock.position}
        >
          <dodecahedronGeometry args={[rock.size]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      ))}
    </group>
  )
}