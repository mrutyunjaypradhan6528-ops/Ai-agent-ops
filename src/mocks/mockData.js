const hospitals = [
  'Lifeline Medical Centre',
  'Fortis Hospital',
  'Apollo Health City',
  'Max Super Speciality',
  'Medanta Medicity',
  'AIIMS Delhi',
  'Kokilaben Dhirubhai',
  'Narayana Health',
]

const patients = [
  'Aryan Maharaj',
  'Priya Sharma',
  'Rahul Verma',
  'Sneha Patel',
  'Vikram Singh',
  'Ananya Gupta',
  'Karan Mehta',
  'Divya Reddy',
  'Arjun Nair',
  'Pooja Iyer',
]

const statuses = ['APPROVED', 'REVIEW_REQUIRED', 'PROCESSING', 'FAILED']
const vectorStatuses = ['INDEXED', 'PENDING', 'SKIPPED', 'FAILED']
const sourceTypes = ['BULK_FOLDER', 'UI_UPLOAD']

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateDocuments(count) {
  const docs = []
  for (let i = 1; i <= count; i++) {
    const rand = seededRandom(i)
    const status = statuses[Math.floor(rand * statuses.length)]
    const vectorStatus = vectorStatuses[Math.floor(rand * vectorStatuses.length)]
    const hospital = hospitals[Math.floor(rand * hospitals.length)]
    const patient = patients[Math.floor(rand * patients.length)]
    const sourceType = sourceTypes[Math.floor(rand * sourceTypes.length)]
    const total = Math.floor(rand * 200000) + 5000
    const exceptionCount = status === 'REVIEW_REQUIRED' ? Math.floor(rand * 3) + 1 : 0
    const date = new Date(2025, Math.floor(rand * 12), Math.floor(rand * 28) + 1)
    docs.push({
      id: i,
      file_name: `doc_${String(i).padStart(5, '0')}.pdf`,
      source_type: sourceType,
      invoice_no: `INV-${100000 + i}`,
      hospital_name: hospital,
      patient_name: patient,
      invoice_date: date.toISOString().split('T')[0],
      printed_total: parseFloat(total.toFixed(2)),
      status,
      vector_status: vectorStatus,
      exception_count: exceptionCount,
      created_at: new Date(2026, 8, 22 - (i % 30)).toISOString(),
    })
  }
  return docs
}

export const mockDocuments = generateDocuments(60)

const lineItems = [
  { description: 'Consultation Fee', quantity: 1, unit_price: 1500, line_total: 1500 },
  { description: 'Room Charges (ICU)', quantity: 3, unit_price: 8500, line_total: 25500 },
  { description: 'Surgical Procedure', quantity: 1, unit_price: 45000, line_total: 45000 },
  { description: 'Pharmacy', quantity: 12, unit_price: 350, line_total: 4200 },
  { description: 'Lab Tests', quantity: 5, unit_price: 800, line_total: 4000 },
  { description: 'Radiology (MRI)', quantity: 1, unit_price: 12000, line_total: 12000 },
  { description: 'Blood Transfusion', quantity: 2, unit_price: 2500, line_total: 5000 },
  { description: 'Physiotherapy', quantity: 4, unit_price: 700, line_total: 2800 },
]

