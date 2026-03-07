import { jsPDF } from "jspdf"
import type { Property, Owner } from "./mock-data"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string | null): string {
  if (!d) return "___/___/______"
  return new Date(d).toLocaleDateString("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n)
}

const PAGE_W = 210
const MARGIN_L = 25
const MARGIN_R = 25
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R
const LINE_H = 5.5
const FOOTER_Y = 280

// ── PDF Generator ────────────────────────────────────────────────────────────

export function generateContractPdf(property: Property, owner: Owner): string {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const tenant = property.tenant
  let y = 0

  // ── Utilities ──────────────────────────────────────────────────────────────

  function checkPage(needed: number = 20) {
    if (y > FOOTER_Y - needed) {
      addFooter()
      doc.addPage()
      y = 30
      addHeader()
    }
  }

  function addHeader() {
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text("HUUROVEREENKOMST - VERTROUWELIJK", MARGIN_L, 15)
    doc.text(`${property.name} - ${property.address}, ${property.zipCode} ${property.city}`, PAGE_W - MARGIN_R, 15, { align: "right" })
    doc.setDrawColor(200)
    doc.line(MARGIN_L, 18, PAGE_W - MARGIN_R, 18)
    doc.setTextColor(0)
  }

  function addFooter() {
    const pageNum = doc.getNumberOfPages()
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.setDrawColor(200)
    doc.line(MARGIN_L, FOOTER_Y, PAGE_W - MARGIN_R, FOOTER_Y)
    doc.text(`Pagina ${pageNum}`, PAGE_W / 2, FOOTER_Y + 5, { align: "center" })
    doc.text("Opgesteld via AedificaPro", MARGIN_L, FOOTER_Y + 5)
    doc.text(new Date().toLocaleDateString("nl-BE"), PAGE_W - MARGIN_R, FOOTER_Y + 5, { align: "right" })
    doc.setTextColor(0)
  }

  function title(text: string) {
    checkPage(15)
    y += 4
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(30, 64, 120)
    doc.text(text, MARGIN_L, y)
    y += 2
    doc.setDrawColor(30, 64, 120)
    doc.setLineWidth(0.4)
    doc.line(MARGIN_L, y, MARGIN_L + CONTENT_W, y)
    doc.setLineWidth(0.2)
    doc.setDrawColor(0)
    doc.setTextColor(0)
    y += LINE_H
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9.5)
  }

  function para(text: string) {
    checkPage()
    const lines = doc.splitTextToSize(text, CONTENT_W)
    for (const line of lines) {
      checkPage()
      doc.text(line, MARGIN_L, y)
      y += LINE_H
    }
  }

  function field(label: string, value: string) {
    checkPage()
    doc.setFont("helvetica", "bold")
    doc.text(label + ":", MARGIN_L + 2, y)
    doc.setFont("helvetica", "normal")
    const labelW = doc.getTextWidth(label + ": ")
    doc.text(value, MARGIN_L + 2 + labelW, y)
    y += LINE_H
  }

  function bulletItem(text: string) {
    checkPage()
    doc.text("\u2022", MARGIN_L + 4, y)
    const lines = doc.splitTextToSize(text, CONTENT_W - 10)
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) checkPage()
      doc.text(lines[i], MARGIN_L + 10, y)
      y += LINE_H
    }
  }

  function gap(h: number = 3) {
    y += h
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1: Title page
  // ══════════════════════════════════════════════════════════════════════════

  // Decorative top bar
  doc.setFillColor(30, 64, 120)
  doc.rect(0, 0, PAGE_W, 40, "F")
  doc.setFillColor(42, 90, 160)
  doc.rect(0, 40, PAGE_W, 3, "F")

  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255)
  doc.text("HUUROVEREENKOMST", PAGE_W / 2, 22, { align: "center" })
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text("Woninghuurovereenkomst naar Belgisch Recht", PAGE_W / 2, 32, { align: "center" })

  doc.setTextColor(0)
  y = 55

  // Property box
  doc.setFillColor(245, 247, 250)
  doc.roundedRect(MARGIN_L, y, CONTENT_W, 32, 3, 3, "F")
  doc.setDrawColor(200, 210, 225)
  doc.roundedRect(MARGIN_L, y, CONTENT_W, 32, 3, 3, "S")

  y += 8
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 64, 120)
  doc.text(property.name, PAGE_W / 2, y, { align: "center" })
  y += 7
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(80)
  doc.text(`${property.address}, ${property.zipCode} ${property.city}`, PAGE_W / 2, y, { align: "center" })
  y += 6
  doc.text(`${property.sqm} m\u00B2 - ${property.bedrooms} slaapkamer(s) - ${property.bathrooms} badkamer(s) - EPC: ${property.epcScore}`, PAGE_W / 2, y, { align: "center" })
  y += 6
  doc.text(`Bouwjaar: ${property.buildingYear}${property.renovatedYear ? ` (gerenoveerd ${property.renovatedYear})` : ""}`, PAGE_W / 2, y, { align: "center" })

  doc.setTextColor(0)
  y += 15

  // Parties summary boxes (side by side)
  const boxW = (CONTENT_W - 8) / 2
  const boxH = 40

  // Verhuurder box
  doc.setFillColor(240, 248, 255)
  doc.roundedRect(MARGIN_L, y, boxW, boxH, 2, 2, "F")
  doc.setDrawColor(180, 210, 240)
  doc.roundedRect(MARGIN_L, y, boxW, boxH, 2, 2, "S")

  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 64, 120)
  doc.text("VERHUURDER", MARGIN_L + boxW / 2, y + 8, { align: "center" })
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60)
  doc.setFontSize(9)
  doc.text(owner.name, MARGIN_L + boxW / 2, y + 16, { align: "center" })
  if (owner.company) {
    doc.text(owner.company, MARGIN_L + boxW / 2, y + 22, { align: "center" })
  }
  doc.text(owner.email, MARGIN_L + boxW / 2, y + (owner.company ? 28 : 22), { align: "center" })
  doc.text(owner.phone, MARGIN_L + boxW / 2, y + (owner.company ? 34 : 28), { align: "center" })

  // Huurder box
  const box2X = MARGIN_L + boxW + 8
  doc.setFillColor(240, 255, 245)
  doc.roundedRect(box2X, y, boxW, boxH, 2, 2, "F")
  doc.setDrawColor(180, 230, 200)
  doc.roundedRect(box2X, y, boxW, boxH, 2, 2, "S")

  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 120, 64)
  doc.text("HUURDER", box2X + boxW / 2, y + 8, { align: "center" })
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60)
  if (tenant) {
    doc.text(tenant.name, box2X + boxW / 2, y + 16, { align: "center" })
    doc.text(tenant.email, box2X + boxW / 2, y + 22, { align: "center" })
    doc.text(tenant.phone, box2X + boxW / 2, y + 28, { align: "center" })
  } else {
    doc.text("(nog toe te wijzen)", box2X + boxW / 2, y + 20, { align: "center" })
  }

  y += boxH + 15

  // Financial summary
  doc.setFillColor(255, 252, 240)
  doc.roundedRect(MARGIN_L, y, CONTENT_W, 28, 2, 2, "F")
  doc.setDrawColor(230, 220, 180)
  doc.roundedRect(MARGIN_L, y, CONTENT_W, 28, 2, 2, "S")

  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(120, 100, 30)
  doc.text("FINANCIEEL OVERZICHT", MARGIN_L + 6, y + 7)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(80)
  const col1 = MARGIN_L + 6
  const col2 = MARGIN_L + CONTENT_W / 3
  const col3 = MARGIN_L + (CONTENT_W / 3) * 2

  doc.text(`Basishuur: ${formatCurrency(property.baseRent)}`, col1, y + 15)
  doc.text(`Gemeensch. kosten: ${formatCurrency(property.commonCosts)}`, col2, y + 15)
  doc.setFont("helvetica", "bold")
  doc.text(`Totaal/maand: ${formatCurrency(property.monthlyRent)}`, col3, y + 15)
  doc.setFont("helvetica", "normal")

  doc.text(`Huurperiode: ${formatDate(property.leaseStart)} - ${formatDate(property.leaseEnd)}`, col1, y + 22)
  doc.text(`Beheersvergoeding: ${owner.managementFeePercent}%`, col2, y + 22)
  doc.text(`Reparatiemandaat: ${formatCurrency(owner.repairMandate)}`, col3, y + 22)

  y += 38
  doc.setTextColor(0)

  // Lease period statement
  doc.setFontSize(10)
  doc.setFont("helvetica", "italic")
  para(`Ondertekend op datum van ${formatDate(property.leaseStart)} te ${property.city}, België.`)
  doc.setFont("helvetica", "normal")

  addFooter()

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2+: Contract articles
  // ══════════════════════════════════════════════════════════════════════════

  doc.addPage()
  y = 30
  addHeader()

  // ── ARTIKEL 1: Partijen ────────────────────────────────────────────────
  title("ARTIKEL 1 - PARTIJEN")
  para("Tussen de ondergetekenden:")
  gap()
  doc.setFont("helvetica", "bold")
  para("De Verhuurder:")
  doc.setFont("helvetica", "normal")
  field("Naam", owner.name)
  if (owner.company) field("Onderneming", owner.company)
  field("E-mail", owner.email)
  field("Telefoon", owner.phone)
  gap()
  doc.setFont("helvetica", "bold")
  para("De Huurder:")
  doc.setFont("helvetica", "normal")
  if (tenant) {
    field("Naam", tenant.name)
    field("E-mail", tenant.email)
    field("Telefoon", tenant.phone)
    field("Huidig adres", tenant.address)
  } else {
    para("(Nog niet toegewezen)")
  }
  gap()
  para("Hierna gezamenlijk aangeduid als \"de Partijen\", wordt het volgende overeengekomen:")

  // ── ARTIKEL 2: Voorwerp van het Contract ──────────────────────────────
  title("ARTIKEL 2 - VOORWERP VAN HET CONTRACT")
  para(`De Verhuurder geeft in huur aan de Huurder, die aanvaardt, het hierna beschreven onroerend goed gelegen te:`)
  gap()
  field("Adres", `${property.address}, ${property.zipCode} ${property.city}`)
  field("Type", property.type === "apartment" ? "Appartement" : property.type === "house" ? "Woning" : property.type === "studio" ? "Studio" : "Commercieel pand")
  field("Bewoonbare oppervlakte", `${property.sqm} m\u00B2`)
  field("Slaapkamers", `${property.bedrooms}`)
  field("Badkamers", `${property.bathrooms}`)
  field("EPC-score", property.epcScore)
  field("Bouwjaar", `${property.buildingYear}`)
  if (property.renovatedYear) field("Gerenoveerd", `${property.renovatedYear}`)
  field("Verdieping", property.floor !== null ? `${property.floor}` : "N.v.t.")
  gap()

  para("Het gehuurde goed omvat de volgende faciliteiten:")
  if (property.hasParking) bulletItem("Parkeerplaats")
  if (property.hasGarage) bulletItem("Garage")
  if (property.hasElevator) bulletItem("Lift in het gebouw")
  if (property.utilities.length > 0) {
    for (const u of property.utilities) {
      bulletItem(`${u.name} (geschatte maandelijkse kost: ${formatCurrency(u.monthlyCost)})`)
    }
  }

  // ── ARTIKEL 3: Duur van de Huur ───────────────────────────────────────
  title("ARTIKEL 3 - DUUR VAN DE HUUR")
  para(`De huurovereenkomst wordt aangegaan voor een bepaalde duur, ingaande op ${formatDate(property.leaseStart)} en eindigend op ${formatDate(property.leaseEnd)}.`)
  gap()
  para("Bij het verstrijken van de huurperiode wordt de overeenkomst stilzwijgend verlengd voor opeenvolgende perioden van drie (3) jaar, tenzij \u00E9\u00E9n van de partijen ten minste zes (6) maanden v\u00F3\u00F3r het verstrijken van de lopende periode opzegt per aangetekend schrijven.")
  gap()
  para("De huurder heeft het recht om de huur op elk ogenblik op te zeggen mits inachtneming van een opzegtermijn van drie (3) maanden. In geval van vroegtijdige be\u00EBindiging gedurende de eerste driejarige periode is een opzegvergoeding verschuldigd conform de Belgische woninghuurwet.")

  // ── ARTIKEL 4: Huurprijs en Lasten ────────────────────────────────────
  title("ARTIKEL 4 - HUURPRIJS EN LASTEN")
  para("De maandelijkse huurprijs en bijhorende kosten worden als volgt vastgesteld:")
  gap()

  // Table-like layout
  const tableY = y
  doc.setFillColor(245, 247, 250)
  doc.roundedRect(MARGIN_L, tableY, CONTENT_W, 32, 2, 2, "F")
  doc.setDrawColor(200, 210, 225)
  doc.roundedRect(MARGIN_L, tableY, CONTENT_W, 32, 2, 2, "S")

  y = tableY + 7
  const tCol1 = MARGIN_L + 6
  const tCol2 = MARGIN_L + CONTENT_W - 6

  doc.text("Basishuur (netto):", tCol1, y)
  doc.text(formatCurrency(property.baseRent), tCol2, y, { align: "right" })
  y += LINE_H
  doc.text("Gemeenschappelijke kosten (provisie):", tCol1, y)
  doc.text(formatCurrency(property.commonCosts), tCol2, y, { align: "right" })
  y += LINE_H

  doc.setDrawColor(180)
  doc.line(tCol1, y - 1, tCol2, y - 1)
  y += 2

  doc.setFont("helvetica", "bold")
  doc.text("Totaal maandelijks te betalen:", tCol1, y)
  doc.text(formatCurrency(property.monthlyRent), tCol2, y, { align: "right" })
  doc.setFont("helvetica", "normal")
  y += LINE_H + 5

  gap()
  para(`De huurprijs wordt jaarlijks ge\u00EFndexeerd op de verjaardag van de inwerkingtreding van het contract, overeenkomstig de Belgische gezondheidsindex.`)
  gap()
  para(`De huurprijs is maandelijks verschuldigd en betaalbaar v\u00F3\u00F3r de eerste werkdag van elke maand, via overschrijving op het rekeningnummer van de Verhuurder.`)

  // ── ARTIKEL 5: Huurwaarborg ───────────────────────────────────────────
  title("ARTIKEL 5 - HUURWAARBORG")
  const warrantyAmount = property.baseRent * 2
  para(`Bij ondertekening van dit contract stort de Huurder een huurwaarborg ten bedrage van ${formatCurrency(warrantyAmount)} (twee maanden basishuur) op een geblokkeerde bankrekening op naam van de Huurder, overeenkomstig artikel 10 van de Woninghuurwet.`)
  gap()
  para("De huurwaarborg wordt vrijgegeven bij het einde van de huurovereenkomst, na aftrek van eventuele schade vastgesteld in de uittredende plaatsbeschrijving of openstaande huurachterstal.")

  // ── ARTIKEL 6: Plaatsbeschrijving ─────────────────────────────────────
  title("ARTIKEL 6 - PLAATSBESCHRIJVING")
  para("De partijen verbinden zich ertoe een omstandige plaatsbeschrijving op te maken bij intrede en uittrede, conform de Belgische woninghuurwet. Deze plaatsbeschrijving wordt opgesteld door een gezamenlijk aangestelde deskundige of in onderling akkoord tussen de partijen.")
  gap()
  para("De kosten van de plaatsbeschrijving worden gelijk verdeeld tussen Verhuurder en Huurder.")

  // ── ARTIKEL 7: Onderhoud en Herstellingen ─────────────────────────────
  title("ARTIKEL 7 - ONDERHOUD EN HERSTELLINGEN")
  para("De Huurder staat in voor het dagelijks onderhoud en de kleine herstellingen (huurherstellingen) zoals bepaald in het Burgerlijk Wetboek en het Vlaams Woninghuurdecreet.")
  gap()
  para("De Verhuurder is verantwoordelijk voor grote herstellingen en structureel onderhoud, waaronder:")
  bulletItem("Herstellingen aan dak, gevel en dragende muren")
  bulletItem("Vervanging van verwarmingsinstallaties en sanitaire leidingen")
  bulletItem("Herstellingen aan elektrische installaties (vaste bedrading)")
  bulletItem("Structurele problemen aan ramen en deuren")
  gap()
  para(`De Verhuurder heeft een vastgesteld reparatiemandaat van ${formatCurrency(owner.repairMandate)} per interventie. Herstellingen boven dit bedrag vereisen voorafgaande goedkeuring door de eigenaar.`)

  // ── ARTIKEL 8: Bestemming en Gebruik ──────────────────────────────────
  title("ARTIKEL 8 - BESTEMMING EN GEBRUIK")
  if (property.type === "commercial") {
    para("Het gehuurde goed is bestemd voor commercieel gebruik overeenkomstig de activiteit van de Huurder. Elke wijziging van bestemming vereist de voorafgaande schriftelijke toestemming van de Verhuurder.")
  } else {
    para("Het gehuurde goed is uitsluitend bestemd als hoofdverblijfplaats van de Huurder en de leden van diens gezin. Elke wijziging van bestemming vereist de voorafgaande schriftelijke toestemming van de Verhuurder.")
  }
  gap()

  if (property.familyMembers !== null) {
    para(`Het maximaal aantal bewoners is vastgesteld op ${property.familyMembers} personen (gezinsleden inbegrepen).`)
    gap()
  }

  para(`Huisdieren: ${property.petsAllowed ? "Huisdieren zijn toegestaan in het gehuurde goed, mits naleving van de huisregels en zonder schade aan het pand." : "Het houden van huisdieren is NIET toegestaan in het gehuurde goed, behoudens uitdrukkelijke schriftelijke toestemming van de Verhuurder."}`)
  gap()
  para(`Roken: ${property.smokingAllowed ? "Roken is toegestaan in het gehuurde goed." : "Roken is NIET toegestaan in het gehuurde goed. De Huurder verbindt zich ertoe dit verbod strikt na te leven."}`)

  // ── ARTIKEL 9: Verzekering ────────────────────────────────────────────
  title("ARTIKEL 9 - VERZEKERING")
  para("De Huurder is verplicht een verzekering af te sluiten die ten minste de volgende risico's dekt:")
  bulletItem("Huurdersaansprakelijkheid (brand, waterschade, ontploffing)")
  bulletItem("Afstand van verhaal ten gunste van de Verhuurder")
  bulletItem("Inboedelverzekering (aanbevolen)")
  gap()
  para("De Huurder bezorgt een kopie van het verzekeringsattest aan de Verhuurder v\u00F3\u00F3r de aanvang van de huurperiode en vervolgens jaarlijks bij vernieuwing.")

  // ── ARTIKEL 10: Beheer ────────────────────────────────────────────────
  title("ARTIKEL 10 - BEHEER")
  para(`Het beheer van het gehuurde goed wordt verzorgd door AedificaPro, handelend in opdracht van de Verhuurder. De beheersvergoeding bedraagt ${owner.managementFeePercent}% van de maandelijkse huuropbrengst.`)
  gap()
  para("Alle communicatie met betrekking tot het gehuurde goed (onderhoudsmeldingen, betalingen, klachten) verloopt via het AedificaPro-platform, tenzij anders overeengekomen.")

  // ── ARTIKEL 11: Einde van de Huur ─────────────────────────────────────
  title("ARTIKEL 11 - EINDE VAN DE HUUR")
  para("Bij het einde van de huurovereenkomst is de Huurder gehouden:")
  bulletItem("Het gehuurde goed te verlaten en de sleutels te overhandigen aan de Verhuurder of diens vertegenwoordiger.")
  bulletItem("Het goed achter te laten in dezelfde staat als bij aanvang, rekening houdend met normale slijtage.")
  bulletItem("Alle persoonlijke bezittingen te verwijderen. Achtergelaten goederen worden geacht afstand van eigendom te zijn.")
  bulletItem("Mee te werken aan de uittredende plaatsbeschrijving.")
  gap()
  para("Eventuele schade die niet onder normale slijtage valt, wordt verrekend met de huurwaarborg. Indien de schade de huurwaarborg overstijgt, is de Huurder gehouden het verschil bij te passen.")

  // ── ARTIKEL 12: Toepasselijk Recht ────────────────────────────────────
  title("ARTIKEL 12 - TOEPASSELIJK RECHT EN GESCHILLEN")
  para("Deze overeenkomst wordt beheerst door het Belgisch recht, in het bijzonder:")
  bulletItem("Het Belgisch Burgerlijk Wetboek (Boek III, Titel VIII)")
  bulletItem("Het Vlaams Woninghuurdecreet van 9 november 2018 (voor woningen in het Vlaams Gewest)")
  bulletItem("De Wet van 20 februari 1991 betreffende de woninghuurovereenkomsten (indien van toepassing)")
  gap()
  para("Alle geschillen voortvloeiend uit of verband houdend met deze overeenkomst worden bij voorkeur minnelijk opgelost. Indien geen minnelijke regeling mogelijk is, zijn de rechtbanken van het arrondissement waar het gehuurde goed gelegen is, uitsluitend bevoegd.")

  // ── ARTIKEL 13: Bijzondere Bepalingen ─────────────────────────────────
  title("ARTIKEL 13 - BIJZONDERE BEPALINGEN")
  para("De volgende bijzondere bepalingen zijn van toepassing op deze huurovereenkomst:")
  gap()
  bulletItem("De Huurder ontvangt bij ondertekening een kopie van het EPC-certificaat (score: " + property.epcScore + ") en het keuringsattest van de elektrische installatie.")
  bulletItem("De Huurder staat in voor de tijdige betaling van nutsvoorzieningen (water, gas, elektriciteit, internet) tenzij anders vermeld in artikel 4.")
  if (property.hasParking) {
    bulletItem("De toegewezen parkeerplaats mag uitsluitend gebruikt worden voor het stallen van een personenwagen. Onderverhuur is niet toegestaan.")
  }
  if (property.hasElevator) {
    bulletItem("Bij gebruik van de lift dient de Huurder de huisregels van het gebouw na te leven. Schade aan gemeenschappelijke delen door verhuizing is voor rekening van de Huurder.")
  }

  // ── Signature block ───────────────────────────────────────────────────
  title("ONDERTEKENING")
  para(`Opgemaakt in twee originele exemplaren te ${property.city}, op ${formatDate(property.leaseStart)}.`)
  para("Elke partij verklaart een exemplaar te hebben ontvangen.")
  gap(10)

  checkPage(50)

  // Signature boxes
  const sigBoxW = (CONTENT_W - 10) / 2
  const sigBoxH = 35
  const sigY = y

  doc.setDrawColor(180)
  doc.setLineDashPattern([2, 2], 0)
  doc.roundedRect(MARGIN_L, sigY, sigBoxW, sigBoxH, 2, 2, "S")
  doc.roundedRect(MARGIN_L + sigBoxW + 10, sigY, sigBoxW, sigBoxH, 2, 2, "S")
  doc.setLineDashPattern([], 0)

  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("De Verhuurder", MARGIN_L + sigBoxW / 2, sigY + 6, { align: "center" })
  doc.text("De Huurder", MARGIN_L + sigBoxW + 10 + sigBoxW / 2, sigY + 6, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text(owner.name, MARGIN_L + sigBoxW / 2, sigY + 12, { align: "center" })
  doc.text(tenant?.name || "(naam huurder)", MARGIN_L + sigBoxW + 10 + sigBoxW / 2, sigY + 12, { align: "center" })

  doc.text("Handtekening:", MARGIN_L + 4, sigY + 20)
  doc.text("Handtekening:", MARGIN_L + sigBoxW + 14, sigY + 20)

  doc.line(MARGIN_L + 4, sigY + 30, MARGIN_L + sigBoxW - 4, sigY + 30)
  doc.line(MARGIN_L + sigBoxW + 14, sigY + 30, MARGIN_L + sigBoxW * 2 + 6, sigY + 30)

  doc.setTextColor(0)
  y = sigY + sigBoxH + 5

  addFooter()

  // Return as blob URL
  const blob = doc.output("blob")
  return URL.createObjectURL(blob)
}

