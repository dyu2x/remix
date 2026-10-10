import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageOption } from '../types';

export const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global / PH' },
  { code: 'fil', name: 'Filipino', nativeName: 'Tagalog / Filipino', region: 'Pambansa / Luzon' },
  { code: 'ceb', name: 'Bisaya / Cebuano', nativeName: 'Sinugboanong Binisaya', region: 'Cebu / Mindanao / Bohol' },
  { code: 'hil', name: 'Hiligaynon', nativeName: 'Ilonggo / Hiligaynon', region: 'Capiz / Iloilo / Panay' },
  { code: 'krj', name: 'Kinaray-a', nativeName: 'Kinaray-a', region: 'Antique / Panay Inland' },
  { code: 'pam', name: 'Kapampangan', nativeName: 'Amanung Sisuan', region: 'Pampanga / Central Luzon' },
  { code: 'ilo', name: 'Ilokano', nativeName: 'Ti Pagsasao nga Ilokano', region: 'Ilocos / Northern Luzon' },
  { code: 'bik', name: 'Bikol', nativeName: 'Bikolano', region: 'Bicol Region' },
  { code: 'war', name: 'Waray', nativeName: 'Waray-Waray', region: 'Samar / Leyte' }
];

interface Translations {
  navHome: string;
  navCatalog: string;
  navFishCare: string;
  navLocation: string;
  navOrderInquiry: string;
  navAdmin: string;
  heroBadge: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
  statsStages: string;
  statsWater: string;
  statsSurvival: string;
  statsOutput: string;
  whyChooseUsTitle: string;
  whyChooseUsSubtitle: string;
  aboutTitle: string;
  aboutKicker: string;
  calcKicker: string;
  calcTitle: string;
  calcSubtitle: string;
  calcSelectFish: string;
  calcEnterQty: string;
  calcEstimatedCost: string;
  calcTierRates: string;
  calcProceedBtn: string;
  locationTitle: string;
  locationSubtitle: string;
  locationAddress: string;
  locationHours: string;
  locationPhone: string;
  locationEmail: string;
  locationGoogleMaps: string;
  locationAppleMaps: string;
  locationCurrentLocation: string;
  locationCoordinates: string;
  inquiryTitle: string;
  inquirySubtitle: string;
  inquiryFullName: string;
  inquiryEmail: string;
  inquiryPhone: string;
  inquiryFishStage: string;
  inquiryQuantity: string;
  inquiryNotes: string;
  inquirySubmitBtn: string;
  footerBio: string;
  footerRights: string;
  languageSelect: string;
}

