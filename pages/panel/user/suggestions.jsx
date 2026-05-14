import React, { useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paperclip, Lightbulb, Send } from 'lucide-react';
import { useBeneficiaryPanelLocale } from '@/contexts/BeneficiaryPanelLocale';

/** API expects these exact Polish category strings */
const SUGGESTION_CATEGORY_API_VALUES = [
  'Błąd techniczny / Awaria',
  'Sugestia nowej funkcji',
  'Pytanie organizacyjne',
  'Inne',
];

const SUGGESTION_CATEGORY_TP_KEYS = ['catTechnical', 'catFeature', 'catOrg', 'catOther'];

function UserSuggestionsBody() {
  const { tp } = useBeneficiaryPanelLocale();
  const [formData, setFormData] = useState({
    category: SUGGESTION_CATEGORY_API_VALUES[0],
    subject: '',
    description: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      const payload = new FormData();
      payload.append('category', formData.category);
      payload.append('subject', formData.subject);
      payload.append('description', formData.description);
      if (attachment) {
        payload.append('attachment', attachment);
      }

      const res = await fetch('/api/user/suggestions', {
        method: 'POST',
        body: payload,
      });
      const json = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({ category: SUGGESTION_CATEGORY_API_VALUES[0], subject: '', description: '' });
        setAttachment(null);
      } else {
        setErrorMsg(json.message || tp('suggestions.sendError'));
      }
    } catch (_err) {
      setErrorMsg(tp('suggestions.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative p-8 rounded-2xl mb-8 overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/20">
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-blue-500" /> {tp('suggestions.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-medium max-w-2xl">{tp('suggestions.intro')}</p>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
          <Lightbulb className="w-64 h-64 text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle>{tp('suggestions.cardTitle')}</CardTitle>
              <CardDescription>{tp('suggestions.cardHint')}</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="p-6 text-center text-green-700 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="text-lg font-bold mb-2">{tp('suggestions.successTitle')}</h3>
                  <p>{tp('suggestions.successText')}</p>
                  <Button className="mt-4" variant="outline" onClick={() => setSuccess(false)}>
                    {tp('suggestions.another')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="category">{tp('suggestions.category')}</Label>
                    <select
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {SUGGESTION_CATEGORY_API_VALUES.map((value, idx) => (
                        <option key={value} value={value}>
                          {tp(`suggestions.${SUGGESTION_CATEGORY_TP_KEYS[idx]}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{tp('suggestions.subject')}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={tp('suggestions.subjectPh')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{tp('suggestions.description')}</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      placeholder={tp('suggestions.descriptionPh')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachment">{tp('suggestions.attachment')}</Label>
                    <div className="flex items-center gap-3">
                      <Input id="attachment" type="file" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                      <Button type="button" variant="outline" onClick={() => document.getElementById('attachment').click()}>
                        <Paperclip className="mr-2 h-4 w-4" />
                        {tp('suggestions.browse')}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">{tp('suggestions.attachmentHint')}</p>
                  </div>

                  {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
                  <Button
                    type="submit"
                    disabled={loading || !formData.subject || !formData.description}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {loading ? tp('suggestions.sending') : tp('suggestions.send')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-50 dark:bg-gray-900/50">
            <CardHeader>
              <CardTitle>{tp('suggestions.tipsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 relative border-l border-gray-200 dark:border-gray-700 ml-3">
                <li className="mb-4 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300 font-bold text-xs">1</span>
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tp('suggestions.tip1Title')}</h3>
                  <p className="text-sm font-normal text-gray-500">{tp('suggestions.tip1Text')}</p>
                </li>
                <li className="mb-4 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300 font-bold text-xs">2</span>
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tp('suggestions.tip2Title')}</h3>
                  <p className="text-sm font-normal text-gray-500">{tp('suggestions.tip2Text')}</p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300 font-bold text-xs">3</span>
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tp('suggestions.tip3Title')}</h3>
                  <p className="text-sm font-normal text-gray-500">{tp('suggestions.tip3Text')}</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function UserSuggestions() {
  return (
    <PanelLayout role="user">
      <UserSuggestionsBody />
    </PanelLayout>
  );
}
