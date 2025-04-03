'use client'

interface Props {
  data: Record<string, any>
}

export function ClientComponent({ data }: Props) {
  return (
    <div>
      {/* Render plain data */}
      {JSON.stringify(data)}
    </div>
  )
}
