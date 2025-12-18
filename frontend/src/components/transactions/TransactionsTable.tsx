import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const statusColor = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
} as const

type StatusColor = keyof typeof statusColor

interface Transaction {
  id: string
  property: string
  client: string
  agent: string
  type: string
  status: string
  statusColor: StatusColor
  amount: string
  date: string
}

const transactions: Transaction[] = [
  {
    id: "TXN001",
    property: "Oak Street",
    client: "John Wilson",
    agent: "Alice Chen",
    type: "Sale",
    status: "Completed",
    statusColor: "green",
    amount: "$530k",
    date: "Jan 12",
  },
  {
    id: "TXN002",
    property: "Maple Avenue",
    client: "Sarah Martinez",
    agent: "Bob Smith",
    type: "Rental",
    status: "In Progress",
    statusColor: "blue",
    amount: "$2.4k",
    date: "Jan 13",
  },
  {
    id: "TXN004",
    property: "Pine Road",
    client: "Lisa Anderson",
    agent: "David Lee",
    type: "Sale",
    status: "Pending",
    statusColor: "yellow",
    amount: "$480k",
    date: "Jan 14",
  },
]

export function TransactionsTable() {
  return (
    <Table className="rounded-xl border">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Property</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.id}</TableCell>
            <TableCell>{t.property}</TableCell>
            <TableCell>{t.client}</TableCell>
            <TableCell>{t.type}</TableCell>

            <TableCell>
              <Badge className={statusColor[t.statusColor]}>
                {t.status}
              </Badge>
            </TableCell>

            <TableCell>{t.amount}</TableCell>
            <TableCell>{t.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
