# Billix

Billix is a modern, responsive invoice studio built with React and Vite. Create professional invoices, review them before sending, save reusable business and customer details, and download a polished PDF directly from the browser.

## Features

- Create invoices with an automatically tracked invoice number and current date
- Add, edit, and remove line items with quantity and price controls
- Calculate subtotal, tax, discount, and final total in real time
- Add business and customer details, email addresses, physical addresses, GSTIN/tax ID, and invoice status
- Set due dates and payment terms
- Add bank account and UPI payment details
- Upload a business logo and choose between Classic and Clean invoice templates
- Show or hide payment details in the generated invoice
- Save and reuse shop and customer profiles
- Save invoices locally and reopen up to the 50 most recent invoices from invoice history
- Start a new invoice without losing saved profiles or history
- Preview the completed invoice in a modal before exporting it
- Save and download invoices as PDF files
- Share an invoice with the Web Share API, with a `mailto:` fallback when sharing is unavailable
- Export saved profiles and invoice history to a JSON backup and import it later
- Responsive layout for desktop and mobile screens

## Tech Stack

- [React 18](https://react.dev/) and [React DOM](https://react.dev/)
- [Vite](https://vitejs.dev/) for development and production builds
- [Bootstrap 5](https://getbootstrap.com/) and [React-Bootstrap](https://react-bootstrap.github.io/) for responsive UI components
- [React Icons](https://react-icons.github.io/react-icons/) for interface icons
- [html2canvas](https://html2canvas.hertzen.com/) and [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- Browser `localStorage` for profiles, invoice history, and invoice numbering
- Browser File APIs for logo uploads and JSON backup import/export
- Web Share API with an email fallback for sharing invoices

## Getting Started

### Prerequisites

- Node.js 16 or newer
- npm (or another compatible package manager)

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
invoice/
├── public/
│   ├── logo192.png
│   └── manifest.json
├── src/
│   ├── assets/
│   │   └── logo192.png
│   ├── components/
│   │   ├── EditableField.jsx
│   │   ├── InvoiceForm.jsx
│   │   ├── InvoiceItem.jsx
│   │   └── InvoiceModal.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Configuration and Data

- Vite serves the development app on port `3000`; change `server.port` in `vite.config.js` to use another port.
- The app does not require a backend or database. Profiles, saved invoices, and the next invoice number are stored in the browser's local storage.
- Use the download and upload controls in the toolbar to move Billix data between browsers or devices with a `billix-backup.json` file.
- Browser storage is device- and browser-specific. Export a backup before clearing site data or changing browsers.

## License

This project is released under the MIT License.

Created by Jesu, 
