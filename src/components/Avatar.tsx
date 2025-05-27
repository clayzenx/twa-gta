const getInitial = (name?: string) => name?.charAt(0).toUpperCase() || '?'

const getColorFromName = (name: string) => {
  // Простая генерация цвета на основе имени
  const colors = ['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export const Avatar = ({ name, photoUrl }: { name?: string; photoUrl?: string }) => {
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="w-10 h-10 rounded-full" />
  }

  const initial = getInitial(name)
  const bgColor = getColorFromName(initial)

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${bgColor}`}
    >
      {initial}
    </div>
  )
}

