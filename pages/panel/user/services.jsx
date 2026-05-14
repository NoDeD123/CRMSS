import React, { useState } from 'react';
import PanelLayout from '@/components/Layout/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Car, Smartphone, BookOpen, Globe, ArrowRight, Star } from 'lucide-react';

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');

  const servicesList = [
    {
      id: 1,
      name: "Wynajem samochodu",
      desc: "Wybierz spośród różnych modeli i wynajmij auto na dogodnych warunkach.",
      icon: <Car className="h-10 w-10 text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: 2,
      name: "Prowadzenie mediów społecznościowych",
      desc: "Profesjonalne zarządzanie Twoimi kanałami w sieci.",
      icon: <Smartphone className="h-10 w-10 text-purple-500" />,
      color: "from-purple-500/20 to-fuchsia-500/20"
    },
    {
      id: 3,
      name: "Szkolenia i kursy",
      desc: "Rozwijaj swoje umiejętności dzięki naszym specjalistycznym kursom.",
      icon: <BookOpen className="h-10 w-10 text-green-500" />,
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: 4,
      name: "Tworzenie stron internetowych",
      desc: "Zbuduj profesjonalną stronę dopasowaną do Twoich potrzeb.",
      icon: <Globe className="h-10 w-10 text-orange-500" />,
      color: "from-orange-500/20 to-amber-500/20"
    },
  ];

  const filteredServices = servicesList.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PanelLayout role="user">
      <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 p-8 rounded-2xl mb-8 border border-blue-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" /> Usługi dla Ciebie
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              To kompleksowe miejsce, w którym znajdziesz pełen wachlarz naszych usług dodatkowych.
              Dzięki intuicyjnemu układowi szybko zapoznasz się z naszą ofertą partnerską i
              bez problemu skorzystasz z interesujących Cię możliwości.
            </p>
          </div>

          <div className="w-full md:w-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Szukaj usług..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 w-full md:w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-900/50 shadow-sm text-lg focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Brak wyników</h3>
          <p className="text-gray-500">Nie znaleziono usług pasujących do hasła "{searchTerm}"</p>
          <Button variant="link" onClick={() => setSearchTerm('')} className="mt-2 text-blue-600">
            Wyczyść wyszukiwanie
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border-t-0">
              <div className={`h-2 w-full bg-gradient-to-r ${service.color}`}></div>
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-500 dark:text-gray-400">
                  {service.desc}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-gray-50/50 dark:bg-gray-900/20">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Sprawdź szczegóły
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PanelLayout>
  );
}