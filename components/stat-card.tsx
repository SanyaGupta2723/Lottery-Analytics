interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

export default function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
