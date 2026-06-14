# PRD.md — DocuBridge AI

## 1. Product Name
DocuBridge AI

## 2. Product Tagline
AI Document Import for ERP

## 3. Product Summary
DocuBridge AI is a local-first document review workbench that allows end users to upload business PDFs or photos, run OCR / AI extraction, review the extracted structured data, correct mistakes, approve the result, and export the final reviewed JSON.

The product focuses on converting documents such as Purchase Orders, Invoices, Delivery Orders, Claim Forms, and printed business forms into structured, reviewable, ERP-ready data.

The first MVP should focus on:

```
Upload → Batch Listing → OCR Draft → Human Review → Approve → Export JSON
```

The MVP will use mock OCR data first. The architecture must allow replacing the mock OCR engine with PaddleOCR-VL or another OCR backend later.

---

## 4. Problem Statement
Many companies still receive business documents as PDFs, scanned images, WhatsApp photos, or printed forms.

These documents usually contain important business data such as:

```
Document title
Document number
Transaction date
Credit term
Bill to
Ship to
Delivery address
Stock code
Stock description
Quantity
Unit price
Subtotal
GST
Grand total
Terms and conditions
```

Today, users often manually key this data into ERP systems. This causes:

```
Slow data entry
Human typing mistakes
Repeated work
Difficult document checking
Poor audit trail
No easy way to compare OCR output with original document
```

DocuBridge AI solves this by turning documents into structured drafts that users can review before submission.

---

## 5. Product Goal
The main goal is to create a document processing UI that allows non-technical end users to upload documents, preview original files, review AI-extracted structured data, correct mistakes, approve clean data, and export the reviewed result.

The UI must feel like a **Document Review Workbench**, not a simple upload form.

---

## 6. Target Users

### 6.1 Primary Users
```
ERP users
Admin staff
Purchasing team
Finance team
Warehouse team
Document processing staff
```

### 6.2 Secondary Users
```
Software developers
ERP implementation team
System admins
Management reviewers
```

---

## 7. Key User Stories

### 7.1 Upload Documents
As an end user, I want to upload one or many PDFs or images so that the system can process them as a batch.

Acceptance criteria:
```
User can drag and drop files
User can select multiple files
User can remove files before processing
User can choose document type
User can create a batch
User can start OCR processing
```

### 7.2 View Batch Listing
As an end user, I want to see all uploaded documents in a batch so that I know which documents need review.

Acceptance criteria:
```
User can see document status
User can see document number if extracted
User can see file name
User can see page count
User can see confidence score
User can filter by status
User can search by document number or file name
User can open a document for review
```

### 7.3 Review Original Document and Extracted Data
As an end user, I want to view the original PDF or image beside the extracted data so that I can verify whether the AI output is correct.

Acceptance criteria:
```
User can preview original document
User can navigate page 1, page 2, page 3, etc.
User can zoom document preview
User can see extracted header fields
User can see extracted line items
User can see extracted totals
User can edit extracted values
User can save reviewed result
```

### 7.4 Human-in-the-loop Correction
As an end user, I want to correct OCR mistakes before approval so that wrong data does not enter another system.

Acceptance criteria:
```
User can edit document number
User can edit transaction date
User can edit bill to / ship to details
User can edit line item rows
User can add line item row
User can delete line item row
User can edit subtotal, GST, and grand total
User can save changes as reviewed_json
Original extracted_json must remain unchanged
```

### 7.5 Approve Document
As an end user, I want to approve a reviewed document so that it becomes ready for export or future ERP submission.

Acceptance criteria:
```
User can approve document after required fields are valid
Approved document status changes to Approved
Approved document appears in Approved Drafts screen
Approved document can be exported as JSON
```

### 7.6 Export Reviewed JSON
As an end user, I want to export reviewed data as JSON so that it can be used by another system later.

Acceptance criteria:
```
User can export one approved document as JSON
User can copy reviewed JSON
User can view raw JSON
Export must use reviewed_json, not extracted_json
```

---

## 8. MVP Scope
The first MVP must include:

```
Dashboard
Upload Batch screen
Batch Detail screen
Document Review Workbench
Approved Drafts screen
Failed Documents screen
IndexedDB local persistence
Mock OCR output
Editable extracted fields
Editable line item table
Validation messages
Save reviewed JSON
Approve document
Export reviewed JSON
```

---

## 9. Out of Scope for MVP
The MVP should not include:

```
Real PaddleOCR-VL integration
Real ERP submission
User login
Role-based permission
Cloud storage
Multi-user collaboration
Payment system
Advanced audit log
Template learning
Production queue worker
Server-side database
```

