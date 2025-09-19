import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Mock data templates for detailed recordings (2-5 minutes each)
const MOCK_RECORDINGS = [
  {
    transcription: "Dzień dobry, nagrywam w piątek rano, 30 sierpnia. Obudziłem się o 7:00 i czuję się zmotywowany. Wczoraj spędziłem 2 godziny analizując testy systemu płatności dla klienta fintech. Wyniki obiecujące - zmniejszyliśmy czas transakcji o 40%, bezpieczeństwo wzrosło dzięki ML wykrywającemu podejrzane wzorce. Dziś spotkanie z Markiem przed prezentacją w przyszły wtorek. Muszę przejrzeć kod Anny do API Banku Millennium - jutro code review. Projekt może być przełomowy - kontrakt na 3 lata, 1.5M złotych. CEO zainteresowany rozszerzeniem na inne banki. Czuję odpowiedzialność ale jestem podekscytowany możliwościami.",
    corrected_text: "Dzień dobry, to jest moja poranna notatka z dzisiejszego dnia. Obudziłem się dziś około 7:00 rano i od razu poczułem, że to będzie produktywny dzień. Wczoraj wieczorem zaplanowałem sobie kilka ważnych zadań, w tym dokończenie prezentacji dla klienta z branży fintech, którą mam przedstawić w przyszłym tygodniu. Ten projekt jest dla mnie bardzo ważny, ponieważ może otworzyć drzwi do współpracy z większymi firmami finansowymi. Przez ostatnie dwa tygodnie intensywnie pracowałem nad analizą ich obecnego systemu płatności i mam kilka konkretnych propozycji ulepszeń, które mogą zwiększyć bezpieczeństwo transakcji o około 20%. Dzisiaj planuję też spotkanie z Markiem z zespołu deweloperskiego, żeby omówić architekturę techniczną nowego modułu AI, który ma analizować wzorce transakcji w czasie rzeczywistym. Mam nadzieję, że uda nam się rozwiązać problem z latencją, który pojawiał się podczas testów. Dodatkowo muszę przejrzeć kod, który Anna napisała do integracji z API banku, bo jutro mamy code review. Czuję się naprawdę zmotywowany i pełen energii, szczególnie że wczoraj otrzymałem pozytywny feedback od CEO naszej firmy na temat kierunku, w którym zmierzamy z tym projektem.",
    summary: "Użytkownik rozpoczął dzień z wysoką motywacją i szczegółowymi planami dotyczącymi ważnego projektu fintech, który może znacząco wpłynąć na rozwój jego kariery. Koncentruje się na aspektach technicznych, współpracy zespołowej i strategicznych celach biznesowych.",
    topics: ["fintech", "projekt", "prezentacja", "AI", "bezpieczeństwo", "płatności", "współpraca", "zespół", "motywacja", "blockchain", "inwestor"],
    follow_up_questions: ["Jakie konkretne funkcje AI będą najważniejsze dla klienta fintech?", "Jak planujesz rozwiązać problem z latencją w module analizy transakcji?", "Jakie są Twoje długoterminowe cele w współpracy z firmami finansowymi?", "Jak możesz wykorzystać pozytywny feedback od CEO do dalszego rozwoju projektu?", "Jakie korzyści może przynieść technologia blockchain w Twoim projekcie?"],
    action_items: ["Dokończyć prezentację dla klienta fintech", "Przygotować się do spotkania z Markiem w sprawie architektury AI", "Przejrzeć kod Anny do integracji z API banku", "Przygotować się do jutrzejszego code review", "Spisać konkretne propozycje ulepszeń bezpieczeństwa", "Przygotować materiały na negocjacje z inwestorem"],
    insights: ["Wysoki poziom motywacji i energii", "Strategiczne myślenie o karierze", "Świadomość znaczenia projektu", "Dobra organizacja czasu i planowanie", "Pozytywne nastawienie do współpracy zespołowej", "Koncentracja na szczegółach technicznych", "Docenianie feedbacku od przełożonych", "Wizja długoterminowego rozwoju"],
    mood_score: 8,
    emotional_tags: ["zmotywowany", "energiczny", "skupiony"],
    main_topics: ["fintech", "projekt", "AI", "zespół", "kariera"],
    importance_level: 5,
    time_offset: 8 // 8:00
  },
  {
    transcription: "Właśnie wróciłem ze spotkania z zespołem i muszę podzielić się swoimi obserwacjami. Spotkanie trwało około półtorej godziny i dotyczyło planowania sprintu na następny tydzień. Uczestniczyli w nim Marek, Anna, Tomek i Kasia z zespołu deweloperskiego oraz Ola z działu produktu. Na początku wszystko wyglądało dobrze, omawialiśmy user stories i estimowaliśmy story pointy, ale w pewnym momencie zauważyłem, że niektórzy członkowie zespołu mają różne rozumienie wymagań klienta. Szczególnie Tomek zadawał dużo pytań o szczegóły implementacji, które powinny być już jasne po wcześniejszych spotkaniach z Product Ownerem. Anna z kolei wydawała się być nieco zestresowana deadline'ami i wspomniała, że ma problemy z integracją API, nad którą pracuje już drugi tydzień. Postanowiłem, że po spotkaniu porozmawiam z nią na osobności, żeby lepiej zrozumieć, gdzie tkwi problem i czy mogę jej jakoś pomóc. Kasia była bardzo aktywna i miała dobre pomysły na optymalizację bazy danych, ale czuję, że jej sugestie nie zostały w pełni docenione przez resztę zespołu. Myślę, że muszę popracować nad tym, żeby wszyscy czuli się komfortowo dzieląc się swoimi pomysłami. Ogólnie atmosfera była pozytywna, ale widzę przestrzeń do poprawy w komunikacji i może potrzebujemy bardziej strukturalnego podejścia do omawiania problemów technicznych.",
    corrected_text: "Właśnie wróciłem ze spotkania z zespołem i muszę podzielić się swoimi obserwacjami. Spotkanie trwało około 1,5 godziny i dotyczyło planowania sprintu na następny tydzień. Uczestniczyli w nim Marek, Anna, Tomek i Kasia z zespołu deweloperskiego oraz Ola z działu produktu. Na początku wszystko wyglądało dobrze - omawialiśmy user stories i estimowaliśmy story pointy, ale w pewnym momencie zauważyłem, że niektórzy członkowie zespołu mają różne rozumienie wymagań klienta. Szczególnie Tomek zadawał dużo pytań o szczegóły implementacji, które powinny być już jasne po wcześniejszych spotkaniach z Product Ownerem. Anna z kolei wydawała się być nieco zestresowana deadline'ami i wspomniała, że ma problemy z integracją API, nad którą pracuje już drugi tydzień. Postanowiłem, że po spotkaniu porozmawiam z nią na osobności, żeby lepiej zrozumieć, gdzie tkwi problem i czy mogę jej jakoś pomóc. Kasia była bardzo aktywna i miała dobre pomysły na optymalizację bazy danych, ale czuję, że jej sugestie nie zostały w pełni docenione przez resztę zespołu.",
    summary: "Użytkownik przeprowadził szczegółową analizę spotkania zespołowego, identyfikując problemy komunikacyjne, różnice w rozumieniu wymagań oraz potrzeby wsparcia dla członków zespołu. Wykazał się empatią i chęcią poprawy dynamiki zespołowej.",
    topics: ["spotkanie", "zespół", "sprint", "komunikacja", "problemy", "API", "baza danych", "współpraca", "leadership", "user stories", "deadline"],
    follow_up_questions: ["Jak możesz lepiej przygotować zespół do rozumienia wymagań przed spotkaniami?", "Jakie konkretne wsparcie możesz zaoferować Annie w problemach z API?", "Jak można stworzyć środowisko, w którym wszyscy czują się komfortowo dzieląc pomysłami?", "Czy obecna struktura spotkań jest optymalna dla produktywności zespołu?", "Jakie narzędzia mogłyby pomóc w lepszej komunikacji technicznej?"],
    action_items: ["Porozmawiać z Anną na osobności o problemach z API", "Zorganizować sesję wyjaśniającą wymagania klienta dla całego zespołu", "Przygotować bardziej strukturalny format spotkań", "Docenić pomysły Kasi i dać jej więcej przestrzeni na wypowiedzi", "Sprawdzić czy Tomek potrzebuje dodatkowego wsparcia w zrozumieniu wymagań", "Wprowadzić lepszy system dokumentacji decyzji z spotkań"],
    insights: ["Świadomość dynamiki zespołowej", "Empatyczne podejście do problemów członków zespołu", "Umiejętność obserwacji i analizy", "Chęć ciągłego doskonalenia procesów", "Rozumienie znaczenia dobrej komunikacji", "Naturalne skłonności przywódcze", "Troska o komfort psychologiczny zespołu"],
    mood_score: 6,
    emotional_tags: ["zamyślony", "odpowiedzialny", "analityczny"],
    main_topics: ["zespół", "komunikacja", "leadership", "współpraca", "rozwój"],
    importance_level: 4,
    time_offset: 14 // 14:00
  },
  {
    transcription: "Jest już wieczór, około dziewiętnastej, i postanowiłem nagrać refleksje z końca tego intensywnego dnia. Poszedłem na spacer do Parku Łazienkowskiego, który jest moim ulubionym miejscem do myślenia. Pogoda była idealna - lekki wiaterek, temperatura około dwudziestu stopni, i nie było zbyt dużo ludzi. Podczas spaceru myślałem o dzisiejszym dniu i o tym, jak bardzo się zmieniło moje podejście do pracy w ciągu ostatnich miesięcy. Kiedyś byłem osobą, która pracowała do późna, często siedziała w biurze do dziesiątej wieczorem, i myślałem, że to jest jedyny sposób na osiągnięcie sukcesu. Ale teraz zaczynam rozumieć, że jakość pracy jest ważniejsza niż ilość godzin. Dzisiejsze spotkanie z zespołem było tego doskonałym przykładem - zauważyłem, że kiedy jestem wypoczęty i mam jasny umysł, potrafię lepiej słuchać innych, dostrzegać problemy i znajdować rozwiązania. Myślałem też o rozmowie, którą miałem w zeszłym tygodniu z moim mentorem, Pawłem. Powiedział mi wtedy, że najważniejszą umiejętnością lidera nie jest wiedza techniczna, ale zdolność do tworzenia środowiska, w którym inni mogą się rozwijać. To bardzo rezonuje ze mną, szczególnie po dzisiejszych obserwacjach dotyczących Kasi i jej pomysłów, które nie zostały w pełni wysłuchane. Chcę być liderem, który daje przestrzeń każdemu członkowi zespołu. Spacer pomógł mi też uporządkować myśli na temat przyszłego tygodnia i tego, jak chcę poprowadzić następne spotkania.",
    corrected_text: "Jest już wieczór, około 19:00, i postanowiłem nagrać refleksje z końca tego intensywnego dnia. Poszedłem na spacer do Parku Łazienkowskiego, który jest moim ulubionym miejscem do myślenia. Pogoda była idealna - lekki wiaterek, temperatura około 20 stopni, i nie było zbyt dużo ludzi. Podczas spaceru myślałem o dzisiejszym dniu i o tym, jak bardzo się zmieniło moje podejście do pracy w ciągu ostatnich miesięcy. Kiedyś byłem osobą, która pracowała do późna, często siedziała w biurze do 22:00, i myślałem, że to jest jedyny sposób na osiągnięcie sukcesu. Ale teraz zaczynam rozumieć, że jakość pracy jest ważniejsza niż ilość godzin. Dzisiejsze spotkanie z zespołem było tego doskonałym przykładem - zauważyłem, że kiedy jestem wypoczęty i mam jasny umysł, potrafię lepiej słuchać innych, dostrzegać problemy i znajdować rozwiązania. Myślałem też o rozmowie z moim mentorem Pawłem z zeszłego tygodnia. Powiedział mi wtedy, że najważniejszą umiejętnością lidera nie jest wiedza techniczna, ale zdolność do tworzenia środowiska, w którym inni mogą się rozwijać.",
    summary: "Użytkownik podczas wieczornego spaceru w parku przeprowadził głęboką refleksję nad swoim rozwojem jako lidera, analizując zmiany w podejściu do pracy i znaczenie work-life balance. Wyciągnął wnioski z dzisiejszego spotkania zespołowego i planuje zmiany w stylu przywództwa.",
    topics: ["spacer", "park", "refleksja", "leadership", "work-life balance", "rozwój osobisty", "mentoring", "zespół", "jakość pracy", "filozofia pracy"],
    follow_up_questions: ["Jak możesz praktycznie wdrożyć filozofię jakości nad ilością w codziennej pracy?", "Jakie konkretne zmiany wprowadzisz w stylu prowadzenia spotkań?", "Jak często planujesz takie refleksyjne spacery dla swojego rozwoju?", "Jakie inne rady od mentora Pawła chciałbyś wdrożyć?", "Jak będziesz mierzyć postęp w tworzeniu lepszego środowiska dla zespołu?"],
    action_items: ["Zaplanować regularne wieczorne spacery na refleksję", "Wdrożyć nowy format spotkań dający więcej przestrzeni każdemu", "Porozmawiać z Pawłem o kolejnych krokach rozwoju przywództwa", "Utworzyć system regularnego feedbacku dla członków zespołu", "Przeanalizować obecny work-life balance i wprowadzić poprawki", "Spisać konkretne zasady tworzenia środowiska rozwoju dla zespołu"],
    insights: ["Głęboka świadomość własnego rozwoju", "Filozoficzne podejście do pracy i życia", "Umiejętność uczenia się z doświadczeń", "Cenowanie rad od mentorów", "Refleksyjność i introspeksja", "Ewolucja w kierunku przywództwa służebnego", "Rozumienie znaczenia środowiska pracy dla rozwoju zespołu", "Docenianie wartości czasu na myślenie"],
    mood_score: 7,
    emotional_tags: ["refleksyjny", "spokojny", "mądry"],
    main_topics: ["rozwój osobisty", "leadership", "work-life balance", "refleksja", "mentoring"],
    importance_level: 3,
    time_offset: 19 // 19:00
  },
  {
    transcription: "Nagrywam to około szesnastej, bo muszę się podzielić tym, co się działo dzisiaj po południu. Miałem naprawdę trudne i stresujące doświadczenie związane z deadline'ami na kilku projektach jednocześnie. Rano wszystko wydawało się pod kontrolą, ale około jedenastej dostałem telefon od klienta z branży e-commerce, że potrzebują przyspieszenia dostawy modułu płatności o cały tydzień. To oznacza, że muszę skończyć wszystko do środy zamiast do przyszłego piątku. Jednocześnie Anna przyszła do mnie z problemem w integracji API banku - okazało się, że bank zmienił format odpowiedzi w swoim API bez wcześniejszego powiadomienia, i teraz musimy przepisać całą logikę parsowania danych. To może zająć minimum dwa dni robocze. Na dodatek Tomek zgłosił błąd w module bezpieczeństwa, który może wpływać na wszystkie transakcje testowe, więc musimy to naprawić z najwyższym priorytetem. Czuję się trochę przytłoczony tym wszystkim, szczególnie że w przyszłym tygodniu mam ważną prezentację dla potencjalnego inwestora i chcę, żeby wszystko było perfekcyjne. Myślałem o tym, czy powinienem poprosić o pomoc dodatkowych deweloperów, ale budżet na ten kwartał jest już napięty. Może muszę po prostu lepiej priorytetyzować zadania i skupić się na tym, co naprawdę krytyczne. Zastanawiam się też, czy nie powinienem wprowadzić jakiegoś systemu zarządzania ryzykiem projektowym, żeby takie sytuacje nie zaskakiwały nas w przyszłości.",
    corrected_text: "Nagrywam to około 16:00, bo muszę się podzielić tym, co się działo dzisiaj po południu. Miałem naprawdę trudne i stresujące doświadczenie związane z deadline'ami na kilku projektach jednocześnie. Rano wszystko wydawało się pod kontrolą, ale około 11:00 dostałem telefon od klienta z branży e-commerce, że potrzebują przyspieszenia dostawy modułu płatności o cały tydzień. To oznacza, że muszę skończyć wszystko do środy zamiast do przyszłego piątku. Jednocześnie Anna przyszła do mnie z problemem w integracji API banku - okazało się, że bank zmienił format odpowiedzi w swoim API bez wcześniejszego powiadomienia, i teraz musimy przepisać całą logikę parsowania danych. To może zająć minimum 2 dni robocze. Na dodatek Tomek zgłosił błąd w module bezpieczeństwa, który może wpływać na wszystkie transakcje testowe, więc musimy to naprawić z najwyższym priorytetem.",
    summary: "Użytkownik doświadczył intensywnego stresu związanego z nagłymi zmianami w projektach, problemami technicznymi i napiętymi deadline'ami. Analizuje opcje zarządzania kryzysem i rozważa wprowadzenie lepszych systemów zarządzania ryzykiem projektowym.",
    topics: ["stres", "deadline", "kryzys projektowy", "API", "e-commerce", "bezpieczeństwo", "zarządzanie ryzykiem", "priorytetyzacja", "budżet", "zespół"],
    follow_up_questions: ["Jakie konkretne kroki podejmiesz, aby poradzić sobie z napiętymi deadline'ami?", "Jak możesz lepiej komunikować się z klientami w kwestii zmian wymagań?", "Jakie systemy wczesnego ostrzegania o problemach projektowych możesz wprowadzić?", "Czy jest możliwość renegocjacji budżetu lub zasobów w takiej sytuacji kryzysowej?", "Jak możesz lepiej przygotować zespół na niespodziewane zmiany w projektach?"],
    action_items: ["Przepriorytetyzować wszystkie zadania według krytyczności", "Zorganizować naradę kryzysową z zespołem", "Skontaktować się z klientem e-commerce w sprawie realności nowego deadline'u", "Przygotować plan naprawczy dla błędu w module bezpieczeństwa", "Zbadać opcje dodatkowych zasobów lub outsourcingu", "Wprowadzić system monitorowania zmian w zewnętrznych API", "Stworzyć protokół zarządzania kryzysami projektowymi"],
    insights: ["Wysokie umiejętności radzenia sobie w sytuacjach kryzysowych", "Świadomość potrzeby lepszego zarządzania ryzykiem", "Analityczne podejście do problemów", "Troska o jakość pracy pomimo presji czasu", "Rozważanie długoterminowych rozwiązań", "Odpowiedzialność za zespół i projekty", "Umiejętność identyfikacji systemowych problemów"],
    mood_score: 4,
    emotional_tags: ["zestresowany", "przytłoczony", "analityczny"],
    main_topics: ["stres", "kryzys", "zarządzanie", "deadline", "zespół"],
    importance_level: 5,
    time_offset: 16 // 16:00
  },
  {
    transcription: "Jest już późny wieczór, około dwudziestej, i właśnie skończyłem długą rozmowę telefoniczną z mamą. Dzwoniła do mnie, bo chciała porozmawiać o swojej wizycie u lekarza z wczoraj. Mama ma sześćdziesiąt osiem lat i ostatnio często martwi się o swoje zdrowie, co jest zupełnie zrozumiałe. Lekarz powiedział jej, że wyniki badań krwi są w normie, ale ciśnienie jest nieco podwyższone i powinna więcej uważać na dietę i ruch. Mama była trochę zaniepokojona, bo babcia, jej mama, miała problemy z sercem w podobnym wieku. Rozmawialiśmy o tym przez prawie godzinę. Opowiedziałem jej o moich doświadczeniach z medytacją i regularnym bieganiem, które bardzo pomagają mi w radzeniu sobie ze stresem. Mama była zainteresowana, ale mówiła, że w jej wieku trudno zacząć nowe nawyki. Postanowiłem, że w weekend pojadę do niej do Krakowa i razem pójdziemy na spacer po Plantach, żeby pokazać jej, jak przyjemne może być lekkie ćwiczenie. Chcę też pomóc jej znaleźć jakieś zajęcia grupowe dla seniorów w jej okolicy, może aqua aerobik albo nordic walking. Podczas rozmowy zdałem sobie sprawę, jak bardzo mi na niej zależy i jak rzadko ostatnio ją odwiedzam. Praca tak mnie pochłania, że czasami zapominam o najważniejszych rzeczach. Mama wspomniała też, że sąsiadka pani Kowalska, która ma podobny wiek, niedawno zaczęła chodzić na zajęcia jogi i czuje się o wiele lepiej. Może to będzie dobry pomysł dla mamy. Obiecałem jej, że będę dzwonić częściej, przynajmniej dwa razy w tygodniu, i że znajdę czas na regularne odwiedziny.",
    corrected_text: "Jest już późny wieczór, około 20:00, i właśnie skończyłem długą rozmowę telefoniczną z mamą. Dzwoniła do mnie, bo chciała porozmawiać o swojej wizycie u lekarza z wczoraj. Mama ma 68 lat i ostatnio często martwi się o swoje zdrowie, co jest zupełnie zrozumiałe. Lekarz powiedział jej, że wyniki badań krwi są w normie, ale ciśnienie jest nieco podwyższone i powinna więcej uważać na dietę i ruch. Mama była trochę zaniepokojona, bo babcia miała problemy z sercem w podobnym wieku. Rozmawialiśmy o tym przez prawie godzinę. Opowiedziałem jej o moich doświadczeniach z medytacją i regularnym bieganiem, które bardzo pomagają mi w radzeniu sobie ze stresem. Postanowiłem, że w weekend pojadę do niej do Krakowa i razem pójdziemy na spacer po Plantach. Chcę też pomóc jej znaleźć zajęcia grupowe dla seniorów w jej okolicy, może aqua aerobik albo nordic walking.",
    summary: "Użytkownik odbył długą, emocjonalną rozmowę z mamą o jej zdrowiu i obawach związanych z wiekiem. Wykazał się troską, empatią i konkretnym planem wsparcia, jednocześnie reflektując nad własnymi priorytetami życiowymi i work-life balance.",
    topics: ["rodzina", "mama", "zdrowie", "ciśnienie", "dieta", "ruch", "obawy", "wsparcie", "Kraków", "seniorzy", "zajęcia grupowe", "work-life balance"],
    follow_up_questions: ["Jak możesz regularnie wspierać mamę w trosce o zdrowie na odległość?", "Jakie konkretne zmiany w stylu życia będą najbardziej realistyczne dla mamy?", "Jak możesz lepiej równoważyć obowiązki zawodowe z troską o rodzinę?", "Jakie zajęcia grupowe w Krakowie mogłyby być najlepsze dla mamy?", "Jak często planujesz odwiedzać mamę, aby to było realistyczne przy Twoim harmonogramie?"],
    action_items: ["Zaplanować weekend w Krakowie z mamą", "Znaleźć zajęcia grupowe dla seniorów w Krakowie (aqua aerobik, nordic walking, joga)", "Ustalić regularny harmonogram telefonów (2x w tygodniu)", "Przygotować listę zdrowych przepisów odpowiednich dla mamy", "Zbadać opcje aplikacji do monitorowania ciśnienia", "Skontaktować się z sąsiadką panią Kowalską w sprawie jogi", "Zaplanować regularne miesięczne odwiedziny"],
    insights: ["Głęboka troska o rodzinę", "Świadomość przemijania czasu i wieku rodziców", "Refleksja nad własnymi priorytetami życiowymi", "Empatia i zrozumienie dla obaw starszych osób", "Chęć aktywnego wsparcia bliskich", "Rozumienie znaczenia aktywności fizycznej dla zdrowia", "Docenianie wartości rodzinnych więzi", "Świadomość potrzeby lepszego work-life balance"],
    mood_score: 6,
    emotional_tags: ["troskliwy", "zamyślony", "odpowiedzialny"],
    main_topics: ["rodzina", "zdrowie", "troska", "wsparcie", "work-life balance"],
    importance_level: 4,
    time_offset: 20 // 20:00
  }
]

