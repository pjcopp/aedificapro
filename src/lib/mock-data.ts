export type Property = {
  id: string
  name: string
  address: string
  city: string
  zipCode: string
  type: "apartment" | "house" | "studio" | "commercial"
  image: string
  bedrooms: number
  bathrooms: number
  sqm: number
  baseRent: number
  commonCosts: number
  monthlyRent: number
  status: "occupied" | "available" | "maintenance" | "new"
  tenant: Tenant | null
  totalRevenue: number
  imageGradient: string
  lat: number
  lng: number
  leaseStart: string | null
  leaseEnd: string | null
  ownerId: string
  utilities: Utility[]
  buildingYear: number
  renovatedYear: number | null
  epcScore: string
  floor: number | null
  hasParking: boolean
  hasGarage: boolean
  hasElevator: boolean
  familyMembers: number | null
  petsAllowed: boolean
  petsPresent: string | null
  smokingAllowed: boolean
}

export type Tenant = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  photoUrl: string
  moveInDate: string
  propertyId: string
}

export type Ticket = {
  id: string
  propertyId: string
  tenantId: string
  tenantName: string
  title: string
  description: string
  category: "plumbing" | "electrical" | "hvac" | "structural" | "appliance" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: string
  updatedAt: string
  assignedTo: string | null
}

export type Message = {
  id: string
  propertyId: string
  sender: string
  senderRole: "owner" | "tenant" | "worker"
  content: string
  timestamp: string
  read: boolean
}

export type Worker = {
  id: string
  name: string
  specialty: "electrician" | "plumber" | "hvac" | "general" | "painter" | "locksmith" | "glazier" | "drain_cleaner"
  region: string
  phone: string
  email: string
  available: boolean
  rating: number
  photoUrl: string
}

export type Invoice = {
  id: string
  propertyId: string
  tenantId: string | null
  month: string
  direction: "uitgaand" | "inkomend"
  description: string
  rent: number
  commonCosts: number
  propertyTax: number
  insuranceCosts: number
  maintenance: number
  total: number
  vatRate: number
  vatAmount: number
  status: "paid" | "pending" | "overdue" | "draft"
  dueDate: string
  supplierName: string | null
}

export type Utility = {
  name: string
  monthlyCost: number
}

export type Intervention = {
  id: string
  propertyId: string
  ticketId: string | null
  title: string
  description: string
  scheduledDate: string
  workerId: string
  workerName: string
  status: "offerte_aangevraagd" | "offerte_ontvangen" | "goedkeuring_nodig" | "goedgekeurd" | "ingepland" | "in_uitvoering" | "uitgevoerd" | "bevestigd" | "gefactureerd"
  cost: number
  quotedCost: number | null
  approvedBy: string | null
  tenantConfirmed: boolean
  contractorConfirmed: boolean
}

export type TeamMember = {
  id: string
  name: string
  role: "admin" | "manager" | "agent"
  email: string
  phone: string
  avatar: string
  photoUrl: string
  properties: number
}

export type EmailMessage = {
  id: string
  from: string
  to: string
  subject: string
  body: string
  timestamp: string
  read: boolean
  propertyId?: string
}

export type AsBuiltDocument = {
  id: string
  propertyId: string
  name: string
  type: "datasheet" | "image" | "blueprint" | "manual" | "certificate" | "report" | "photo" | "pdf" | "word" | "excel" | "video" | "zip"
  folder: string
  uploadedAt: string
  size: string
  category: string
}

export type Owner = {
  id: string
  name: string
  email: string
  phone: string
  company: string | null
  avatar: string
  photoUrl: string
  managementFeePercent: number
  repairMandate: number
  notes: string
  propertyIds: string[]
}

export type CandidateTenant = {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  photoUrl: string
  familySituation: string
  monthlyIncome: number
  pets: string | null
  status: "pending" | "approved" | "rejected"
  appliedForId: string
  notes: string
  appliedAt: string
}

export type InsurancePolicy = {
  id: string
  propertyId: string
  holder: "owner" | "tenant"
  holderName: string
  company: string
  policyNumber: string
  type: string
  annualPremium: number
  startDate: string
  endDate: string
}

// ── Properties ──────────────────────────────────────────────────────────────

export const properties: Property[] = [
  {
    id: "p1",
    name: "Appartement Grote Markt",
    address: "Grote Markt 12",
    city: "Brussel",
    zipCode: "1000",
    type: "apartment",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 85,
    baseRent: 1100,
    commonCosts: 250,
    monthlyRent: 1350,
    status: "occupied",
    totalRevenue: 32400,
    imageGradient: "from-amber-400 to-orange-600",
    ownerId: "o1",
    lat: 50.8467,
    lng: 4.3525,
    leaseStart: "2024-06-01",
    leaseEnd: "2026-05-31",
    buildingYear: 1920,
    renovatedYear: 2020,
    epcScore: "B",
    floor: 2,
    hasParking: false,
    hasGarage: false,
    hasElevator: true,
    familyMembers: 2,
    petsAllowed: false,
    petsPresent: null,
    smokingAllowed: false,
    tenant: {
      id: "t1",
      name: "Emma Janssens",
      email: "emma.janssens@email.be",
      phone: "+32 470 12 34 56",
      address: "Grote Markt 12, 1000 Brussel",
      avatar: "EJ",
      photoUrl: "https://i.pravatar.cc/150?u=emma.janssens@email.be",
      moveInDate: "2024-06-01",
      propertyId: "p1",
    },
    utilities: [
      { name: "Elektriciteit", monthlyCost: 95 },
      { name: "Water", monthlyCost: 35 },
      { name: "Gas", monthlyCost: 65 },
      { name: "Internet", monthlyCost: 45 },
    ],
  },
  {
    id: "p2",
    name: "Studio Meir",
    address: "Meir 78",
    city: "Antwerpen",
    zipCode: "2000",
    type: "studio",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    bedrooms: 1,
    bathrooms: 1,
    sqm: 45,
    baseRent: 800,
    commonCosts: 150,
    monthlyRent: 950,
    status: "occupied",
    totalRevenue: 22800,
    imageGradient: "from-blue-400 to-indigo-600",
    ownerId: "o1",
    lat: 51.2194,
    lng: 4.4025,
    leaseStart: "2025-01-01",
    leaseEnd: "2026-12-31",
    buildingYear: 1960,
    renovatedYear: 2024,
    epcScore: "C",
    floor: 3,
    hasParking: false,
    hasGarage: false,
    hasElevator: false,
    familyMembers: 1,
    petsAllowed: true,
    petsPresent: null,
    smokingAllowed: false,
    tenant: {
      id: "t2",
      name: "Lucas Peeters",
      email: "lucas.p@email.be",
      phone: "+32 471 23 45 67",
      address: "Meir 78, 2000 Antwerpen",
      avatar: "LP",
      photoUrl: "https://i.pravatar.cc/150?u=lucas.p@email.be",
      moveInDate: "2025-01-01",
      propertyId: "p2",
    },
    utilities: [
      { name: "Elektriciteit", monthlyCost: 65 },
      { name: "Water", monthlyCost: 25 },
      { name: "Internet", monthlyCost: 45 },
    ],
  },
  {
    id: "p3",
    name: "Loft Korenmarkt",
    address: "Korenmarkt 5",
    city: "Gent",
    zipCode: "9000",
    type: "apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 120,
    baseRent: 1350,
    commonCosts: 300,
    monthlyRent: 1650,
    status: "available",
    totalRevenue: 39600,
    imageGradient: "from-emerald-400 to-teal-600",
    ownerId: "o2",
    lat: 51.0543,
    lng: 3.7247,
    leaseStart: null,
    leaseEnd: null,
    buildingYear: 1890,
    renovatedYear: 2023,
    epcScore: "A",
    floor: 1,
    hasParking: true,
    hasGarage: false,
    hasElevator: true,
    familyMembers: null,
    petsAllowed: true,
    petsPresent: null,
    smokingAllowed: false,
    tenant: null,
    utilities: [
      { name: "Elektriciteit", monthlyCost: 120 },
      { name: "Water", monthlyCost: 45 },
      { name: "Gas", monthlyCost: 85 },
      { name: "Internet", monthlyCost: 55 },
    ],
  },
  {
    id: "p4",
    name: "Herenhuis Naamsestraat",
    address: "Naamsestraat 44",
    city: "Leuven",
    zipCode: "3000",
    type: "house",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    bedrooms: 4,
    bathrooms: 2,
    sqm: 180,
    baseRent: 1500,
    commonCosts: 300,
    monthlyRent: 1800,
    status: "occupied",
    totalRevenue: 43200,
    imageGradient: "from-violet-400 to-purple-600",
    ownerId: "o2",
    lat: 50.8798,
    lng: 4.7005,
    leaseStart: "2024-03-01",
    leaseEnd: "2026-02-28",
    buildingYear: 1905,
    renovatedYear: 2019,
    epcScore: "C",
    floor: null,
    hasParking: true,
    hasGarage: true,
    hasElevator: false,
    familyMembers: 4,
    petsAllowed: true,
    petsPresent: "1 hond",
    smokingAllowed: false,
    tenant: {
      id: "t3",
      name: "Sophie De Smet",
      email: "sophie.desmet@email.be",
      phone: "+32 472 34 56 78",
      address: "Naamsestraat 44, 3000 Leuven",
      avatar: "SD",
      photoUrl: "https://i.pravatar.cc/150?u=sophie.desmet@email.be",
      moveInDate: "2024-03-01",
      propertyId: "p4",
    },
    utilities: [
      { name: "Elektriciteit", monthlyCost: 140 },
      { name: "Water", monthlyCost: 50 },
      { name: "Gas", monthlyCost: 110 },
      { name: "Internet", monthlyCost: 50 },
    ],
  },
  {
    id: "p5",
    name: "Appartement Markt Brugge",
    address: "Markt 22",
    city: "Brugge",
    zipCode: "8000",
    type: "apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 78,
    baseRent: 900,
    commonCosts: 200,
    monthlyRent: 1100,
    status: "maintenance",
    totalRevenue: 26400,
    imageGradient: "from-rose-400 to-pink-600",
    ownerId: "o3",
    lat: 51.2093,
    lng: 3.2247,
    leaseStart: "2024-09-01",
    leaseEnd: "2026-08-31",
    buildingYear: 1975,
    renovatedYear: null,
    epcScore: "D",
    floor: 1,
    hasParking: false,
    hasGarage: false,
    hasElevator: false,
    familyMembers: 1,
    petsAllowed: false,
    petsPresent: null,
    smokingAllowed: true,
    tenant: {
      id: "t4",
      name: "Thomas Willems",
      email: "t.willems@email.be",
      phone: "+32 473 45 67 89",
      address: "Markt 22, 8000 Brugge",
      avatar: "TW",
      photoUrl: "https://i.pravatar.cc/150?u=t.willems@email.be",
      moveInDate: "2024-09-01",
      propertyId: "p5",
    },
    utilities: [
      { name: "Elektriciteit", monthlyCost: 80 },
      { name: "Water", monthlyCost: 30 },
      { name: "Gas", monthlyCost: 55 },
      { name: "Internet", monthlyCost: 45 },
    ],
  },
  {
    id: "p6",
    name: "Commercieel Pand Sint-Lambert",
    address: "Place Saint-Lambert 8",
    city: "Luik",
    zipCode: "4000",
    type: "commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    bedrooms: 0,
    bathrooms: 1,
    sqm: 200,
    baseRent: 2200,
    commonCosts: 600,
    monthlyRent: 2800,
    status: "occupied",
    totalRevenue: 67200,
    imageGradient: "from-cyan-400 to-blue-600",
    ownerId: "o3",
    lat: 50.6451,
    lng: 5.5734,
    leaseStart: "2023-01-01",
    leaseEnd: "2027-12-31",
    buildingYear: 2010,
    renovatedYear: null,
    epcScore: "A",
    floor: 0,
    hasParking: true,
    hasGarage: true,
    hasElevator: true,
    familyMembers: null,
    petsAllowed: false,
    petsPresent: null,
    smokingAllowed: false,
    tenant: {
      id: "t5",
      name: "Dupont Consulting BVBA",
      email: "info@dupontconsulting.be",
      phone: "+32 4 123 45 67",
      address: "Place Saint-Lambert 8, 4000 Luik",
      avatar: "DC",
      photoUrl: "https://i.pravatar.cc/150?u=info@dupontconsulting.be",
      moveInDate: "2023-01-01",
      propertyId: "p6",
    },
    utilities: [
      { name: "Elektriciteit", monthlyCost: 250 },
      { name: "Water", monthlyCost: 60 },
      { name: "Gas", monthlyCost: 150 },
      { name: "Internet", monthlyCost: 85 },
    ],
  },
  {
    id: "p7",
    name: "Nieuwbouw Mechelen",
    address: "Grote Markt 35",
    city: "Mechelen",
    zipCode: "2800",
    type: "apartment",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 92,
    baseRent: 1050,
    commonCosts: 200,
    monthlyRent: 1250,
    status: "new",
    totalRevenue: 0,
    imageGradient: "from-slate-400 to-gray-600",
    ownerId: "o1",
    lat: 51.0259,
    lng: 4.4776,
    leaseStart: null,
    leaseEnd: null,
    buildingYear: 2025,
    renovatedYear: null,
    epcScore: "A+",
    floor: 4,
    hasParking: true,
    hasGarage: false,
    hasElevator: true,
    familyMembers: null,
    petsAllowed: true,
    petsPresent: null,
    smokingAllowed: false,
    tenant: null,
    utilities: [],
  },
]

