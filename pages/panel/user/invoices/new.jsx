import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import NewInvoiceContent from '@/components/panel/invoices/NewInvoiceContent';
import { USER_PANEL_BASE } from '@/lib/panelBase';

export default function NewInvoice() {
  return (
    <PanelLayout role="user">
      <NewInvoiceContent panelBase={USER_PANEL_BASE} />
    </PanelLayout>
  );
}