const LOCATIONS = [
  "Warsaw, Poland",
  "Kraków, Poland", 
  "Home",
  "Office",
  "Park Łazienkowski",
  "Centrum Warszawy",
  null // sometimes no location
]

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json()
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required (YYYY-MM-DD format)' }, { status: 400 })
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 })
    }

    console.log(`🧪 Generating mock data for ${date}`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate 3-5 random recordings for the day
    const numRecordings = Math.floor(Math.random() * 3) + 3 // 3-5 recordings
    const recordings = []

    for (let i = 0; i < numRecordings; i++) {
      const template = MOCK_RECORDINGS[Math.floor(Math.random() * MOCK_RECORDINGS.length)]
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
      
      // Create timestamp for the recording
      const recordingDate = new Date(date)
      recordingDate.setHours(template.time_offset, Math.floor(Math.random() * 60), 0, 0)
      
      const recording = {
        filename: `mock-voice-note-${date}-${i + 1}.wav`,
        blob_url: `https://example.com/mock-audio-${date}-${i + 1}.wav`,
        transcription: template.transcription,
        corrected_text: template.corrected_text,
        summary: template.summary,
        topics: JSON.stringify(template.topics),
        follow_up_questions: JSON.stringify(template.follow_up_questions),
        action_items: JSON.stringify(template.action_items),
        insights: JSON.stringify(template.insights),
        location: location,
        recorded_at: recordingDate.toISOString(),
        created_at: recordingDate.toISOString(),
        
        // Mood analysis fields
        recorded_date: date,
        recorded_time: `${template.time_offset.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
        mood_score: template.mood_score + Math.floor(Math.random() * 3) - 1, // ±1 variation
        emotional_tags: JSON.stringify(template.emotional_tags),
        main_topics: JSON.stringify(template.main_topics),
        importance_level: template.importance_level
      }

      recordings.push(recording)
    }

    // Insert mock data into database
    const { data, error } = await supabase
      .from('voice_notes')
      .insert(recordings)
      .select('id')

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`✅ Generated ${recordings.length} mock recordings for ${date}`)

    return NextResponse.json({
      success: true,
      date,
      recordings_generated: recordings.length,
      recordings: data,
      message: `Successfully generated ${recordings.length} mock voice notes for ${date}`
    })

  } catch (error: any) {
    console.error('❌ Error generating mock day data:', error)
    return NextResponse.json({
      error: 'Failed to generate mock day data',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
