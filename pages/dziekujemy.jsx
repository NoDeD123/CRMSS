import Head from 'next/head';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <>
      <Head>
        <title>Dziekujemy - StrefaStartu</title>
        <meta
          name="description"
          content="Dziekujemy za wyslanie formularza. Sprawdz skrzynke mailowa."
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
        <section className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200/60">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dziekujemy!</h1>
          <p className="text-gray-600 mb-6">
            Twoje zgloszenie zostalo wyslane. Sprawdz skrzynke mailowa - odezwiemy sie wkrotce.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Wroc na strone glowna
          </Link>
        </section>
      </main>
    </>
  );
}
