export type Property = {
  id: string
  name: string
  address: string
  city: string
  zipCode: string
  type: "apartment" | "house" | "studio" | "commercial"
  bedrooms: number
  bathrooms: number
  sqm: number
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
}

export type Tenant = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  avatar: string
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
  specialty: "electrician" | "plumber" | "hvac" | "general" | "painter" | "locksmith"
  phone: string
  email: string
  available: boolean
  rating: number
}

export type Invoice = {
  id: string
  propertyId: string
  tenantId: string
  month: string
  rent: number
  electricity: number
  water: number
  gas: number
  internet: number
  maintenance: number
  total: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
}

export type Utility = {
  name: string
  monthlyCost: number
}

export type Intervention = {
  id: string
  propertyId: string
  title: string
  description: string
  scheduledDate: string
  workerId: string
  workerName: string
  status: "planned" | "in-progress" | "completed"
  cost: number
}

export type TeamMember = {
  id: string
  name: string
  role: "admin" | "manager" | "agent"
  email: string
  phone: string
  avatar: string
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
  type: "datasheet" | "image" | "blueprint" | "manual" | "certificate" | "report"
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
  monthlyFee: number
  repairMandate: number
  notes: string
  propertyIds: string[]
}

export type CandidateTenant = {
  id: string
  name: string
  email: string
  phone: string
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

export const properties: Property[] = [
  {
    id: "p1",
    name: "Appartement Grote Markt",
    address: "Grote Markt 12",
    city: "Brussel",
    zipCode: "1000",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 85,
    monthlyRent: 1350,
    status: "occupied",
    totalRevenue: 32400,
    imageGradient: "from-amber-400 to-orange-600",
    ownerId: "o1",
    lat: 50.8467,
    lng: 4.3525,
    leaseStart: "2024-06-01",
    leaseEnd: "2026-05-31",
    tenant: {
      id: "t1",
      name: "Emma Janssens",
      email: "emma.janssens@email.be",
      phone: "+32 470 12 34 56",
      address: "Grote Markt 12, 1000 Brussel",
      avatar: "EJ",
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
    bedrooms: 1,
    bathrooms: 1,
    sqm: 45,
    monthlyRent: 950,
    status: "occupied",
    totalRevenue: 22800,
    imageGradient: "from-blue-400 to-indigo-600",
    ownerId: "o1",
    lat: 51.2194,
    lng: 4.4025,
    leaseStart: "2025-01-01",
    leaseEnd: "2026-12-31",
    tenant: {
      id: "t2",
      name: "Lucas Peeters",
      email: "lucas.p@email.be",
      phone: "+32 471 23 45 67",
      address: "Meir 78, 2000 Antwerpen",
      avatar: "LP",
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
    bedrooms: 3,
    bathrooms: 2,
    sqm: 120,
    monthlyRent: 1650,
    status: "available",
    totalRevenue: 39600,
    imageGradient: "from-emerald-400 to-teal-600",
    ownerId: "o2",
    lat: 51.0543,
    lng: 3.7247,
    leaseStart: null,
    leaseEnd: null,
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
    bedrooms: 4,
    bathrooms: 2,
    sqm: 180,
    monthlyRent: 1800,
    status: "occupied",
    totalRevenue: 43200,
    imageGradient: "from-violet-400 to-purple-600",
    ownerId: "o2",
    lat: 50.8798,
    lng: 4.7005,
    leaseStart: "2024-03-01",
    leaseEnd: "2026-02-28",
    tenant: {
      id: "t3",
      name: "Sophie De Smet",
      email: "sophie.desmet@email.be",
      phone: "+32 472 34 56 78",
      address: "Naamsestraat 44, 3000 Leuven",
      avatar: "SD",
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
    bedrooms: 2,
    bathrooms: 1,
    sqm: 78,
    monthlyRent: 1100,
    status: "maintenance",
    totalRevenue: 26400,
    imageGradient: "from-rose-400 to-pink-600",
    ownerId: "o3",
    lat: 51.2093,
    lng: 3.2247,
    leaseStart: "2024-09-01",
    leaseEnd: "2026-08-31",
    tenant: {
      id: "t4",
      name: "Thomas Willems",
      email: "t.willems@email.be",
      phone: "+32 473 45 67 89",
      address: "Markt 22, 8000 Brugge",
      avatar: "TW",
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
    bedrooms: 0,
    bathrooms: 1,
    sqm: 200,
    monthlyRent: 2800,
    status: "occupied",
    totalRevenue: 67200,
    imageGradient: "from-cyan-400 to-blue-600",
    ownerId: "o3",
    lat: 50.6451,
    lng: 5.5734,
    leaseStart: "2023-01-01",
    leaseEnd: "2027-12-31",
    tenant: {
      id: "t5",
      name: "Dupont Consulting BVBA",
      email: "info@dupontconsulting.be",
      phone: "+32 4 123 45 67",
      address: "Place Saint-Lambert 8, 4000 Luik",
      avatar: "DC",
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
    bedrooms: 2,
    bathrooms: 1,
    sqm: 92,
    monthlyRent: 1250,
    status: "new",
    totalRevenue: 0,
    imageGradient: "from-slate-400 to-gray-600",
    ownerId: "o1",
    lat: 51.0259,
    lng: 4.4776,
    leaseStart: null,
    leaseEnd: null,
    tenant: null,
    utilities: [],
  },
]

export const tenants: Tenant[] = properties
  .filter((p) => p.tenant)
  .map((p) => p.tenant!)

export const tickets: Ticket[] = [
  {
    id: "tk1",
    propertyId: "p1",
    tenantId: "t1",
    tenantName: "Emma Janssens",
    title: "Keukenkraan lekt",
    description: "De keukenkraan druppelt al 2 dagen constant.",
    category: "plumbing",
    priority: "medium",
    status: "open",
    createdAt: "2026-03-01T10:30:00Z",
    updatedAt: "2026-03-01T10:30:00Z",
    assignedTo: null,
  },
  {
    id: "tk2",
    propertyId: "p4",
    tenantId: "t3",
    tenantName: "Sophie De Smet",
    title: "Verwarming werkt niet in slaapkamer",
    description: "De radiator in de hoofdslaapkamer verwarmt niet. Thermostaat geeft foutcode E04.",
    category: "hvac",
    priority: "high",
    status: "in-progress",
    createdAt: "2026-02-28T08:15:00Z",
    updatedAt: "2026-03-02T14:00:00Z",
    assignedTo: "w3",
  },
  {
    id: "tk3",
    propertyId: "p5",
    tenantId: "t4",
    tenantName: "Thomas Willems",
    title: "Badkamerverlichting kapot",
    description: "Het plafondlicht in de badkamer doet het niet meer. Lamp vervangen maar nog steeds geen licht.",
    category: "electrical",
    priority: "medium",
    status: "open",
    createdAt: "2026-03-03T16:45:00Z",
    updatedAt: "2026-03-03T16:45:00Z",
    assignedTo: null,
  },
  {
    id: "tk4",
    propertyId: "p2",
    tenantId: "t2",
    tenantName: "Lucas Peeters",
    title: "Voordeurslot klemt",
    description: "Het voordeurslot werkt niet goed. Sleutel blijft vastzitten bij het draaien.",
    category: "other",
    priority: "urgent",
    status: "in-progress",
    createdAt: "2026-03-04T07:00:00Z",
    updatedAt: "2026-03-04T09:30:00Z",
    assignedTo: "w6",
  },
  {
    id: "tk5",
    propertyId: "p1",
    tenantId: "t1",
    tenantName: "Emma Janssens",
    title: "Vaatwasser maakt lawaai",
    description: "De vaatwasser maakt een luid knarsgend geluid tijdens de wascyclus.",
    category: "appliance",
    priority: "low",
    status: "resolved",
    createdAt: "2026-02-15T11:20:00Z",
    updatedAt: "2026-02-20T15:00:00Z",
    assignedTo: "w4",
  },
  {
    id: "tk6",
    propertyId: "p6",
    tenantId: "t5",
    tenantName: "Dupont Consulting BVBA",
    title: "Airco koelt niet",
    description: "De airconditioningunit in het hoofdkantoor blaast warme lucht.",
    category: "hvac",
    priority: "high",
    status: "open",
    createdAt: "2026-03-05T09:00:00Z",
    updatedAt: "2026-03-05T09:00:00Z",
    assignedTo: null,
  },
]

export const messages: Message[] = [
  {
    id: "m1",
    propertyId: "p1",
    sender: "Emma Janssens",
    senderRole: "tenant",
    content: "Hallo, de loodgieter is langs geweest maar ik was niet thuis. Kunnen we een nieuwe afspraak maken?",
    timestamp: "2026-03-04T14:30:00Z",
    read: false,
  },
  {
    id: "m2",
    propertyId: "p1",
    sender: "Vastgoedbeheerder",
    senderRole: "owner",
    content: "Natuurlijk, ik neem contact op met de loodgieter en laat u een nieuw tijdstip weten.",
    timestamp: "2026-03-04T15:10:00Z",
    read: true,
  },
  {
    id: "m3",
    propertyId: "p4",
    sender: "Sophie De Smet",
    senderRole: "tenant",
    content: "De verwarmingstechnicus heeft het probleem opgelost. Alles werkt nu weer. Bedankt!",
    timestamp: "2026-03-03T16:00:00Z",
    read: true,
  },
  {
    id: "m4",
    propertyId: "p2",
    sender: "Lucas Peeters",
    senderRole: "tenant",
    content: "De slotenmaker is er, maar zegt dat het hele slotmechanisme vervangen moet worden. Is dat goedgekeurd?",
    timestamp: "2026-03-04T10:15:00Z",
    read: false,
  },
  {
    id: "m5",
    propertyId: "p5",
    sender: "Thomas Willems",
    senderRole: "tenant",
    content: "Wanneer kan iemand naar het badkamerlicht komen kijken? Het is al een paar dagen zo.",
    timestamp: "2026-03-05T08:00:00Z",
    read: false,
  },
  {
    id: "m6",
    propertyId: "p6",
    sender: "Dupont Consulting BVBA",
    senderRole: "tenant",
    content: "Het airco-probleem is dringend, we hebben deze week vergaderingen met klanten. Gelieve prioriteit te geven.",
    timestamp: "2026-03-05T09:30:00Z",
    read: false,
  },
]

export const workers: Worker[] = [
  { id: "w1", name: "Jan De Vries", specialty: "plumber", phone: "+32 470 51 11 22", email: "jan.devries@diensten.be", available: true, rating: 4.8 },
  { id: "w2", name: "Pieter Smeets", specialty: "electrician", phone: "+32 471 52 22 33", email: "p.smeets@elektra.be", available: true, rating: 4.6 },
  { id: "w3", name: "Marco Claes", specialty: "hvac", phone: "+32 472 53 33 44", email: "m.claes@klimaat.be", available: false, rating: 4.9 },
  { id: "w4", name: "Erik Maes", specialty: "general", phone: "+32 473 54 44 55", email: "e.maes@onderhoud.be", available: true, rating: 4.5 },
  { id: "w5", name: "Willem Jacobs", specialty: "painter", phone: "+32 474 55 55 66", email: "w.jacobs@schilderwerk.be", available: true, rating: 4.7 },
  { id: "w6", name: "Henk Mertens", specialty: "locksmith", phone: "+32 475 56 66 77", email: "h.mertens@sloten.be", available: false, rating: 4.4 },
]

export const invoices: Invoice[] = [
  { id: "inv1", propertyId: "p1", tenantId: "t1", month: "Maart 2026", rent: 1350, electricity: 95, water: 35, gas: 65, internet: 45, maintenance: 0, total: 1590, status: "pending", dueDate: "2026-03-05" },
  { id: "inv2", propertyId: "p2", tenantId: "t2", month: "Maart 2026", rent: 950, electricity: 65, water: 25, gas: 0, internet: 45, maintenance: 0, total: 1085, status: "paid", dueDate: "2026-03-05" },
  { id: "inv3", propertyId: "p4", tenantId: "t3", month: "Maart 2026", rent: 1800, electricity: 140, water: 50, gas: 110, internet: 50, maintenance: 250, total: 2400, status: "pending", dueDate: "2026-03-05" },
  { id: "inv4", propertyId: "p5", tenantId: "t4", month: "Maart 2026", rent: 1100, electricity: 80, water: 30, gas: 55, internet: 45, maintenance: 0, total: 1310, status: "overdue", dueDate: "2026-03-01" },
  { id: "inv5", propertyId: "p6", tenantId: "t5", month: "Maart 2026", rent: 2800, electricity: 250, water: 60, gas: 150, internet: 85, maintenance: 0, total: 3345, status: "paid", dueDate: "2026-03-05" },
  { id: "inv6", propertyId: "p1", tenantId: "t1", month: "Februari 2026", rent: 1350, electricity: 102, water: 38, gas: 78, internet: 45, maintenance: 0, total: 1613, status: "paid", dueDate: "2026-02-05" },
  { id: "inv7", propertyId: "p2", tenantId: "t2", month: "Februari 2026", rent: 950, electricity: 70, water: 28, gas: 0, internet: 45, maintenance: 0, total: 1093, status: "paid", dueDate: "2026-02-05" },
  { id: "inv8", propertyId: "p4", tenantId: "t3", month: "Februari 2026", rent: 1800, electricity: 145, water: 52, gas: 120, internet: 50, maintenance: 0, total: 2167, status: "paid", dueDate: "2026-02-05" },
]

export const interventions: Intervention[] = [
  { id: "int1", propertyId: "p5", title: "Volledige badkamerrenovatie", description: "Complete renovatie van sanitair en betegeling", scheduledDate: "2026-03-15", workerId: "w4", workerName: "Erik Maes", status: "planned", cost: 3500 },
  { id: "int2", propertyId: "p1", title: "Jaarlijks ketelonderhoud", description: "Jaarlijkse service van de centrale verwarmingsketel", scheduledDate: "2026-03-20", workerId: "w3", workerName: "Marco Claes", status: "planned", cost: 250 },
  { id: "int3", propertyId: "p4", title: "Buitenschilderwerk", description: "Schilderen van buitengevel en raamkozijnen", scheduledDate: "2026-04-01", workerId: "w5", workerName: "Willem Jacobs", status: "planned", cost: 4200 },
  { id: "int4", propertyId: "p3", title: "Inspectie voor verhuur", description: "Volledige inspectie van het pand voor nieuwe huurders", scheduledDate: "2026-03-10", workerId: "w4", workerName: "Erik Maes", status: "in-progress", cost: 150 },
]

export const teamMembers: TeamMember[] = [
  { id: "tm1", name: "Sarah van Dijk", role: "admin", email: "sarah@aedificapro.be", phone: "+32 470 70 00 11", avatar: "SD", properties: 6 },
  { id: "tm2", name: "Mark Hendricks", role: "manager", email: "mark@aedificapro.be", phone: "+32 471 70 00 22", avatar: "MH", properties: 4 },
  { id: "tm3", name: "Lisa Vermeer", role: "agent", email: "lisa@aedificapro.be", phone: "+32 472 70 00 33", avatar: "LV", properties: 2 },
]

export const emails: EmailMessage[] = [
  { id: "em1", from: "sarah@aedificapro.be", to: "jan.devries@diensten.be", subject: "Loodgieterswerk Grote Markt 12", body: "Dag Jan, we hebben een lekkende kraan op Grote Markt 12. Kun je deze week langskomen?", timestamp: "2026-03-04T11:00:00Z", read: true, propertyId: "p1" },
  { id: "em2", from: "jan.devries@diensten.be", to: "sarah@aedificapro.be", subject: "Re: Loodgieterswerk Grote Markt 12", body: "Dag Sarah, ik kan donderdagmiddag langskomen. Past dat?", timestamp: "2026-03-04T13:00:00Z", read: true, propertyId: "p1" },
  { id: "em3", from: "emma.janssens@email.be", to: "sarah@aedificapro.be", subject: "Vraag over huurbetaling", body: "Hallo, de nutsvoorzieningen lijken hoger deze maand. Kunt u een uitsplitsing geven?", timestamp: "2026-03-03T09:00:00Z", read: false, propertyId: "p1" },
  { id: "em4", from: "sarah@aedificapro.be", to: "t.willems@email.be", subject: "Update onderhoud - Markt Brugge", body: "Beste Thomas, we hebben een volledige badkamerrenovatie gepland op 15 maart. Zorg a.u.b. voor toegang.", timestamp: "2026-03-02T16:00:00Z", read: true, propertyId: "p5" },
]

export const asBuiltDocuments: AsBuiltDocument[] = [
  { id: "doc1", propertyId: "p1", name: "CV-ketel Remeha Avanta", type: "datasheet", uploadedAt: "2024-06-15", size: "2.4 MB", category: "Verwarming" },
  { id: "doc2", propertyId: "p1", name: "Plattegrond - 2e verdieping", type: "blueprint", uploadedAt: "2024-06-01", size: "5.1 MB", category: "Architectuur" },
  { id: "doc3", propertyId: "p1", name: "EPC-certificaat", type: "certificate", uploadedAt: "2024-05-20", size: "1.2 MB", category: "Certificaten" },
  { id: "doc4", propertyId: "p4", name: "Tuinonderhoudsplan", type: "report", uploadedAt: "2025-01-10", size: "0.8 MB", category: "Onderhoud" },
  { id: "doc5", propertyId: "p4", name: "Dakinspectie 2025", type: "report", uploadedAt: "2025-06-01", size: "3.5 MB", category: "Inspecties" },
  { id: "doc6", propertyId: "p3", name: "Slimme thermostaat handleiding", type: "manual", uploadedAt: "2025-03-15", size: "1.8 MB", category: "Verwarming" },
  { id: "doc7", propertyId: "p5", name: "Keukenapparatuur specificaties", type: "datasheet", uploadedAt: "2024-09-01", size: "2.1 MB", category: "Apparatuur" },
  { id: "doc8", propertyId: "p6", name: "Brandveiligheidscertificaat", type: "certificate", uploadedAt: "2025-11-01", size: "0.5 MB", category: "Certificaten" },
  { id: "doc9", propertyId: "p2", name: "Studio renovatie foto's", type: "image", uploadedAt: "2024-12-20", size: "15.3 MB", category: "Fotografie" },
]

export const analyticsData = {
  areaComparison: [
    { area: "Brussel Centrum", avgRent: 1400, yourRent: 1350, sqmPrice: 16.5 },
    { area: "Antwerpen Meir", avgRent: 1050, yourRent: 950, sqmPrice: 23.3 },
    { area: "Gent Korenmarkt", avgRent: 1700, yourRent: 1650, sqmPrice: 14.2 },
    { area: "Leuven Centrum", avgRent: 1750, yourRent: 1800, sqmPrice: 9.7 },
    { area: "Brugge Markt", avgRent: 1150, yourRent: 1100, sqmPrice: 14.7 },
    { area: "Luik Centrum", avgRent: 3000, yourRent: 2800, sqmPrice: 15.0 },
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


export const owners: Owner[] = [
  { id: "o1", name: "Marc Van den Berg", email: "marc.vdberg@email.be", phone: "+32 470 99 11 22", company: "VDB Vastgoed BVBA", monthlyFee: 150, repairMandate: 500, notes: "Maandelijkse rapportage vereist. Voorkeur voor e-mail communicatie.", propertyIds: ["p1", "p2", "p7"] },
  { id: "o2", name: "Catherine Dubois", email: "c.dubois@email.be", phone: "+32 471 88 22 33", company: null, monthlyFee: 120, repairMandate: 300, notes: "Altijd telefonisch bereikbaar. Wil goedkeuring voor elke reparatie boven mandaat.", propertyIds: ["p3", "p4"] },
  { id: "o3", name: "Famille De Ridder", email: "deridder.immo@email.be", phone: "+32 472 77 33 44", company: "De Ridder Investments NV", monthlyFee: 200, repairMandate: 1000, notes: "Professionele investeerder. Kwartaalrapportage. Hoog mandaat voor snelle afhandeling.", propertyIds: ["p5", "p6"] },
]

export const candidateTenants: CandidateTenant[] = [
  { id: "ct1", name: "Lien Wouters", email: "lien.wouters@email.be", phone: "+32 470 11 22 33", familySituation: "Samenwonend, geen kinderen", monthlyIncome: 3200, pets: null, status: "pending", appliedForId: "p3", notes: "Beide partners werken voltijds. Goede referenties vorige verhuurder.", appliedAt: "2026-03-01" },
  { id: "ct2", name: "Ahmed El Mansouri", email: "ahmed.elm@email.be", phone: "+32 471 22 33 44", familySituation: "Alleenstaand", monthlyIncome: 2800, pets: "1 kat", status: "pending", appliedForId: "p3", notes: "IT-consultant, stabiel inkomen. Huisdier besproken met eigenaar.", appliedAt: "2026-03-02" },
  { id: "ct3", name: "Joke & Bart Claessens", email: "claessens.jb@email.be", phone: "+32 472 33 44 55", familySituation: "Gehuwd, 2 kinderen (8 en 11)", monthlyIncome: 5500, pets: null, status: "approved", appliedForId: "p7", notes: "Zoeken grotere woning. Uitstekende betalingshistoriek bij huidige verhuurder.", appliedAt: "2026-02-20" },
  { id: "ct4", name: "Nina De Graef", email: "nina.degraef@email.be", phone: "+32 473 44 55 66", familySituation: "Alleenstaande moeder, 1 kind (4)", monthlyIncome: 2400, pets: null, status: "rejected", appliedForId: "p3", notes: "Inkomen onvoldoende voor gevraagde huurprijs (norm: 3x huur).", appliedAt: "2026-02-15" },
]

export const insurancePolicies: InsurancePolicy[] = [
  { id: "ins1", propertyId: "p1", holder: "owner", holderName: "Marc Van den Berg", company: "KBC Verzekeringen", policyNumber: "KBC-2024-001234", type: "Brand & Gebouw", annualPremium: 480, startDate: "2024-01-01", endDate: "2025-12-31" },
  { id: "ins2", propertyId: "p1", holder: "tenant", holderName: "Emma Janssens", company: "Ethias", policyNumber: "ETH-2024-005678", type: "Huurdersaansprakelijkheid", annualPremium: 120, startDate: "2024-06-01", endDate: "2025-05-31" },
  { id: "ins3", propertyId: "p4", holder: "owner", holderName: "Catherine Dubois", company: "AG Insurance", policyNumber: "AG-2024-009012", type: "Brand & Gebouw", annualPremium: 650, startDate: "2024-03-01", endDate: "2025-02-28" },
  { id: "ins4", propertyId: "p4", holder: "tenant", holderName: "Sophie De Smet", company: "KBC Verzekeringen", policyNumber: "KBC-2024-003456", type: "Huurdersaansprakelijkheid", annualPremium: 135, startDate: "2024-03-01", endDate: "2025-02-28" },
  { id: "ins5", propertyId: "p6", holder: "owner", holderName: "Famille De Ridder", company: "Baloise", policyNumber: "BAL-2023-007890", type: "Brand & Bedrijfsgebouw", annualPremium: 1200, startDate: "2023-01-01", endDate: "2025-12-31" },
  { id: "ins6", propertyId: "p5", holder: "owner", holderName: "Famille De Ridder", company: "AXA Belgium", policyNumber: "AXA-2024-002345", type: "Brand & Gebouw", annualPremium: 420, startDate: "2024-09-01", endDate: "2025-08-31" },
]

export const paymentHistory: Record<string, { onTime: number; late: number; score: number }> = {
  t1: { onTime: 20, late: 2, score: 91 },
  t2: { onTime: 14, late: 0, score: 100 },
  t3: { onTime: 22, late: 4, score: 85 },
  t4: { onTime: 16, late: 5, score: 76 },
  t5: { onTime: 36, late: 1, score: 97 },
}

export type InspectionItem = {
  id: string
  room: string
  element: string
  condition: "goed" | "licht gebrek" | "gebrek" | "ernstig gebrek"
  description: string
  photoCount: number
  timestamp: string
}

export type PropertyInspection = {
  id: string
  propertyId: string
  type: "intrede" | "uittrede" | "tussentijds"
  date: string
  inspector: string
  status: "voltooid" | "in behandeling"
  items: InspectionItem[]
}

export const propertyInspections: PropertyInspection[] = [
  {
    id: "insp1",
    propertyId: "p1",
    type: "intrede",
    date: "2024-06-01T10:00:00Z",
    inspector: "Sarah van Dijk",
    status: "voltooid",
    items: [
      { id: "i1-1", room: "Woonkamer", element: "Muren", condition: "goed", description: "Muren in goede staat, recent geschilderd", photoCount: 2, timestamp: "2024-06-01T10:05:00Z" },
      { id: "i1-2", room: "Woonkamer", element: "Vloer", condition: "goed", description: "Parketvloer zonder beschadigingen", photoCount: 1, timestamp: "2024-06-01T10:08:00Z" },
      { id: "i1-3", room: "Woonkamer", element: "Ramen", condition: "licht gebrek", description: "Kleine kras op linker raam, ca. 5cm", photoCount: 3, timestamp: "2024-06-01T10:12:00Z" },
      { id: "i1-4", room: "Woonkamer", element: "Verwarming", condition: "goed", description: "Radiator werkt correct", photoCount: 1, timestamp: "2024-06-01T10:15:00Z" },
      { id: "i1-5", room: "Keuken", element: "Keukenblad", condition: "goed", description: "Granieten werkblad in perfecte staat", photoCount: 2, timestamp: "2024-06-01T10:20:00Z" },
      { id: "i1-6", room: "Keuken", element: "Toestellen", condition: "goed", description: "Oven, kookplaat en vaatwasser functioneel", photoCount: 3, timestamp: "2024-06-01T10:25:00Z" },
      { id: "i1-7", room: "Keuken", element: "Kraan", condition: "licht gebrek", description: "Lichte kalkaanslag op keukenkraan", photoCount: 2, timestamp: "2024-06-01T10:28:00Z" },
      { id: "i1-8", room: "Badkamer", element: "Sanitair", condition: "goed", description: "Wastafel, douche en toilet in orde", photoCount: 3, timestamp: "2024-06-01T10:35:00Z" },
      { id: "i1-9", room: "Badkamer", element: "Tegels", condition: "goed", description: "Tegels zonder barsten of loskomende voegen", photoCount: 1, timestamp: "2024-06-01T10:38:00Z" },
      { id: "i1-10", room: "Slaapkamer 1", element: "Muren", condition: "goed", description: "Muren in goede staat", photoCount: 1, timestamp: "2024-06-01T10:45:00Z" },
      { id: "i1-11", room: "Slaapkamer 1", element: "Vloer", condition: "goed", description: "Laminaat in goede staat", photoCount: 1, timestamp: "2024-06-01T10:48:00Z" },
      { id: "i1-12", room: "Slaapkamer 2", element: "Muren", condition: "licht gebrek", description: "Kleine schroefgaatjes in muur (vorige bewoner)", photoCount: 2, timestamp: "2024-06-01T10:55:00Z" },
      { id: "i1-13", room: "Hal", element: "Voordeur", condition: "goed", description: "Deur en slot functioneren correct", photoCount: 1, timestamp: "2024-06-01T11:00:00Z" },
      { id: "i1-14", room: "Hal", element: "Parlofoon", condition: "goed", description: "Intercom werkt", photoCount: 1, timestamp: "2024-06-01T11:03:00Z" },
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
      { id: "i2-4", room: "Keuken", element: "Muren", condition: "goed", description: "Spatwand en muren proper", photoCount: 1, timestamp: "2024-03-01T09:30:00Z" },
      { id: "i2-5", room: "Keuken", element: "Toestellen", condition: "gebrek", description: "Vriesvak koelkast sluit niet goed - rubbers versleten", photoCount: 3, timestamp: "2024-03-01T09:35:00Z" },
      { id: "i2-6", room: "Badkamer 1", element: "Sanitair", condition: "goed", description: "Alles functioneel", photoCount: 2, timestamp: "2024-03-01T09:45:00Z" },
      { id: "i2-7", room: "Badkamer 1", element: "Voegen", condition: "licht gebrek", description: "Siliconen rond bad beginnen los te komen", photoCount: 3, timestamp: "2024-03-01T09:50:00Z" },
      { id: "i2-8", room: "Badkamer 2", element: "Sanitair", condition: "goed", description: "Douche en wastafel in orde", photoCount: 1, timestamp: "2024-03-01T09:55:00Z" },
      { id: "i2-9", room: "Slaapkamer 1", element: "Raam", condition: "goed", description: "Dubbel glas, goede isolatie", photoCount: 1, timestamp: "2024-03-01T10:05:00Z" },
      { id: "i2-10", room: "Slaapkamer 2", element: "Vloer", condition: "goed", description: "Tapijt in goede staat", photoCount: 1, timestamp: "2024-03-01T10:10:00Z" },
      { id: "i2-11", room: "Slaapkamer 3", element: "Muren", condition: "licht gebrek", description: "Vochtplek in hoek bij raam - vermoedelijk condensatie", photoCount: 2, timestamp: "2024-03-01T10:15:00Z" },
      { id: "i2-12", room: "Tuin", element: "Terras", condition: "gebrek", description: "Meerdere tegels verzakt, struikelgevaar", photoCount: 4, timestamp: "2024-03-01T10:30:00Z" },
      { id: "i2-13", room: "Tuin", element: "Omheining", condition: "licht gebrek", description: "Tuinhek scharniert stroef", photoCount: 1, timestamp: "2024-03-01T10:35:00Z" },
      { id: "i2-14", room: "Garage", element: "Poort", condition: "goed", description: "Elektrische garagepoort functioneert", photoCount: 1, timestamp: "2024-03-01T10:40:00Z" },
      { id: "i2-15", room: "Garage", element: "Vloer", condition: "licht gebrek", description: "Olievlek op betonvloer", photoCount: 1, timestamp: "2024-03-01T10:42:00Z" },
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
      { id: "i3-1", room: "Woonkamer", element: "Muren", condition: "licht gebrek", description: "Verfschade naast TV-hoek, waarschijnlijk door meubels", photoCount: 2, timestamp: "2026-02-15T14:10:00Z" },
      { id: "i3-2", room: "Woonkamer", element: "Vloer", condition: "goed", description: "Laminaat nog in goede staat", photoCount: 1, timestamp: "2026-02-15T14:15:00Z" },
      { id: "i3-3", room: "Keuken", element: "Muren", condition: "gebrek", description: "Vetspetters op muur achter kookplaat - niet afwasbaar", photoCount: 2, timestamp: "2026-02-15T14:25:00Z" },
      { id: "i3-4", room: "Keuken", element: "Afvoer", condition: "ernstig gebrek", description: "Gootsteen loopt traag leeg - vermoeden verstopping", photoCount: 1, timestamp: "2026-02-15T14:30:00Z" },
      { id: "i3-5", room: "Badkamer", element: "Tegels", condition: "gebrek", description: "Gebarsten tegel naast douchedeur - scherpe rand", photoCount: 3, timestamp: "2026-02-15T14:40:00Z" },
      { id: "i3-6", room: "Badkamer", element: "Ventilatie", condition: "ernstig gebrek", description: "Afzuiging werkt niet - schimmelvorming zichtbaar", photoCount: 4, timestamp: "2026-02-15T14:45:00Z" },
      { id: "i3-7", room: "Slaapkamer", element: "Raam", condition: "licht gebrek", description: "Rolgordijn blijft hangen bij openen", photoCount: 1, timestamp: "2026-02-15T14:55:00Z" },
      { id: "i3-8", room: "Slaapkamer", element: "Stopcontact", condition: "gebrek", description: "Stopcontact naast bed werkt niet", photoCount: 1, timestamp: "2026-02-15T15:00:00Z" },
      { id: "i3-9", room: "Hal", element: "Verlichting", condition: "licht gebrek", description: "Plafondlamp flikkert", photoCount: 1, timestamp: "2026-02-15T15:05:00Z" },
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