These can be added in later phases.

---

## 10. Product Workflow

```
User uploads PDF / image files
  ↓
System creates upload batch
  ↓
System stores files in IndexedDB
  ↓
System generates mock OCR result
  ↓
System shows document listing
  ↓
User opens document review screen
  ↓
User checks original document and extracted data
  ↓
User edits incorrect fields
  ↓
System saves reviewed_json
  ↓
User approves document
  ↓
User exports reviewed JSON
```

---

## 11. Main Screens

### 11.1 Dashboard
**Purpose:** Give a high-level summary of current document processing status.

Required UI elements:
```
Total Documents card
Need Review card
Approved card
Failed card
Recent Batches list
Quick Upload button
```

Required behavior:
```
Click Total Documents → go to Batches
Click Need Review → go to Review Queue
Click Approved → go to Approved Drafts
Click Failed → go to Failed Documents
```

### 11.2 Upload Batch Screen
**Purpose:** Allow users to create a batch and upload documents.

Required fields:
```
Batch Name
Document Type
Upload Dropzone
File Queue
Start Processing Button
```

Supported document types:
```
Purchase Order
Invoice
Delivery Order
Claim Form
Generic Document
```

Supported file types:
```
PDF
PNG
JPG
JPEG
```

Required behavior:
```
User can upload multiple files
User can remove selected files before processing
System validates file type
System shows file count
System creates batch after user starts processing
System stores files locally in IndexedDB
System creates mock OCR result for each document
```

### 11.3 Batch Detail Screen
**Purpose:** Show all documents inside one batch.

Required table columns:
```
Status
Document No
File Name
Document Type
Pages
Confidence
Validation Issues
Last Updated
Action
```

Required actions:
```
Open Review
Export JSON if approved
Reprocess mock OCR
Delete document from batch
```

Required filters:
```
Search by document number
Search by file name
Filter by status
Filter by document type
Filter by confidence level
```

### 11.4 Document Review Workbench
**Purpose:** Allow users to review one document in detail.

Layout:
```
Top bar:
Document No | File Name | Status | Confidence | Save Draft | Approve

Left panel:
Page thumbnails

Center panel:
PDF / image viewer

Right panel:
Extraction panel with editable structured data
```

Required tabs in right panel:
```
Summary
Line Items
Validation
Raw JSON
```

#### Summary Tab
Required fields:
```
Document Title
Document No
Transaction Date
Credit Term
Bill To
Ship To
Delivery Address
Subtotal
GST
Grand Total
Terms and Conditions
```

#### Line Items Tab
Required columns:
```
Serial No
Stock Code
Description
Remark
Quantity
UOM
Unit Price
Total Price
Confidence
```

Required actions:
```
Edit cell
Add row
Delete row
Save line item changes
```

#### Validation Tab
Required validation messages:
```
Missing document number
Invalid transaction date
Missing line items
Invalid numeric amount
Subtotal + GST mismatch with Grand Total
Quantity × Unit Price mismatch with Total Price
```

#### Raw JSON Tab
Required behavior:
```
Show extracted_json
Show reviewed_json
Allow copy reviewed_json
Allow export reviewed_json
```

### 11.5 Approved Drafts Screen
**Purpose:** Show documents that have been reviewed and approved.

Required table columns:
```
Document No
Document Type
File Name
Approved At
Confidence
Action
```

Required actions:
```
View Document
View JSON
Export JSON
```

### 11.6 Failed Documents Screen
**Purpose:** Show documents that failed processing.

Required table columns:
```
File Name
Document Type
Error Reason
Uploaded At
Action
```

Required actions:
```
View file
Retry processing
Delete document
Mark as rejected
```

---

## 12. Status Definitions
Documents must use the following statuses:

```
Uploaded
Processing
OCR Completed
Need Review
Ready to Submit
Approved
Submitted
Failed
Rejected
```

Status rules:
```
Uploaded        = file uploaded but OCR not started
Processing      = OCR or mock OCR is running
OCR Completed   = OCR output exists
Need Review     = user must check extracted result
Ready to Submit = validation passed but not approved
Approved        = user approved reviewed data
Submitted       = reserved for future ERP submission
Failed          = OCR or file processing failed
Rejected        = user rejected the document
```

For MVP, `Submitted` is reserved and does not need real ERP integration.

---

## 13. Confidence Rules
Confidence levels:
```
High   = 90% to 100%
Medium = 70% to 89%
Low    = below 70%
```

Confidence should appear at:
```
Document level
Field level
Line item level if available
```

