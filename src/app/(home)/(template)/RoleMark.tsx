import { useGameStatusStore } from "@/providers/GameStatus"

interface RoleMarkProps {
  currentRole: 'aiRole' | 'playerRole' | undefined
}

export default function RoleMark(props: RoleMarkProps) {
  const { isPlaying, playerRole, aiRole } = useGameStatusStore((state) => state)

  return <div className="flex flex-col gap-y-2">
    <div className="w-20 h-20 rounded-full flex justify-center items-center"
      style={{
        backgroundColor: !isPlaying ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      }}>
        {
          props.currentRole === 'playerRole'
            ? <img className={ `${ playerRole === 'X' ? 'w-8' : 'w-10' }` }
            src={ `/images/${ playerRole === 'X' ? 'x' : 'o' }_white.svg` }/>

            : <img className={ `${ aiRole === 'X' ? 'w-8' : 'w-10' }` }
            src={ `/images/${ aiRole === 'X' ? 'x' : 'o' }_white.svg` }/>
        }
    </div>

    <div className="text-white/70 text-center"> { props.currentRole === 'playerRole' ? 'YOU' : 'A.I' } </div>

    <div className="text-white/30 text-center text-sm"> { props.currentRole === 'playerRole' ? 'Player 1' : 'Player 2' } </div>
  </div>
}