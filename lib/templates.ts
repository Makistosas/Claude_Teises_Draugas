/**
 * Intake templates for structured Slack messages
 * Each template includes a header tag [TD:XXX] for easy triage
 */

export interface IntakeTemplate {
  id: string;
  header: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  template: string;
}

export const intakeTemplates: IntakeTemplate[] = [
  {
    id: 'pretenzija',
    header: '[TD:PRETENZIJA]',
    title: 'Pretenzija',
    description: 'Parašyti oficialią pretenziją pardavėjui ar paslaugų teikėjui',
    icon: 'FileWarning',
    template: `[TD:PRETENZIJA]

=== PRETENZIJOS ŠABLONAS ===

1. KAS JŪS ESATE?
   □ Fizinis asmuo / □ Juridinis asmuo
   Vardas/Pavadinimas: _______________

2. KAM SKIRTA? (atsakovas)
   Vardas/Pavadinimas: _______________
   (jei žinoma: adresas, el. paštas)

3. SITUACIJOS SANTRAUKA (3-7 sakiniai)
   _________________________________
   _________________________________
   _________________________________

4. DATOS IR TERMINAI
   Kada įvyko: _______________
   Kada buvo susitarta: _______________

5. SUMA IR REIKALAVIMAS
   Suma (€): _______________
   Ko reikalaujate: _______________

6. ĮRODYMAI (pažymėkite turimus)
   □ Pokalbių istorija (chat/SMS)
   □ Sutartis
   □ Mokėjimo pavedimas
   □ Nuotraukos
   □ Kita: _______________

7. KO NORITE KAIP REZULTATO?
   □ Grąžinti pinigus
   □ Pakeisti prekę
   □ Atlyginti žalą
   □ Kita: _______________

8. TERMINAS ATSAKYMUI
   □ 7 dienų  □ 14 dienų  □ Kita: ___`,
  },
  {
    id: 'sutartis',
    header: '[TD:SUTARTIS]',
    title: 'Sutartis',
    description: 'Parengti ar peržiūrėti sutartį',
    icon: 'FileSignature',
    template: `[TD:SUTARTIS]

=== SUTARTIES ŠABLONAS ===

1. SUTARTIES TIPAS
   □ Nuomos sutartis
   □ Paslaugų sutartis
   □ Pirkimo-pardavimo sutartis
   □ Kita: _______________

2. ŠALYS
   Šalis 1 (jūs): _______________
   Šalis 2: _______________

3. OBJEKTAS / PASLAUGOS APIMTIS
   _________________________________
   _________________________________

4. KAINA IR ATSISKAITYMO TVARKA
   Kaina (€): _______________
   Mokėjimo terminas: _______________
   Mokėjimo būdas: _______________

5. TERMINAI
   Pradžia: _______________
   Pabaiga: _______________

6. ATSAKOMYBĖ IR GARANTIJOS
   _________________________________

7. NUTRAUKIMO SĄLYGOS
   _________________________________

8. PAPILDOMAI (jei aktualu)
   □ Konfidencialumas
   □ Ginčų sprendimas
   □ Kita: _______________`,
  },
  {
    id: 'ivertinimas',
    header: '[TD:IVERTINIMAS]',
    title: 'Situacijos įvertinimas',
    description: 'Gauti nuomonę apie savo teisinę situaciją',
    icon: 'Scale',
    template: `[TD:IVERTINIMAS]

=== SITUACIJOS ĮVERTINIMO ŠABLONAS ===

1. KAS NUTIKO? (5-10 sakinių)
   _________________________________
   _________________________________
   _________________________________
   _________________________________
   _________________________________

2. KOKIA PROBLEMA ŠIANDIEN?
   _________________________________
   _________________________________

3. KO BIJOTE / KAS SVARBIAUSIA?
   _________________________________
   _________________________________

4. KOKIE DOKUMENTAI/ĮRODYMAI TURITE?
   □ Sutartis
   □ Susirašinėjimai
   □ Sąskaitos/kvitai
   □ Nuotraukos/video
   □ Liudininkų kontaktai
   □ Kita: _______________

5. KOKS NORIMAS SPRENDIMAS?
   _________________________________`,
  },
  {
    id: 'skola',
    header: '[TD:SKOLA]',
    title: 'Skolos priminimas',
    description: 'Parašyti raštišką skolos priminimą',
    icon: 'Receipt',
    template: `[TD:SKOLA]

=== SKOLOS PRIMINIMO ŠABLONAS ===

1. SKOLININKAS
   Vardas/Pavadinimas: _______________
   Kontaktai (jei žinomi): _______________

2. SKOLOS SUMA
   Suma (€): _______________

3. SKOLOS PAGRINDAS
   □ Sąskaita faktūra
   □ Sutartis
   □ Žodinis susitarimas
   □ Kita: _______________

4. TERMINAS
   Turėjo sumokėti iki: _______________

5. AR JAU PRIMINTA?
   □ Ne, tai pirmas priminimas
   □ Taip, priminta žodžiu
   □ Taip, priminta raštu (kada: ___)

6. PAGEIDAUJAMAS TONAS
   □ Neutralus (draugiškas priminimas)
   □ Griežtesnis (su perspėjimu)
   □ Oficialus (prieš teisinį procesą)`,
  },
];

// Get template by ID
export function getTemplateById(id: string): IntakeTemplate | undefined {
  return intakeTemplates.find((t) => t.id === id);
}

// Add metadata footer to template
export function enrichTemplate(template: string, metaFooter: string): string {
  return `${template}\n\n${metaFooter}`;
}