export const tenants: Tenant[] = properties
  .filter((p) => p.tenant)
  .map((p) => p.tenant!)

// ── Tickets ─────────────────────────────────────────────────────────────────

export const tickets: Ticket[] = [
  { id: "tk1", propertyId: "p1", tenantId: "t1", tenantName: "Emma Janssens", title: "Keukenkraan lekt", description: "De keukenkraan druppelt al 2 dagen constant.", category: "plumbing", priority: "medium", status: "open", createdAt: "2026-03-01T10:30:00Z", updatedAt: "2026-03-01T10:30:00Z", assignedTo: null },
  { id: "tk2", propertyId: "p4", tenantId: "t3", tenantName: "Sophie De Smet", title: "Verwarming werkt niet in slaapkamer", description: "De radiator in de hoofdslaapkamer verwarmt niet. Thermostaat geeft foutcode E04.", category: "hvac", priority: "high", status: "in-progress", createdAt: "2026-02-28T08:15:00Z", updatedAt: "2026-03-02T14:00:00Z", assignedTo: "w3" },
  { id: "tk3", propertyId: "p5", tenantId: "t4", tenantName: "Thomas Willems", title: "Badkamerverlichting kapot", description: "Het plafondlicht in de badkamer doet het niet meer. Lamp vervangen maar nog steeds geen licht.", category: "electrical", priority: "medium", status: "open", createdAt: "2026-03-03T16:45:00Z", updatedAt: "2026-03-03T16:45:00Z", assignedTo: null },
  { id: "tk4", propertyId: "p2", tenantId: "t2", tenantName: "Lucas Peeters", title: "Voordeurslot klemt", description: "Het voordeurslot werkt niet goed. Sleutel blijft vastzitten bij het draaien.", category: "other", priority: "urgent", status: "in-progress", createdAt: "2026-03-04T07:00:00Z", updatedAt: "2026-03-04T09:30:00Z", assignedTo: "w6" },
  { id: "tk5", propertyId: "p1", tenantId: "t1", tenantName: "Emma Janssens", title: "Vaatwasser maakt lawaai", description: "De vaatwasser maakt een luid knarsgend geluid tijdens de wascyclus.", category: "appliance", priority: "low", status: "resolved", createdAt: "2026-02-15T11:20:00Z", updatedAt: "2026-02-20T15:00:00Z", assignedTo: "w4" },
  { id: "tk6", propertyId: "p6", tenantId: "t5", tenantName: "Dupont Consulting BVBA", title: "Airco koelt niet", description: "De airconditioningunit in het hoofdkantoor blaast warme lucht.", category: "hvac", priority: "high", status: "open", createdAt: "2026-03-05T09:00:00Z", updatedAt: "2026-03-05T09:00:00Z", assignedTo: null },
  { id: "tk7", propertyId: "p1", tenantId: "t1", tenantName: "Emma Janssens", title: "Intercom defect", description: "De parlofoon reageert niet meer bij aanbellen.", category: "electrical", priority: "low", status: "closed", createdAt: "2025-11-10T09:00:00Z", updatedAt: "2025-11-15T14:00:00Z", assignedTo: "w2" },
  { id: "tk8", propertyId: "p4", tenantId: "t3", tenantName: "Sophie De Smet", title: "Garagepoort blokkeert", description: "De elektrische garagepoort stopt halverwege het openen.", category: "other", priority: "medium", status: "closed", createdAt: "2025-12-01T11:00:00Z", updatedAt: "2025-12-05T16:00:00Z", assignedTo: "w4" },
]

// ── Messages ────────────────────────────────────────────────────────────────

export const messages: Message[] = [
  { id: "m1", propertyId: "p1", sender: "Emma Janssens", senderRole: "tenant", content: "Hallo, de loodgieter is langs geweest maar ik was niet thuis. Kunnen we een nieuwe afspraak maken?", timestamp: "2026-03-04T14:30:00Z", read: false },
  { id: "m2", propertyId: "p1", sender: "Vastgoedbeheerder", senderRole: "owner", content: "Natuurlijk, ik neem contact op met de loodgieter en laat u een nieuw tijdstip weten.", timestamp: "2026-03-04T15:10:00Z", read: true },
  { id: "m3", propertyId: "p4", sender: "Sophie De Smet", senderRole: "tenant", content: "De verwarmingstechnicus heeft het probleem opgelost. Alles werkt nu weer. Bedankt!", timestamp: "2026-03-03T16:00:00Z", read: true },
  { id: "m4", propertyId: "p2", sender: "Lucas Peeters", senderRole: "tenant", content: "De slotenmaker is er, maar zegt dat het hele slotmechanisme vervangen moet worden. Is dat goedgekeurd?", timestamp: "2026-03-04T10:15:00Z", read: false },
  { id: "m5", propertyId: "p5", sender: "Thomas Willems", senderRole: "tenant", content: "Wanneer kan iemand naar het badkamerlicht komen kijken? Het is al een paar dagen zo.", timestamp: "2026-03-05T08:00:00Z", read: false },
  { id: "m6", propertyId: "p6", sender: "Dupont Consulting BVBA", senderRole: "tenant", content: "Het airco-probleem is dringend, we hebben deze week vergaderingen met klanten. Gelieve prioriteit te geven.", timestamp: "2026-03-05T09:30:00Z", read: false },
]

// ── Workers (by region & specialty) ─────────────────────────────────────────

export const workers: Worker[] = [
  { id: "w1", name: "Jan De Vries", specialty: "plumber", region: "Brussel", phone: "+32 470 51 11 22", email: "jan.devries@diensten.be", available: true, rating: 4.8, photoUrl: "https://i.pravatar.cc/150?u=jan.devries" },
  { id: "w2", name: "Pieter Smeets", specialty: "electrician", region: "Antwerpen", phone: "+32 471 52 22 33", email: "p.smeets@elektra.be", available: true, rating: 4.6, photoUrl: "https://i.pravatar.cc/150?u=p.smeets" },
  { id: "w3", name: "Marco Claes", specialty: "hvac", region: "Vlaams-Brabant", phone: "+32 472 53 33 44", email: "m.claes@klimaat.be", available: false, rating: 4.9, photoUrl: "https://i.pravatar.cc/150?u=m.claes" },
  { id: "w4", name: "Erik Maes", specialty: "general", region: "Oost-Vlaanderen", phone: "+32 473 54 44 55", email: "e.maes@onderhoud.be", available: true, rating: 4.5, photoUrl: "https://i.pravatar.cc/150?u=e.maes" },
  { id: "w5", name: "Willem Jacobs", specialty: "painter", region: "West-Vlaanderen", phone: "+32 474 55 55 66", email: "w.jacobs@schilderwerk.be", available: true, rating: 4.7, photoUrl: "https://i.pravatar.cc/150?u=w.jacobs" },
  { id: "w6", name: "Henk Mertens", specialty: "locksmith", region: "Antwerpen", phone: "+32 475 56 66 77", email: "h.mertens@sloten.be", available: false, rating: 4.4, photoUrl: "https://i.pravatar.cc/150?u=h.mertens" },
  { id: "w7", name: "Koen Verhoeven", specialty: "glazier", region: "Brussel", phone: "+32 476 57 77 88", email: "k.verhoeven@glas.be", available: true, rating: 4.3, photoUrl: "https://i.pravatar.cc/150?u=k.verhoeven" },
  { id: "w8", name: "Bart Lenaerts", specialty: "drain_cleaner", region: "Oost-Vlaanderen", phone: "+32 477 58 88 99", email: "b.lenaerts@ontstopping.be", available: true, rating: 4.6, photoUrl: "https://i.pravatar.cc/150?u=b.lenaerts" },
  { id: "w9", name: "Michel Dubois", specialty: "hvac", region: "Luik", phone: "+32 478 59 99 00", email: "m.dubois@climat.be", available: true, rating: 4.7, photoUrl: "https://i.pravatar.cc/150?u=m.dubois" },
  { id: "w10", name: "Tom Verstraeten", specialty: "electrician", region: "Brussel", phone: "+32 479 60 00 11", email: "t.verstraeten@elektro.be", available: true, rating: 4.5, photoUrl: "https://i.pravatar.cc/150?u=t.verstraeten" },
  { id: "w11", name: "Steven De Keyser", specialty: "plumber", region: "Antwerpen", phone: "+32 470 61 11 22", email: "s.dekeyser@loodgieter.be", available: true, rating: 4.8, photoUrl: "https://i.pravatar.cc/150?u=s.dekeyser" },
  { id: "w12", name: "Yves Martin", specialty: "general", region: "Luik", phone: "+32 471 62 22 33", email: "y.martin@services.be", available: true, rating: 4.2, photoUrl: "https://i.pravatar.cc/150?u=y.martin" },
]

