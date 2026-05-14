import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import NewCostInvoiceContent from '@/components/panel/invoices/NewCostInvoiceContent';
import { USER_PANEL_BASE } from '@/lib/panelBase';

export default function NewCostInvoice() {
  return (
    <PanelLayout role="user">
      <NewCostInvoiceContent panelBase={USER_PANEL_BASE} />
    </PanelLayout>
  );
}