// ── Template-specific generators ────────────────────────────────────────────

export function generateTemplatePdf(
  templateName: string,
  category: string,
  property?: Property | null,
  owner?: Owner | null,
): string {
  // If we have full property + owner data, generate a real contract
  if (property && owner && category === "huurovereenkomst") {
    return generateContractPdf(property, owner)
  }

  // Otherwise generate a template preview
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  // Header
  doc.setFillColor(30, 64, 120)
  doc.rect(0, 0, PAGE_W, 35, "F")
  doc.setFillColor(42, 90, 160)
  doc.rect(0, 35, PAGE_W, 2, "F")

  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255)
  doc.text("TEMPLATE", PAGE_W / 2, 18, { align: "center" })
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(templateName, PAGE_W / 2, 28, { align: "center" })

  doc.setTextColor(0)
  let ty = 50

  doc.setFontSize(10)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(100)
  doc.text("Dit is een sjabloon. Vul de velden in om het document te voltooien.", PAGE_W / 2, ty, { align: "center" })
  ty += 15

  doc.setTextColor(0)
  doc.setFont("helvetica", "normal")

  if (category === "plaatsbeschrijving") {
    generateInspectionTemplate(doc, ty, templateName)
  } else if (category === "opzeg") {
    generateTerminationTemplate(doc, ty, templateName)
  } else if (category === "addendum") {
    generateAddendumTemplate(doc, ty, templateName)
  } else {
    generateGenericTemplate(doc, ty, templateName, category)
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.setDrawColor(200)
  doc.line(MARGIN_L, FOOTER_Y, PAGE_W - MARGIN_R, FOOTER_Y)
  doc.text("Template - AedificaPro", MARGIN_L, FOOTER_Y + 5)
  doc.text("Pagina 1", PAGE_W / 2, FOOTER_Y + 5, { align: "center" })

  const blob = doc.output("blob")
  return URL.createObjectURL(blob)
}