export const specialtyLabels: Record<string, string> = {
  electrician: "Elektricien",
  plumber: "Loodgieter",
  hvac: "HVAC",
  general: "Generieke klusjes",
  painter: "Schilder",
  locksmith: "Slotenmaker",
  glazier: "Glazenmaker",
  drain_cleaner: "Ontstopper",
}

export const regionList = ["Brussel", "Antwerpen", "Oost-Vlaanderen", "Vlaams-Brabant", "West-Vlaanderen", "Luik"]

// ── Invoices (uitgaand & inkomend) ──────────────────────────────────────────

export const invoices: Invoice[] = [
  // Uitgaande facturen (naar huurders - alleen commercieel)
  { id: "inv1", propertyId: "p6", tenantId: "t5", month: "Maart 2026", direction: "uitgaand", description: "Maandelijkse huur + kosten", rent: 2200, commonCosts: 600, propertyTax: 0, insuranceCosts: 0, maintenance: 0, total: 3388, vatRate: 21, vatAmount: 588, status: "pending", dueDate: "2026-03-05", supplierName: null },
  { id: "inv2", propertyId: "p6", tenantId: "t5", month: "Februari 2026", direction: "uitgaand", description: "Maandelijkse huur + kosten", rent: 2200, commonCosts: 600, propertyTax: 0, insuranceCosts: 0, maintenance: 0, total: 3388, vatRate: 21, vatAmount: 588, status: "paid", dueDate: "2026-02-05", supplierName: null },
  { id: "inv3", propertyId: "p6", tenantId: "t5", month: "Q1 2026", direction: "uitgaand", description: "Kwartaalafrekening doorrekening kosten", rent: 0, commonCosts: 450, propertyTax: 1200, insuranceCosts: 300, maintenance: 0, total: 2359.5, vatRate: 21, vatAmount: 409.5, status: "draft", dueDate: "2026-04-01", supplierName: null },
  // Inkomende facturen (van leveranciers/vaklui)
  { id: "inv4", propertyId: "p5", tenantId: null, month: "Maart 2026", direction: "inkomend", description: "Badkamerrenovatie - materiaal + arbeid", rent: 0, commonCosts: 0, propertyTax: 0, insuranceCosts: 0, maintenance: 3500, total: 4235, vatRate: 21, vatAmount: 735, status: "pending", dueDate: "2026-03-30", supplierName: "Erik Maes - Onderhoud" },
  { id: "inv5", propertyId: "p1", tenantId: null, month: "Maart 2026", direction: "inkomend", description: "Jaarlijks ketelonderhoud", rent: 0, commonCosts: 0, propertyTax: 0, insuranceCosts: 0, maintenance: 250, total: 302.5, vatRate: 21, vatAmount: 52.5, status: "paid", dueDate: "2026-03-25", supplierName: "Marco Claes - Klimaat" },
  { id: "inv6", propertyId: "p4", tenantId: null, month: "April 2026", direction: "inkomend", description: "Buitenschilderwerk gevel + raamkozijnen", rent: 0, commonCosts: 0, propertyTax: 0, insuranceCosts: 0, maintenance: 4200, total: 5082, vatRate: 21, vatAmount: 882, status: "draft", dueDate: "2026-04-15", supplierName: "Willem Jacobs - Schilderwerk" },
  { id: "inv7", propertyId: "p2", tenantId: null, month: "Maart 2026", direction: "inkomend", description: "Slotvervanging voordeur", rent: 0, commonCosts: 0, propertyTax: 0, insuranceCosts: 0, maintenance: 180, total: 217.8, vatRate: 21, vatAmount: 37.8, status: "paid", dueDate: "2026-03-10", supplierName: "Henk Mertens - Sloten" },
]

// ── Payment tracking (for residential tenants - contract-based) ─────────────

export const paymentTracking: { propertyId: string; tenantId: string; month: string; baseRent: number; commonCosts: number; total: number; status: "paid" | "pending" | "overdue"; dueDate: string }[] = [
  { propertyId: "p1", tenantId: "t1", month: "Maart 2026", baseRent: 1100, commonCosts: 250, total: 1350, status: "pending", dueDate: "2026-03-05" },
  { propertyId: "p2", tenantId: "t2", month: "Maart 2026", baseRent: 800, commonCosts: 150, total: 950, status: "paid", dueDate: "2026-03-05" },
  { propertyId: "p4", tenantId: "t3", month: "Maart 2026", baseRent: 1500, commonCosts: 300, total: 1800, status: "pending", dueDate: "2026-03-05" },
  { propertyId: "p5", tenantId: "t4", month: "Maart 2026", baseRent: 900, commonCosts: 200, total: 1100, status: "overdue", dueDate: "2026-03-01" },
  { propertyId: "p1", tenantId: "t1", month: "Februari 2026", baseRent: 1100, commonCosts: 250, total: 1350, status: "paid", dueDate: "2026-02-05" },
  { propertyId: "p2", tenantId: "t2", month: "Februari 2026", baseRent: 800, commonCosts: 150, total: 950, status: "paid", dueDate: "2026-02-05" },
  { propertyId: "p4", tenantId: "t3", month: "Februari 2026", baseRent: 1500, commonCosts: 300, total: 1800, status: "paid", dueDate: "2026-02-05" },
  { propertyId: "p5", tenantId: "t4", month: "Februari 2026", baseRent: 900, commonCosts: 200, total: 1100, status: "paid", dueDate: "2026-02-05" },
]

// ── Interventions (with workflow) ───────────────────────────────────────────

export const interventions: Intervention[] = [
  { id: "int1", propertyId: "p5", ticketId: "tk3", title: "Volledige badkamerrenovatie", description: "Complete renovatie van sanitair en betegeling", scheduledDate: "2026-03-15", workerId: "w4", workerName: "Erik Maes", status: "ingepland", cost: 3500, quotedCost: 3500, approvedBy: "Sarah van Dijk", tenantConfirmed: true, contractorConfirmed: true },
  { id: "int2", propertyId: "p1", ticketId: null, title: "Jaarlijks ketelonderhoud", description: "Jaarlijkse service van de centrale verwarmingsketel", scheduledDate: "2026-03-20", workerId: "w3", workerName: "Marco Claes", status: "goedgekeurd", cost: 250, quotedCost: 250, approvedBy: "Sarah van Dijk", tenantConfirmed: false, contractorConfirmed: false },
  { id: "int3", propertyId: "p4", ticketId: null, title: "Buitenschilderwerk", description: "Schilderen van buitengevel en raamkozijnen", scheduledDate: "2026-04-01", workerId: "w5", workerName: "Willem Jacobs", status: "offerte_ontvangen", cost: 4200, quotedCost: 4200, approvedBy: null, tenantConfirmed: false, contractorConfirmed: false },
  { id: "int4", propertyId: "p3", ticketId: null, title: "Inspectie voor verhuur", description: "Volledige inspectie van het pand voor nieuwe huurders", scheduledDate: "2026-03-10", workerId: "w4", workerName: "Erik Maes", status: "in_uitvoering", cost: 150, quotedCost: 150, approvedBy: "Mark Hendricks", tenantConfirmed: false, contractorConfirmed: false },
  { id: "int5", propertyId: "p1", ticketId: "tk1", title: "Keukenkraan reparatie", description: "Lekkende keukenkraan herstellen of vervangen", scheduledDate: "", workerId: "", workerName: "", status: "offerte_aangevraagd", cost: 0, quotedCost: null, approvedBy: null, tenantConfirmed: false, contractorConfirmed: false },
  { id: "int6", propertyId: "p6", ticketId: "tk6", title: "Airco reparatie", description: "Diagnose en reparatie airconditioningunit", scheduledDate: "", workerId: "w9", workerName: "Michel Dubois", status: "offerte_ontvangen", cost: 0, quotedCost: 850, approvedBy: null, tenantConfirmed: false, contractorConfirmed: false },
]

// ── Team Members ────────────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  { id: "tm1", name: "Sarah van Dijk", role: "admin", email: "sarah@aedificapro.be", phone: "+32 470 70 00 11", avatar: "SD", photoUrl: "https://i.pravatar.cc/150?u=sarah.vandijk", properties: 7 },
  { id: "tm2", name: "Mark Hendricks", role: "manager", email: "mark@aedificapro.be", phone: "+32 471 70 00 22", avatar: "MH", photoUrl: "https://i.pravatar.cc/150?u=mark.hendricks", properties: 4 },
  { id: "tm3", name: "Lisa Vermeer", role: "agent", email: "lisa@aedificapro.be", phone: "+32 472 70 00 33", avatar: "LV", photoUrl: "https://i.pravatar.cc/150?u=lisa.vermeer", properties: 2 },
]

// ── Emails ──────────────────────────────────────────────────────────────────

export const emails: EmailMessage[] = [
  { id: "em1", from: "sarah@aedificapro.be", to: "jan.devries@diensten.be", subject: "Loodgieterswerk Grote Markt 12", body: "Dag Jan, we hebben een lekkende kraan op Grote Markt 12. Kun je deze week langskomen?", timestamp: "2026-03-04T11:00:00Z", read: true, propertyId: "p1" },
  { id: "em2", from: "jan.devries@diensten.be", to: "sarah@aedificapro.be", subject: "Re: Loodgieterswerk Grote Markt 12", body: "Dag Sarah, ik kan donderdagmiddag langskomen. Past dat?", timestamp: "2026-03-04T13:00:00Z", read: true, propertyId: "p1" },
  { id: "em3", from: "emma.janssens@email.be", to: "sarah@aedificapro.be", subject: "Vraag over huurbetaling", body: "Hallo, de nutsvoorzieningen lijken hoger deze maand. Kunt u een uitsplitsing geven?", timestamp: "2026-03-03T09:00:00Z", read: false, propertyId: "p1" },
  { id: "em4", from: "sarah@aedificapro.be", to: "t.willems@email.be", subject: "Update onderhoud - Markt Brugge", body: "Beste Thomas, we hebben een volledige badkamerrenovatie gepland op 15 maart. Zorg a.u.b. voor toegang.", timestamp: "2026-03-02T16:00:00Z", read: true, propertyId: "p5" },
]

