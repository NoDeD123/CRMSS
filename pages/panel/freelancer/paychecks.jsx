import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import PaychecksContent from '@/components/panel/paychecks/PaychecksContent';
import { FREELANCER_PANEL_BASE } from '@/lib/panelBase';

export default function FreelancerPaychecks() {
  return (
    <PanelLayout role="freelancer">
      <PaychecksContent panelBase={FREELANCER_PANEL_BASE} />
    </PanelLayout>
  );
}
