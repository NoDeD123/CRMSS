import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { PayoutFormContent } from '../../user/payouts/form';
import { FREELANCER_PANEL_BASE } from '@/lib/panelBase';

export default function FreelancerPayoutForm() {
  return (
    <PanelLayout role="freelancer">
      <PayoutFormContent panelBase={FREELANCER_PANEL_BASE} />
    </PanelLayout>
  );
}