function templateField(doc: jsPDF, label: string, y: number): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.text(label + ":", MARGIN_L, y)
  doc.setFont("helvetica", "normal")
  const lw = doc.getTextWidth(label + ": ")
  doc.setDrawColor(180)
  doc.setLineDashPattern([1, 1], 0)
  doc.line(MARGIN_L + lw, y + 0.5, MARGIN_L + CONTENT_W, y + 0.5)
  doc.setLineDashPattern([], 0)
  return y + LINE_H + 1
}

function generateInspectionTemplate(doc: jsPDF, y: number, name: string) {
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 64, 120)
  doc.text(name.toUpperCase(), MARGIN_L, y)
  y += 10
  doc.setTextColor(0)

  y = templateField(doc, "Adres van het pand", y)
  y = templateField(doc, "Datum van inspectie", y)
  y = templateField(doc, "Naam verhuurder / vertegenwoordiger", y)
  y = templateField(doc, "Naam huurder", y)
  y += 5

  const rooms = ["Inkomhal", "Woonkamer", "Keuken", "Slaapkamer 1", "Slaapkamer 2", "Badkamer", "Toilet", "Berging", "Balkon/Terras"]

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("RUIMTES", MARGIN_L, y)
  y += 7

  for (const room of rooms) {
    if (y > 255) break
    doc.setFillColor(248, 248, 250)
    doc.roundedRect(MARGIN_L, y - 3, CONTENT_W, 18, 1, 1, "F")
    doc.setDrawColor(220)
    doc.roundedRect(MARGIN_L, y - 3, CONTENT_W, 18, 1, 1, "S")

    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(room, MARGIN_L + 3, y + 2)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text("Staat: \u25A1 Goed   \u25A1 Voldoende   \u25A1 Slecht   |   Opmerkingen: ___________________________", MARGIN_L + 3, y + 10)
    y += 22
  }
}

