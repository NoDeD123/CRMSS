import React from 'react';
import { useRouter } from 'next/router';

const documents = {
  pl: [
    { label: 'Regulamin', slug: '../docs/regulamin.pdf' },
    { label: 'Polityka RODO', slug: '../docs/rodo.pdf' },
    { label: 'Polityka Prywatności', slug: '../docs/polityka.pdf' },
    { label: 'Polityka Cookies', slug: '../docs/cookie.pdf' },
  ],
  en: [
    { label: 'Terms and Conditions', slug: 'terms' },
    { label: 'GDPR Policy', slug: 'gdpr' },
    { label: 'Privacy Policy', slug: 'privacy' },
    { label: 'Cookie Policy', slug: 'cookie_en' },
  ],
  ua: [
    { label: 'Правила', slug: 'terms_ua' },
    { label: 'Політика GDPR', slug: 'gdpr_ua' },
    { label: 'Політика конфіденційності', slug: 'politika_ua' },
    { label: 'Політика Cookies', slug: 'cookie_ua' },
  ],
};

const DocumentLinks = () => {
  const { locale } = useRouter();
  // Jeśli z jakiegoś powodu dany język nie istnieje, domyślnie wybieramy polski
  const docs = documents[locale] || documents.pl;

  return (
    <div className="mt-4 md:mt-0">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">Dokumenty</h3>
      <nav className="flex flex-col space-y-2 text-gray-600 text-sm items-center md:items-start">
        {docs.map((doc) => (
          <a 
            key={doc.slug}
            href={`/${locale}/${doc.slug}`}
            className="hover:text-gray-900 transition-colors duration-200 hover:underline w-full text-center md:text-left"
          >
            {doc.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default DocumentLinks;
