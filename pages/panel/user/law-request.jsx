import React, { useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Send, Paperclip } from 'lucide-react';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

function LawRequestBody() {
  const { tp } = useBeneficiaryPanelLocale();
  const [description, setDescription] = useState('');
  const [wantsMeeting, setWantsMeeting] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('wantsMeeting', String(wantsMeeting));
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await fetch('/api/user/law-requests', {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error || tp('lawRequest.sendFail'));
        return;
      }

      setSuccess(payload?.message || tp('lawRequest.sendOk'));
      setDescription('');
      setWantsMeeting(false);
      setAttachment(null);
    } catch (requestError) {
      console.error(requestError);
      setError(tp('lawRequest.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative p-8 rounded-2xl mb-8 overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/20">
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-blue-500" /> {tp('lawRequest.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-medium max-w-2xl">{tp('lawRequest.intro')}</p>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
          <ShieldAlert className="w-64 h-64 text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle>{tp('lawRequest.formTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="problem_desc" className="text-base font-semibold">
                    {tp('lawRequest.problemLabel')}
                  </Label>
                  <textarea
                    id="problem_desc"
                    name="problem_desc"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    placeholder={tp('lawRequest.problemPh')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment" className="text-base font-semibold">
                    {tp('lawRequest.attachmentLabel')}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      id="attachment"
                      name="attachment"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => document.getElementById('attachment')?.click()}
                    >
                      <Paperclip className="mr-2 h-4 w-4" /> {tp('lawRequest.browse')}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">{tp('lawRequest.attachmentHint')}</p>
                </div>

                <div className="flex items-center space-x-2 pt-2 pb-4">
                  <input
                    type="checkbox"
                    id="meeting"
                    name="meeting"
                    checked={wantsMeeting}
                    onChange={(e) => setWantsMeeting(e.target.checked)}
                    className="rounded border-gray-300 w-5 h-5 accent-blue-600"
                  />
                  <Label htmlFor="meeting" className="font-medium cursor-pointer text-base">
                    {tp('lawRequest.meeting')}
                  </Label>
                </div>

                {success && <p className="text-sm text-green-600">{success}</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                  <Send className="mr-2 h-5 w-5" /> {loading ? tp('lawRequest.sending') : tp('lawRequest.send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-50 dark:bg-gray-900/50">
            <CardHeader>
              <CardTitle>{tp('lawRequest.howTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 relative border-l border-gray-200 dark:border-gray-700 ml-3">
                <li className="mb-4 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300 font-bold text-xs">1</span>
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tp('lawRequest.step1Title')}</h3>
                  <p className="text-sm font-normal text-gray-500">{tp('lawRequest.step1Text')}</p>
                </li>
                <li className="mb-4 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300 font-bold text-xs">2</span>
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tp('lawRequest.step2Title')}</h3>
                  <p className="text-sm font-normal text-gray-500">{tp('lawRequest.step2Text')}</p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300 font-bold text-xs">3</span>
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tp('lawRequest.step3Title')}</h3>
                  <p className="text-sm font-normal text-gray-500">{tp('lawRequest.step3Text')}</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function LawRequest() {
  return (
    <PanelLayout role="user">
      <LawRequestBody />
    </PanelLayout>
  );
}