function generateTerminationTemplate(doc: jsPDF, y: number, name: string) {
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 64, 120)
  doc.text(name.toUpperCase(), MARGIN_L, y)
  y += 10
  doc.setTextColor(0)

  y = templateField(doc, "Naam afzender", y)
  y = templateField(doc, "Adres afzender", y)
  y += 3
  y = templateField(doc, "Naam ontvanger", y)
  y = templateField(doc, "Adres ontvanger", y)
  y += 5

  y = templateField(doc, "Datum", y)
  y += 5

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Betreft: Opzegging huurovereenkomst", MARGIN_L, y)
  y += 10

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9.5)
  const body = [
    "Geachte heer/mevrouw,",
    "",
    "Hierbij deel ik u mede dat ik de huurovereenkomst betreffende het pand gelegen te",
    "_______________________________________________ wens op te zeggen.",
    "",
    "De opzegtermijn van drie (3) maanden gaat in op ___/___/______, zodat de",
    "huurovereenkomst eindigt op ___/___/______.",
    "",
    "Ik verzoek u de uittredende plaatsbeschrijving in te plannen en mij te informeren",
    "over de verdere afhandeling van de huurwaarborg.",
    "",
    "Ik verzoek u de goede ontvangst van dit schrijven te bevestigen.",
    "",
    "Met vriendelijke groeten,",
    "",
    "",
    "Handtekening: ___________________________",
  ]
  for (const line of body) {
    doc.text(line, MARGIN_L, y)
    y += LINE_H
  }
}