UI must show both visual badge and text. Example:
```
High Confidence
Medium Confidence
Low Confidence
```

Do not rely only on color.

---

## 14. Validation Rules
The MVP must include client-side validation.

Required validation rules:
```
Document number is required
Transaction date is required
Grand total must be numeric
Subtotal must be numeric
GST must be numeric
At least one line item is required
Quantity must be numeric
Unit price must be numeric
Total price must be numeric
Subtotal + GST should equal Grand Total
Quantity × Unit Price should equal Total Price
```

Validation severity:
```
error
warning
info
```

Approval rule:
```
Document cannot be approved if unresolved error exists.
Document can be approved with warnings after confirmation.
```

---

## 15. Data Requirements
For MVP, store data locally using IndexedDB.

Required stores:
```
batches
documents
ocr_results
reviewed_results
validation_issues
review_actions
```

---

## 16. Data Model

### 16.1 Batch
```json
{
  "batch_id": "batch_001",
  "batch_name": "June Purchase Orders",
  "document_type": "purchase_order",
  "status": "Need Review",
  "total_files": 10,
  "created_at": "2026-06-14T10:00:00Z",
  "updated_at": "2026-06-14T10:00:00Z"
}
```

### 16.2 Document
```json
{
  "document_id": "doc_001",
  "batch_id": "batch_001",
  "file_name": "PO001.pdf",
  "file_type": "application/pdf",
  "document_no": "PO001",
  "document_type": "purchase_order",
  "page_count": 3,
  "status": "Need Review",
  "confidence": 0.86,
  "created_at": "2026-06-14T10:00:00Z",
  "updated_at": "2026-06-14T10:00:00Z"
}
```

### 16.3 OCR Result
```json
{
  "ocr_result_id": "ocr_001",
  "document_id": "doc_001",
  "engine": "mock",
  "confidence": 0.86,
  "extracted_json": {},
  "field_metadata": [],
  "raw_text": "",
  "created_at": "2026-06-14T10:00:00Z"
}
```

### 16.4 Reviewed Result
```json
{
  "reviewed_result_id": "review_001",
  "document_id": "doc_001",
  "reviewed_json": {},
  "review_status": "Approved",
  "approved_by": "demo_user",
  "approved_at": "2026-06-14T10:30:00Z",
  "updated_at": "2026-06-14T10:30:00Z"
}
```

### 16.5 Field Metadata
```json
{
  "field_key": "document_no",
  "label": "Document No",
  "value": "PO001",
  "confidence": 0.96,
  "page_no": 1,
  "bounding_box": {
    "x": 120,
    "y": 80,
    "width": 220,
    "height": 40
  },
  "validation_status": "valid",
  "validation_message": ""
}
```

---

## 17. Document Schemas

### 17.1 Purchase Order Schema
```json
{
  "document_type": "purchase_order",
  "document_title": "",
  "document_no": "",
  "transaction_date": "",
  "credit_term": "",
  "bill_to": {
    "name": "",
    "address": ""
  },
  "ship_to": {
    "name": "",
    "address": ""
  },
  "delivery_address": "",
  "line_items": [
    {
      "serial_no": "",
      "stock_code": "",
      "description": "",
      "remark": "",
      "quantity": 0,
      "uom": "",
      "unit_price": 0,
      "total_price": 0
    }
  ],
  "totals": {
    "subtotal": 0,
    "gst": 0,
    "grand_total": 0
  },
  "terms_and_conditions": ""
}
```

### 17.2 Invoice Schema
```json
{
  "document_type": "invoice",
  "document_title": "",
  "invoice_no": "",
  "invoice_date": "",
  "supplier": {
    "name": "",
    "address": ""
  },
  "customer": {
    "name": "",
    "address": ""
  },
  "payment_terms": "",
  "line_items": [
    {
      "serial_no": "",
      "description": "",
      "quantity": 0,
      "uom": "",
      "unit_price": 0,
      "total_price": 0
    }
  ],
  "totals": {
    "subtotal": 0,
    "tax": 0,
    "grand_total": 0
  }
}
```

### 17.3 Delivery Order Schema
```json
{
  "document_type": "delivery_order",
  "document_title": "",
  "delivery_order_no": "",
  "transaction_date": "",
  "customer": {
    "name": "",
    "address": ""
  },
  "delivery_address": "",
  "line_items": [
    {
      "serial_no": "",
      "stock_code": "",
      "description": "",
      "quantity": 0,
      "uom": "",
      "remark": ""
    }
  ]
}
```

---

## 18. Functional Requirements

