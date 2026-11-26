/* ==========================================================================
   CONTENT — every word that appears in the report lives here.
   Members: edit wording freely, but keep within the limits:
     headline ≤ 6 words · caption ≤ 25 words, ≤ 2 sentences · labels ≤ 4 words, ≤ 4 per step
     quiz question ≤ 15 words · choice ≤ 8 words · why ≤ 20 words
   Open the report with ?rehearse at the end of the address to see warnings.
   ========================================================================== */
(function (R) {
  const S = (id, o) => Object.assign({ id, headline: '', caption: '', labels: [], date: null, more: null,
    notes: [], page: '', bonus: false, art: null, extra: null }, o);

  R.CONTENT = {
    title: '4 Years, 13 Days',
    subtitle: 'La Liga and Exile in Dapitan (1892–1896)',
    citation: 'Jose Rizal: Social Reformer and Patriot — A Study of His Life and Times, Chapter 15, pp. 101–106',
    members: ['Pagulayan', 'Panghulan', 'Pagatpatan', 'Ocampo'],
    scenes: [
      /* ------------------------------------------------------------ OPENING */
      { id: 'opening', member: null, color: '#9E2A2B', textColor: '#9E2A2B', title: 'Opening', pages: 'Chapter 15',
        steps: [
          S('cover', { headline: '4 Years, 13 Days', caption: 'Chapter 15: La Liga and Exile in Dapitan, 1892 to 1896.',
            page: 'Ch. 15', art: 'envelope_seal',
            notes: ['Greet the class and introduce the group.', 'Say: today we follow Rizal from Manila into four years of exile.'] }),
          S('letter', { headline: 'A secret voyage', caption: 'On July 14, 1892, under heavy guard and in utmost secrecy, Rizal boarded a ship. Where was he going?',
            page: 'p. 102', art: 'envelope_seal',
            notes: ['Read the handwritten line slowly for drama.', 'Ask the class to guess where he was sent.'] }),
          S('map', { headline: 'From Manila to Dapitan', caption: 'Four stops, four reporters. Collect all four passport stamps by answering the checkpoint questions.',
            labels: ['Manila', 'Dapitan'], page: 'pp. 101–106', art: 'journey_map',
            notes: ['Explain the passport: 2 quick questions after each member.', 'Hand the clicker to Member 1.'] })
        ], quiz: [] },

      /* ------------------------------------------------------------ MEMBER 1 */
      { id: 'm1', member: 1, color: '#9E2A2B', textColor: '#9E2A2B', title: 'Return to Manila & La Liga Filipina', pages: 'p. 101',
        steps: [
          S('title', { headline: 'La Liga Filipina', caption: 'Return to Manila and the founding of La Liga Filipina.', page: 'p. 101',
            notes: ['Introduce yourself and your part.'] }),
          S('arrival', { headline: 'Back in Manila', caption: 'Rizal and his sister Lucia arrived on the steamer Don Juan, causing a remarkable stir.',
            labels: ['Don Juan', 'Hotel Oriente'], date: 'June 26, 1892', page: 'p. 101', art: 'manila_harbor',
            notes: ['Earlier arrivals went unnoticed; this one caused a stir.', 'They stayed at Hotel Oriente in Binondo, his room facing Binondo Church.'] }),
          S('pardon', { headline: 'A plea for pardon', caption: 'He asked Governor General Despujol to pardon his father, brother and brothers-in-law.',
            labels: ['Malacañang'], page: 'p. 101', art: 'malacanang_door',
            notes: ['Despujol met him several times.', 'Rizal immediately campaigned for his family and for La Liga.'] }),
          S('north', { headline: 'A trip up north', caption: 'He visited Malolos, San Fernando, Tarlac and Bacolor. Spanish officials saw agitation.',
            labels: ['Tutuban'], page: 'p. 101', art: 'north_rail', bonus: true,
            notes: ['He took a train from Tutuban Station.', 'Houses he visited were later searched by the guardia civil.'] }),
          S('meeting', { headline: 'The secret meeting', caption: 'At Doroteo Ongjuco\'s house in Tondo, Filipino patriots founded La Liga Filipina.',
            date: 'July 3, 1892', page: 'p. 101', art: 'tondo_house_night',
            extra: { windows: ['Mabini', 'Bonifacio', 'Salvador', 'Paez', 'Serrano Laktaw', 'Arellano'] },
            notes: ['On the night of his arrival he met Mabini, Bonifacio, Salvador, Paez, Serrano Laktaw and Arellano.', 'La Liga was founded July 3, 1892 on Ilaya Street, Tondo.'] }),
          S('officers', { headline: 'Elect the officers', caption: 'Drag each name to the right position. Can the class guess them?',
            page: 'p. 101', art: 'officer_cards',
            extra: { posts: [['President', 'Ambrosio Salvador'], ['Fiscal', 'Agustin de la Rosa'], ['Treasurer', 'Bonifacio Arevalo'], ['Secretary', 'Deodato Arellano']] },
            notes: ['Let classmates call out answers before you drag.', 'Deodato Arellano was the brother-in-law of Marcelo H. del Pilar.'] }),
          S('luggage', { headline: 'What was in the pillows?', caption: 'Anti-friar handbills, Pobres Frailes, were found in Lucia\'s pillows. The Spaniards blamed Rizal.',
            labels: ['Pobres Frailes'], page: 'p. 101', art: 'pillows_handbills',
            notes: ['The handbills were supposedly by Fr. Jacinto, printed by Imprenta de los Amigos.', 'They attacked rich friars who abused the poor.', 'This led straight to his arrest.'] })
        ],
        quiz: [
          { q: 'Where was La Liga Filipina founded on July 3, 1892?',
            choices: ['Hotel Oriente, Binondo', 'Malacañang Palace', 'Fort Santiago', 'House of Doroteo Ongjuco, Tondo'], answer: 'D',
            why: 'At Ongjuco\'s house on Ilaya Street, Tondo. Hotel Oriente was where Rizal stayed.', page: 'p. 101' },
          { q: 'What was found in Lucia\'s pillows that got Rizal arrested?',
            choices: ['Copies of Noli Me Tangere', 'Letters from Blumentritt', 'Anti-friar handbills, Pobres Frailes', 'La Liga\'s constitution'], answer: 'C',
            why: 'The handbills attacked the friars, and authorities concluded Rizal wrote them.', page: 'p. 101' }
        ] },

      /* ------------------------------------------------------------ MEMBER 2 */
      { id: 'm2', member: 2, color: '#1F4E79', textColor: '#1F4E79', title: 'Arrest, Exile & Fr. Pastells', pages: 'pp. 102–103',
        steps: [
          S('title', { headline: 'Arrest and Exile', caption: 'Arrest, the voyage to Dapitan, and the letters with Fr. Pastells.', page: 'pp. 102–103',
            notes: ['Introduce yourself and your part.'] }),
          S('fort', { headline: 'Locked in Fort Santiago', caption: 'Governor General Despujol ordered Rizal arrested, detained, then exiled to the south.',
            labels: ['Fort Santiago'], page: 'p. 102', art: 'fort_santiago_gate',
            notes: ['His heavily monitored activities aggravated the case.'] }),
          S('voyage', { headline: 'Exiled to Dapitan', caption: 'Under heavy guard, Rizal was shipped south. In Dapitan he was handed to Capt. Ricardo Carnicero.',
            labels: ['steamer Cebu', 'Dapitan'], date: 'July 14 → 17, 1892', page: 'p. 102', art: 'sea_voyage',
            notes: ['Captain Delgas of the steamer Cebu handed him over.', 'Carnicero was the politico-military governor of Dapitan, an isolated outpost in northern Mindanao.'] }),
          S('offer', { headline: 'An offer with conditions', caption: 'Fr. Pastells had Fr. Obach invite Rizal to the mission house, with conditions. Rizal chose Carnicero\'s house.',
            labels: ['Mission house', 'Carnicero\'s house'], page: 'p. 102', art: 'two_doors',
            notes: ['Fr. Pablo Pastells, S.J., was the Jesuit superior and once Rizal\'s adviser at Ateneo.', 'Rizal was not amenable to the conditions.'] }),
          S('why', { headline: 'Why Zamboanga?', caption: 'The Spaniards made Zamboanga a first line of defense. Jesuit missions had their headquarters in Dapitan.',
            labels: ['Fort Pillar', 'Dapitan'], page: 'p. 102', art: 'zamboanga_inset', bonus: true,
            notes: ['Fort Zamboanga was founded in 1635; Fort Pillar stood in Cagang-Cagang (now Rio Hondo).'] }),
          S('letters', { headline: 'Faith versus reason', caption: 'From September 1892 to April 1893, Rizal and Fr. Pastells debated religion through letters.',
            date: 'Sept 1892 – Apr 1893', page: 'p. 102', art: 'chat_avatars',
            extra: { chat: [
              ['pastells', 'Here is a book by Sarda. Do not view religion by your personal judgment.'],
              ['rizal', 'Self-judgment was given to us by God. It should guide us.'],
              ['pastells', 'Do not rely on your own self-esteem in matters of faith.'],
              ['rizal', 'I respect others\' beliefs, but I value freedom of the mind.'],
              ['rizal', 'Reason led me to God. I trust in a just and loving Father.'] ] },
            notes: ['Rizal believed in the validity of individual reasoning.', 'Even his concept of God came from reason, not faith alone.'] }),
          S('friendship', { headline: 'From guard to friend', caption: 'Rizal\'s warm, cultivated manner won over Carnicero. He was allowed to move around town.',
            labels: ['Capt. Carnicero'], page: 'p. 103', art: 'carnicero_moods',
            notes: ['An authority is naturally hostile to an exile at first; that changed quickly.'] }),
          S('lottery', { headline: 'Scratch the ticket!', caption: 'Rizal, Carnicero and Francisco Equilor won second prize: P20,000. Rizal\'s share was P6,200.',
            date: 'Sept 21, 1892', page: 'p. 103', art: 'lottery_ticket',
            extra: { split: [['P2,000', 'his father'], ['P200', 'Jose Basa'], ['P4,000', 'land in Dapitan']] },
            notes: ['The news came by boat from Butuan.', 'Jose Basa had supported him in Hong Kong.', 'The rest bought land in Dapitan.'] })
        ],
        quiz: [
          { q: 'Why didn\'t Rizal live in the Jesuit mission house in Dapitan?',
            choices: ['The offer had conditions he wouldn\'t accept', 'It was too far from town', 'Capt. Carnicero forbade it', 'He planned to leave Dapitan soon'], answer: 'A',
            why: 'Fr. Pastells\' offer came with conditions, so Rizal lived with Capt. Carnicero.', page: 'p. 102' },
          { q: 'How much was Rizal\'s share of the lottery prize?',
            choices: ['P20,000', 'P2,000', 'P6,200', 'P200'], answer: 'C',
            why: 'Of P6,200: P2,000 to his father, P200 to Jose Basa, the rest for land.', page: 'p. 103' }
        ] },

      /* ------------------------------------------------------------ MEMBER 3 */
      { id: 'm3', member: 3, color: '#3E6B3A', textColor: '#3E6B3A', title: 'Life, Livelihood & Science', pages: 'pp. 103–104',
        steps: [
          S('title', { headline: 'Life in Dapitan', caption: 'Farming, trade, science and teaching: how Rizal lived in exile.', page: 'pp. 103–104',
            notes: ['Introduce yourself and your part.'] }),
          S('blumentritt', { headline: 'A letter to Blumentritt', caption: 'Rizal described his quiet but fruitful life in a letter to his friend Blumentritt.',
            date: 'Dec 19, 1893', page: 'p. 103', art: 'dapitan_village',
            more: '"I have many fruit trees, mangoes, lanzones, guyabanos, baluno, nangka… I have rabbits, dogs, cats."',
            notes: ['He had small boats, two canoes or barotos.', 'He could hear a clear brook from his house and see the sea.'] }),
          S('houses', { headline: 'Three houses', caption: 'Click each house to see who lived there.',
            labels: ['square', 'octagon', 'hexagon'], page: 'p. 103', art: 'house_square',
            extra: { who: { square: 'Rizal, his mother, sister Trinidad and a nephew', octagon: 'the boys / students he taught', hexagon: 'his chickens' } },
            notes: ['All three were made of bamboo and nipa.', 'In the octagonal house he taught boys arithmetic, Spanish and English.'] }),
          S('day', { headline: 'A day in Dapitan', caption: 'Drag the sun to follow Rizal\'s routine, from 5 a.m. to night.',
            page: 'p. 103', art: 'day_vignettes',
            extra: { times: [['5:00', 'Plants and chickens'], ['7:30', 'Breakfast'], ['Later', 'Treats poor patients'], ['Then', 'Into town by baroto'], ['12:00', 'Lunch'], ['Until 4 p.m.', 'Teaches the boys'], ['Night', 'Reads and studies']] },
            notes: ['Breakfast was tea, pastries, cheese and sweetmeats.', 'Afternoons went to agriculture.'] }),
          S('farmer', { headline: 'Rizal the farmer', caption: 'He bought land in Talisay, planted fruit trees and introduced European farming methods.',
            labels: ['Talisay', 'European methods'], page: 'p. 103', art: 'talisay_farm',
            notes: ['He also bought farming machinery.'] }),
          S('ponot', { headline: 'A colony that failed', caption: 'He planned a farming colony at Sitio Ponot for evicted Calamba farmers. Spain ignored it.',
            labels: ['Sitio Ponot'], page: 'p. 103', art: 'ponot_pin', bonus: true,
            notes: ['It was near Sindangan Bay; he invited relatives in exile to join.'] }),
          S('trader', { headline: 'Rizal the trader', caption: 'With Ramon Carreon he traded hemp and started a cooperative so locals could earn.',
            labels: ['hemp', 'Ramon Carreon'], page: 'p. 103', art: 'hemp_trade',
            notes: ['He taught modern planting, harvesting and manufacturing of hemp.', 'He sold it in Manila at a sizeable profit, giving him a stable income.'] }),
          S('europe', { headline: 'Letters to Europe', caption: 'European scientists wrote to Rizal for articles, specimens and reports.',
            page: 'p. 104', art: 'europe_letters',
            extra: { scientists: [
              ['Dr. Rost', 'London', 'Philippine dialects'], ['Dr. Joest', '', 'Moro bamboo messages'],
              ['Dr. Kheil', 'Prague', 'Butterflies of Mindanao'], ['Dr. Knuttel', 'Stuttgart', 'Volcanic eruptions'],
              ['Dr. Meyer', 'Dresden', 'Plant and animal samples'] ] },
            notes: ['Dr. A. B. Meyer of Dresden was his most constant correspondent and sent him books.'] }),
          S('species', { headline: 'New species discovered!', caption: 'Two animals Rizal sent were named after him: a frog and a beetle.',
            labels: ['Rhacophorus rizali', 'Apogonia rizali'], page: 'p. 104', art: 'specimen_frog',
            notes: ['Prof. Boettger named the frog Rhacophorus rizali.', 'Dr. Carl M. Heller named the small beetle Apogonia rizali.'] }),
          S('school', { headline: 'Rizal\'s school', caption: 'Sixteen boys paid no tuition. Instead, they worked on his projects.',
            labels: ['16 students'], page: 'p. 104', art: 'students',
            extra: { subjects: ['Reading & writing', 'Spanish & English', 'Geography & history', 'Mathematics', 'Nature study', 'Arnis & boxing', 'Swimming & boating'] },
            notes: ['They came from prominent Dapitan families.', 'The curriculum followed the European model, not the Spanish one.'] }),
          S('plaza', { headline: 'Improving the town', caption: 'With Fr. Francisco Sanchez he remodeled the plaza. He also built waterworks and a relief map.',
            labels: ['relief map', 'waterworks'], page: 'p. 104', art: 'plaza_before_after', bonus: true,
            notes: ['The relief map of Mindanao can still be viewed today.', 'The waterworks gave homes clean water.'] })
        ],
        quiz: [
          { q: 'According to his letter to Blumentritt, who lived in the octagonal house?',
            choices: ['Rizal, his mother, sister and nephew', 'His chickens', 'The boys he taught', 'His patients'], answer: 'C',
            why: 'Square: Rizal\'s family. Octagonal: his students. Hexagonal: his chickens.', page: 'p. 103' },
          { q: 'What was Rhacophorus rizali, named after Rizal?',
            choices: ['A beetle', 'A butterfly', 'A fruit tree', 'A frog'], answer: 'D',
            why: 'Prof. Boettger named the frog. The beetle was Apogonia rizali, named by Dr. Heller.', page: 'p. 104' }
        ] },

      /* ------------------------------------------------------------ MEMBER 4 */
      { id: 'm4', member: 4, color: '#C98A1B', textColor: '#8A5A0B', title: 'Workshop, Arts, Medicine & Departure', pages: 'pp. 105–106',
        steps: [
          S('title', { headline: 'The Inventor\'s Exile', caption: 'Inventions, art, medicine, love, and the road out of Dapitan.', page: 'pp. 105–106',
            notes: ['Introduce yourself and your part.'] }),
          S('lamps', { headline: 'Lighting Dapitan', caption: 'Click the lamp. Rizal lit the streets with coconut-oil lamps and drained marshes to fight malaria.',
            labels: ['coconut-oil lamp'], page: 'p. 105', art: 'night_street_lamps',
            notes: ['Draining the marshes took several months.'] }),
          S('workbench', { headline: 'Rizal the inventor', caption: 'He modeled a brick-making invention on a Belgian example and made a wooden lighter using compressed air.',
            labels: ['brick maker', 'wooden lighter'], page: 'p. 105', art: 'workbench',
            notes: ['The brick machine was modeled on a Belgian example.'] }),
          S('gallery', { headline: 'Poems from exile', caption: 'He wrote poems in Dapitan, including one his mother requested.',
            page: 'p. 105', art: 'poem_frames',
            extra: { poems: ['A Ricardo Carnicero', 'Hymn to the Talisay Tree', 'My Retreat', 'El Canto del Viajero'] },
            notes: ['Hymn to the Talisay Tree was written at his mother\'s request.', 'He also painted a Lenten backdrop for the Sisters of Charity chapel.'] }),
          S('sculpture', { headline: 'The Mother\'s Revenge', caption: 'His most popular sculpture remembers his dog Syria, whose puppy was devoured by a crocodile.',
            labels: ['Syria'], page: 'p. 105', art: 'mothers_revenge',
            notes: ['He made several sculptures in Dapitan; this is the most popular.'] }),
          S('linguist', { headline: 'Rizal the linguist', caption: 'He wrote a Tagalog grammar, learned Bisayan, studied Subanon, and compared Bisayan with Malay.',
            labels: ['Tagalog', 'Bisayan', 'Subanon', 'Malay'], page: 'p. 105', art: 'language_bubbles', bonus: true,
            notes: ['A comparative study of Bisayan and Malay.'] }),
          S('doctor', { headline: 'Doctor Rizal', caption: 'He operated on his mother\'s eyes and treated the poor for free.',
            labels: ['his mother', 'free care'], page: 'p. 105', art: 'doctor_rizal',
            notes: ['His mother and sister Maria lived with him for a year.', 'He used native medicinal plants; rich patients paid him well.', 'His fame spread beyond the Philippines.'] }),
          S('josephine', { headline: 'Josephine Bracken', caption: 'Mr. Tauffer came for treatment with Josephine. She and Rizal fell in love, but the Church refused to marry them.',
            page: 'p. 105', art: 'josephine_panels',
            extra: { panels: ['Tauffer and Josephine arrive', 'Love, and many obstacles', 'They live together', 'Baby Francisco, three hours'] },
            notes: ['George Tauffer, an American engineer, came with a letter from Julio Llorente.', 'Rizal diagnosed his blindness as incurable.', 'Their premature son Francisco lived three hours; Rizal baptized and buried him.', 'Present this part gently.'] }),
          S('vote', { headline: 'You are Rizal', caption: 'Dr. Pio Valenzuela brings news of a planned revolution. Do you support it?',
            date: 'June 21, 1896', page: 'p. 106', art: 'valenzuela_visit',
            extra: { reasons: ['The people were not ready', 'Not enough funds and arms', 'Military experts not on their side'] },
            notes: ['Valenzuela left Manila June 15 on the steamer Venus with a blind man, Raymundo Mata, as cover.', 'Rizal also refused the Katipunan\'s offer to rescue him.'] }),
          S('cuba', { headline: 'A way out: Cuba', caption: 'Rizal volunteered as a doctor in Cuba. Governor General Blanco finally accepted.',
            date: 'July 30, 1896', page: 'p. 106', art: 'cuba_letter',
            notes: ['Blumentritt had suggested it almost a year earlier.', 'He was promised a safe-conduct pass.'] }),
          S('farewell', { headline: 'Farewell, Dapitan', caption: 'He sold his lands and said goodbye. The España carried him to Manila.',
            labels: ['España'], date: 'July 31 → August 6, 1896', page: 'p. 106', art: 'sunset_farewell',
            extra: { counter: '4 years, 13 days' },
            notes: ['Even the captain came in full uniform to see him off.', 'Companions: Josephine, Narcisa, Angelica, three sons of Maria and two sons of Lucia.', 'His diary: four years, thirteen days and a few hours.'] })
        ],
        quiz: [
          { q: 'What did Rizal use to light the streets of Dapitan?',
            choices: ['Coconut-oil lamps', 'Kerosene lanterns', 'Electric bulbs', 'Wax candles'], answer: 'A',
            why: 'He devised a street-lighting system using lamps fueled with coconut oil.', page: 'p. 105' },
          { q: 'How did Rizal\'s exile in Dapitan come to an end in 1896?',
            choices: ['The governor general pardoned him', 'The Katipunan rescued him', 'His Cuba doctor offer was accepted', 'He escaped on the steamer España'], answer: 'C',
            why: 'Blanco accepted his Cuba offer on July 30, 1896, ending 4 years and 13 days.', page: 'p. 106' }
        ] },

      /* ------------------------------------------------------------ CLOSING */
      { id: 'closing', member: null, color: '#2E2117', textColor: '#2E2117', title: 'Closing', pages: 'Chapter 15',
        steps: [
          S('passport', { headline: 'Journey complete', caption: 'Four years, thirteen days, and a few hours in Dapitan.',
            page: 'pp. 101–106', art: 'stamps',
            notes: ['Show the stamped passport and team scores if used.'] }),
          S('thanks', { headline: 'Thank you!', caption: 'Next: Chapter 16, Rizal\'s Arrest and Trial.',
            page: 'Ch. 15', art: 'rizal_bust',
            notes: ['Thank the class. Invite questions.'] })
        ], quiz: [] }
    ]
  };
})(globalThis.Report = globalThis.Report || {});
if (typeof module !== 'undefined') module.exports = globalThis.Report;
