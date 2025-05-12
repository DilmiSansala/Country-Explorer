import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import countriesService from '../services/api';
import { SessionContext } from '../contexts/SessionContext';

const DetailPage = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  
  const { isAuthenticated, isFavorite, toggleFavorite } = useContext(SessionContext);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const data = await countriesService.getCountryByCode(code);
        setCountry(data);
        
        if (data.borders && data.borders.length > 0) {
          const borderPromises = data.borders.map(border => 
            countriesService.getCountryByCode(border)
          );
          const borderData = await Promise.all(borderPromises);
          setBorderCountries(borderData);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch country details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-white/30">
              <div className="relative">
                <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-l-4 border-r-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="mt-6 text-xl font-medium text-gray-700">Loading country details...</div>
              <p className="text-gray-500 mt-2">Exploring the world of {code}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-center bg-rose-50/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-200/50 max-w-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-rose-700 mb-2">Oops! Something went wrong</h2>
              <p className="text-rose-600 mb-6">{error || 'Country not found.'}</p>
              <Link 
                to="/" 
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Go Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getLanguages = () => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  const getCurrencies = () => {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies)
      .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
      .join(', ');
  };

  const getRegionColors = (region) => {
    switch(region) {
      case 'Africa': return { 
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-500',
        text: 'text-amber-700',
        light: 'bg-amber-50'
      };
      case 'Americas': return { 
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-500',
        text: 'text-blue-700',
        light: 'bg-blue-50'
      };
      case 'Asia': return { 
        gradient: 'from-red-500 to-rose-600',
        bg: 'bg-red-500',
        text: 'text-red-700',
        light: 'bg-red-50'
      };
      case 'Europe': return { 
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-500',
        text: 'text-emerald-700',
        light: 'bg-emerald-50'
      };
      case 'Oceania': return { 
        gradient: 'from-purple-500 to-violet-600',
        bg: 'bg-purple-500',
        text: 'text-purple-700',
        light: 'bg-purple-50'
      };
      default: return { 
        gradient: 'from-gray-500 to-slate-600',
        bg: 'bg-gray-500',
        text: 'text-gray-700',
        light: 'bg-gray-50'
      };
    }
  };

  const regionColors = getRegionColors(country.region);

  const InfoItem = ({ icon, label, value }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <div className={`${regionColors.light} px-5 py-3 flex items-center border-b border-gray-100`}>
        <div className={`w-8 h-8 rounded-full ${regionColors.bg} flex items-center justify-center text-white mr-3`}>
          {icon}
        </div>
        <h3 className={`font-semibold ${regionColors.text}`}>{label}</h3>
      </div>
      <div className="p-5">
        <p className="text-gray-700">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative">
      {/* Decorative Circles */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <svg className="absolute w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="world-pattern" patternUnits="userSpaceOnUse" width="200" height="200">
              <path d="M25,60 a20,20 0 1,0 0,1 z M75,60 a20,20 0 1,0 0,1 z M125,60 a20,20 0 1,0 0,1 z M175,60 a20,20 0 1,0 0,1 z M25,100 a20,20 0 1,0 0,1 z M75,100 a20,20 0 1,0 0,1 z M125,100 a20,20 0 1,0 0,1 z M175,100 a20,20 0 1,0 0,1 z M25,140 a20,20 0 1,0 0,1 z M75,140 a20,20 0 1,0 0,1 z M125,140 a20,20 0 1,0 0,1 z M175,140 a20,20 0 1,0 0,1 z M50,80 a20,20 0 1,0 0,1 z M100,80 a20,20 0 1,0 0,1 z M150,80 a20,20 0 1,0 0,1 z M50,120 a20,20 0 1,0 0,1 z M100,120 a20,20 0 1,0 0,1 z M150,120 a20,20 0 1,0 0,1 z M50,160 a20,20 0 1,0 0,1 z M100,160 a20,20 0 1,0 0,1 z M150,160 a20,20 0 1,0 0,1 z" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#world-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl text-gray-700 hover:bg-white transition-all duration-300 group border border-white/50"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Countries
          </Link>
        </div>
        
        {/* Country Header */}
        <div className="mb-10 text-center">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-4 shadow-lg border border-white/50">
            <span className={`inline-block px-4 py-1.5 text-sm font-medium text-white rounded-full bg-gradient-to-r ${regionColors.gradient} shadow-lg`}>
              {country.region} {country.subregion ? `• ${country.subregion}` : ''}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 tracking-tight mb-2">
            {country.name.common}
          </h1>
          {country.name.nativeName && (
            <div className="text-xl text-gray-600 italic">
              {Object.values(country.name.nativeName)[0].common}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Flag Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/30 h-full">
              <div className="p-6">
                <div className="aspect-w-3 aspect-h-2 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={country.flags.svg || country.flags.png} 
                    alt={`Flag of ${country.name.common}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
                
                {isAuthenticated && (
                  <div className="mt-6">
                    <button
                      onClick={() => toggleFavorite(country.cca3)}
                      className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        isFavorite(country.cca3) 
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg hover:shadow-rose-500/30' 
                          : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                      }`}
                      disabled={!isAuthenticated}
                    >
                      <svg className="w-5 h-5 mr-2" fill={isFavorite(country.cca3) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      {isFavorite(country.cca3) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  </div>
                )}
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${regionColors.bg} flex items-center justify-center text-white mr-3`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capital</p>
                      <p className="font-medium text-gray-800">{country.capital ? country.capital.join(', ') : 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${regionColors.bg} flex items-center justify-center text-white mr-3`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Population</p>
                      <p className="font-medium text-gray-800">{formatNumber(country.population)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${regionColors.bg} flex items-center justify-center text-white mr-3`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium text-gray-800">{country.area ? `${formatNumber(country.area)} km²` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Country Details */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/30">
              <div className="p-6 lg:p-8">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl ${regionColors.bg} flex items-center justify-center text-white mr-4`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Country Insights</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem 
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>}
                    label="Top Level Domain" 
                    value={country.tld ? country.tld.join(', ') : 'N/A'} 
                  />
                  
                  <InfoItem 
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>}
                    label="Currencies" 
                    value={getCurrencies()} 
                  />
                  
                  <InfoItem 
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>}
                    label="Languages" 
                    value={getLanguages()} 
                  />
                  
                  {country.car && country.car.side && (
                    <InfoItem 
                      icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>}
                      label="Driving Side" 
                      value={country.car.side === 'right' ? 'Right' : 'Left'} 
                    />
                  )}
                  
                  {country.timezones && (
                    <InfoItem 
                      icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>}
                      label="Timezones" 
                      value={country.timezones.length > 3 
                        ? `${country.timezones.slice(0, 3).join(', ')} +${country.timezones.length - 3} more`
                        : country.timezones.join(', ')} 
                    />
                  )}
                  
                  {country.idd && country.idd.root && (
                    <InfoItem 
                      icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>}
                      label="Calling Code" 
                      value={country.idd.suffixes && country.idd.suffixes.length > 0
                        ? `${country.idd.root}${country.idd.suffixes[0]}`
                        : country.idd.root} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neighboring Countries */}
        {borderCountries.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/30 p-6 lg:p-8">
            <div className="flex items-center mb-8">
              <div className={`w-12 h-12 rounded-xl ${regionColors.bg} flex items-center justify-center text-white mr-4`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Neighboring Countries</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {borderCountries.map(border => (
                <Link 
                  key={border.cca3} 
                  to={`/country/${border.cca3}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl">
                    <div className="aspect-w-3 aspect-h-2 relative overflow-hidden">
                      <img 
                        src={border.flags.png} 
                        alt={`Flag of ${border.name.common}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-end">
                        <h3 className="text-white font-medium px-4 py-3">{border.name.common}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;