| ID | Requirement |
|---|---|
| FR-001 | The system must allow users to create a batch before or during file upload. |
| FR-002 | The system must allow users to upload multiple PDF or image files. |
| FR-003 | The system must store uploaded files locally using IndexedDB for MVP. |
| FR-004 | The system must generate mock OCR result for each uploaded document. |
| FR-005 | The system must show documents in a table after upload. |
| FR-006 | The system must allow users to open each document for review. |
| FR-007 | The system must preview the original PDF or image. |
| FR-008 | The system must show structured extracted fields. |
| FR-009 | The system must allow users to edit extracted fields. |
| FR-010 | The system must allow users to edit extracted line items. |
| FR-011 | The system must save user-corrected data as reviewed_json. |
| FR-012 | The system must preserve extracted_json and not overwrite it. |
| FR-013 | The system must validate required fields and calculation rules. |
| FR-014 | The system must allow users to approve valid reviewed documents. |
| FR-015 | The system must allow users to export reviewed_json. |

---

## 19. Non-functional Requirements

### 19.1 Usability
The UI must be simple enough for non-technical users.

### 19.2 Performance
For MVP, the UI should support at least:
```
100 uploaded documents per batch
3 pages per PDF average
Basic local search and filtering
```

### 19.3 Reliability
Data should persist after browser refresh using IndexedDB.

### 19.4 Maintainability
OCR logic must be separated from UI logic.

### 19.5 Replaceability
Mock OCR must be replaceable with real PaddleOCR-VL backend later.

### 19.6 Accessibility
The UI must not rely only on color. Status and confidence must include readable labels.

---

## 20. OCR Provider Contract
The frontend should consume OCR result through a provider-neutral contract.

Example OCR response:
```json
{
  "document_id": "doc_001",
  "document_type": "purchase_order",
  "confidence": 0.91,
  "pages": [
    {
      "page_no": 1,
      "width": 1200,
      "height": 1600
    }
  ],
  "extracted_json": {},
  "field_metadata": [
    {
      "field_key": "document_no",
      "label": "Document No",
      "value": "PO001",
      "confidence": 0.96,
      "page_no": 1,
      "bounding_box": {
        "x": 120,
        "y": 80,
        "width": 220,
        "height": 40
      }
    }
  ],
  "validation_issues": []
}
```

Possible future OCR providers:
```
Mock OCR
PaddleOCR-VL
PaddleOCR
External OCR API
Custom document AI service
```

---

## 21. Success Metrics
The MVP is successful when:

```
User can upload multiple documents
User can create a batch
User can see document listing
User can open a document for review
User can preview original document
User can view extracted structured data
User can edit extracted data
User can save reviewed result
User can approve document
User can export reviewed JSON
Data remains after browser refresh
```

---

## 22. Demo Scenario
Use this scenario for testing and presentation:

```
1.  User opens DocuBridge AI
2.  User creates batch named "June Purchase Orders"
3.  User selects document type "Purchase Order"
4.  User uploads 5 sample PDF files
5.  System creates document listing
6.  System generates mock OCR result
7.  User opens PO001
8.  User sees original document on the left/center
9.  User sees extracted data on the right
10. User edits one wrong quantity
11. System updates reviewed_json
12. User approves the document
13. User exports reviewed JSON
```

---

## 23. Future Roadmap

### Phase 1: Local-first MVP
```
Mock OCR
IndexedDB
Upload
Review
Approve
Export JSON
```

### Phase 2: Real OCR Backend
```
PaddleOCR-VL integration
Backend API
OCR queue
Real PDF page parsing
Bounding box evidence
```

### Phase 3: ERP Integration
```
Submit reviewed data to ERP
Field mapping
Duplicate checking
Import history
ERP draft creation
```

### Phase 4: Enterprise Features
```
User login
Roles and permissions
Audit log
Cloud storage
Template learning
Multi-user review
On-premise deployment
```

---

## 24. MVP Implementation Instruction
Build a local-first web MVP for DocuBridge AI.

Use mock OCR first.

The product must support:
```
Upload multiple PDF/image files
Create batch
Store files in IndexedDB
Generate mock structured OCR data
Show batch listing
Open document review workbench
Preview original document
Show editable extracted fields
Show editable line items
Run client-side validation
Save reviewed_json
Approve document
Export reviewed_json
```

Prioritize workflow correctness over advanced styling.

Do not build real ERP submission in MVP.

Do not build real PaddleOCR-VL integration in MVP.

Keep the OCR provider replaceable so real PaddleOCR-VL can be added later.
