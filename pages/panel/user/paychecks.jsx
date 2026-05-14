import React from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import PaychecksContent from '@/components/panel/paychecks/PaychecksContent';
import { USER_PANEL_BASE } from '@/lib/panelBase';

export default function UserPaycheck() {
  return (
    <PanelLayout role="user">
      <PaychecksContent panelBase={USER_PANEL_BASE} />
    </PanelLayout>
  );
}
