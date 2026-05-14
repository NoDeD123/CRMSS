import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import NewInvoiceContent from '@/components/panel/invoices/NewInvoiceContent';
import { FREELANCER_PANEL_BASE } from '@/lib/panelBase';

export default function FreelancerNewInvoice() {
  return (
    <PanelLayout role="freelancer">
      <NewInvoiceContent panelBase={FREELANCER_PANEL_BASE} />
    </PanelLayout>
  );
}
