export type Lang = "en" | "bn";

const en = {
  nav: { home: "Home", shop: "Shop", club: "Club Jersey", national: "Country Jersey", retro: "Retro Jerseys", special: "Special Edition", custom: "Custom Order" },
  categories: { club: "Club Jersey", national: "Country Jersey", retro: "Retro Jerseys", special: "Special Edition" },
  common: {
    searchPlaceholder: "Search jerseys...", searchLabel: "Search jerseys", search: "Search", whatsapp: "WhatsApp", customOrder: "Custom Order",
    openMenu: "Open menu", closeMenu: "Close menu", viewAll: "View all items", chatWhatsapp: "Chat on WhatsApp",
    switchTo: "Switch to Bengali", toggleLabel: "বাং", player: "Player", fan: "Fan", photoSoon: "Photo coming soon",
  },
  footer: {
    tagline: "Premium football jerseys. Club, country, retro and custom kits.", shop: "Shop", company: "Company", contact: "Contact",
    contactUs: "Contact us", orderAsk: "Order and ask on WhatsApp", rights: "All rights reserved.",
  },
  card: { buyNow: "Buy Now", details: "Details", stockOut: "Stock Out", save: "SAVE {n}%", new: "NEW" },
  home: {
title: "Premium quality jerseys, delivered to you.",
    subtitle: "Club, country, retro and custom kits. Pick a jersey and order directly on WhatsApp.",
    browse: "Browse collection", customKit: "Order a custom kit",
    newArrivals: "New Arrivals", club: "Club Jerseys", country: "Country Jerseys", retroSpecial: "Retro and Special Editions",
    howTitle: "How to order",
    s1: "Pick your jersey", s1t: "Browse the collection and tap Buy Now on the one you want.",
    s2: "Download the photo", s2t: "Save the jersey photo from the order window.",
    s3: "Send it on WhatsApp", s3t: "Attach the photo and your size. We confirm price and delivery.",
    bannerTitle: "Custom kits for your local team", bannerText: "Send your team name, quantity and design. We handle the rest.", bannerCta: "Request a custom kit",
  },
  shop: {
    title: "Shop", filters: "Filters", sortBy: "Sort by:", sortDefault: "Default sorting", sortPriceAsc: "Price: low to high", sortPriceDesc: "Price: high to low", sortName: "Name",
    gCategory: "Category", gTeam: "Club / Country", gSeason: "Season", gSize: "Size", gPrice: "Price range", upTo: "Up to {price}", maxPrice: "Maximum price",
    clearAll: "Clear all filters", clear: "Clear filters", count: "{n} jerseys", resultsFor: "Results for \"{q}\": ",
    emptyTitle: "No jerseys found", emptyText: "Try removing a filter or searching for something else.",
    showing: "Showing {from} - {to} of {total} results", prev: "Previous page", next: "Next page", pagination: "Pagination", showN: "Show {n} jerseys", closeFilters: "Close filters", close: "Close",
  },
  product: {
    home: "Home", size: "Size", askWhatsapp: "Ask on WhatsApp", askBack: "Ask if it is coming back",
    type: "Type", team: "Club / Country", season: "Season", version: "Version", sizes: "Sizes available",
    about: "About this jersey", colorNote: "Photo colors may vary slightly depending on your screen.", related: "Related jerseys",
  },
  order: {
    title: "Order on WhatsApp", selectSize: "Select size", s1: "Download the jersey photo.", s2: "Open WhatsApp with your order message.", s3: "Attach the photo and send. We confirm the rest there.",
    download: "Download Photo", downloaded: "Photo downloaded", preparing: "Preparing...", cont: "Continue to WhatsApp",
    note: "We confirm price, delivery and payment on WhatsApp.",
    noPhoto: "This jersey has no photo yet. Continue to WhatsApp and we will send you one.",
  },
  custom: {
    title: "Custom kits for your team", subtitle: "Tell us about your team and what you need. We reply on WhatsApp with the design and price.",
    step1: "Send your team details", step2: "Approve the design", step3: "Receive your kit",
    team: "Team name", contact: "Contact person", phone: "Phone / WhatsApp", quantity: "Quantity", style: "Jersey style", selectStyle: "Select a style",
    half: "Half sleeve", full: "Full sleeve", polo: "Polo collar", deadline: "Deadline", sizes: "Sizes needed", sizesHint: "Example: 5 M, 5 L, 2 XL",
    notes: "Notes", notesHint: "Colors, names, numbers, sponsors. You can send design files on WhatsApp.", send: "Send request", sending: "Sending...",
    invalid: "Please fill in team name, contact person, phone and quantity.",
    busy: "We are getting a lot of messages right now. Please message us on WhatsApp instead.",
  },
  contactPage: {
    title: "Contact us", subtitle: "Questions about a jersey, size or delivery? Send us a message.", reach: "Reach us directly",
    name: "Name", phone: "Phone (optional)", message: "Message", send: "Send message", invalid: "Please add your name and a message.",
  },
  success: {
    received: "Request received", oneMore: "One more step",
    savedText: "Thank you. We will get back to you soon. For a faster reply, message us on WhatsApp.",
    unsavedText: "Send your message on WhatsApp so we can reply.", msgUs: "Message us on WhatsApp", cont: "Continue to WhatsApp",
  },
  notFound: { title: "Page not found", text: "The page you are looking for does not exist or was moved.", browse: "Browse jerseys" },
};

