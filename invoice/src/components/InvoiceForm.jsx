import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import InvoiceItem from './InvoiceItem'
import InvoiceModal from './InvoiceModal'
import InputGroup from 'react-bootstrap/InputGroup'
import { BiSave, BiFolderOpen, BiDownload, BiUpload, BiPlus, BiHistory } from 'react-icons/bi'

const readStorage = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch {
    return fallback
  }
}

function InvoiceForm() {
  const [state, setState] = useState({
    isOpen: false,
    currency: '₹',
    currentDate: new Date().toLocaleDateString(),
    invoiceNumber: Number(localStorage.getItem('billix-next-invoice') || 1),
    shopName: '',
    dateOfIssue: '',
    billTo: '',
    billToEmail: '',
    billToAddress: '',
    billFrom: '',
    billFromEmail: '',
    billFromAddress: '',
    gstin: '',
    dueDate: '',
    status: 'Draft',
    paymentTerms: '',
    bankName: '',
    bankAccount: '',
    upiId: '',
    showPaymentDetails: true,
    logo: '',
    template: 'classic',
    notes: '',
    total: '0.00',
    subTotal: '0.00',
    taxRate: '',
    taxAmmount: '0.00',
    discountRate: '',
    discountAmmount: '0.00'
  })

  const [items, setItems] = useState([
    {
      id: 0,
      name: '',
      price: '1.00',
      quantity: 0
    }
  ])

  const [savedShops, setSavedShops] = useState(() => readStorage('billix-shops'))
  const [savedCustomers, setSavedCustomers] = useState(() => readStorage('billix-customers'))
  const [invoiceHistory, setInvoiceHistory] = useState(() => readStorage('billix-history'))

  useEffect(() => {
    handleCalculateTotal()
  }, [])

  const handleRowDel = (item) => {
    const index = items.indexOf(item)
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
    handleCalculateTotal()
  }

  const handleAddEvent = () => {
    const id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36)
    const newItem = {
      id: id,
      name: '',
      price: '1.00',
      quantity: 0
    }
    setItems([...items, newItem])
  }

  const handleCalculateTotal = () => {
    let subTotal = 0;
    items.forEach(item => {
      subTotal += parseFloat(item.price) * parseInt(item.quantity);
    });
    const taxAmmount = subTotal * (state.taxRate / 100);
    const discountAmmount = subTotal * (state.discountRate / 100);
    const total = (subTotal - discountAmmount) + taxAmmount;
    const formatINR = (value) => Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    setState(prev => ({
      ...prev,
      subTotal: formatINR(subTotal),
      taxAmmount: formatINR(taxAmmount),
      discountAmmount: formatINR(discountAmmount),
      total: formatINR(total)
    }));
  }

  const onItemizedItemEdit = (evt) => {
    const item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    }

    const newItems = items.map(currentItem => {
      for (let key in currentItem) {
        if (key === item.name && currentItem.id == item.id) {
          currentItem[key] = item.value
        }
      }
      return currentItem
    })

    setItems(newItems)
    handleCalculateTotal()
  }

  const editField = (event) => {
    setState(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
    handleCalculateTotal()
  }

  const onCurrencyChange = (selectedOption) => {
    setState(prev => ({ ...prev, ...selectedOption }))
  }

  const openModal = (event) => {
    event.preventDefault()
    handleCalculateTotal()
    setState(prev => ({ ...prev, isOpen: true }))
  }

  const closeModal = () => setState(prev => ({ ...prev, isOpen: false }))

  const saveProfile = (type) => {
    const isShop = type === 'shop'
    const profile = isShop
      ? { id: state.shopName || state.billFrom, name: state.shopName || state.billFrom, shopName: state.shopName, billFrom: state.billFrom, billFromEmail: state.billFromEmail, billFromAddress: state.billFromAddress, gstin: state.gstin, bankName: state.bankName, bankAccount: state.bankAccount, upiId: state.upiId }
      : { id: state.billTo, name: state.billTo, billTo: state.billTo, billToEmail: state.billToEmail, billToAddress: state.billToAddress }
    if (!profile.id) return
    const profiles = isShop ? savedShops : savedCustomers
    const updatedProfiles = [profile, ...profiles.filter(item => item.id !== profile.id)]
    localStorage.setItem(isShop ? 'billix-shops' : 'billix-customers', JSON.stringify(updatedProfiles))
    isShop ? setSavedShops(updatedProfiles) : setSavedCustomers(updatedProfiles)
  }

  const loadProfile = (type, id) => {
    const profiles = type === 'shop' ? savedShops : savedCustomers
    const profile = profiles.find(item => item.id === id)
    if (profile) setState(prev => ({ ...prev, ...profile }))
  }

  const saveInvoice = () => {
    const savedInfo = { ...state, status: 'Saved' }
    const invoice = { id: `${Date.now()}-${state.invoiceNumber}`, savedAt: new Date().toISOString(), info: savedInfo, items }
    const updatedHistory = [invoice, ...invoiceHistory.filter(item => item.id !== invoice.id)].slice(0, 50)
    localStorage.setItem('billix-history', JSON.stringify(updatedHistory))
    localStorage.setItem('billix-next-invoice', String(Number(state.invoiceNumber) + 1))
    setInvoiceHistory(updatedHistory)
    setState(prev => ({ ...prev, status: 'Saved' }))
  }

  const loadInvoice = (id) => {
    const invoice = invoiceHistory.find(item => item.id === id)
    if (invoice) {
      setState(invoice.info)
      setItems(invoice.items)
    }
  }

  const startNewInvoice = () => {
    setState(prev => ({
      ...prev,
      invoiceNumber: Number(localStorage.getItem('billix-next-invoice') || Number(prev.invoiceNumber) + 1),
      currentDate: new Date().toLocaleDateString(),
      billTo: '', billToEmail: '', billToAddress: '', notes: '', status: 'Draft',
      total: '₹0.00', subTotal: '₹0.00', taxAmmount: '₹0.00', discountAmmount: '₹0.00'
    }))
    setItems([{ id: Date.now(), name: '', price: '1.00', quantity: 0 }])
  }

  const handleLogoChange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setState(prev => ({ ...prev, logo: reader.result }))
    reader.readAsDataURL(file)
  }

  const exportBackup = () => {
    const backup = { shops: savedShops, customers: savedCustomers, history: invoiceHistory }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'billix-backup.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const shareInvoice = () => {
    const text = `${state.shopName || 'Billix'} invoice #${state.invoiceNumber} for ${state.total}`
    if (navigator.share) {
      navigator.share({ title: 'Billix invoice', text })
    } else {
      window.location.href = `mailto:${state.billToEmail || ''}?subject=Invoice%20${state.invoiceNumber}&body=${encodeURIComponent(text)}`
    }
  }

  const importBackup = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result)
        const shops = backup.shops || []
        const customers = backup.customers || []
        const history = backup.history || []
        localStorage.setItem('billix-shops', JSON.stringify(shops))
        localStorage.setItem('billix-customers', JSON.stringify(customers))
        localStorage.setItem('billix-history', JSON.stringify(history))
        setSavedShops(shops)
        setSavedCustomers(customers)
        setInvoiceHistory(history)
      } catch {
        // Ignore invalid backup files.
      }
    }
    reader.readAsText(file)
  }

  const saveSection = (section, fields) => {
    const savedValues = fields.reduce((values, field) => ({
      ...values,
      [field]: state[field]
    }), {})
    localStorage.setItem(`billix-${section}`, JSON.stringify(savedValues))
  }

  const loadSection = (section, fields) => {
    const savedValues = localStorage.getItem(`billix-${section}`)
    if (!savedValues) return

    try {
      const values = JSON.parse(savedValues)
      setState(prev => ({ ...prev, ...fields.reduce((next, field) => ({
        ...next,
        ...(values[field] !== undefined ? { [field]: values[field] } : {})
      }), {}) }))
    } catch {
      localStorage.removeItem(`billix-${section}`)
    }
  }

  useEffect(() => {
    handleCalculateTotal()
  }, [items, state.taxRate, state.discountRate])

  return (
    <Form onSubmit={openModal} className="invoice-form">
      <div className="workspace-intro">
        <div>
          <div className="eyebrow">Sales document / 01</div>
          <h1>Create an invoice</h1>
          <p>Build a clear, professional bill in a few quick steps.</p>
        </div>
        <div className="intro-stamp">INR <span>•</span> Ready to edit</div>
      </div>
      <div className="billix-toolbar">
        <div className="toolbar-group">
          <Form.Select aria-label="Load shop profile" value="" onChange={event => loadProfile('shop', event.target.value)}>
            <option value="">Shop profiles</option>
            {savedShops.map(shop => <option key={shop.id} value={shop.id}>{shop.name}</option>)}
          </Form.Select>
          <Button type="button" className="toolbar-button" onClick={() => saveProfile('shop')}><BiSave /> Save shop</Button>
        </div>
        <div className="toolbar-group">
          <Form.Select aria-label="Load customer profile" value="" onChange={event => loadProfile('customer', event.target.value)}>
            <option value="">Customer profiles</option>
            {savedCustomers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </Form.Select>
          <Button type="button" className="toolbar-button" onClick={() => saveProfile('customer')}><BiSave /> Save customer</Button>
        </div>
        <Form.Select className="history-select" aria-label="Load invoice history" value="" onChange={event => loadInvoice(event.target.value)}>
          <option value=""><BiHistory /> Invoice history</option>
          {invoiceHistory.map(invoice => <option key={invoice.id} value={invoice.id}>#{invoice.info.invoiceNumber} - {invoice.info.billTo || 'Untitled'}</option>)}
        </Form.Select>
        <Button type="button" className="new-invoice-button" onClick={startNewInvoice}><BiPlus /> New invoice</Button>
        <div className="backup-actions">
          <Button type="button" className="icon-toolbar-button" title="Export Billix backup" onClick={exportBackup}><BiDownload /></Button>
          <label className="icon-toolbar-button" title="Import Billix backup" htmlFor="billix-backup-input"><BiUpload /></label>
          <input id="billix-backup-input" type="file" accept="application/json" onChange={importBackup} hidden />
        </div>
      </div>
      <Row>
        <Col xs={12}>
          <Card className="invoice-card p-4 p-xl-5 my-3 my-xl-4">
            <div className="invoice-header d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center mb-2">
                    <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                    <Form.Control 
                      type="number" 
                      value={state.invoiceNumber} 
                      name="invoiceNumber" 
                      onChange={editField} 
                      min="1" 
                      style={{ maxWidth: '70px' }} 
                      required 
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center shop-name-field">
                    <Form.Control 
                      type="text" 
                      value={state.shopName} 
                      name="shopName" 
                      onChange={editField} 
                      placeholder="Shop name" 
                      className="shop-name-input" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4"/>
            <Row className="party-details mb-5">
              <Col className="party-column">
                <div className="section-heading">
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <div className="section-actions">
                    <Button type="button" className="save-section-button" onClick={() => { saveSection('customer', ['billTo', 'billToEmail', 'billToAddress']); saveProfile('customer') }}>
                      <BiSave /> Save
                    </Button>
                    <Button type="button" className="load-section-button" onClick={() => loadSection('customer', ['billTo', 'billToEmail', 'billToAddress'])}>
                      <BiFolderOpen /> Load
                    </Button>
                  </div>
                </div>
                <Form.Control 
                  placeholder="Who is this invoice to?" 
                  rows={3} 
                  value={state.billTo} 
                  type="text" 
                  name="billTo" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="name" 
                  
                />
                <Form.Control 
                  placeholder="Email address" 
                  value={state.billToEmail} 
                  type="email" 
                  name="billToEmail" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="email" 
                />
                <Form.Control 
                  placeholder="Billing address" 
                  value={state.billToAddress} 
                  type="text" 
                  name="billToAddress" 
                  className="my-2" 
                  autoComplete="address" 
                  onChange={editField} 
                  required 
                />
              </Col>
              <Col className="party-column">
                <div className="section-heading">
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <div className="section-actions">
                    <Button type="button" className="save-section-button" onClick={() => { saveSection('business', ['shopName', 'billFrom', 'billFromEmail', 'billFromAddress']); saveProfile('shop') }}>
                      <BiSave /> Save
                    </Button>
                    <Button type="button" className="load-section-button" onClick={() => loadSection('business', ['shopName', 'billFrom', 'billFromEmail', 'billFromAddress'])}>
                      <BiFolderOpen /> Load
                    </Button>
                  </div>
                </div>
                <Form.Control 
                  placeholder="Who is this invoice from?" 
                  rows={3} 
                  value={state.billFrom} 
                  type="text" 
                  name="billFrom" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="name" 
                  
                />
                <Form.Control 
                  placeholder="Email address" 
                  value={state.billFromEmail} 
                  type="email" 
                  name="billFromEmail" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="email" 
                />
                <Form.Control 
                  placeholder="Billing address" 
                  value={state.billFromAddress} 
                  type="text" 
                  name="billFromAddress" 
                  className="my-2" 
                  autoComplete="address" 
                  onChange={editField} 
                  required 
                />
              </Col>
            </Row>
            <Row className="invoice-settings-row g-3 mb-4">
              <Col xs={12} md={3}>
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={state.status} onChange={editField}>
                  <option>Draft</option>
                  <option>Sent</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                  <option>Saved</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={3}>
                <Form.Label>Due date (optional)</Form.Label>
                <Form.Control type="date" name="dueDate" value={state.dueDate} onChange={editField} />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label>GSTIN / tax ID (optional)</Form.Label>
                <Form.Control name="gstin" value={state.gstin} onChange={editField} placeholder="Enter GSTIN or tax ID" />
              </Col>
            </Row>
            <InvoiceItem 
              onItemizedItemEdit={onItemizedItemEdit} 
              onRowAdd={handleAddEvent} 
              onRowDel={handleRowDel} 
              currency={state.currency} 
              items={items}
            />
            <Row className="totals-row mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>{state.subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">({state.discountRate || 0}%)</span>
                    {state.discountAmmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({state.taxRate || 0}%)</span>
                    {state.taxAmmount || 0}
                  </span>
                </div>
                <hr/>
                <div 
                  className="d-flex flex-row align-items-start justify-content-between" 
                  style={{ fontSize: '1.125rem' }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">{state.total || 0}</span>
                </div>
              </Col>
            </Row>
            <hr className="my-4"/>
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control 
              placeholder="Thanks for your business!" 
              name="notes" 
              value={state.notes} 
              onChange={editField} 
              as="textarea" 
              className="my-2" 
              rows={1}
            />
            <Row className="payment-branding-row g-3 mt-2">
              <Col xs={12} md={4}>
                <Form.Label className="fw-bold">Payment terms</Form.Label>
                <Form.Control name="paymentTerms" value={state.paymentTerms} onChange={editField} placeholder="e.g. Payable on receipt" />
              </Col>
              <Col xs={12} md={4}>
                <Form.Label className="fw-bold">Bank / UPI details</Form.Label>
                <Form.Control name="bankName" value={state.bankName} onChange={editField} placeholder="Bank name" className="mb-2" />
                <Form.Control name="bankAccount" value={state.bankAccount} onChange={editField} placeholder="Account number" className="mb-2" />
                <Form.Control name="upiId" value={state.upiId} onChange={editField} placeholder="UPI ID (optional)" />
              </Col>
              <Col xs={12} md={4}>
                <Form.Label className="fw-bold">Invoice logo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleLogoChange} />
                <Form.Select name="template" value={state.template} onChange={editField} className="mt-2">
                  <option value="classic">Classic blue template</option>
                  <option value="clean">Clean template</option>
                </Form.Select>
                <Form.Check
                  type="switch"
                  id="show-payment-details"
                  name="showPaymentDetails"
                  label="Show payment details"
                  checked={state.showPaymentDetails}
                  onChange={event => setState(prev => ({ ...prev, showPaymentDetails: event.target.checked }))}
                  className="mt-3 payment-toggle"
                />
              </Col>
            </Row>
            <Row className="g-3 align-items-end mt-2">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Tax rate:</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      name="taxRate" 
                      type="number" 
                      value={state.taxRate} 
                      onChange={editField} 
                      placeholder="0.0" 
                      min="0.00" 
                      step="0.01" 
                      max="100.00"
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Discount rate:</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      name="discountRate" 
                      type="number" 
                      value={state.discountRate} 
                      onChange={editField} 
                      placeholder="0.0" 
                      min="0.00" 
                      step="0.01" 
                      max="100.00"
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Button variant="primary" type="submit" className="d-block w-100">
                  Review Invoice
                </Button>
              </Col>
            </Row>
            <InvoiceModal 
              showModal={state.isOpen} 
              closeModal={closeModal} 
              info={state} 
              items={items} 
              currency={state.currency} 
              subTotal={state.subTotal} 
              taxAmmount={state.taxAmmount} 
              discountAmmount={state.discountAmmount} 
              total={state.total}
              onSaveInvoice={saveInvoice}
              onShareInvoice={shareInvoice}
            />
          </Card>
        </Col>
      </Row>
    </Form>
  )
}

export default InvoiceForm
