import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { PayoutsListContent } from '../../user/payouts/index';

export default function FreelancerPayoutsList() {
  return (
    <PanelLayout role="freelancer">
      <PayoutsListContent />
    </PanelLayout>
  );
}
