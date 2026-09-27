'use client'

import * as XLSX from 'xlsx'

interface ExportExcelButtonProps {
  data: any[]
  filename?: string
  columns: { header: string; key: string }[]
}

export default function ExportExcelButton({ data, filename = 'export.xlsx', columns }: ExportExcelButtonProps) {
  const handleExport = () => {
    // Format data according to columns
    const formattedData = data.map(row => {
      const formattedRow: any = {}
      columns.forEach(col => {
        formattedRow[col.header] = row[col.key]
      })
      return formattedRow
    })

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    XLSX.writeFile(workbook, filename)
  }

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Unduh sebagai Excel
    </button>
  )
}
