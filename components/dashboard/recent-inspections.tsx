import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentInspections() {
  const inspections = [
    {
      id: "1",
      product: "Farinha de Trigo",
      batch: "FT-2023-05-001",
      status: "Aprovado",
      date: "30/05/2023",
      inspector: "JD",
    },
    {
      id: "2",
      product: "Açúcar Refinado",
      batch: "AR-2023-05-002",
      status: "Pendente",
      date: "29/05/2023",
      inspector: "MC",
    },
    {
      id: "3",
      product: "Leite Integral",
      batch: "LI-2023-05-003",
      status: "Reprovado",
      date: "28/05/2023",
      inspector: "AS",
    },
    {
      id: "4",
      product: "Óleo de Soja",
      batch: "OS-2023-05-004",
      status: "Aprovado",
      date: "27/05/2023",
      inspector: "JD",
    },
    {
      id: "5",
      product: "Fermento Biológico",
      batch: "FB-2023-05-005",
      status: "Aprovado",
      date: "26/05/2023",
      inspector: "MC",
    },
  ]

  return (
    <div className="space-y-8">
      {inspections.map((inspection) => (
        <div key={inspection.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{inspection.inspector}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{inspection.product}</p>
            <p className="text-sm text-muted-foreground">Lote: {inspection.batch}</p>
          </div>
          <div className="ml-auto font-medium">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                inspection.status === "Aprovado"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : inspection.status === "Pendente"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              }`}
            >
              {inspection.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
