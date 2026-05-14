import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wallet, Send } from 'lucide-react';
import Link from 'next/link';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

const payoutStatusBadgeClass = {
  DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  UNDER_REVIEW: 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

export default function PaychecksContent({ panelBase }) {
  const { lng, tp } = useBeneficiaryPanelLocale();
  const dateLocale = lng === 'en' ? 'en-GB' : 'pl-PL';
  const payoutsFormPath = `${panelBase}/payouts/form`;
  const [amount, setAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaychecks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/paychecks');
      const json = await res.json();
      if (res.ok && json.data) {
        setCurrentBalance(Number(json.data.accountBalance));
        setPayoutHistory(Array.isArray(json.data.payouts) ? json.data.payouts : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaychecks();
  }, []);

  const payoutLabel = (status) => tp(`paychecks.st${status}`) || status;

  const handleWithdrawClick = async (e) => {
    e.preventDefault();
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error(tp('paychecks.amountInvalid'));
      return;
    }

    try {
      setLoading(true);
      const payload = { amount: Number(amount) };
      const res = await fetch('/api/user/paychecks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(json.message || tp('paychecks.orderOk'));
        setAmount('');
        fetchPaychecks();
      } else {
        toast.error(json.error || tp('paychecks.orderFail'));
      }
    } catch (err) {
      toast.error(tp('paychecks.unexpected'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {tp('paychecks.title')}
          </h1>
          <p className="text-gray-500">{tp('paychecks.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                {tp('paychecks.warningTitle')}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{tp('paychecks.warningBody')}</p>
              <Link
                href={payoutsFormPath}
                className="text-sm font-medium underline text-yellow-800 dark:text-yellow-500 mt-2 inline-block"
              >
                {tp('paychecks.declarationLink')}
              </Link>
            </div>
          </div>
        </div>

        <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">{tp('paychecks.balanceTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-4xl font-bold">
                {loading ? '...' : currentBalance.toFixed(2)} PLN
              </span>
            </div>

            <form className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="withdraw_amount">{tp('paychecks.amountLabel')}</Label>
                <div className="relative">
                  <Input
                    id="withdraw_amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={currentBalance}
                    placeholder="0.00"
                    className="pl-3 pr-12 text-lg h-12"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">PLN</span>
                </div>
              </div>
              <Button onClick={handleWithdrawClick} className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg">
                <Send className="mr-2 h-5 w-5" /> {tp('paychecks.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{tp('paychecks.historyTitle')}</CardTitle>
            <p className="text-sm text-gray-500 font-normal">{tp('paychecks.historySubtitle')}</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading && payoutHistory.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm">{tp('paychecks.loading')}</p>
            ) : payoutHistory.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm">{tp('paychecks.emptyHistory')}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tp('paychecks.colNumber')}</TableHead>
                    <TableHead>{tp('paychecks.colDate')}</TableHead>
                    <TableHead className="text-right">{tp('paychecks.colAmount')}</TableHead>
                    <TableHead>{tp('paychecks.colStatus')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutHistory.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-sm">{row.requestNumber}</TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString(dateLocale)
                          : '\u2014'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {Number(row.amount).toFixed(2)} {row.currency || 'PLN'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={payoutStatusBadgeClass[row.status] || 'bg-gray-100 text-gray-800'}
                        >
                          {payoutLabel(row.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