// ── As-Built Documents (folder hierarchy) ───────────────────────────────────

export const asBuiltDocuments: AsBuiltDocument[] = [
  // ── p1 - Appartement Grote Markt ───────────────────────────────────────────
  { id: "doc1", propertyId: "p1", name: "CV-ketel Remeha Avanta - Datasheet.pdf", type: "datasheet", folder: "Verwarming", uploadedAt: "2024-06-15", size: "2.4 MB", category: "Verwarming" },
  { id: "doc2", propertyId: "p1", name: "Onderhoudsrapport ketel 2025.pdf", type: "report", folder: "Verwarming", uploadedAt: "2025-03-20", size: "1.1 MB", category: "Verwarming" },
  { id: "doc3", propertyId: "p1", name: "Plattegrond - 2e verdieping.dwg", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2024-06-01", size: "5.1 MB", category: "Architectuur" },
  { id: "doc4", propertyId: "p1", name: "Gevelaanzicht.dwg", type: "blueprint", folder: "Architectuur/Gevels", uploadedAt: "2024-06-01", size: "3.2 MB", category: "Architectuur" },
  { id: "doc5", propertyId: "p1", name: "EPC-certificaat B.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-05-20", size: "1.2 MB", category: "Certificaten" },
  { id: "doc6", propertyId: "p1", name: "Keuringsattest elektriciteit.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-05-25", size: "0.8 MB", category: "Certificaten" },
  { id: "doc7", propertyId: "p1", name: "Voorgevel.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2024-06-01", size: "4.5 MB", category: "Fotografie" },
  { id: "doc8", propertyId: "p1", name: "Woonkamer.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-06-01", size: "3.8 MB", category: "Fotografie" },
  { id: "doc9", propertyId: "p1", name: "Keuken.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-06-01", size: "3.6 MB", category: "Fotografie" },
  { id: "doc10", propertyId: "p1", name: "Huurovereenkomst getekend.pdf", type: "pdf", folder: "Contracten", uploadedAt: "2024-06-01", size: "245 KB", category: "Contracten" },
  { id: "doc28", propertyId: "p1", name: "Plaatsbeschrijving intrede.docx", type: "word", folder: "Contracten", uploadedAt: "2024-06-01", size: "1.8 MB", category: "Contracten" },
  { id: "doc29", propertyId: "p1", name: "Inventaris meubelen.xlsx", type: "excel", folder: "Inventaris", uploadedAt: "2024-06-02", size: "128 KB", category: "Inventaris" },
  { id: "doc30", propertyId: "p1", name: "Stookplaatsattest.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-05-28", size: "0.6 MB", category: "Certificaten" },
  { id: "doc31", propertyId: "p1", name: "Asbestattest.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-05-15", size: "1.4 MB", category: "Certificaten" },
  { id: "doc32", propertyId: "p1", name: "Slaapkamer 1.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-06-01", size: "3.2 MB", category: "Fotografie" },
  { id: "doc33", propertyId: "p1", name: "Badkamer.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-06-01", size: "2.9 MB", category: "Fotografie" },
  { id: "doc34", propertyId: "p1", name: "Balkon uitzicht.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2024-06-01", size: "5.1 MB", category: "Fotografie" },
  { id: "doc35", propertyId: "p1", name: "Verwarming schema.pdf", type: "blueprint", folder: "Verwarming", uploadedAt: "2024-06-10", size: "1.5 MB", category: "Verwarming" },
  { id: "doc36", propertyId: "p1", name: "Elektrisch schema.pdf", type: "blueprint", folder: "Elektriciteit", uploadedAt: "2024-06-10", size: "2.1 MB", category: "Elektriciteit" },
  { id: "doc37", propertyId: "p1", name: "Huurwaarborg bewijs.pdf", type: "pdf", folder: "Financieel", uploadedAt: "2024-06-05", size: "95 KB", category: "Financieel" },
  { id: "doc38", propertyId: "p1", name: "Bodemonderzoek rapport.pdf", type: "report", folder: "Certificaten", uploadedAt: "2024-04-10", size: "3.8 MB", category: "Certificaten" },
  { id: "doc39", propertyId: "p1", name: "Vloerverwarming handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2024-06-15", size: "4.2 MB", category: "Handleidingen" },
  { id: "doc40", propertyId: "p1", name: "Video rondleiding appartement.mp4", type: "video", folder: "Media", uploadedAt: "2024-06-01", size: "85.4 MB", category: "Media" },

  // ── p2 - Studio Meir ──────────────────────────────────────────────────────
  { id: "doc26", propertyId: "p2", name: "Studio renovatie album.zip", type: "zip", folder: "Foto's/Renovatie", uploadedAt: "2024-12-20", size: "15.3 MB", category: "Fotografie" },
  { id: "doc27", propertyId: "p2", name: "EPC-certificaat A.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-12-01", size: "0.9 MB", category: "Certificaten" },
  { id: "doc41", propertyId: "p2", name: "Huurovereenkomst Peeters.pdf", type: "pdf", folder: "Contracten", uploadedAt: "2024-12-15", size: "312 KB", category: "Contracten" },
  { id: "doc42", propertyId: "p2", name: "Plaatsbeschrijving intrede.docx", type: "word", folder: "Contracten", uploadedAt: "2024-12-15", size: "2.1 MB", category: "Contracten" },
  { id: "doc43", propertyId: "p2", name: "Keuringsattest gasinstallatie.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-11-20", size: "0.7 MB", category: "Certificaten" },
  { id: "doc44", propertyId: "p2", name: "Plattegrond studio.pdf", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2024-12-01", size: "1.8 MB", category: "Architectuur" },
  { id: "doc45", propertyId: "p2", name: "Woonkamer na renovatie.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-12-20", size: "4.2 MB", category: "Fotografie" },
  { id: "doc46", propertyId: "p2", name: "Keuken na renovatie.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-12-20", size: "3.8 MB", category: "Fotografie" },
  { id: "doc47", propertyId: "p2", name: "Badkamer na renovatie.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-12-20", size: "3.5 MB", category: "Fotografie" },
  { id: "doc48", propertyId: "p2", name: "Renovatie offerte aannemer.pdf", type: "pdf", folder: "Financieel", uploadedAt: "2024-09-15", size: "520 KB", category: "Financieel" },
  { id: "doc49", propertyId: "p2", name: "Renovatie facturen overzicht.xlsx", type: "excel", folder: "Financieel", uploadedAt: "2025-01-10", size: "245 KB", category: "Financieel" },
  { id: "doc50", propertyId: "p2", name: "Wasmachine Bosch handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2024-12-18", size: "6.8 MB", category: "Handleidingen" },
  { id: "doc51", propertyId: "p2", name: "Inductiekookplaat handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2024-12-18", size: "3.4 MB", category: "Handleidingen" },
  { id: "doc52", propertyId: "p2", name: "Brandverzekering polis.pdf", type: "pdf", folder: "Verzekeringen", uploadedAt: "2024-12-01", size: "180 KB", category: "Verzekeringen" },

  // ── p3 - Loft Korenmarkt ──────────────────────────────────────────────────
  { id: "doc18", propertyId: "p3", name: "Slimme thermostaat Nest - handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2025-03-15", size: "1.8 MB", category: "Handleidingen" },
  { id: "doc19", propertyId: "p3", name: "Vaatwasser Siemens handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2025-03-15", size: "2.1 MB", category: "Handleidingen" },
  { id: "doc20", propertyId: "p3", name: "Plattegrond loft.dwg", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2023-06-01", size: "4.3 MB", category: "Architectuur" },
  { id: "doc53", propertyId: "p3", name: "Huurovereenkomst De Smet.pdf", type: "pdf", folder: "Contracten", uploadedAt: "2023-06-01", size: "289 KB", category: "Contracten" },
  { id: "doc54", propertyId: "p3", name: "EPC-certificaat A+.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2023-05-20", size: "1.1 MB", category: "Certificaten" },
  { id: "doc55", propertyId: "p3", name: "Keuringsattest elektriciteit.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2023-05-22", size: "0.8 MB", category: "Certificaten" },
  { id: "doc56", propertyId: "p3", name: "Conformiteitsattest rookmelders.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2023-05-25", size: "0.4 MB", category: "Certificaten" },
  { id: "doc57", propertyId: "p3", name: "Woonkamer panorama.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2023-06-01", size: "6.2 MB", category: "Fotografie" },
  { id: "doc58", propertyId: "p3", name: "Open keuken.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2023-06-01", size: "4.8 MB", category: "Fotografie" },
  { id: "doc59", propertyId: "p3", name: "Mezzanine slaapkamer.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2023-06-01", size: "4.1 MB", category: "Fotografie" },
  { id: "doc60", propertyId: "p3", name: "Gevel Korenmarkt.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2023-06-01", size: "5.5 MB", category: "Fotografie" },
  { id: "doc61", propertyId: "p3", name: "Plaatsbeschrijving intrede.docx", type: "word", folder: "Contracten", uploadedAt: "2023-06-01", size: "3.2 MB", category: "Contracten" },
  { id: "doc62", propertyId: "p3", name: "Addendum huisdierenclausule.docx", type: "word", folder: "Contracten", uploadedAt: "2023-08-15", size: "85 KB", category: "Contracten" },
  { id: "doc63", propertyId: "p3", name: "Domotica systeem handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2023-06-01", size: "8.4 MB", category: "Handleidingen" },
  { id: "doc64", propertyId: "p3", name: "Warmtepomp Daikin technische fiche.pdf", type: "datasheet", folder: "Verwarming", uploadedAt: "2023-06-01", size: "3.6 MB", category: "Verwarming" },
  { id: "doc65", propertyId: "p3", name: "3D scan interieur.zip", type: "zip", folder: "Media", uploadedAt: "2023-06-05", size: "124.5 MB", category: "Media" },
  { id: "doc66", propertyId: "p3", name: "Video drone opname gebouw.mp4", type: "video", folder: "Media", uploadedAt: "2023-06-02", size: "210.8 MB", category: "Media" },

  // ── p4 - Herenhuis Naamsestraat ───────────────────────────────────────────
  { id: "doc11", propertyId: "p4", name: "Tuinonderhoudsplan 2025.docx", type: "word", folder: "Onderhoud", uploadedAt: "2025-01-10", size: "0.8 MB", category: "Onderhoud" },
  { id: "doc12", propertyId: "p4", name: "Dakinspectie 2025 rapport.pdf", type: "report", folder: "Inspecties", uploadedAt: "2025-06-01", size: "3.5 MB", category: "Inspecties" },
  { id: "doc13", propertyId: "p4", name: "Plattegrond begane grond.dwg", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2024-03-01", size: "4.8 MB", category: "Architectuur" },
  { id: "doc14", propertyId: "p4", name: "Plattegrond verdieping.dwg", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2024-03-01", size: "4.6 MB", category: "Architectuur" },
  { id: "doc15", propertyId: "p4", name: "Voorgevel herenhuis.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2024-03-01", size: "5.2 MB", category: "Fotografie" },
  { id: "doc16", propertyId: "p4", name: "Tuin achteraanzicht.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2024-03-01", size: "4.1 MB", category: "Fotografie" },
  { id: "doc17", propertyId: "p4", name: "EPC-certificaat C.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-03-01", size: "1.0 MB", category: "Certificaten" },
  { id: "doc67", propertyId: "p4", name: "Huurovereenkomst Maes.pdf", type: "pdf", folder: "Contracten", uploadedAt: "2024-03-01", size: "278 KB", category: "Contracten" },
  { id: "doc68", propertyId: "p4", name: "Plaatsbeschrijving intrede.docx", type: "word", folder: "Contracten", uploadedAt: "2024-03-01", size: "4.5 MB", category: "Contracten" },
  { id: "doc69", propertyId: "p4", name: "Woonkamer herenhuis.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-03-01", size: "4.8 MB", category: "Fotografie" },
  { id: "doc70", propertyId: "p4", name: "Keuken herenhuis.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-03-01", size: "4.3 MB", category: "Fotografie" },
  { id: "doc71", propertyId: "p4", name: "Master bedroom.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-03-01", size: "3.9 MB", category: "Fotografie" },
  { id: "doc72", propertyId: "p4", name: "Zolder ruimte.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-03-01", size: "3.1 MB", category: "Fotografie" },
  { id: "doc73", propertyId: "p4", name: "Plattegrond zolder.dwg", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2024-03-01", size: "3.9 MB", category: "Architectuur" },
  { id: "doc74", propertyId: "p4", name: "Asbestattest.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-02-15", size: "1.6 MB", category: "Certificaten" },
  { id: "doc75", propertyId: "p4", name: "Keuringsattest gasinstallatie.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-02-20", size: "0.7 MB", category: "Certificaten" },
  { id: "doc76", propertyId: "p4", name: "Elektrisch schema.pdf", type: "blueprint", folder: "Elektriciteit", uploadedAt: "2024-03-01", size: "1.9 MB", category: "Elektriciteit" },
  { id: "doc77", propertyId: "p4", name: "Offerte schilderwerken 2025.pdf", type: "pdf", folder: "Onderhoud", uploadedAt: "2025-02-01", size: "420 KB", category: "Onderhoud" },
  { id: "doc78", propertyId: "p4", name: "Gevel restauratie plan.docx", type: "word", folder: "Onderhoud", uploadedAt: "2025-01-20", size: "1.2 MB", category: "Onderhoud" },
  { id: "doc79", propertyId: "p4", name: "Onderhoudskosten overzicht 2024.xlsx", type: "excel", folder: "Financieel", uploadedAt: "2025-01-05", size: "156 KB", category: "Financieel" },
  { id: "doc80", propertyId: "p4", name: "Erfgoed beschermingsbesluit.pdf", type: "pdf", folder: "Juridisch", uploadedAt: "2020-06-15", size: "2.3 MB", category: "Juridisch" },
  { id: "doc81", propertyId: "p4", name: "Stedenbouwkundige vergunning verbouwing.pdf", type: "pdf", folder: "Juridisch", uploadedAt: "2023-09-10", size: "1.8 MB", category: "Juridisch" },
  { id: "doc82", propertyId: "p4", name: "CV-ketel Vaillant ecoTEC handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2024-03-01", size: "5.7 MB", category: "Handleidingen" },
  { id: "doc83", propertyId: "p4", name: "Video rondleiding herenhuis.mp4", type: "video", folder: "Media", uploadedAt: "2024-03-05", size: "156.2 MB", category: "Media" },

  // ── p5 - Appartement Markt Brugge ─────────────────────────────────────────
  { id: "doc21", propertyId: "p5", name: "Keukenapparatuur specificaties.pdf", type: "datasheet", folder: "Apparatuur", uploadedAt: "2024-09-01", size: "2.1 MB", category: "Apparatuur" },
  { id: "doc22", propertyId: "p5", name: "Badkamer voor renovatie.jpg", type: "photo", folder: "Foto's/Renovatie", uploadedAt: "2026-02-15", size: "3.9 MB", category: "Fotografie" },
  { id: "doc84", propertyId: "p5", name: "Huurovereenkomst Willems.pdf", type: "pdf", folder: "Contracten", uploadedAt: "2024-09-01", size: "256 KB", category: "Contracten" },
  { id: "doc85", propertyId: "p5", name: "Plaatsbeschrijving intrede.docx", type: "word", folder: "Contracten", uploadedAt: "2024-09-01", size: "2.8 MB", category: "Contracten" },
  { id: "doc86", propertyId: "p5", name: "EPC-certificaat B.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-08-20", size: "1.0 MB", category: "Certificaten" },
  { id: "doc87", propertyId: "p5", name: "Keuringsattest elektriciteit.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2024-08-22", size: "0.8 MB", category: "Certificaten" },
  { id: "doc88", propertyId: "p5", name: "Plattegrond appartement.pdf", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2024-09-01", size: "2.4 MB", category: "Architectuur" },
  { id: "doc89", propertyId: "p5", name: "Woonkamer.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-09-01", size: "4.1 MB", category: "Fotografie" },
  { id: "doc90", propertyId: "p5", name: "Slaapkamer.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2024-09-01", size: "3.6 MB", category: "Fotografie" },
  { id: "doc91", propertyId: "p5", name: "Gevel Markt Brugge.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2024-09-01", size: "5.8 MB", category: "Fotografie" },
  { id: "doc92", propertyId: "p5", name: "Badkamer na renovatie.jpg", type: "photo", folder: "Foto's/Renovatie", uploadedAt: "2026-03-01", size: "4.2 MB", category: "Fotografie" },
  { id: "doc93", propertyId: "p5", name: "Renovatie badkamer offerte.pdf", type: "pdf", folder: "Financieel", uploadedAt: "2026-01-15", size: "380 KB", category: "Financieel" },
  { id: "doc94", propertyId: "p5", name: "Renovatie factuur eindafrekening.pdf", type: "pdf", folder: "Financieel", uploadedAt: "2026-03-03", size: "210 KB", category: "Financieel" },
  { id: "doc95", propertyId: "p5", name: "Renovatie foto's voor-na.zip", type: "zip", folder: "Foto's/Renovatie", uploadedAt: "2026-03-01", size: "28.5 MB", category: "Fotografie" },
  { id: "doc96", propertyId: "p5", name: "Airco Daikin handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2024-09-01", size: "4.5 MB", category: "Handleidingen" },
  { id: "doc97", propertyId: "p5", name: "Syndicus reglement.pdf", type: "pdf", folder: "Juridisch", uploadedAt: "2024-08-15", size: "1.5 MB", category: "Juridisch" },
  { id: "doc98", propertyId: "p5", name: "Basisakte appartementsgebouw.pdf", type: "pdf", folder: "Juridisch", uploadedAt: "2024-08-15", size: "3.2 MB", category: "Juridisch" },

  // ── p6 - Commercieel Pand Luik ────────────────────────────────────────────
  { id: "doc23", propertyId: "p6", name: "Brandveiligheidscertificaat.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2025-11-01", size: "0.5 MB", category: "Certificaten" },
  { id: "doc24", propertyId: "p6", name: "Commercieel huurcontract.pdf", type: "pdf", folder: "Contracten", uploadedAt: "2023-01-01", size: "312 KB", category: "Contracten" },
  { id: "doc25", propertyId: "p6", name: "Airco-installatie schema.dwg", type: "blueprint", folder: "HVAC", uploadedAt: "2023-01-01", size: "2.8 MB", category: "HVAC" },
  { id: "doc99", propertyId: "p6", name: "Plattegrond commercieel gelijkvloers.dwg", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2023-01-01", size: "5.6 MB", category: "Architectuur" },
  { id: "doc100", propertyId: "p6", name: "Plattegrond verdieping kantoren.dwg", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2023-01-01", size: "5.2 MB", category: "Architectuur" },
  { id: "doc101", propertyId: "p6", name: "Etalage gevel.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2023-01-01", size: "4.8 MB", category: "Fotografie" },
  { id: "doc102", propertyId: "p6", name: "Winkelruimte interieur.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2023-01-01", size: "4.2 MB", category: "Fotografie" },
  { id: "doc103", propertyId: "p6", name: "Kantoorruimte verdieping.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2023-01-01", size: "3.5 MB", category: "Fotografie" },
  { id: "doc104", propertyId: "p6", name: "Parkeergarage.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2023-01-01", size: "3.1 MB", category: "Fotografie" },
  { id: "doc105", propertyId: "p6", name: "Brandveiligheidsplan.pdf", type: "report", folder: "Veiligheid", uploadedAt: "2025-11-01", size: "2.8 MB", category: "Veiligheid" },
  { id: "doc106", propertyId: "p6", name: "Evacuatieplan.pdf", type: "blueprint", folder: "Veiligheid", uploadedAt: "2025-11-01", size: "1.2 MB", category: "Veiligheid" },
  { id: "doc107", propertyId: "p6", name: "Milieuvergunning klasse 2.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2023-01-01", size: "1.8 MB", category: "Certificaten" },
  { id: "doc108", propertyId: "p6", name: "Huurwaardering taxatie.pdf", type: "report", folder: "Financieel", uploadedAt: "2022-11-15", size: "4.5 MB", category: "Financieel" },
  { id: "doc109", propertyId: "p6", name: "Onderhoudscontract HVAC.docx", type: "word", folder: "HVAC", uploadedAt: "2025-01-01", size: "340 KB", category: "HVAC" },
  { id: "doc110", propertyId: "p6", name: "Jaarlijkse kosten overzicht.xlsx", type: "excel", folder: "Financieel", uploadedAt: "2026-01-15", size: "198 KB", category: "Financieel" },
  { id: "doc111", propertyId: "p6", name: "Toegangscontrolesysteem handleiding.pdf", type: "manual", folder: "Handleidingen", uploadedAt: "2023-01-01", size: "3.2 MB", category: "Handleidingen" },
  { id: "doc112", propertyId: "p6", name: "Lift onderhoudscertificaat.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2025-09-01", size: "0.6 MB", category: "Certificaten" },
  { id: "doc113", propertyId: "p6", name: "Kadasterplan.pdf", type: "blueprint", folder: "Juridisch", uploadedAt: "2022-06-01", size: "2.1 MB", category: "Juridisch" },
  { id: "doc114", propertyId: "p6", name: "Notarisakte aankoop.pdf", type: "pdf", folder: "Juridisch", uploadedAt: "2022-06-01", size: "8.4 MB", category: "Juridisch" },
  { id: "doc115", propertyId: "p6", name: "Video drone opname pand.mp4", type: "video", folder: "Media", uploadedAt: "2023-02-10", size: "178.3 MB", category: "Media" },
  { id: "doc116", propertyId: "p6", name: "Alle certificaten 2025.zip", type: "zip", folder: "Certificaten", uploadedAt: "2025-12-01", size: "8.2 MB", category: "Certificaten" },

  // ── p7 - Appartement Station Gent ─────────────────────────────────────────
  { id: "doc117", propertyId: "p7", name: "EPC-certificaat B.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2025-09-01", size: "1.1 MB", category: "Certificaten" },
  { id: "doc118", propertyId: "p7", name: "Keuringsattest elektriciteit.pdf", type: "certificate", folder: "Certificaten", uploadedAt: "2025-09-05", size: "0.8 MB", category: "Certificaten" },
  { id: "doc119", propertyId: "p7", name: "Plattegrond appartement.pdf", type: "blueprint", folder: "Architectuur/Plattegronden", uploadedAt: "2025-09-01", size: "2.2 MB", category: "Architectuur" },
  { id: "doc120", propertyId: "p7", name: "Woonkamer.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2025-09-01", size: "3.8 MB", category: "Fotografie" },
  { id: "doc121", propertyId: "p7", name: "Keuken.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2025-09-01", size: "3.4 MB", category: "Fotografie" },
  { id: "doc122", propertyId: "p7", name: "Slaapkamer.jpg", type: "photo", folder: "Foto's/Interieur", uploadedAt: "2025-09-01", size: "3.1 MB", category: "Fotografie" },
  { id: "doc123", propertyId: "p7", name: "Gevel stationswijk.jpg", type: "photo", folder: "Foto's/Exterieur", uploadedAt: "2025-09-01", size: "4.5 MB", category: "Fotografie" },
  { id: "doc124", propertyId: "p7", name: "Publicatie advertentie.docx", type: "word", folder: "Marketing", uploadedAt: "2025-09-10", size: "580 KB", category: "Marketing" },
  { id: "doc125", propertyId: "p7", name: "Schatting huurwaarde.pdf", type: "report", folder: "Financieel", uploadedAt: "2025-08-15", size: "1.8 MB", category: "Financieel" },
]

// ── Analytics ───────────────────────────────────────────────────────────────

export const analyticsData = {
  areaComparison: [
    { area: "Brussel Centrum", avgRent: 1400, yourRent: 1350, sqmPrice: 16.5, floor: 2, hasParking: false, hasElevator: true },
    { area: "Antwerpen Meir", avgRent: 1050, yourRent: 950, sqmPrice: 23.3, floor: 3, hasParking: false, hasElevator: false },
    { area: "Gent Korenmarkt", avgRent: 1700, yourRent: 1650, sqmPrice: 14.2, floor: 1, hasParking: true, hasElevator: true },
    { area: "Leuven Centrum", avgRent: 1750, yourRent: 1800, sqmPrice: 9.7, floor: null, hasParking: true, hasElevator: false },
    { area: "Brugge Markt", avgRent: 1150, yourRent: 1100, sqmPrice: 14.7, floor: 1, hasParking: false, hasElevator: false },
    { area: "Luik Centrum", avgRent: 3000, yourRent: 2800, sqmPrice: 15.0, floor: 0, hasParking: true, hasElevator: true },
  ],
  revenueHistory: [
    { month: "Okt", revenue: 8000 },
    { month: "Nov", revenue: 8000 },
    { month: "Dec", revenue: 8000 },
    { month: "Jan", revenue: 9850 },
    { month: "Feb", revenue: 9850 },
    { month: "Mrt", revenue: 9850 },
  ],
  occupancyRate: [
    { month: "Okt", rate: 100 },
    { month: "Nov", rate: 100 },
    { month: "Dec", rate: 83 },
    { month: "Jan", rate: 100 },
    { month: "Feb", rate: 100 },
    { month: "Mrt", rate: 83 },
  ],
  monthlyExpenses: [
    { month: "Okt", onderhoud: 450, verzekering: 380, belasting: 520, overig: 150 },
    { month: "Nov", onderhoud: 200, verzekering: 380, belasting: 520, overig: 80 },
    { month: "Dec", onderhoud: 1200, verzekering: 380, belasting: 520, overig: 300 },
    { month: "Jan", onderhoud: 350, verzekering: 380, belasting: 520, overig: 120 },
    { month: "Feb", onderhoud: 250, verzekering: 380, belasting: 520, overig: 90 },
    { month: "Mrt", onderhoud: 3900, verzekering: 380, belasting: 520, overig: 200 },
  ],
  rentPerSqm: [
    { property: "Grote Markt", pricePerSqm: 15.9, areaAvg: 16.5 },
    { property: "Meir", pricePerSqm: 21.1, areaAvg: 23.3 },
    { property: "Korenmarkt", pricePerSqm: 13.8, areaAvg: 14.2 },
    { property: "Naamsestraat", pricePerSqm: 10.0, areaAvg: 9.7 },
    { property: "Markt Brugge", pricePerSqm: 14.1, areaAvg: 14.7 },
    { property: "Sint-Lambert", pricePerSqm: 14.0, areaAvg: 15.0 },
  ],
  tenantSatisfaction: [
    { category: "Reactietijd", score: 4.2 },
    { category: "Onderhoud", score: 3.8 },
    { category: "Communicatie", score: 4.5 },
    { category: "Prijs/kwaliteit", score: 3.9 },
    { category: "Algemeen", score: 4.1 },
  ],
}

// ── Owners (management fee as percentage) ───────────────────────────────────

export const owners: Owner[] = [
  { id: "o1", name: "Marc Van den Berg", email: "marc.vdberg@email.be", phone: "+32 470 99 11 22", company: "VDB Vastgoed BVBA", avatar: "MV", photoUrl: "https://i.pravatar.cc/150?u=marc.vandenberg", managementFeePercent: 8, repairMandate: 500, notes: "Maandelijkse rapportage vereist. Voorkeur voor e-mail communicatie.", propertyIds: ["p1", "p2", "p7"] },
  { id: "o2", name: "Catherine Dubois", email: "c.dubois@email.be", phone: "+32 471 88 22 33", company: null, avatar: "CD", photoUrl: "https://i.pravatar.cc/150?u=catherine.dubois", managementFeePercent: 7, repairMandate: 300, notes: "Altijd telefonisch bereikbaar. Wil goedkeuring voor elke reparatie boven mandaat.", propertyIds: ["p3", "p4"] },
  { id: "o3", name: "Famille De Ridder", email: "deridder.immo@email.be", phone: "+32 472 77 33 44", company: "De Ridder Investments NV", avatar: "DR", photoUrl: "https://i.pravatar.cc/150?u=famille.deridder", managementFeePercent: 6, repairMandate: 1000, notes: "Professionele investeerder. Kwartaalrapportage. Hoog mandaat voor snelle afhandeling.", propertyIds: ["p5", "p6"] },
]

// ── Candidate Tenants ───────────────────────────────────────────────────────

export const candidateTenants: CandidateTenant[] = [
  { id: "ct1", name: "Lien Wouters", email: "lien.wouters@email.be", phone: "+32 470 11 22 33", avatar: "LW", photoUrl: "https://i.pravatar.cc/150?u=lien.wouters", familySituation: "Samenwonend, geen kinderen", monthlyIncome: 3200, pets: null, status: "pending", appliedForId: "p3", notes: "Beide partners werken voltijds. Goede referenties vorige verhuurder.", appliedAt: "2026-03-01" },
  { id: "ct2", name: "Ahmed El Mansouri", email: "ahmed.elm@email.be", phone: "+32 471 22 33 44", avatar: "AE", photoUrl: "https://i.pravatar.cc/150?u=ahmed.elmansouri", familySituation: "Alleenstaand", monthlyIncome: 2800, pets: "1 kat", status: "pending", appliedForId: "p3", notes: "IT-consultant, stabiel inkomen. Huisdier besproken met eigenaar.", appliedAt: "2026-03-02" },
  { id: "ct3", name: "Joke & Bart Claessens", email: "claessens.jb@email.be", phone: "+32 472 33 44 55", avatar: "JB", photoUrl: "https://i.pravatar.cc/150?u=joke.bart.claessens", familySituation: "Gehuwd, 2 kinderen (8 en 11)", monthlyIncome: 5500, pets: null, status: "approved", appliedForId: "p7", notes: "Zoeken grotere woning. Uitstekende betalingshistoriek bij huidige verhuurder.", appliedAt: "2026-02-20" },
  { id: "ct4", name: "Nina De Graef", email: "nina.degraef@email.be", phone: "+32 473 44 55 66", avatar: "ND", photoUrl: "https://i.pravatar.cc/150?u=nina.degraef", familySituation: "Alleenstaande moeder, 1 kind (4)", monthlyIncome: 2400, pets: null, status: "rejected", appliedForId: "p3", notes: "Inkomen onvoldoende voor gevraagde huurprijs (norm: 3x huur).", appliedAt: "2026-02-15" },
]

// ── Insurance Policies ──────────────────────────────────────────────────────

export const insurancePolicies: InsurancePolicy[] = [
  { id: "ins1", propertyId: "p1", holder: "owner", holderName: "Marc Van den Berg", company: "KBC Verzekeringen", policyNumber: "KBC-2024-001234", type: "Brand & Gebouw", annualPremium: 480, startDate: "2024-01-01", endDate: "2025-12-31" },
  { id: "ins2", propertyId: "p1", holder: "tenant", holderName: "Emma Janssens", company: "Ethias", policyNumber: "ETH-2024-005678", type: "Huurdersaansprakelijkheid", annualPremium: 120, startDate: "2024-06-01", endDate: "2025-05-31" },
  { id: "ins3", propertyId: "p4", holder: "owner", holderName: "Catherine Dubois", company: "AG Insurance", policyNumber: "AG-2024-009012", type: "Brand & Gebouw", annualPremium: 650, startDate: "2024-03-01", endDate: "2025-02-28" },
  { id: "ins4", propertyId: "p4", holder: "tenant", holderName: "Sophie De Smet", company: "KBC Verzekeringen", policyNumber: "KBC-2024-003456", type: "Huurdersaansprakelijkheid", annualPremium: 135, startDate: "2024-03-01", endDate: "2025-02-28" },
  { id: "ins5", propertyId: "p6", holder: "owner", holderName: "Famille De Ridder", company: "Baloise", policyNumber: "BAL-2023-007890", type: "Brand & Bedrijfsgebouw", annualPremium: 1200, startDate: "2023-01-01", endDate: "2025-12-31" },
  { id: "ins6", propertyId: "p5", holder: "owner", holderName: "Famille De Ridder", company: "AXA Belgium", policyNumber: "AXA-2024-002345", type: "Brand & Gebouw", annualPremium: 420, startDate: "2024-09-01", endDate: "2025-08-31" },
]

// ── Payment History ─────────────────────────────────────────────────────────

export const paymentHistory: Record<string, { onTime: number; late: number; score: number }> = {
  t1: { onTime: 20, late: 2, score: 91 },
  t2: { onTime: 14, late: 0, score: 100 },
  t3: { onTime: 22, late: 4, score: 85 },
  t4: { onTime: 16, late: 5, score: 76 },
  t5: { onTime: 36, late: 1, score: 97 },
}

// ── Inspections ─────────────────────────────────────────────────────────────

export type InspectionItem = {
  id: string
  room: string
  element: string
  condition: "goed" | "licht gebrek" | "gebrek" | "ernstig gebrek"
  description: string
  photoCount: number
  photoUrls?: string[]
  timestamp: string
  estimatedCost?: number
  dimensions?: string
  materials?: string
  meterReading?: string
}

export type PropertyInspection = {
  id: string
  propertyId: string
  type: "intrede" | "uittrede" | "tussentijds"
  date: string
  inspector: string
  status: "voltooid" | "in behandeling"
  items: InspectionItem[]
  generalNotes?: string
  floorPlanRef?: string
  meterReadings?: { type: string; value: string; unit: string }[]
  keyCount?: number
  signedByTenant?: boolean
  signedByOwner?: boolean
}

export const propertyInspections: PropertyInspection[] = [
  {
    id: "insp1",
    propertyId: "p1",
    type: "intrede",
    date: "2024-06-01T10:00:00Z",
    inspector: "Sarah van Dijk",
    status: "voltooid",
    generalNotes: "Appartement in zeer goede staat bij intrede. Enkele cosmetische aandachtspunten (kras raam, kalkaanslag kraan, schroefgaatjes). Alle toestellen functioneel getest. Meterstanden genoteerd. Huurder en eigenaar hebben plaatsbeschrijving ondertekend.",
    floorPlanRef: "Plattegrond - 2e verdieping.dwg",
    meterReadings: [
      { type: "Elektriciteit (dag)", value: "45.231", unit: "kWh" },
      { type: "Elektriciteit (nacht)", value: "12.847", unit: "kWh" },
      { type: "Gas", value: "1.823", unit: "m\u00B3" },
      { type: "Water", value: "234", unit: "m\u00B3" },
    ],
    keyCount: 4,
    signedByTenant: true,
    signedByOwner: true,
    items: [
      { id: "i1-1", room: "Woonkamer", element: "Muren", condition: "goed", description: "Muren in goede staat, recent geschilderd in RAL 9010 (zuiver wit). Geen scheuren, vlekken of beschadigingen zichtbaar.", photoCount: 2, photoUrls: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:05:00Z", dimensions: "5.2m x 3.8m, hoogte 2.70m", materials: "Gipspleister, latex verf RAL 9010" },
      { id: "i1-2", room: "Woonkamer", element: "Vloer", condition: "goed", description: "Parketvloer eiken, legpatroon visgraat. Geen krassen, deuken of verkleuring. Plinten intact.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:08:00Z", dimensions: "19.76 m\u00B2", materials: "Eiken parket visgraat, geolied" },
      { id: "i1-3", room: "Woonkamer", element: "Ramen", condition: "licht gebrek", description: "Dubbel glas HR++, PVC kaders. Kleine kras op linker raam (ca. 5cm), vermoedelijk bij vorige verhuizing. Alle ramen sluiten correct, geen tocht.", photoCount: 3, photoUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:12:00Z", estimatedCost: 0, materials: "PVC kaders, HR++ dubbel glas" },
      { id: "i1-4", room: "Woonkamer", element: "Verwarming", condition: "goed", description: "Plaatradiator type 22, thermostatisch ventiel aanwezig. Radiator warmt gelijkmatig op, geen lekkage.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:15:00Z", materials: "Stalen plaatradiator type 22, 1200x600mm" },
      { id: "i1-5", room: "Keuken", element: "Keukenblad", condition: "goed", description: "Granieten werkblad in perfecte staat. Geen krassen, vlekken of barsten. Spatrand intact.", photoCount: 2, photoUrls: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:20:00Z", dimensions: "3.20m x 0.60m", materials: "Zwart graniet, gepolijst, 30mm dik" },
      { id: "i1-6", room: "Keuken", element: "Toestellen", condition: "goed", description: "Siemens oven (model HB578G0S6), inductiekookplaat (4 zones) en vaatwasser (A+++). Alle toestellen functioneel getest op alle programma\u2019s.", photoCount: 3, photoUrls: ["https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:25:00Z", materials: "Siemens iQ500 serie, inbouw" },
      { id: "i1-7", room: "Keuken", element: "Kraan", condition: "licht gebrek", description: "Grohe keukenkraan met uittrekbare sproeier. Lichte kalkaanslag op de sproeikop. Functioneert correct, warm en koud water ok.", photoCount: 2, photoUrls: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:28:00Z", estimatedCost: 0, materials: "Grohe Minta uittrekbare sproeier, chroom" },
      { id: "i1-8", room: "Badkamer", element: "Sanitair", condition: "goed", description: "Villeroy & Boch wastafel met onderkast, inloopdouche met regendouchekop, hangtoilet met Geberit inbouwreservoir. Alles functioneel, geen lekkage.", photoCount: 3, photoUrls: ["https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:35:00Z", dimensions: "4.8 m\u00B2", materials: "V&B Subway 2.0, Geberit Sigma, Hansgrohe Raindance" },
      { id: "i1-9", room: "Badkamer", element: "Tegels", condition: "goed", description: "Vloertegels 60x60 antraciet, wandtegels 30x60 wit mat. Geen barsten, voegen intact en schoon.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:38:00Z", materials: "Vloer: Marazzi SistemN 60x60, Wand: Atlas Concorde 30x60" },
      { id: "i1-10", room: "Badkamer", element: "Ventilatie", condition: "goed", description: "Mechanische afzuiging (ventilator type C). Draait correct op 2 snelheden. Filter recent vervangen.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:40:00Z", materials: "Ventiduct Silent 100, debiet 95 m\u00B3/h" },
      { id: "i1-11", room: "Slaapkamer 1", element: "Muren", condition: "goed", description: "Muren geschilderd in lichtgrijs (RAL 7035). Geen beschadigingen. Twee stopcontacten per wand.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:45:00Z", dimensions: "4.0m x 3.5m, hoogte 2.70m", materials: "Gipspleister, latex verf RAL 7035" },
      { id: "i1-12", room: "Slaapkamer 1", element: "Vloer", condition: "goed", description: "Laminaat Quick-Step Impressive, eiken naturel. Goede staat, geen beschadigingen of opbolling.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:48:00Z", dimensions: "14.0 m\u00B2", materials: "Quick-Step Impressive IM1848" },
      { id: "i1-13", room: "Slaapkamer 1", element: "Ramen", condition: "goed", description: "Groot raam met rolluik (elektrisch). Raam sluit goed, rolluik functioneert op alle standen.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:50:00Z", materials: "PVC kader, HR++ glas, elektrisch rolluik Somfy" },
      { id: "i1-14", room: "Slaapkamer 1", element: "Stopcontacten", condition: "goed", description: "4 dubbele stopcontacten, 1 TV-aansluiting, 1 netwerkaansluiting. Alle getest en functioneel.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:52:00Z", materials: "Niko Intense wit" },
      { id: "i1-15", room: "Slaapkamer 2", element: "Muren", condition: "licht gebrek", description: "3 kleine schroefgaatjes in linkermuur (vorige bewoner had planken opgehangen). Verder muren in goede staat, geschilderd RAL 9010.", photoCount: 2, photoUrls: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:55:00Z", estimatedCost: 25, dimensions: "3.5m x 3.2m, hoogte 2.70m", materials: "Gipspleister, latex verf RAL 9010" },
      { id: "i1-16", room: "Slaapkamer 2", element: "Deuren", condition: "goed", description: "Binnendeur spaanplaat wit gelakt. Sluit goed, slot en klink functioneren.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"], timestamp: "2024-06-01T10:57:00Z", materials: "Spaanplaat binnendeur, wit gelakt, Litto slot" },
      { id: "i1-17", room: "Hal", element: "Voordeur", condition: "goed", description: "Veiligheidsdeur met 3-puntssluiting. Sluit correct, geen beschadigingen. Deurspion en brievenbus aanwezig.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=300&fit=crop"], timestamp: "2024-06-01T11:00:00Z", materials: "Stalen veiligheidsdeur, 3-puntssluiting, RAL 7016" },
      { id: "i1-18", room: "Hal", element: "Parlofoon", condition: "goed", description: "Video-intercom met kleurenscherm. Deurbel, camera en deuropener getest en functioneel.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop"], timestamp: "2024-06-01T11:03:00Z", materials: "Niko Home Control video-intercom" },
      { id: "i1-19", room: "Hal", element: "Meterkast", condition: "goed", description: "Meterkast netjes georganiseerd. 12 zekeringen, aardlekbeveiliging 300mA + 30mA. Alle circuits gelabeld.", photoCount: 1, photoUrls: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop"], timestamp: "2024-06-01T11:05:00Z", meterReading: "Zekeringkast 12 groepen, 40A hoofdzekering" },
    ],
  },
  {
    id: "insp2",
    propertyId: "p4",
    type: "intrede",
    date: "2024-03-01T09:00:00Z",
    inspector: "Mark Hendricks",
    status: "voltooid",
    items: [
      { id: "i2-1", room: "Woonkamer", element: "Muren", condition: "goed", description: "Pas geschilderd, uitstekende staat", photoCount: 2, timestamp: "2024-03-01T09:10:00Z" },
      { id: "i2-2", room: "Woonkamer", element: "Vloer", condition: "licht gebrek", description: "Kleine kras in hardhouten vloer bij ingang", photoCount: 2, timestamp: "2024-03-01T09:15:00Z" },
      { id: "i2-3", room: "Woonkamer", element: "Open haard", condition: "goed", description: "Schouw en haard in werkende staat", photoCount: 2, timestamp: "2024-03-01T09:20:00Z" },
      { id: "i2-4", room: "Woonkamer", element: "Ramen", condition: "goed", description: "Dubbel glas, goede isolatie", photoCount: 1, timestamp: "2024-03-01T09:22:00Z" },
      { id: "i2-5", room: "Keuken", element: "Muren", condition: "goed", description: "Spatwand en muren proper", photoCount: 1, timestamp: "2024-03-01T09:30:00Z" },
      { id: "i2-6", room: "Keuken", element: "Toestellen", condition: "gebrek", description: "Vriesvak koelkast sluit niet goed - rubbers versleten", photoCount: 3, timestamp: "2024-03-01T09:35:00Z" },
      { id: "i2-7", room: "Keuken", element: "Kraan", condition: "goed", description: "Keukenkraan functioneert correct", photoCount: 1, timestamp: "2024-03-01T09:37:00Z" },
      { id: "i2-8", room: "Keuken", element: "Keukenblad", condition: "goed", description: "Werkblad zonder beschadigingen", photoCount: 1, timestamp: "2024-03-01T09:39:00Z" },
      { id: "i2-9", room: "Badkamer 1", element: "Sanitair", condition: "goed", description: "Alles functioneel", photoCount: 2, timestamp: "2024-03-01T09:45:00Z" },
      { id: "i2-10", room: "Badkamer 1", element: "Voegen", condition: "licht gebrek", description: "Siliconen rond bad beginnen los te komen", photoCount: 3, timestamp: "2024-03-01T09:50:00Z" },
      { id: "i2-11", room: "Badkamer 1", element: "Douche", condition: "goed", description: "Douchewand en kraan in orde", photoCount: 1, timestamp: "2024-03-01T09:52:00Z" },
      { id: "i2-12", room: "Badkamer 1", element: "Toilet", condition: "goed", description: "Spoeling en afsluiting werken", photoCount: 1, timestamp: "2024-03-01T09:54:00Z" },
      { id: "i2-13", room: "Badkamer 2", element: "Sanitair", condition: "goed", description: "Douche en wastafel in orde", photoCount: 1, timestamp: "2024-03-01T09:55:00Z" },
      { id: "i2-14", room: "Slaapkamer 1", element: "Raam", condition: "goed", description: "Dubbel glas, goede isolatie", photoCount: 1, timestamp: "2024-03-01T10:05:00Z" },
      { id: "i2-15", room: "Slaapkamer 1", element: "Sloten", condition: "goed", description: "Deurslot functioneert correct", photoCount: 1, timestamp: "2024-03-01T10:07:00Z" },
      { id: "i2-16", room: "Slaapkamer 2", element: "Vloer", condition: "goed", description: "Tapijt in goede staat", photoCount: 1, timestamp: "2024-03-01T10:10:00Z" },
      { id: "i2-17", room: "Slaapkamer 3", element: "Muren", condition: "licht gebrek", description: "Vochtplek in hoek bij raam - vermoedelijk condensatie", photoCount: 2, timestamp: "2024-03-01T10:15:00Z" },
      { id: "i2-18", room: "Tuin", element: "Terras", condition: "gebrek", description: "Meerdere tegels verzakt, struikelgevaar", photoCount: 4, timestamp: "2024-03-01T10:30:00Z" },
      { id: "i2-19", room: "Tuin", element: "Omheining", condition: "licht gebrek", description: "Tuinhek scharniert stroef", photoCount: 1, timestamp: "2024-03-01T10:35:00Z" },
      { id: "i2-20", room: "Garage", element: "Poort", condition: "goed", description: "Elektrische garagepoort functioneert", photoCount: 1, timestamp: "2024-03-01T10:40:00Z" },
      { id: "i2-21", room: "Garage", element: "Vloer", condition: "licht gebrek", description: "Olievlek op betonvloer", photoCount: 1, timestamp: "2024-03-01T10:42:00Z" },
      { id: "i2-22", room: "Garage", element: "Stopcontacten", condition: "goed", description: "Alle stopcontacten functioneel", photoCount: 1, timestamp: "2024-03-01T10:44:00Z" },
    ],
  },
  {
    id: "insp3",
    propertyId: "p5",
    type: "tussentijds",
    date: "2026-02-15T14:00:00Z",
    inspector: "Lisa Vermeer",
    status: "voltooid",
    items: [
      { id: "i3-1", room: "Woonkamer", element: "Muren", condition: "licht gebrek", description: "Verfschade naast TV-hoek, waarschijnlijk door meubels", photoCount: 2, timestamp: "2026-02-15T14:10:00Z", estimatedCost: 150 },
      { id: "i3-2", room: "Woonkamer", element: "Vloer", condition: "goed", description: "Laminaat nog in goede staat", photoCount: 1, timestamp: "2026-02-15T14:15:00Z" },
      { id: "i3-3", room: "Woonkamer", element: "Ramen", condition: "goed", description: "Ramen sluiten goed", photoCount: 1, timestamp: "2026-02-15T14:18:00Z" },
      { id: "i3-4", room: "Keuken", element: "Muren", condition: "gebrek", description: "Vetspetters op muur achter kookplaat - niet afwasbaar", photoCount: 2, timestamp: "2026-02-15T14:25:00Z", estimatedCost: 200 },
      { id: "i3-5", room: "Keuken", element: "Afvoer", condition: "ernstig gebrek", description: "Gootsteen loopt traag leeg - vermoeden verstopping", photoCount: 1, timestamp: "2026-02-15T14:30:00Z", estimatedCost: 180 },
      { id: "i3-6", room: "Keuken", element: "Vensterbank", condition: "licht gebrek", description: "Waterschade op vensterbank door condensatie", photoCount: 1, timestamp: "2026-02-15T14:33:00Z", estimatedCost: 80 },
      { id: "i3-7", room: "Badkamer", element: "Tegels", condition: "gebrek", description: "Gebarsten tegel naast douchedeur - scherpe rand", photoCount: 3, timestamp: "2026-02-15T14:40:00Z", estimatedCost: 120 },
      { id: "i3-8", room: "Badkamer", element: "Ventilatie", condition: "ernstig gebrek", description: "Afzuiging werkt niet - schimmelvorming zichtbaar", photoCount: 4, timestamp: "2026-02-15T14:45:00Z", estimatedCost: 350 },
      { id: "i3-9", room: "Badkamer", element: "Douche", condition: "licht gebrek", description: "Douchekop lekt licht bij afsluiting", photoCount: 1, timestamp: "2026-02-15T14:48:00Z", estimatedCost: 45 },
      { id: "i3-10", room: "Badkamer", element: "Toilet", condition: "goed", description: "Toilet functioneert correct", photoCount: 1, timestamp: "2026-02-15T14:50:00Z" },
      { id: "i3-11", room: "Slaapkamer", element: "Raam", condition: "licht gebrek", description: "Rolgordijn blijft hangen bij openen", photoCount: 1, timestamp: "2026-02-15T14:55:00Z", estimatedCost: 60 },
      { id: "i3-12", room: "Slaapkamer", element: "Stopcontact", condition: "gebrek", description: "Stopcontact naast bed werkt niet", photoCount: 1, timestamp: "2026-02-15T15:00:00Z", estimatedCost: 90 },
      { id: "i3-13", room: "Slaapkamer", element: "Deuren", condition: "goed", description: "Deur en slot functioneren correct", photoCount: 1, timestamp: "2026-02-15T15:02:00Z" },
      { id: "i3-14", room: "Hal", element: "Verlichting", condition: "licht gebrek", description: "Plafondlamp flikkert", photoCount: 1, timestamp: "2026-02-15T15:05:00Z", estimatedCost: 35 },
      { id: "i3-15", room: "Hal", element: "Sloten", condition: "goed", description: "Voordeurslot functioneert", photoCount: 1, timestamp: "2026-02-15T15:07:00Z" },
    ],
  },
  {
    id: "insp4",
    propertyId: "p1",
    type: "tussentijds",
    date: "2025-12-10T11:00:00Z",
    inspector: "Sarah van Dijk",
    status: "voltooid",
    items: [
      { id: "i4-1", room: "Woonkamer", element: "Muren", condition: "goed", description: "Geen verandering sinds intrede", photoCount: 1, timestamp: "2025-12-10T11:05:00Z" },
      { id: "i4-2", room: "Keuken", element: "Toestellen", condition: "licht gebrek", description: "Deurgreep vaatwasser los", photoCount: 2, timestamp: "2025-12-10T11:15:00Z" },
      { id: "i4-3", room: "Badkamer", element: "Voegen", condition: "licht gebrek", description: "Voegen douche beginnen te verkleuren", photoCount: 2, timestamp: "2025-12-10T11:25:00Z" },
      { id: "i4-4", room: "Slaapkamer 1", element: "Raam", condition: "goed", description: "Ramen sluiten goed", photoCount: 1, timestamp: "2025-12-10T11:30:00Z" },
      { id: "i4-5", room: "Slaapkamer 2", element: "Muren", condition: "licht gebrek", description: "Schroefgaatjes nog aanwezig", photoCount: 1, timestamp: "2025-12-10T11:35:00Z" },
      { id: "i4-6", room: "Hal", element: "Vloer", condition: "goed", description: "Tegels in orde", photoCount: 1, timestamp: "2025-12-10T11:40:00Z" },
    ],
  },
]

// ── App Updates (for top header dropdown) ───────────────────────────────────

export const appUpdates = [
  { id: "upd1", title: "Contract Dashboard toegevoegd", description: "Nieuw overzicht van alle actieve contracten met vervaldatums.", date: "2026-03-05", type: "feature" as const },
  { id: "upd2", title: "Interventie workflow", description: "Volledige offerte- en goedkeuringsworkflow voor interventies.", date: "2026-03-03", type: "feature" as const },
  { id: "upd3", title: "Vaklui per regio", description: "Filter vaklui op regio en specialisme.", date: "2026-03-01", type: "improvement" as const },
  { id: "upd4", title: "Huurprijs uitsplitsing", description: "Basishuur en gemeenschappelijke kosten apart zichtbaar.", date: "2026-02-28", type: "improvement" as const },
  { id: "upd5", title: "Bugfix: kaart laden", description: "Probleem opgelost waarbij de pandenkaart niet laadde in donkere modus.", date: "2026-02-25", type: "bugfix" as const },
]

// ── Manuals (for top header dropdown) ───────────────────────────────────────

export const appManuals = [
  { id: "man1", title: "Aan de slag met AedificaPro", description: "Basishandleiding voor nieuwe gebruikers", category: "Basis" },
  { id: "man2", title: "Pandenbeheer", description: "Panden toevoegen, bewerken en beheren", category: "Beheer" },
  { id: "man3", title: "Huurdersbeheer", description: "Huurders, kandidaten en contracten", category: "Beheer" },
  { id: "man4", title: "Tickets & Interventies", description: "Onderhoudsmeldingen en werkorders afhandelen", category: "Onderhoud" },
  { id: "man5", title: "Facturatie & Betalingen", description: "Facturen, betalingsopvolging en BTW", category: "Financieel" },
  { id: "man6", title: "Rapportage & Analyse", description: "Dashboards en financiele rapporten", category: "Analyse" },
]
