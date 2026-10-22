import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Container from 'react-bootstrap/Container'
import InvoiceForm from './components/InvoiceForm'
import { BiReceipt } from 'react-icons/bi'

function App() {
  return (
    <div className="App w-100">
      <header className="site-header">
        <Container>
          <div className="site-header-inner">
            <div className="brand-lockup">
              <span className="brand-mark"><BiReceipt /></span>
              <div>
                <div className="brand-name">Billix</div>
                <div className="brand-kicker">Invoice studio</div>
              </div>
            </div>
            <div className="workspace-status">
              <span className="status-dot" /> Draft workspace
            </div>
          </div>
        </Container>
      </header>
      <main className="site-main">
        <Container>
        <InvoiceForm />
        </Container>
      </main>
    </div>
  )
}

export default App