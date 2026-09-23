export default function LineItemsTable({ items }) {
  if (!items || items.length === 0)
    return <p className="text-sm text-gray-500">No line items available.</p>

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Qty</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Unit Price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Line Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-600">{item.id}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.description}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">₹{item.unit_price.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">₹{item.line_total.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              Computed Total
            </td>
            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
              ₹{items.reduce((sum, li) => sum + li.line_total, 0).toLocaleString('en-IN')}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
