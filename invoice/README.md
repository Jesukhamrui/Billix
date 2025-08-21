
# Invoice Generator 

A modern, responsive invoice generator web application built with React and Vite. Easily create, review, and download professional invoices in PDF format. 

## Features
- Add, edit, and remove invoice items
- Dynamic calculation of subtotal, tax, discount, and total
- Customizable currency selection
- Responsive UI using Bootstrap and React-Bootstrap
- Download invoice as PDF (using html2canvas and jsPDF)
- Modal preview before download
- Notes and client/company details

## Demo
![Invoice Generator Screenshot](public/vite.svg)

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
App will run at [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
├── public/
│   ├── manifest.json
│   ├── vite.svg
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   │   └── react.svg
│   └── components/
│       ├── EditableField.jsx
│       ├── InvoiceForm.jsx
│       ├── InvoiceItem.jsx
│       └── InvoiceModal.jsx
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Technologies Used
- [React](https://react.dev/) (v18)
- [Vite](https://vitejs.dev/)
- [Bootstrap](https://getbootstrap.com/) & [React-Bootstrap](https://react-bootstrap.github.io/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [React Icons](https://react-icons.github.io/react-icons/)

## Configuration
- **Port:** Default development server runs on port 3000 (see `vite.config.js`)
- **ESLint:** Configured for React best practices (`eslint.config.js`)

## Manifest
See `public/manifest.json` for PWA configuration.

## License
MIT

---
Created by Jesu (based on John Uberbacher's template)
