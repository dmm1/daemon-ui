import { useState, useMemo, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './table'

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  paginated?: boolean
  pageSize?: number
  className?: string
}

type SortDir = 'asc' | 'desc'

function getCellValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function DataTable<T>({
  data,
  columns,
  searchable = false,
  paginated = false,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const val = getCellValue(row, col.key)
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [data, search, columns])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = getCellValue(a, sortKey)
      const bVal = getCellValue(b, sortKey)
      const aStr = aVal == null ? '' : String(aVal)
      const bStr = bVal == null ? '' : String(bVal)
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = paginated
    ? Math.max(1, Math.ceil(sorted.length / pageSize))
    : 1
  const pageData = paginated
    ? sorted.slice(page * pageSize, (page + 1) * pageSize)
    : sorted

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className={cn('font-mono', className)}>
      {searchable && (
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          placeholder="Search..."
          aria-label="Search table"
          className="border border-border bg-background px-3 py-1.5 text-xs font-mono mb-3 w-full outline-none focus:ring-1 focus:ring-ring"
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={
                  col.sortable
                    ? 'cursor-pointer select-none hover:text-foreground'
                    : undefined
                }
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={
                  col.sortable && sortKey === col.key
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-primary">
                      {sortDir === 'asc' ? '▴' : '▾'}
                    </span>
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-foreground-dim py-8"
              >
                No data
              </TableCell>
            </TableRow>
          ) : (
            pageData.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(row)
                      : String(getCellValue(row, col.key) ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-foreground-dim">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-2 py-1 border border-border hover:text-primary disabled:opacity-30 transition-colors"
          >
            PREV
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  'w-6 h-6 flex items-center justify-center border transition-colors',
                  i === page
                    ? 'border-primary text-primary'
                    : 'border-border hover:text-primary'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-2 py-1 border border-border hover:text-primary disabled:opacity-30 transition-colors"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  )
}

export { DataTable, type Column, type DataTableProps }