function generateAddendumTemplate(doc: jsPDF, y: number, name: string) {
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 64, 120)
  doc.text(name.toUpperCase(), MARGIN_L, y)
  y += 10
  doc.setTextColor(0)

  doc.setFontSize(9.5)
  doc.setFont("helvetica", "normal")

  const lines = [
    "Addendum bij de huurovereenkomst van ___/___/______ betreffende het pand gelegen te:",
    "",
  ]
  for (const line of lines) {
    doc.text(line, MARGIN_L, y)
    y += LINE_H
  }

  y = templateField(doc, "Adres pand", y)
  y += 3
  y = templateField(doc, "Naam verhuurder", y)
  y = templateField(doc, "Naam huurder", y)
  y += 8

  doc.setFont("helvetica", "bold")
  doc.text("De partijen komen het volgende overeen:", MARGIN_L, y)
  y += 8

  doc.setFont("helvetica", "normal")
  y = templateField(doc, "Nieuwe basishuur (per maand)", y)
  y = templateField(doc, "Nieuwe gemeenschappelijke kosten (per maand)", y)
  y = templateField(doc, "Ingangsdatum wijziging", y)
  y += 5

  const body2 = [
    "Alle overige bepalingen van de oorspronkelijke huurovereenkomst blijven onverkort",
    "van toepassing.",
    "",
    `Opgemaakt in twee originele exemplaren op ___/___/______.`,
    "",
    "",
    "De Verhuurder:                                    De Huurder:",
    "",
    "",
    "___________________________              ___________________________",
  ]
  for (const line of body2) {
    doc.text(line, MARGIN_L, y)
    y += LINE_H
  }
}

function generateGenericTemplate(doc: jsPDF, y: number, name: string, _category: string) {
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(30, 64, 120)
  doc.text(name.toUpperCase(), MARGIN_L, y)
  y += 10
  doc.setTextColor(0)

  y = templateField(doc, "Datum", y)
  y = templateField(doc, "Partij 1", y)
  y = templateField(doc, "Partij 2", y)
  y = templateField(doc, "Betreft", y)
  y += 10

  doc.setFontSize(9.5)
  doc.setFont("helvetica", "normal")
  doc.text("(Inhoud van het document)", MARGIN_L, y)
}
