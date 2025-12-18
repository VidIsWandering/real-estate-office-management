"use client"

import { useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const statusColor = {
  gray: "bg-gray-100 text-gray-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  red: "bg-red-100 text-red-700",
} as const

type StatusColor = keyof typeof statusColor

const typeColor = {
  deposit: "bg-orange-100 text-orange-700",
  sale: "bg-blue-100 text-blue-700",
  lease: "bg-green-100 text-green-700",
} as const

type TypeColor = keyof typeof typeColor

interface Contract {
  id: string
  transactionId: string
  contractType: string
  typeColor: TypeColor
  partyA: string
  partyB: string
  totalValue: string
  depositAmount: string
  signDate: string
  effectiveDate: string
  legalStaff: string
  status: string
  statusColor: StatusColor
  hasFile: boolean
}

const contracts: Contract[] = [
  {
    id: "HD001",
    transactionId: "GD001",
    contractType: "Sale & purchase",
    typeColor: "sale",
    partyA: "Nguyễn Văn A",
    partyB: "Trần Thị B",
    totalValue: "8.5B VND",
    depositAmount: "200M VND",
    signDate: "10/12/2024",
    effectiveDate: "15/12/2024",
    legalStaff: "Legal: Lê Văn C",
    status: "Notarized",
    statusColor: "green",
    hasFile: true,
  },
  {
    id: "HD002",
    transactionId: "GD002",
    contractType: "Deposit agreement",
    typeColor: "deposit",
    partyA: "Phạm Thị D",
    partyB: "Hoàng Văn E",
    totalValue: "3.2B VND",
    depositAmount: "100M VND",
    signDate: "20/11/2024",
    effectiveDate: "20/11/2024",
    legalStaff: "Legal: Võ Thị F",
    status: "Signed",
    statusColor: "blue",
    hasFile: true,
  },
  {
    id: "HD003",
    transactionId: "GD003",
    contractType: "Lease agreement",
    typeColor: "lease",
    partyA: "Đặng Văn G",
    partyB: "Bùi Thị H",
    totalValue: "50M VND/month",
    depositAmount: "100M VND",
    signDate: "05/11/2024",
    effectiveDate: "01/12/2024",
    legalStaff: "Legal: Trần Văn I",
    status: "Notarized",
    statusColor: "green",
    hasFile: true,
  },
  {
    id: "HD004",
    transactionId: "GD004",
    contractType: "Sale & purchase",
    typeColor: "sale",
    partyA: "Mai Thị K",
    partyB: "Phan Văn L",
    totalValue: "15B VND",
    depositAmount: "500M VND",
    signDate: "25/10/2024",
    effectiveDate: "",
    legalStaff: "Legal: Nguyễn Thị M",
    status: "Awaiting signature",
    statusColor: "yellow",
    hasFile: false,
  },
  {
    id: "HD005",
    transactionId: "GD005",
    contractType: "Deposit agreement",
    typeColor: "deposit",
    partyA: "Lý Văn N",
    partyB: "Trương Thị O",
    totalValue: "1.8B VND",
    depositAmount: "50M VND",
    signDate: "",
    effectiveDate: "",
    legalStaff: "Legal: Lê Văn C",
    status: "Draft",
    statusColor: "gray",
    hasFile: false,
  },
]

export function ContractsTable() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Contract | null>(null)

  const openDetails = (c: Contract) => {
    setSelected(c)
    setOpen(true)
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract ID</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Total value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {contracts.map((contract) => (
            <TableRow
              key={contract.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => openDetails(contract)}
            >
              <TableCell className="font-medium">{contract.id}</TableCell>
              <TableCell>{contract.transactionId}</TableCell>
              <TableCell>
                <Badge className={typeColor[contract.typeColor]}>
                  {contract.contractType}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold">{contract.totalValue}</TableCell>
              <TableCell>
                <Badge className={statusColor[contract.statusColor]}>
                  {contract.status}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDetails(contract)
                    }}
                    aria-label="View details"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Contract ID</div>
                <div className="font-medium">{selected.id}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Status</div>
                <Badge className={statusColor[selected.statusColor]}>{selected.status}</Badge>
              </div>

              <div>
                <div className="text-xs text-gray-500">Transaction ID</div>
                <div className="font-medium">{selected.transactionId}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Contract type</div>
                <Badge className={typeColor[selected.typeColor]}>{selected.contractType}</Badge>
              </div>

              <div>
                <div className="text-xs text-gray-500">Total value</div>
                <div className="font-medium">{selected.totalValue}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Deposit amount</div>
                <div className="font-medium">{selected.depositAmount}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Party A</div>
                <div className="font-medium">{selected.partyA}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Party B</div>
                <div className="font-medium">{selected.partyB}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Sign date</div>
                <div className="font-medium">{selected.signDate || "-"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Effective date</div>
                <div className="font-medium">{selected.effectiveDate || "-"}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-500">Legal staff</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{selected.legalStaff}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">File</div>
                {selected.hasFile ? (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="text-sm text-gray-700">Attached</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">None</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