function generateDocumentDetail(id) {
  const doc = mockDocuments.find((d) => d.id === id) || mockDocuments[0]
  const items = lineItems.slice(0, 3 + (id % 5))
  const computedTotal = items.reduce((sum, li) => sum + li.line_total, 0)
  const hasMismatch = doc.status === 'REVIEW_REQUIRED' && id % 2 === 0
  return {
    ...doc,
    extraction_method: id % 3 === 0 ? 'OCR_VISION' : 'NATIVE_TEXT',
    ocr_status: id % 3 === 0 ? 'COMPLETED' : 'NOT_REQUIRED',
    chunk_count: 8 + (id % 20),
    page_count: 1 + (id % 5),
    file_size_bytes: 102400 + id * 512,
    sha256: `a1b2c3d4e5f6${String(id).padStart(6, '0')}`,
    invoice_header: {
      invoice_no: doc.invoice_no,
      hospital_name: doc.hospital_name,
      patient_name: doc.patient_name,
      patient_id: `PAT-${10000 + id}`,
      invoice_date: doc.invoice_date,
      insurer: id % 4 === 0 ? '' : ['Star Health', 'ICICI Lombard', 'HDFC Ergo', 'Bajaj Allianz'][id % 4],
      diagnosis: id % 5 === 0 ? '' : ['Cardiac Arrhythmia', 'Fracture Recovery', 'Post-Surgical Care', 'Pneumonia', 'Routine Checkup'][id % 5],
      printed_total: doc.printed_total,
      computed_total: hasMismatch ? parseFloat((computedTotal + 500).toFixed(2)) : parseFloat(computedTotal.toFixed(2)),
    },
    line_items: items.map((li, idx) => ({ ...li, id: idx + 1 })),
    validation_results: [
      { field: 'invoice_no', status: 'PASS', message: 'Invoice number present' },
      { field: 'patient_name', status: doc.patient_name ? 'PASS' : 'FAIL', message: doc.patient_name ? 'Patient name present' : 'Missing patient name' },
      { field: 'diagnosis', status: id % 5 === 0 ? 'FAIL' : 'PASS', message: id % 5 === 0 ? 'Missing diagnosis' : 'Diagnosis present' },
      { field: 'insurer', status: id % 4 === 0 ? 'FAIL' : 'PASS', message: id % 4 === 0 ? 'Missing insurer' : 'Insurer present' },
      { field: 'totals_match', status: hasMismatch ? 'FAIL' : 'PASS', message: hasMismatch ? 'Printed total does not match computed total' : 'Totals match' },
    ],
    exceptions:
      doc.exception_count > 0
        ? Array.from({ length: doc.exception_count }, (_, i) => ({
            id: id * 100 + i,
            type: ['TOTAL_MISMATCH', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'DUPLICATE_FILE'][i % 5],
            status: 'OPEN',
            message: ['Printed total mismatch', 'Patient name missing', 'Diagnosis not found', 'Insurer field empty', 'Duplicate file detected'][i % 5],
            created_at: doc.created_at,
          }))
        : [],
    audit_trail: [
      { action: 'UPLOADED', timestamp: '2026-09-22T10:30:00Z', detail: 'File received from bulk folder' },
      { action: 'SHA256_COMPUTED', timestamp: '2026-09-22T10:30:01Z', detail: 'Hash computed for deduplication' },
      { action: 'TEXT_EXTRACTED', timestamp: '2026-09-22T10:30:05Z', detail: 'Native text extracted from 3 pages' },
      { action: 'VALIDATED', timestamp: '2026-09-22T10:30:08Z', detail: 'Validation completed with exceptions' },
      { action: 'INDEXED', timestamp: '2026-09-22T10:30:12Z', detail: '8 chunks embedded and upserted to Chroma' },
    ],
  }
}

export const mockDocumentDetail = {
  1: generateDocumentDetail(1),
  2: generateDocumentDetail(2),
  3: generateDocumentDetail(3),
  4: generateDocumentDetail(4),
  5: generateDocumentDetail(5),
}

export const mockUploadResult = {
  uploaded: 3,
  processed: 3,
  duplicates: 0,
  failed: 0,
  documents: [
    { id: 61, file_name: 'upload_001.pdf', status: 'APPROVED' },
    { id: 62, file_name: 'upload_002.pdf', status: 'REVIEW_REQUIRED' },
    { id: 63, file_name: 'upload_003.pdf', status: 'APPROVED' },
  ],
  message: '3 files uploaded, extracted, validated, and indexed successfully.',
}

export const mockIngestionStats = {
  source_folder: 'data/source_invoices',
  discovered_pdfs: 18000,
  processed: 18000,
  succeeded: 17950,
  failed: 50,
  skipped_duplicates: 120,
  indexed_documents: 17830,
  indexed_chunks: 142640,
}

export function mockIngestionJob(jobId) {
  return {
    job_id: jobId,
    status: 'RUNNING',
    total: 18000,
    processed: 12500,
    succeeded: 12400,
    failed: 30,
    skipped_duplicates: 70,
    current_file: 'doc_12501.pdf',
    started_at: '2026-09-23T08:00:00Z',
    progress_percent: 69,
  indexed_documents: 12300,
    indexed_chunks: 98400,
  }
}

