export function GameControls() {
  // Проверяем, есть ли поддержка touch (мобильное устройство)
  const isTouchDevice = 'ontouchstart' in window

  // На touch устройствах не показываем десктопные контролы
  if (isTouchDevice) {
    return null
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      color: 'white',
      fontSize: '14px',
      background: 'rgba(0,0,0,0.7)',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <div>WASD/ЦФЫВ - движение</div>
      <div>Пробел - атака</div>
    </div>
  )
}