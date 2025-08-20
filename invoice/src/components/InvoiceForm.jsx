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

function InvoiceForm() {
  const [state, setState] = useState({
    isOpen: false,
    currency: '₹',
    currentDate: '',
    invoiceNumber: 1,
    dateOfIssue: '',
    billTo: '',
    billToEmail: '',
    billToAddress: '',
    billFrom: '',
    billFromEmail: '',
    billFromAddress: '',
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
      description: '',
      price: '1.00',
      quantity: 1
    }
  ])

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
      description: '',
      quantity: 1
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

  useEffect(() => {
    handleCalculateTotal()
  }, [items, state.taxRate, state.discountRate])

  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control 
                    type="date" 
                    value={state.dateOfIssue} 
                    name="dateOfIssue" 
                    onChange={editField} 
                    style={{ maxWidth: '150px' }} 
                    required 
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
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
            </div>
            <hr className="my-4"/>
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control 
                  placeholder="Who is this invoice to?" 
                  rows={3} 
                  value={state.billTo} 
                  type="text" 
                  name="billTo" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="name" 
                  required 
                />
                <Form.Control 
                  placeholder="Email address" 
                  value={state.billToEmail} 
                  type="email" 
                  name="billToEmail" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="email" 
                  required 
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
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control 
                  placeholder="Who is this invoice from?" 
                  rows={3} 
                  value={state.billFrom} 
                  type="text" 
                  name="billFrom" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="name" 
                  required 
                />
                <Form.Control 
                  placeholder="Email address" 
                  value={state.billFromEmail} 
                  type="email" 
                  name="billFromEmail" 
                  className="my-2" 
                  onChange={editField} 
                  autoComplete="email" 
                  required 
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
            <InvoiceItem 
              onItemizedItemEdit={onItemizedItemEdit} 
              onRowAdd={handleAddEvent} 
              onRowDel={handleRowDel} 
              currency={state.currency} 
              items={items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>{state.currency}{state.subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">({state.discountRate || 0}%)</span>
                    {state.currency}{state.discountAmmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({state.taxRate || 0}%)</span>
                    {state.currency}{state.taxAmmount || 0}
                  </span>
                </div>
                <hr/>
                <div 
                  className="d-flex flex-row align-items-start justify-content-between" 
                  style={{ fontSize: '1.125rem' }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">{state.currency}{state.total || 0}</span>
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
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
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
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select 
                onChange={event => onCurrencyChange({currency: event.target.value})} 
                className="btn btn-light my-1" 
                aria-label="Change Currency"
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Singapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control 
                  name="taxRate" 
                  type="number" 
                  value={state.taxRate} 
                  onChange={editField} 
                  className="bg-white border" 
                  placeholder="0.0" 
                  min="0.00" 
                  step="0.01" 
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control 
                  name="discountRate" 
                  type="number" 
                  value={state.discountRate} 
                  onChange={editField} 
                  className="bg-white border" 
                  placeholder="0.0" 
                  min="0.00" 
                  step="0.01" 
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>
  )
}

export default InvoiceForm