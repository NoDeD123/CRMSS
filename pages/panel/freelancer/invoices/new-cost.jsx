import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import NewCostInvoiceContent from '@/components/panel/invoices/NewCostInvoiceContent';
import { FREELANCER_PANEL_BASE } from '@/lib/panelBase';

export default function FreelancerNewCostInvoice() {
  return (
    <PanelLayout role="freelancer">
      <NewCostInvoiceContent panelBase={FREELANCER_PANEL_BASE} />
    </PanelLayout>
  );
}
