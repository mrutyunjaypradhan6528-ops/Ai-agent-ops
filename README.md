# AgentForge AI Document Ops

Operations application for processing synthetic hospital invoice PDFs. The React frontend handles document upload, review, analytics, and a cited Q&A interface. The FastAPI backend is not implemented in this repository: its folders contain placeholders only. The frontend runs in demo mode using bundled synthetic data until that backend is added.

## Tech Stack

- **React 18** (JavaScript, JSX)
- **Vite** build tool
- **React Router** for routing
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Recharts** for charts
- **lucide-react** for icons

## Getting Started

Use Node.js 22 or 24 (verified locally with Node.js 24). From the project folder:

```powershell
npm.cmd ci
npm.cmd run dev
```

The app runs at `http://localhost:5173`. Keep that terminal open; press Ctrl+C to stop it. In other shells, `npm` works in place of `npm.cmd`. Using `npm.cmd` in PowerShell avoids script execution-policy errors.

No environment file or backend is required for demo mode. All data is synthetic, operations are simulated, and changes are not saved. Excel export requires the backend and is disabled in demo mode. If port 5173 is already occupied, stop the existing app instance or explicitly choose another port with `npm.cmd run dev -- --port 5174`.

Verify the project with:

```powershell
npm.cmd run lint
npm.cmd run build
```

## Environment

To customize the configuration, copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`) and adjust the values. Restart the development server after changing them:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | FastAPI backend URL |
| `VITE_USE_MOCKS` | `true` | Use mock data when backend is not ready |

Set `VITE_USE_MOCKS=false` only once the FastAPI backend is implemented and running. An unset value defaults to demo mode. The backend must allow the frontend origin through CORS when using an absolute API URL.

Never put credentials in `VITE_*` variables: these values are visible in the browser. Keep backend secrets in `backend/.env`. Environment files, dependencies, uploaded/source documents, generated exports, and vector databases are excluded from Git; `.env.example` contains only safe defaults.

## Routes

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/upload` | Upload Documents |
| `/knowledge-base` | Knowledge Base (bulk ingestion) |
| `/documents` | Document List |
| `/documents/:documentId` | Document Detail |
| `/exceptions` | Exceptions Review Queue |
| `/chat` | Ask Invoices (cited Q&A) |
| `/analytics` | Analytics |

## Service Layer

| File | Exports |
|---|---|
| `src/services/documentService.js` | `getDocuments`, `getDocumentById`, `uploadDocuments`, `reprocessDocument`, `sendToReview`, `checkHealth` |
| `src/services/ingestionService.js` | `startBulkIngestion`, `getIngestionJob`, `getIngestionStats`, `reindexDocument` |
| `src/services/exceptionService.js` | `getExceptions`, `reviewException` |
| `src/services/chatService.js` | `sendChatQuery` |
| `src/services/analyticsService.js` | `getAnalyticsSummary`, `getAnalyticsTrends`, `getExportUrl` |

## API Contract

The frontend expects these FastAPI endpoints:

- `GET /api/v1/health`
- `POST /api/v1/documents/upload` (multipart/form-data, field `files`)
- `GET /api/v1/documents?page=&page_size=&search=&status=&hospital=&exception_type=`
- `GET /api/v1/documents/{documentId}`
- `POST /api/v1/documents/{documentId}/reprocess`
- `PATCH /api/v1/documents/{documentId}/review`
- `POST /api/v1/ingestion/bulk` (JSON `{"recursive":true}`)
- `GET /api/v1/ingestion/jobs/{jobId}`
- `GET /api/v1/ingestion/stats`
- `POST /api/v1/ingestion/reindex/{documentId}`
- `GET /api/v1/exceptions?page=&page_size=&status=&type=`
- `PATCH /api/v1/exceptions/{exceptionId}/review`
- `POST /api/v1/chat/query`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/trends`
- `GET /api/v1/exports/invoices.xlsx`

## Project Structure

```
src/
  components/
    layout/AppLayout.jsx
    common/LoadingSpinner.jsx, ErrorMessage.jsx, StatusBadge.jsx
    documents/DocumentTable.jsx, InvoiceFields.jsx, LineItemsTable.jsx
    exceptions/ExceptionTable.jsx
    ingestion/IngestionProgress.jsx, IndexStats.jsx
    chat/ChatMessage.jsx, CitationCard.jsx
    charts/ExceptionChart.jsx, InvoiceTrendChart.jsx
  pages/
    DashboardPage.jsx, UploadPage.jsx, KnowledgeBasePage.jsx,
    DocumentsPage.jsx, DocumentDetailPage.jsx, ExceptionsPage.jsx,
    ChatPage.jsx, AnalyticsPage.jsx
  services/
    api.js, documentService.js, ingestionService.js,
    exceptionService.js, chatService.js, analyticsService.js
  config/apiConfig.js
  mocks/mockData.js
  App.jsx, main.jsx
backend/
  apis/.gitkeep, services/.gitkeep
  data/samples/.gitkeep, data/source_invoices/.gitkeep, data/uploads/.gitkeep
  vectorstore/chroma/.gitkeep, exports/.gitkeep
database/sql/.gitkeep
```

## Backend Work Still Required

1. Implement the FastAPI backend with the endpoints listed above.
2. Place ~18,000 synthetic PDFs in `backend/data/source_invoices/`.
3. Configure Ollama and SQL Server credentials in `backend/.env` (never in frontend code).
4. Set `VITE_USE_MOCKS=false` in `.env` when the backend is ready.
5. Run `npm run build` to verify production build.
