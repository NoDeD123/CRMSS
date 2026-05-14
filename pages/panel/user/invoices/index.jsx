import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import InvoicesListContent from '@/components/panel/invoices/InvoicesListContent';
import { USER_PANEL_BASE } from '@/lib/panelBase';

export default function InvoicesList() {
  return (
    <PanelLayout role="user">
      <InvoicesListContent panelBase={USER_PANEL_BASE} />
    </PanelLayout>
  );
}