const exceptionTypes = [
  'TOTAL_MISMATCH',
  'DUPLICATE_FILE',
  'DUPLICATE_INVOICE',
  'MISSING_PATIENT_NAME',
  'MISSING_DIAGNOSIS',
  'MISSING_INSURER',
  'MISSING_INVOICE_DATE',
  'EXTRACTION_FAILED',
]

export const mockExceptions = mockDocuments
  .filter((d) => d.exception_count > 0)
  .flatMap((d, idx) =>
    Array.from({ length: d.exception_count }, (_, i) => ({
      id: idx * 10 + i + 1,
      document_id: d.id,
      file_name: d.file_name,
      invoice_no: d.invoice_no,
      hospital_name: d.hospital_name,
      type: exceptionTypes[(idx + i) % exceptionTypes.length],
      status: 'OPEN',
      message: ['Printed total does not match computed total', 'Duplicate file detected by SHA-256', 'Duplicate invoice number found', 'Patient name is missing', 'Diagnosis field is empty', 'Insurer field is empty', 'Invoice date is missing', 'Text extraction failed for this page'][i % 8],
      created_at: d.created_at,
    }))
  )

export function mockChatResponse(question) {
  const lower = question.toLowerCase()
  if (lower.includes('total') || lower.includes('amount') || lower.includes('price')) {
    return {
      answer: 'The printed total for invoice INV-100001 is INR 105,442.33. This was verified against the line items which sum to the same amount.',
      citations: [
        {
          document_id: 1,
          invoice_no: 'INV-100001',
          file_name: 'doc_00001.pdf',
          page_number: 1,
          chunk_id: 'doc-1-page-1-chunk-1',
          snippet: 'Grand Total 105,442.33',
        },
        {
          document_id: 3,
          invoice_no: 'INV-100003',
          file_name: 'doc_00003.pdf',
          page_number: 2,
          chunk_id: 'doc-3-page-2-chunk-3',
          snippet: 'Total Amount Due: 87,500.00',
        },
      ],
    }
  }
  if (lower.includes('patient') || lower.includes('name')) {
    return {
      answer: 'Invoice INV-100001 is for patient Aryan Maharaj at Lifeline Medical Centre.',
      citations: [
        {
          document_id: 1,
          invoice_no: 'INV-100001',
          file_name: 'doc_00001.pdf',
          page_number: 1,
          chunk_id: 'doc-1-page-1-chunk-0',
          snippet: 'Patient Name: Aryan Maharaj',
        },
      ],
    }
  }
  return {
    answer: 'I could not find enough evidence to answer that question. Try asking about invoice totals, patient names, or hospital details.',
    citations: [],
  }
}

export const mockAnalyticsSummary = {
  total_documents: 18000,
  approved_documents: 15500,
  review_required: 2300,
  failed_documents: 200,
  total_invoice_value: 1850000000,
  exception_rate: 12.8,
  by_hospital: hospitals.map((h, i) => ({
    hospital: h,
    count: 2000 + i * 150,
    total_value: 200000000 + i * 15000000,
  })),
  by_insurer: [
    { insurer: 'Star Health', count: 5200, total_value: 520000000 },
    { insurer: 'ICICI Lombard', count: 4100, total_value: 410000000 },
    { insurer: 'HDFC Ergo', count: 3800, total_value: 380000000 },
    { insurer: 'Bajaj Allianz', count: 2900, total_value: 290000000 },
    { insurer: 'Uninsured', count: 2000, total_value: 250000000 },
  ],
  by_status: [
    { status: 'APPROVED', count: 15500 },
    { status: 'REVIEW_REQUIRED', count: 2300 },
    { status: 'PROCESSING', count: 0 },
    { status: 'FAILED', count: 200 },
  ],
  by_exception_type: exceptionTypes.map((type, i) => ({
    type,
    count: [450, 120, 80, 600, 400, 300, 200, 50][i],
  })),
}

export const mockAnalyticsTrends = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' })
  return {
    month,
    invoice_count: 1200 + Math.floor(seededRandom(i + 1) * 800),
    total_value: 120000000 + Math.floor(seededRandom(i + 2) * 80000000),
    exceptions: 100 + Math.floor(seededRandom(i + 3) * 200),
  }
})
