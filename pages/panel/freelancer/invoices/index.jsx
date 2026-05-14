import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import InvoicesListContent from '@/components/panel/invoices/InvoicesListContent';
import { FREELANCER_PANEL_BASE } from '@/lib/panelBase';

export default function FreelancerInvoicesList() {
  return (
    <PanelLayout role="freelancer">
      <InvoicesListContent panelBase={FREELANCER_PANEL_BASE} />
    </PanelLayout>
  );
}