export type Dict = typeof en;

const bn: Dict = {
  nav: { home: "হোম", shop: "শপ", club: "ক্লাব জার্সি", national: "কান্ট্রি জার্সি", retro: "রেট্রো জার্সি", special: "স্পেশাল এডিশন", custom: "কাস্টম অর্ডার" },
  categories: { club: "ক্লাব জার্সি", national: "কান্ট্রি জার্সি", retro: "রেট্রো জার্সি", special: "স্পেশাল এডিশন" },
  common: {
    searchPlaceholder: "জার্সি খুঁজুন...", searchLabel: "জার্সি খুঁজুন", search: "খুঁজুন", whatsapp: "হোয়াটসঅ্যাপ", customOrder: "কাস্টম অর্ডার",
    openMenu: "মেনু খুলুন", closeMenu: "মেনু বন্ধ করুন", viewAll: "সব দেখুন", chatWhatsapp: "হোয়াটসঅ্যাপে চ্যাট করুন",
    switchTo: "Switch to English", toggleLabel: "EN", player: "প্লেয়ার", fan: "ফ্যান", photoSoon: "ছবি শিগগিরই আসছে",
  },
  footer: {
    tagline: "প্রিমিয়াম ফুটবল জার্সি। ক্লাব, দেশ, রেট্রো ও কাস্টম কিট।", shop: "শপ", company: "কোম্পানি", contact: "যোগাযোগ",
    contactUs: "যোগাযোগ করুন", orderAsk: "হোয়াটসঅ্যাপে অর্ডার ও প্রশ্ন করুন", rights: "সর্বস্বত্ব সংরক্ষিত।",
  },
  card: { buyNow: "কিনুন", details: "বিস্তারিত", stockOut: "স্টক শেষ", save: "{n}% ছাড়", new: "নতুন" },
  home: {
title: "প্রিমিয়াম কোয়ালিটির জার্সি, আপনার দরজায়।",
    subtitle: "ক্লাব, দেশ, রেট্রো ও কাস্টম কিট। জার্সি বেছে নিন আর সরাসরি হোয়াটসঅ্যাপে অর্ডার করুন।",
    browse: "কালেকশন দেখুন", customKit: "কাস্টম কিট অর্ডার করুন",
    newArrivals: "নতুন এসেছে", club: "ক্লাব জার্সি", country: "কান্ট্রি জার্সি", retroSpecial: "রেট্রো ও স্পেশাল এডিশন",
    howTitle: "কীভাবে অর্ডার করবেন",
    s1: "জার্সি বেছে নিন", s1t: "কালেকশন ঘুরে দেখুন আর পছন্দের জার্সিতে “কিনুন” চাপুন।",
    s2: "ছবি ডাউনলোড করুন", s2t: "অর্ডার উইন্ডো থেকে জার্সির ছবি সেভ করুন।",
    s3: "হোয়াটসঅ্যাপে পাঠান", s3t: "ছবি ও আপনার সাইজ পাঠান। দাম ও ডেলিভারি আমরা কনফার্ম করব।",
    bannerTitle: "আপনার লোকাল টিমের জন্য কাস্টম কিট", bannerText: "টিমের নাম, পরিমাণ ও ডিজাইন পাঠান। বাকিটা আমরা সামলে নেব।", bannerCta: "কাস্টম কিটের অনুরোধ করুন",
  },
  shop: {
    title: "শপ", filters: "ফিল্টার", sortBy: "সাজান:", sortDefault: "ডিফল্ট", sortPriceAsc: "দাম: কম থেকে বেশি", sortPriceDesc: "দাম: বেশি থেকে কম", sortName: "নাম",
    gCategory: "ক্যাটাগরি", gTeam: "ক্লাব / দেশ", gSeason: "সিজন", gSize: "সাইজ", gPrice: "দামের সীমা", upTo: "সর্বোচ্চ {price}", maxPrice: "সর্বোচ্চ দাম",
    clearAll: "সব ফিল্টার মুছুন", clear: "ফিল্টার মুছুন", count: "{n}টি জার্সি", resultsFor: "“{q}” এর ফলাফল: ",
    emptyTitle: "কোনো জার্সি পাওয়া যায়নি", emptyText: "একটি ফিল্টার সরিয়ে দেখুন বা অন্য কিছু খুঁজুন।",
    showing: "{total}টির মধ্যে {from} - {to} দেখানো হচ্ছে", prev: "আগের পৃষ্ঠা", next: "পরের পৃষ্ঠা", pagination: "পৃষ্ঠা", showN: "{n}টি জার্সি দেখুন", closeFilters: "ফিল্টার বন্ধ করুন", close: "বন্ধ করুন",
  },
  product: {
    home: "হোম", size: "সাইজ", askWhatsapp: "হোয়াটসঅ্যাপে জিজ্ঞাসা করুন", askBack: "আবার স্টকে আসবে কিনা জিজ্ঞাসা করুন",
    type: "ধরন", team: "ক্লাব / দেশ", season: "সিজন", version: "ভার্সন", sizes: "যে সাইজ আছে",
    about: "এই জার্সি সম্পর্কে", colorNote: "স্ক্রিনভেদে ছবির রঙে সামান্য পার্থক্য হতে পারে।", related: "সম্পর্কিত জার্সি",
  },
  order: {
    title: "হোয়াটসঅ্যাপে অর্ডার করুন", selectSize: "সাইজ বেছে নিন", s1: "জার্সির ছবি ডাউনলোড করুন।", s2: "অর্ডার মেসেজসহ হোয়াটসঅ্যাপ খুলুন।", s3: "ছবিটি অ্যাটাচ করে পাঠান। বাকিটা সেখানেই কনফার্ম করব।",
    download: "ছবি ডাউনলোড করুন", downloaded: "ছবি ডাউনলোড হয়েছে", preparing: "প্রস্তুত হচ্ছে...", cont: "হোয়াটসঅ্যাপে যান",
    note: "দাম, ডেলিভারি ও পেমেন্ট আমরা হোয়াটসঅ্যাপে কনফার্ম করি।",
    noPhoto: "এই জার্সির ছবি এখনো যোগ হয়নি। হোয়াটসঅ্যাপে যান, আমরা ছবি পাঠিয়ে দেব।",
  },
  custom: {
    title: "আপনার টিমের জন্য কাস্টম কিট", subtitle: "আপনার টিম ও প্রয়োজনের কথা জানান। আমরা হোয়াটসঅ্যাপে ডিজাইন ও দাম জানিয়ে দেব।",
    step1: "টিমের তথ্য পাঠান", step2: "ডিজাইন অনুমোদন করুন", step3: "কিট হাতে পান",
    team: "টিমের নাম", contact: "যোগাযোগকারীর নাম", phone: "ফোন / হোয়াটসঅ্যাপ", quantity: "পরিমাণ", style: "জার্সির স্টাইল", selectStyle: "স্টাইল বেছে নিন",
    half: "হাফ স্লিভ", full: "ফুল স্লিভ", polo: "পোলো কলার", deadline: "ডেডলাইন", sizes: "কোন সাইজ কতটি", sizesHint: "যেমন: ৫টি M, ৫টি L, ২টি XL",
    notes: "নোট", notesHint: "রঙ, নাম, নম্বর, স্পনসর। ডিজাইন ফাইল হোয়াটসঅ্যাপে পাঠাতে পারেন।", send: "অনুরোধ পাঠান", sending: "পাঠানো হচ্ছে...",
    invalid: "টিমের নাম, যোগাযোগকারীর নাম, ফোন ও পরিমাণ লিখুন।",
    busy: "এই মুহূর্তে অনেক মেসেজ আসছে। অনুগ্রহ করে হোয়াটসঅ্যাপে মেসেজ করুন।",
  },
  contactPage: {
    title: "যোগাযোগ করুন", subtitle: "জার্সি, সাইজ বা ডেলিভারি নিয়ে প্রশ্ন আছে? আমাদের মেসেজ করুন।", reach: "সরাসরি যোগাযোগ",
    name: "নাম", phone: "ফোন (ঐচ্ছিক)", message: "মেসেজ", send: "মেসেজ পাঠান", invalid: "আপনার নাম ও মেসেজ লিখুন।",
  },
  success: {
    received: "অনুরোধ পাওয়া গেছে", oneMore: "আর একটি ধাপ",
    savedText: "ধন্যবাদ। আমরা শিগগিরই যোগাযোগ করব। দ্রুত উত্তরের জন্য হোয়াটসঅ্যাপে মেসেজ করুন।",
    unsavedText: "আমরা যেন উত্তর দিতে পারি, তাই হোয়াটসঅ্যাপে আপনার মেসেজ পাঠান।", msgUs: "হোয়াটসঅ্যাপে মেসেজ করুন", cont: "হোয়াটসঅ্যাপে যান",
  },
  notFound: { title: "পেজ পাওয়া যায়নি", text: "আপনি যে পেজটি খুঁজছেন তা নেই বা সরিয়ে নেওয়া হয়েছে।", browse: "জার্সি দেখুন" },
};

export const dictionaries: Record<Lang, Dict> = { en, bn };

export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
