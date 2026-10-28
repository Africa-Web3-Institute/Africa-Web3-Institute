import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Mail, 
  Users, 
  Globe, 
  Heart, 
  Lightbulb,
  Target,
  Award,
  Clock,
  Send,
  ChevronRight,
 
  Bell,
  Building2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function Careers() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const values = [
    {
      icon: Heart,
      title: language === 'fr' ? 'Innovation avec Impact' : 'Innovation with Impact',
      description: language === 'fr' 
        ? 'Nous créons des solutions qui transforment l\'Afrique grâce à la technologie Web3.'
        : 'We create solutions that transform Africa through Web3 technology.'
    },
    {
      icon: Users,
      title: language === 'fr' ? 'Collaboration Panafricaine' : 'Pan-African Collaboration',
      description: language === 'fr'
        ? 'Travailler ensemble à travers les frontières pour construire un avenir numérique unifié.'
        : 'Working together across borders to build a unified digital future.'
    },
    {
      icon: Target,
      title: language === 'fr' ? 'Excellence' : 'Excellence',
      description: language === 'fr'
        ? 'Nous visons l\'excellence dans tout ce que nous faisons, de la recherche à l\'exécution.'
        : 'We strive for excellence in everything we do, from research to execution.'
    },
    {
      icon: Lightbulb,
      title: language === 'fr' ? 'Apprentissage Continu' : 'Continuous Learning',
      description: language === 'fr'
        ? 'Nous favorisons une culture de croissance et de développement continus.'
        : 'We foster a culture of continuous growth and development.'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: language === 'fr' ? 'Travail à Distance' : 'Remote Work',
      description: language === 'fr' 
        ? 'Travaillez depuis n\'importe où en Afrique'
        : 'Work from anywhere in Africa'
    },
    {
      icon: Award,
      title: language === 'fr' ? 'Développement Professionnel' : 'Professional Development',
      description: language === 'fr'
        ? 'Accès à des formations et conférences'
        : 'Access to training and conferences'
    },
    {
      icon: Clock,
      title: language === 'fr' ? 'Horaires Flexibles' : 'Flexible Hours',
      description: language === 'fr'
        ? 'Équilibrez travail et vie personnelle'
        : 'Balance work and personal life'
    },
    {
      icon: Heart,
      title: language === 'fr' ? 'Environnement Inclusif' : 'Inclusive Environment',
      description: language === 'fr'
        ? 'Culture diversifiée et accueillante'
        : 'Diverse and welcoming culture'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#0B1437] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#D4A017] opacity-5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-[#D4A017] opacity-5 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4A017] px-4 py-1.5 border border-[#D4A017]/30 rounded-full">
                {language === 'fr' ? 'Carrières' : 'Careers'}
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 px-4 py-1.5 border border-white/10 rounded-full">
                {language === 'fr' ? 'Rejoignez-nous' : 'Join Us'}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {language === 'fr' 
                ? 'Façonnez l\'avenir numérique de l\'Afrique'
                : 'Shape Africa\'s Digital Future'}
            </h1>
            
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">
              {language === 'fr'
                ? 'Nous recherchons des talents passionnés pour rejoindre notre équipe panafricaine et contribuer à la transformation numérique du continent.'
                : 'We\'re looking for passionate talent to join our pan-African team and contribute to the continent\'s digital transformation.'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg">
              <div className="text-center p-4 border border-white/10 rounded-lg">
                <p className="text-2xl font-bold text-[#D4A017]">18+</p>
                <p className="text-xs text-white/40 mt-1">{language === 'fr' ? 'Pays' : 'Countries'}</p>
              </div>
              <div className="text-center p-4 border border-white/10 rounded-lg">
                <p className="text-2xl font-bold text-[#D4A017]">100%</p>
                <p className="text-xs text-white/40 mt-1">{language === 'fr' ? 'À Distance' : 'Remote'}</p>
              </div>
              <div className="text-center p-4 border border-white/10 rounded-lg">
                <p className="text-2xl font-bold text-[#D4A017]">10+</p>
                <p className="text-xs text-white/40 mt-1">{language === 'fr' ? 'Projets en Cours' : 'Active Projects'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No Vacancies Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Large Icon */}
            <div className="w-24 h-24 rounded-2xl bg-[#D4A017]/10 flex items-center justify-center mx-auto mb-8">
              <Briefcase className="w-12 h-12 text-[#D4A017]" strokeWidth={1.5} />
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-[#0B1437] mb-4">
              {language === 'fr' 
                ? 'Aucun poste vacant pour le moment'
                : 'No Open Positions at the Moment'}
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
              {language === 'fr'
                ? 'Nous n\'avons pas de postes vacants actuellement, mais nous sommes toujours à la recherche de talents exceptionnels. Laissez-nous vos coordonnées et nous vous contacterons dès qu\'une opportunité correspondant à votre profil se présentera.'
                : 'We don\'t have any open positions right now, but we\'re always looking for exceptional talent. Leave your details and we\'ll reach out when an opportunity matching your profile arises.'}
            </p>

            {/* Notification Bell */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#D4A017]/5 border border-[#D4A017]/20 rounded-full">
                <Bell className="w-4 h-4 text-[#D4A017]" />
                <span className="text-sm text-gray-600">
                  {language === 'fr'
                    ? 'Soyez parmi les premiers informés des nouvelles opportunités'
                    : 'Be the first to know about new opportunities'}
                </span>
              </div>
            </div>

            {/* Email Subscription */}
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'fr' ? 'Votre adresse email' : 'Your email address'}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-[#D4A017] focus:outline-none transition-colors text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#D4A017] text-[#0B1437] font-semibold text-sm hover:bg-[#c49216] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  {language === 'fr' ? 'Recevoir les alertes' : 'Get Alerts'}
                </button>
              </div>
              {subscribed && (
                <p className="text-sm text-green-600 mt-3 animate-fadeIn">
                  ✓ {language === 'fr' ? 'Inscription réussie !' : 'Subscribed successfully!'}
                </p>
              )}
            </form>

            {/* Alternative Actions */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link
                to="/about"
                className="group p-6 border border-gray-200 rounded-xl hover:border-[#D4A017] transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A017]/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#D4A017]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1437] group-hover:text-[#D4A017] transition-colors">
                      {language === 'fr' ? 'Découvrir AWI' : 'Learn About AWI'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Notre mission et vision' : 'Our mission and vision'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/contact"
                className="group p-6 border border-gray-200 rounded-xl hover:border-[#D4A017] transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A017]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#D4A017]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1437] group-hover:text-[#D4A017] transition-colors">
                      {language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'fr' ? 'Nous contacter directement' : 'Reach out directly'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4A017] mb-3">
              {language === 'fr' ? 'Nos Valeurs' : 'Our Values'}
            </p>
            <h2 className="text-3xl font-bold text-[#0B1437]">
              {language === 'fr' 
                ? 'Ce qui nous anime'
                : 'What Drives Us'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index} 
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:border-[#D4A017] transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#D4A017]/10 flex items-center justify-center mb-4 group-hover:bg-[#D4A017] transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#D4A017] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-[#0B1437] mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4A017] mb-3">
              {language === 'fr' ? 'Avantages' : 'Benefits'}
            </p>
            <h2 className="text-3xl font-bold text-[#0B1437]">
              {language === 'fr' 
                ? 'Pourquoi rejoindre AWI ?'
                : 'Why Join AWI?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#D4A017]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#D4A017]" />
                  </div>
                  <h3 className="font-semibold text-[#0B1437] mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-500">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B1437] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D4A017]/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-[#D4A017]" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            {language === 'fr'
              ? 'Prêt à faire la différence ?'
              : 'Ready to Make a Difference?'}
          </h2>
          
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            {language === 'fr'
              ? 'Même si nous n\'avons pas de postes ouverts actuellement, nous aimerions connaître votre parcours et vos aspirations.'
              : 'Even though we don\'t have open positions right now, we\'d love to hear about your background and aspirations.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 bg-[#D4A017] text-[#0B1437] font-semibold rounded-lg hover:bg-[#c49216] transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </Link>
            <button
              onClick={() => {
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {language === 'fr' ? 'Recevoir des alertes' : 'Get Alerts'}
            </button>
          </div>
        </div>
      </section>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
