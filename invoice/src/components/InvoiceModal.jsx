import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import { BiPaperPlane, BiCloudDownload, BiShareAlt, BiSave } from "react-icons/bi"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function GenerateInvoice(info) {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    })
    pdf.internal.scaleFactor = 1
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    const fileName = `${(info.shopName || 'billix').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-invoice-${info.invoiceNumber || '0001'}.pdf`
    pdf.save(fileName)
  })
}

function InvoiceModal({ 
  showModal, 
  closeModal, 
  info, 
  items, 
  currency, 
  subTotal, 
  taxAmmount, 
  discountAmmount, 
  total,
  onSaveInvoice,
  onShareInvoice
}) {
  const formatINR = (value) => Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  return (
    <div>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div id="invoiceCapture" className={`invoice-pdf ${info.template === 'clean' ? 'invoice-pdf-clean' : ''}`}>
          <div className="invoice-pdf-header">
            <div className="invoice-pdf-header-wave" />
            <div className="invoice-pdf-header-content">
              {info.logo && <img className="invoice-pdf-logo" src={info.logo} alt="Invoice logo" />}
              <div className="invoice-pdf-title">INVOICE</div>
              <div className="invoice-pdf-header-shop-name">{info.shopName || 'Billix'}</div>
              <div className="invoice-pdf-number">NO: INV-{info.invoiceNumber || '0001'}</div>
            </div>
          </div>
          <div className="invoice-pdf-body">
            <Row className="invoice-pdf-parties">
              <Col md={6}>
                <div className="invoice-pdf-section-title">Bill To:</div>
                <div>{info.billTo || ''}</div>
                <div>{info.billToEmail || ''}</div>
                <div>{info.billToAddress || ''}</div>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="invoice-pdf-section-title">From:</div>
                <div>{info.billFrom || ''}</div>
                <div>{info.billFromEmail || ''}</div>
                <div>{info.billFromAddress || ''}</div>
              </Col>
            </Row>
            <div className="invoice-pdf-date">
              <span>Date: {info.currentDate}</span>
              {info.dueDate && <span>Due: {info.dueDate}</span>}
              {info.gstin && <span>GSTIN: {info.gstin}</span>}
              <span>Status: {info.status}</span>
            </div>
            <Table className="invoice-pdf-items">
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th className="text-center">QTY</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name || 'Item'}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">{formatINR(item.price)}</td>
                    <td className="text-end">{formatINR(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="invoice-pdf-summary">
              <div><span>SUBTOTAL</span><strong>{subTotal}</strong></div>
              <div><span>TAX</span><strong>{taxAmmount}</strong></div>
              <div><span>DISCOUNT</span><strong>{discountAmmount}</strong></div>
              <div className="invoice-pdf-total"><span>TOTAL</span><strong>{total}</strong></div>
            </div>
            <div className="invoice-pdf-footer-grid">
              <div>
                <div className="invoice-pdf-section-title">Note:</div>
                <div className="invoice-pdf-note">{info.notes || 'Thank you for your business.'}</div>
              </div>
              {info.showPaymentDetails && (
                <div>
                  <div className="invoice-pdf-section-title">Payment Information:</div>
                  <div><strong>Business:</strong> {info.billFrom || 'Billix'}</div>
                  <div><strong>Address:</strong> {info.billFromAddress || 'Contact the business for payment details.'}</div>
                  {info.paymentTerms && <div><strong>Terms:</strong> {info.paymentTerms}</div>}
                  {info.bankName && <div><strong>Bank:</strong> {info.bankName}</div>}
                  {info.bankAccount && <div><strong>Account:</strong> {info.bankAccount}</div>}
                  {info.upiId && <div><strong>UPI:</strong> {info.upiId}</div>}
                  <div><strong>Email:</strong> {info.billFromEmail || 'Not provided'}</div>
                </div>
              )}
            </div>
            <div className="invoice-pdf-thank-you">Thank You!</div>
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={3}>
              <Button variant="primary" className="d-block w-100" onClick={() => { onSaveInvoice(); GenerateInvoice(info) }}>
                <BiSave 
                  style={{width: '15px', height: '15px', marginTop: '-3px'}} 
                  className="me-2"
                />
                Save & Download
              </Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={onShareInvoice}>
                <BiShareAlt 
                  style={{width: '15px', height: '15px', marginTop: '-3px'}} 
                  className="me-2"
                />
                Share Invoice
              </Button>
            </Col>
            <Col md={4}>
              <Button 
                variant="outline-primary" 
                className="d-block w-100 mt-3 mt-md-0" 
                onClick={() => GenerateInvoice(info)}
              >
                <BiPaperPlane 
                  style={{width: '15px', height: '15px', marginTop: '-3px'}} 
                  className="me-2"
                />
                Send Invoice
              </Button>
            </Col>
            <Col md={4}>
              <Button 
                variant="outline-primary" 
                className="d-block w-100 mt-3 mt-md-0" 
                onClick={() => GenerateInvoice(info)}
              >
                <BiCloudDownload 
                  style={{width: '16px', height: '16px', marginTop: '-3px'}} 
                  className="me-2"
                />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      <hr className="mt-4 mb-3"/>
    </div>
  )
}

export default InvoiceModal