const translations: Record<LanguageCode, Translations> = {
  en: {
    navHome: 'Home',
    navCatalog: 'Fingerling Catalog',
    navFishCare: 'Fish Care & Guides',
    navLocation: 'Farm Location',
    navOrderInquiry: 'Order Inquiry',
    navAdmin: 'Admin Portal',
    heroBadge: 'Clarias batrachus Hatchery & Grower',
    heroPrimaryBtn: 'View Catalog',
    heroSecondaryBtn: 'Place Order Inquiry',
    statsStages: 'Fingerling Stages',
    statsWater: 'Water Quality',
    statsSurvival: 'Survival Rate',
    statsOutput: 'Annual Output',
    whyChooseUsTitle: 'Why Choose Mesina Farms',
    whyChooseUsSubtitle: 'Pioneering scientific fish breeding with verified survival rates, certified bio-security, and direct farmer support.',
    aboutTitle: 'The Science of Living Inventory',
    aboutKicker: 'About Mesina Farms',
    calcKicker: 'Instant Quote',
    calcTitle: 'Calculate Your Order',
    calcSubtitle: 'Select a fingerling stage and quantity to instantly see volume-based tier pricing and your total cost.',
    calcSelectFish: 'Select Growth Stage',
    calcEnterQty: 'Target Quantity (Pcs)',
    calcEstimatedCost: 'Estimated Order Total',
    calcTierRates: 'Volume Pricing Tiers',
    calcProceedBtn: 'Proceed with this Inquiry',
    locationTitle: 'Hatchery Location',
    locationSubtitle: 'Visit Mesina Farms in Ivisan, Capiz for fingerling inspections, logistics pickup, and technical consultations.',
    locationAddress: 'Farm Address',
    locationHours: 'Visiting & Pickup Hours',
    locationPhone: 'Contact Hotline',
    locationEmail: 'Support Email',
    locationGoogleMaps: 'Open in Google Maps',
    locationAppleMaps: 'Open in Apple Maps',
    locationCurrentLocation: 'Use My Current Location',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Fingerling Order Inquiry',
    inquirySubtitle: 'Connect directly with our hatchery team for availability, transport scheduling, and volume orders.',
    inquiryFullName: 'Full Name',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Phone Number',
    inquiryFishStage: 'Fingerling Stage / Variety',
    inquiryQuantity: 'Estimated Quantity (pcs)',
    inquiryNotes: 'Delivery Details & Notes',
    inquirySubmitBtn: 'Submit Order Inquiry',
    footerBio: 'Premium Clarias batrachus catfish hatchery and grower. Scientifically bred, sustainably raised fingerlings for aquaculture excellence.',
    footerRights: 'All rights reserved.',
    languageSelect: 'Select Language'
  },
  fil: {
    navHome: 'Tahanan',
    navCatalog: 'Katalogo ng Fingerlings',
    navFishCare: 'Pag-aalaga at Gabay',
    navLocation: 'Lokasyon ng Sakahan',
    navOrderInquiry: 'Magtanong ng Order',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad sa Pagpaparami ng Hito (Clarias batrachus)',
    heroPrimaryBtn: 'Tingnan ang Katalogo',
    heroSecondaryBtn: 'Magpadala ng Order Inquiry',
    statsStages: 'Yugto ng Semilya',
    statsWater: 'Kalidad ng Tubig',
    statsSurvival: 'Bilis ng Kaligtasan',
    statsOutput: 'Taunang Ani',
    whyChooseUsTitle: 'Bakit Piliin ang Mesina Farms',
    whyChooseUsSubtitle: 'Makabagong siyentipikong pagpaparami ng semilya na may garantisadong kalusugan at buong suporta sa mga magsasaka.',
    aboutTitle: 'Ang Agham ng Buhay na Semilya',
    aboutKicker: 'Tungkol sa Mesina Farms',
    calcKicker: 'Tantiya ng Presyo',
    calcTitle: 'Kalkulahin ang Iyong Order',
    calcSubtitle: 'Pumili ng laki ng semilya at dami upang agad makita ang diskwento sa bulto at kabuuang halaga.',
    calcSelectFish: 'Pumili ng Laki ng Semilya',
    calcEnterQty: 'Dami ng Piraso',
    calcEstimatedCost: 'Tantiyang Kabuuang Halaga',
    calcTierRates: 'Talaan ng Presyo ayon sa Dami',
    calcProceedBtn: 'Ipatuloy ang Inquiry',
    locationTitle: 'Lokasyon ng Hatchery',
    locationSubtitle: 'Bisitahin ang Mesina Farms sa Ivisan, Capiz para sa inspeksyon ng semilya, pickup, at konsultasyon.',
    locationAddress: 'Eksaktong Tirahan ng Farm',
    locationHours: 'Oras ng Pagbisita at Pickup',
    locationPhone: 'Telepono / Hotline',
    locationEmail: 'Email ng Suporta',
    locationGoogleMaps: 'Buksan sa Google Maps',
    locationAppleMaps: 'Buksan sa Apple Maps',
    locationCurrentLocation: 'Gamitin ang Aking Kasalukuyang Lokasyon',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Inquiry sa Pag-order ng Semilya',
    inquirySubtitle: 'Makipag-ugnayan agad sa aming koponan para sa iskedyul ng delivery at bultuhang order.',
    inquiryFullName: 'Buong Pangalan',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numero ng Telepono',
    inquiryFishStage: 'Yugto / Uri ng Semilya',
    inquiryQuantity: 'Tantiyang Dami (piraso)',
    inquiryNotes: 'Mga Detalye sa Delivery at Mensahe',
    inquirySubmitBtn: 'Isumite ang Order Inquiry',
    footerBio: 'Mataas na uri ng semilya ng hito (Clarias batrachus) na pinalaki sa makabagong siyensya para sa maunlad na palaisdaan.',
    footerRights: 'Lahat ng karapatan ay nakalaan.',
    languageSelect: 'Pumili ng Wika'
  },
  ceb: {
    navHome: 'Panimalay',
    navCatalog: 'Katalogo sa Similya',
    navFishCare: 'Pag-atiman ug Giya',
    navLocation: 'Lokasyon sa Umahan',
    navOrderInquiry: 'Pangutana sa Order',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad sa Pasanay og Hito (Clarias batrachus)',
    heroPrimaryBtn: 'Tan-awa ang Katalogo',
    heroSecondaryBtn: 'Pangutana Mahitungod sa Order',
    statsStages: 'Yugto sa Similya',
    statsWater: 'Kalidad sa Tubig',
    statsSurvival: 'Kaluwasan sa Isda',
    statsOutput: 'Tinuig nga Ani',
    whyChooseUsTitle: 'Nganong Pilion ang Mesina Farms',
    whyChooseUsSubtitle: 'Siyentipikong pamaagi sa pagpasanay og similya sa hito nga himsog, paspas motubo, ug adunay matinud-anong serbisyo.',
    aboutTitle: 'Ang Siyensya sa Buhi nga Similya',
    aboutKicker: 'Mahitungod sa Mesina Farms',
    calcKicker: 'Paspas nga Presyo',
    calcTitle: 'Kalkulaha ang Imong Order',
    calcSubtitle: 'Pilia ang gidak-on sa similya ug gidaghanon aron dali makita ang diskwento sa dinaghan ug kinatibuk-ang bayronon.',
    calcSelectFish: 'Pilia ang Gidak-on sa Similya',
    calcEnterQty: 'Gidaghanon sa Piraso',
    calcEstimatedCost: 'Gibanabana nga Total',
    calcTierRates: 'Presyo Sumala sa Kadaghanon',
    calcProceedBtn: 'Ipadayon Kini nga Order',
    locationTitle: 'Lokasyon sa Hatchery',
    locationSubtitle: 'Bisitaha ang Mesina Farms sa Ivisan, Capiz alang sa pagsusi sa similya, pickup, ug tambag sa pag-atiman.',
    locationAddress: 'Eksaktong Adres sa Umahan',
    locationHours: 'Oras sa Pagbisita ug Pagkuha',
    locationPhone: 'Numero sa Telepono',
    locationEmail: 'Email sa Suporta',
    locationGoogleMaps: 'Ablihi sa Google Maps',
    locationAppleMaps: 'Ablihi sa Apple Maps',
    locationCurrentLocation: 'Gamita Akong Kasamtangang Lokasyon',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Pangutana sa Pag-order og Similya',
    inquirySubtitle: 'Pakig-istorya sa among hatchery team alang sa reserbasyon ug transportasyon.',
    inquiryFullName: 'Tibuok Ngalan',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numero sa Selpon',
    inquiryFishStage: 'Klase / Gidak-on sa Similya',
    inquiryQuantity: 'Gibanabanang Gidaghanon (pcs)',
    inquiryNotes: 'Mensahe ug Detalye sa Paghatod',
    inquirySubmitBtn: 'Isumiter ang Inquiry',
    footerBio: 'Taas nga kalidad nga similya sa pantat/hito (Clarias batrachus) gipadako sa limpiyo ug siyentipikong pamaagi.',
    footerRights: 'Tanan nga katungod gigunitan.',
    languageSelect: 'Pili og Pinulongan'
  },
  hil: {
    navHome: 'Balay',
    navCatalog: 'Katalogo sang Pantat',
    navFishCare: 'Pang-atipan kag Giya',
    navLocation: 'Lokasyon sang Umahan',
    navOrderInquiry: 'Pamangkot sa Order',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad sang Pagpasanay sang Pantat (Ivisan, Capiz)',
    heroPrimaryBtn: 'Lantawa ang Katalogo',
    heroSecondaryBtn: 'Magpadala sang Pamangkot',
    statsStages: 'Yugto sang Similya',
    statsWater: 'Kalidad sang Tubig',
    statsSurvival: 'Kabuhi sang Isda',
    statsOutput: 'Tinuig nga Paggwa',
    whyChooseUsTitle: 'Ngaa Mesina Farms ang Pilion Mo',
    whyChooseUsSubtitle: 'Panguna nga pasilidad sa Capiz para sa puro nga pantat (Clarias batrachus) nga mabaskog, masinulub-on sa balatian kag madasig magdaku.',
    aboutTitle: 'Ang Siyensya sang Buhi nga Similya',
    aboutKicker: 'Nahanungod sa Mesina Farms',
    calcKicker: 'Presyo Dayon',
    calcTitle: 'Kalkulaha ang Imo Order',
    calcSubtitle: 'Pilia ang kadakuon sang similya kag kadamuon agud makita gilayon ang diskwento kag kabilugan nga balayran.',
    calcSelectFish: 'Pilia ang Kadakuon sang Pantat',
    calcEnterQty: 'Kadamuon sang Bilog',
    calcEstimatedCost: 'Ginatantiya nga Kabilugan',
    calcTierRates: 'Talaan sang Presyo kada Bulto',
    calcProceedBtn: 'Ipadayon ang Inquiry',
    locationTitle: 'Lokasyon sang Amon Hatchery',
    locationSubtitle: 'Hapit sa Brgy. Cabugao, Ivisan, Capiz para sa personal nga paglantaw, pickup, kag panugyan sa pagpatubo.',
    locationAddress: 'Eksakto nga Direksyon sa Ivisan, Capiz',
    locationHours: 'Oras sang Pagbisita kag Pickup',
    locationPhone: 'Hotline sa Pagtawag',
    locationEmail: 'Email sang Suporta',
    locationGoogleMaps: 'Buksi sa Google Maps',
    locationAppleMaps: 'Buksi sa Apple Maps',
    locationCurrentLocation: 'Gamita ang Akon Lokasyon Subong',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Pamangkot sa Pagbakal sang Similya',
    inquirySubtitle: 'Makitransaksyon direkta sa tag-iya kag mga eksperto sa Mesina Farms.',
    inquiryFullName: 'Bug-os nga Pangalan',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numero sa Telepono',
    inquiryFishStage: 'Yugto sang Similya nga Luyag',
    inquiryQuantity: 'Kadamuon nga Ginakinahanglan (pcs)',
    inquiryNotes: 'Detalye sa Pagdul-ong ukon Pag-pickup',
    inquirySubmitBtn: 'Isumite ang Pamangkot',
    footerBio: 'Panguna nga hatchery sang pantat sa Capiz kag bilog nga Panay. Siyentipiko nga pagpadaku para sa imo kadalag-an.',
    footerRights: 'Tanan nga kinamatarong ginatigana.',
    languageSelect: 'Pilia ang Hambal'
  },
  krj: {
    navHome: 'Balay',
    navCatalog: 'Katalogo kang Similya',
    navFishCare: 'Pag-atipan kag Giya',
    navLocation: 'Lugar kang Umahan',
    navOrderInquiry: 'Pamangkot sa Pagbakal',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad kang Pagpasanay kang Pantat sa Panay',
    heroPrimaryBtn: 'Turuka ang Katalogo',
    heroSecondaryBtn: 'Magpadara kang Pamangkot',
    statsStages: 'Yugto kang Similya',
    statsWater: 'Kalidad kang Tubi',
    statsSurvival: 'Kabuhi kang Isda',
    statsOutput: 'Tinuig nga Paggwa',
    whyChooseUsTitle: 'Andut Mesina Farms ang Piliun Mo',
    whyChooseUsSubtitle: 'Ginasiguro namun ang mabaskug nga pantat halin sa matin-aw nga tubi kag siyentipiko nga pagpasanay.',
    aboutTitle: 'Ang Siyensya kang Buhi nga Similya',
    aboutKicker: 'Tungod sa Mesina Farms',
    calcKicker: 'Tantiya kang Presyo',
    calcTitle: 'Kalkulaha ang Imo Baklun',
    calcSubtitle: 'Pilia ang bahul kang similya kag kadoro para makita gilayon ang diskwento kag bilog nga bayranan.',
    calcSelectFish: 'Pilia ang Bahul kang Similya',
    calcEnterQty: 'Kadoro kang Bilog',
    calcEstimatedCost: 'Tantiya nga Kabilugan',
    calcTierRates: 'Presyo kada Bulto',
    calcProceedBtn: 'Ipadayon ang Pamangkot',
    locationTitle: 'Lugar kang Hatchery',
    locationSubtitle: 'Bisitaha ang Mesina Farms sa Ivisan, Capiz para sa personal nga pag-usisa kag pickup.',
    locationAddress: 'Adres kang Farm',
    locationHours: 'Oras kang Pagbisita kag Pagkuha',
    locationPhone: 'Numero sa Selpon',
    locationEmail: 'Email kang Suporta',
    locationGoogleMaps: 'Buksi sa Google Maps',
    locationAppleMaps: 'Buksi sa Apple Maps',
    locationCurrentLocation: 'Gamita Akon Lokasyon Kadya',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Pamangkot sa Pag-order kang Similya',
    inquirySubtitle: 'Makig-angot direkta sa amun team para sa reserbasyon kag schedule.',
    inquiryFullName: 'Bilog nga Pangaran',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numero kang Selpon',
    inquiryFishStage: 'Bahul kang Similya',
    inquiryQuantity: 'Kadoro nga Ginakinahanglan (pcs)',
    inquiryNotes: 'Mensahe kag Detalye kang Pagdeliber',
    inquirySubmitBtn: 'Ipadara ang Pamangkot',
    footerBio: 'Mataas nga kalidad kang similya kang pantat sa Panay. Siyentipiko nga pagpadaku para sa manami nga ani.',
    footerRights: 'Tanan nga kinamatarung ginatipigan.',
    languageSelect: 'Pili kang Hambal'
  },
  pam: {
    navHome: 'Bale',
    navCatalog: 'Katalogo da reng Semilya',
    navFishCare: 'Pamaniingat at Giya',
    navLocation: 'Karinan ning Polder / Farm',
    navOrderInquiry: 'Kutang king Pamaniorder',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad king Pamagparami king Asan a Itu (Clarias batrachus)',
    heroPrimaryBtn: 'Lawen ing Katalogo',
    heroSecondaryBtn: 'Magparla kang Kutang king Order',
    statsStages: 'Yugto da reng Semilya',
    statsWater: 'Kasantingan ning Danum',
    statsSurvival: 'Porsyentu ning Meiligtas',
    statsOutput: 'Pabanwang Pupul',
    whyChooseUsTitle: 'Bakit Mesina Farms ing Piliinan Yu',
    whyChooseUsSubtitle: 'Siyentipikung pamagparami karing semilyang itu a masalese, masanting kaisipan at mabilis dagul.',
    aboutTitle: 'Ing Siyensya ning Mabie Semilya',
    aboutKicker: 'Tungkul king Mesina Farms',
    calcKicker: 'Tantiya ning Alaga',
    calcTitle: 'Kalkulan ing Kekang Order',
    calcSubtitle: 'Mamili kang dagul ning semilya at karakal ban agad mong akit ing diskwento king dakal at pangkabilugang alaga.',
    calcSelectFish: 'Mamili kang Dagul ning Semilya',
    calcEnterQty: 'Karakal da reng Pirasu',
    calcEstimatedCost: 'Tantiyang Pangkabilugang Alaga',
    calcTierRates: 'Alaga Agpang king Karakal',
    calcProceedBtn: 'Ituluy ing Kutang',
    locationTitle: 'Karinan ning Hatchery',
    locationSubtitle: 'Bisitan me ing Mesina Farms king Ivisan, Capiz para king personal a pamanyuri, pickup, at pamanyaliksik.',
    locationAddress: 'Tirahan ning Farm',
    locationHours: 'Oras ning Pamamasyal at Pickup',
    locationPhone: 'Hotline king Teleponu',
    locationEmail: 'Email ning Saup',
    locationGoogleMaps: 'Ibuklat king Google Maps',
    locationAppleMaps: 'Ibuklat king Apple Maps',
    locationCurrentLocation: 'Gamitan ing Kasalukuyan kung Lokasyon',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Kutang king Pamaniorder Semilya',
    inquirySubtitle: 'Makipag-ugnayan karing kekaming eksperto para karing maragul a order at transportasyon.',
    inquiryFullName: 'Kumpletung Lagyu',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numeru king Teleponu',
    inquiryFishStage: 'Yugto / Dagul ning Semilya',
    inquiryQuantity: 'Tantiyang Karakal (pirasu)',
    inquiryNotes: 'Detaye king Pamandulung at Mensahi',
    inquirySubmitBtn: 'Iparla ing Order Inquiry',
    footerBio: 'Pang-primang kaledad a semilya ning itu a mibait king siyentipikung paralan para karing maragul a palaisdaan.',
    footerRights: 'Makatala ngan deng karapatan.',
    languageSelect: 'Mamiling Salita'
  },
  ilo: {
    navHome: 'Balay',
    navCatalog: 'Katologo dagiti Similya',
    navFishCare: 'Panangtaripato ken Giya',
    navLocation: 'Pagsaadan ti Talon',
    navOrderInquiry: 'Saludsod ti Panag-order',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad ti Panagpaadu ti Paltat (Clarias batrachus)',
    heroPrimaryBtn: 'Kitaen ti Katologo',
    heroSecondaryBtn: 'Ipatulod ti Saludsod',
    statsStages: 'Tukad ti Similya',
    statsWater: 'Kalidad ti Danum',
    statsSurvival: 'Bael nga Agbiag',
    statsOutput: 'Tinawen a Maipataud',
    whyChooseUsTitle: 'Apay a Mesina Farms ti Pilienyo',
    whyChooseUsSubtitle: 'Sientipiko a panagpaadu ti similya ti paltat a nasalun-at, napartak a dumakkel, ken addaan natibker a resistensya.',
    aboutTitle: 'Ti Siensia ti Sibibiag a Similya',
    aboutKicker: 'Maipanggep iti Mesina Farms',
    calcKicker: 'Pattapatta ti Presyo',
    calcTitle: 'Karkularen ti Order Mo',
    calcSubtitle: 'Piliem ti kadakkel ti similya ken kaadu tapno dagus a makitam ti diskuento iti adu ken pakabuklan a bayadan.',
    calcSelectFish: 'Piliem ti Kadakkel ti Similya',
    calcEnterQty: 'Kaadu ti Piraso',
    calcEstimatedCost: 'Pattapatta a Pakabuklan',
    calcTierRates: 'Presyo Segun iti Kaadu',
    calcProceedBtn: 'Itultuloy daytoy a Saludsod',
    locationTitle: 'Pagsaadan ti Hatchery',
    locationSubtitle: 'Sarungkaran ti Mesina Farms idiay Ivisan, Capiz para iti panangsukimat, panagala, ken panagkonsulta.',
    locationAddress: 'Eksakto a Pagnaedan ti Farm',
    locationHours: 'Oras ti Panagbisita ken Panag-pickup',
    locationPhone: 'Telepono / Hotline',
    locationEmail: 'Email ti Tulong',
    locationGoogleMaps: 'Lukatan iti Google Maps',
    locationAppleMaps: 'Lukatan iti Apple Maps',
    locationCurrentLocation: 'Usaren ti Agdama a Lokasionko',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Saludsod ti Panaggatang ti Similya',
    inquirySubtitle: 'Makiuman a direkta iti grupo ti hatchery para iti reserbasion ken panangibiahe.',
    inquiryFullName: 'Nagan Mo',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numero ti Telepono',
    inquiryFishStage: 'Kadakkel / Klase ti Similya',
    inquiryQuantity: 'Pattapatta a Kaadu (piraso)',
    inquiryNotes: 'Detaye ti Panangidanon ken Mensahe',
    inquirySubmitBtn: 'Ipatulod ti Saludsod',
    footerBio: 'Nangato a kalidad a similya ti paltat a naipasngay ken napadakkel iti sientipiko a wagas para iti panagtalon iti danum.',
    footerRights: 'Amin a kalintegan ket naituding.',
    languageSelect: 'Piliem ti Pagsasao'
  },
  bik: {
    navHome: 'Harong',
    navCatalog: 'Katalogo nin Semilya',
    navFishCare: 'Pag-ataman asin Giya',
    navLocation: 'Lugar kan Oma',
    navOrderInquiry: 'Hapot sa Pag-order',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad sa Pagpapadakol nin Hito (Clarias batrachus)',
    heroPrimaryBtn: 'Hilingon an Katalogo',
    heroSecondaryBtn: 'Magpadara nin Hapot',
    statsStages: 'Yugto nin Semilya',
    statsWater: 'Kalidad nin Tubig',
    statsSurvival: 'Buhay na Porsyento',
    statsOutput: 'Tinuig na Pagguno',
    whyChooseUsTitle: 'Tano ta Mesina Farms an Pilion Mo',
    whyChooseUsSubtitle: 'Siyentipikong pagpapadakol nin semilya nin hito na marigon an hawak, marikas magdakula asin may giya sa mga paraoma.',
    aboutTitle: 'An Siyensya kan Buhay na Semilya',
    aboutKicker: 'Manungod sa Mesina Farms',
    calcKicker: 'Tantiya kan Presyo',
    calcTitle: 'Kalkulahon an Saindong Order',
    calcSubtitle: 'Pilion an sukol kan semilya asin kadakol tanganing maheling tulos an bawas sa presyo asin bilog na babayadan.',
    calcSelectFish: 'Pilion an Sukol kan Semilya',
    calcEnterQty: 'Kadakol nin Pidaso',
    calcEstimatedCost: 'Tantiyadong Gabos na Bayadan',
    calcTierRates: 'Presyo Uyon sa Kadakol',
    calcProceedBtn: 'Ipadagos an Inquiry',
    locationTitle: 'Lugar kan Hatchery',
    locationSubtitle: 'Bisitahon an Mesina Farms sa Ivisan, Capiz para sa personal na pag-inspeksyon, pickup, asin konsultasyon.',
    locationAddress: 'Eksaktong Adres kan Farm',
    locationHours: 'Oras nin Pagbisita asin Pagkua',
    locationPhone: 'Hotline sa Pag-apod',
    locationEmail: 'Email nin Tabang',
    locationGoogleMaps: 'Bukasan sa Google Maps',
    locationAppleMaps: 'Bukasan sa Apple Maps',
    locationCurrentLocation: 'Gamiton an Sakuyang Lokasyon Ngunyan',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Hapot sa Pagbakal nin Semilya',
    inquirySubtitle: 'Makipag-olay nin direkta sa samong grupo para sa reserbasyon asin iskedyul.',
    inquiryFullName: 'Bilog na Pangaran',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numero sa Telepono',
    inquiryFishStage: 'Sukol / Klase nin Semilya',
    inquiryQuantity: 'Tantiyang Kadakol (pidaso)',
    inquiryNotes: 'Mga Detalye sa Paghatod asin Mensahe',
    inquirySubmitBtn: 'Isumite an Order Inquiry',
    footerBio: 'Dekalidad na semilya nin hito na pinapadakula sa siyentipikong paagi para sa marhay na ani sa saindong mga pasakay.',
    footerRights: 'Gabos na katanosan nakatagama.',
    languageSelect: 'Pilion an Tataramon'
  },
  war: {
    navHome: 'Balay',
    navCatalog: 'Katalogo hit Similya',
    navFishCare: 'Pag-ataman ngan Giya',
    navLocation: 'Lugar hit Umahan',
    navOrderInquiry: 'Pakiana ha Order',
    navAdmin: 'Admin Portal',
    heroBadge: 'Pasilidad hit Pagpadamo hit Hito (Clarias batrachus)',
    heroPrimaryBtn: 'Kitaa an Katalogo',
    heroSecondaryBtn: 'Pakiana parte hit Order',
    statsStages: 'Yugto hit Similya',
    statsWater: 'Kalidad hit Tubig',
    statsSurvival: 'Kaluwasan hit Isda',
    statsOutput: 'Tuigan nga Ani',
    whyChooseUsTitle: 'Kay Ano nga Mesina Farms an Pilion Mo',
    whyChooseUsSubtitle: 'Siyentipiko nga pagpadamo hit similya nga hito nga makusog an resistensya, madasig tumubo ngan waray sakit.',
    aboutTitle: 'An Siyensya hit Buhi nga Similya',
    aboutKicker: 'Bahin ha Mesina Farms',
    calcKicker: 'Tantya hit Presyo',
    calcTitle: 'Kalkulaha an Imo Order',
    calcSubtitle: 'Pilia an kadako hit similya ngan kadamo basi makit-an dayon an diskwento ngan kabug-usan nga bayad.',
    calcSelectFish: 'Pilia an Kadako hit Similya',
    calcEnterQty: 'Kadamo hit Pidaso',
    calcEstimatedCost: 'Tantya nga Total',
    calcTierRates: 'Presyo Sumala ha Kadamo',
    calcProceedBtn: 'Ipadayon Ini nga Pakiana',
    locationTitle: 'Lugar hit Hatchery',
    locationSubtitle: 'Bisitaha an Mesina Farms ha Ivisan, Capiz para hit pagsusi hit similya, pickup, ngan konsulta.',
    locationAddress: 'Eksakto nga Adres hit Farm',
    locationHours: 'Oras hit Pagbisita ngan Pagkuha',
    locationPhone: 'Numero hit Telepono',
    locationEmail: 'Email hit Bulig',
    locationGoogleMaps: 'Abriri ha Google Maps',
    locationAppleMaps: 'Abriri ha Apple Maps',
    locationCurrentLocation: 'Gamita an Akon Lokasyon Yana',
    locationCoordinates: 'GPS Coordinates',
    inquiryTitle: 'Pakiana ha Pagpalit hin Similya',
    inquirySubtitle: 'Pakig-istorya dayon ha amon hatchery team para ha reserbasyon ngan delivery.',
    inquiryFullName: 'Bug-os nga Ngaran',
    inquiryEmail: 'Email Address',
    inquiryPhone: 'Numero hit Telepono',
    inquiryFishStage: 'Kadako hit Similya',
    inquiryQuantity: 'Tantya nga Kadamo (pcs)',
    inquiryNotes: 'Detalye hit Paghatod ngan Mensahe',
    inquirySubmitBtn: 'Isumite an Pakiana',
    footerBio: 'Mataas nga kalidad nga similya hin hito nga ginpadako ha siyentipiko nga pamaagi para hit kaupayan hit imo palaisdaan.',
    footerRights: 'Ngatanan nga katungod gintitipigan.',
    languageSelect: 'Pili hin Yinaknan'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('mesina_language') as LanguageCode;
    if (saved && translations[saved]) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('mesina_language', lang);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: languageOptions }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
