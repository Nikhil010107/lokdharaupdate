/* =========================================================
   LOKDHARA — India's Living Folk Heritage Database
   script.js — data, multilingual engine, views and tools
   Plain JavaScript, no external libraries.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. REFERENCE VOCABULARIES
   --------------------------------------------------------- */
const CATS = {
  D: { icon: '💃', color: '#ff6b4a', en: 'Folk Dances' },
  M: { icon: '🎶', color: '#ffb627', en: 'Folk Music' },
  I: { icon: '🥁', color: '#00d8c8', en: 'Folk Instruments' },
  F: { icon: '🪔', color: '#ff3d8b', en: 'Folk Festivals' },
  A: { icon: '🎨', color: '#8f7bff', en: 'Folk Arts & Crafts' },
  O: { icon: '📜', color: '#3ab8ff', en: 'Oral Traditions' },
  K: { icon: '🌿', color: '#7ddc5a', en: 'Traditional Knowledge' }
};

const PERIODS = {
  AN: { order: 1, en: 'Ancient', range: 'Prehistory – 600 CE', color: '#f2b705' },
  EM: { order: 2, en: 'Early Medieval', range: '600 – 1200 CE', color: '#ff7a59' },
  MD: { order: 3, en: 'Medieval', range: '1200 – 1750 CE', color: '#e8487a' },
  CL: { order: 4, en: 'Colonial Era', range: '1750 – 1947', color: '#8d86ff' },
  MO: { order: 5, en: 'Modern India', range: '1947 – 2026', color: '#1fb5a8' }
};

/* Vitality status — framed positively, with a score used in the Heritage Vitality Index */
const STATUS = {
  T: { order: 1, score: 100, color: '#2fd67b', en: 'Flourishing', note: 'Widely practised, joyfully passed on and growing in visibility.' },
  S: { order: 2, score: 80, color: '#00d8c8', en: 'Steady & Living', note: 'Practised regularly by its community with stable transmission.' },
  R: { order: 3, score: 75, color: '#8f7bff', en: 'Revived & Rising', note: 'Brought back to strength through revival efforts and new learners.' },
  N: { order: 4, score: 55, color: '#ffb627', en: 'Nurture Priority', note: 'Loved by its community and ready to flourish further with more support.' },
  V: { order: 5, score: 35, color: '#ff6b4a', en: 'Revival Priority', note: 'Held by a few dedicated bearers — a top priority for documentation and revival.' }
};

const REGIONS = ['North', 'Central', 'East', 'North-East', 'West', 'South', 'Islands'];

/* ---------------------------------------------------------
   2. STATES & UNION TERRITORIES
   [code, name, type, capital, region, languages, gridX, gridY]
   Grid positions form a tile cartogram of India.
   --------------------------------------------------------- */
const STATES_RAW = [
  ['AP', 'Andhra Pradesh', 'State', 'Amaravati', 'South', 'Telugu, Urdu, Lambadi', 4, 5],
  ['AR', 'Arunachal Pradesh', 'State', 'Itanagar', 'North-East', 'Nyishi, Adi, Monpa, Apatani, Galo, Hindi', 9, 1],
  ['AS', 'Assam', 'State', 'Dispur', 'North-East', 'Assamese, Bodo, Bengali, Mising, Karbi', 8, 2],
  ['BR', 'Bihar', 'State', 'Patna', 'East', 'Hindi, Maithili, Bhojpuri, Magahi, Angika', 5, 2],
  ['CG', 'Chhattisgarh', 'State', 'Raipur', 'Central', 'Chhattisgarhi, Hindi, Gondi, Halbi', 5, 4],
  ['GA', 'Goa', 'State', 'Panaji', 'West', 'Konkani, Marathi', 2, 5],
  ['GJ', 'Gujarat', 'State', 'Gandhinagar', 'West', 'Gujarati, Kutchi, Bhili', 1, 4],
  ['HR', 'Haryana', 'State', 'Chandigarh', 'North', 'Haryanvi, Hindi, Punjabi', 3, 2],
  ['HP', 'Himachal Pradesh', 'State', 'Shimla', 'North', 'Hindi, Pahari, Kangri, Kinnauri', 3, 1],
  ['JH', 'Jharkhand', 'State', 'Ranchi', 'East', 'Hindi, Santali, Nagpuri, Mundari, Ho, Kurukh', 5, 3],
  ['KA', 'Karnataka', 'State', 'Bengaluru', 'South', 'Kannada, Tulu, Kodava, Konkani', 3, 5],
  ['KL', 'Kerala', 'State', 'Thiruvananthapuram', 'South', 'Malayalam', 3, 6],
  ['MP', 'Madhya Pradesh', 'State', 'Bhopal', 'Central', 'Hindi, Malvi, Bundeli, Nimadi, Gondi, Bhili', 4, 3],
  ['MH', 'Maharashtra', 'State', 'Mumbai', 'West', 'Marathi, Varhadi, Konkani, Ahirani', 3, 4],
  ['MN', 'Manipur', 'State', 'Imphal', 'North-East', 'Meiteilon, Tangkhul, Thadou', 9, 3],
  ['ML', 'Meghalaya', 'State', 'Shillong', 'North-East', 'Khasi, Garo, Pnar', 8, 3],
  ['MZ', 'Mizoram', 'State', 'Aizawl', 'North-East', 'Mizo', 9, 4],
  ['NL', 'Nagaland', 'State', 'Kohima', 'North-East', 'Nagamese, Ao, Angami, Sumi, Konyak', 9, 2],
  ['OD', 'Odisha', 'State', 'Bhubaneswar', 'East', 'Odia, Sambalpuri, Santali, Kui', 6, 4],
  ['PB', 'Punjab', 'State', 'Chandigarh', 'North', 'Punjabi', 2, 1],
  ['RJ', 'Rajasthan', 'State', 'Jaipur', 'West', 'Hindi, Marwari, Mewari, Dhundhari', 2, 3],
  ['SK', 'Sikkim', 'State', 'Gangtok', 'North-East', 'Nepali, Bhutia, Lepcha, Limbu', 6, 2],
  ['TN', 'Tamil Nadu', 'State', 'Chennai', 'South', 'Tamil', 4, 6],
  ['TS', 'Telangana', 'State', 'Hyderabad', 'South', 'Telugu, Urdu, Lambadi, Gondi', 4, 4],
  ['TR', 'Tripura', 'State', 'Agartala', 'North-East', 'Bengali, Kokborok', 8, 4],
  ['UP', 'Uttar Pradesh', 'State', 'Lucknow', 'North', 'Hindi, Awadhi, Bhojpuri, Braj, Bundeli, Urdu', 4, 2],
  ['UK', 'Uttarakhand', 'State', 'Dehradun', 'North', 'Garhwali, Kumaoni, Hindi, Jaunsari', 4, 1],
  ['WB', 'West Bengal', 'State', 'Kolkata', 'East', 'Bengali, Santali, Nepali, Rajbanshi', 6, 3],
  ['AN', 'Andaman & Nicobar Islands', 'Union Territory', 'Sri Vijaya Puram', 'Islands', 'Bengali, Hindi, Tamil, Nicobarese', 7, 6],
  ['CH', 'Chandigarh', 'Union Territory', 'Chandigarh', 'North', 'Punjabi, Hindi', 2, 2],
  ['DN', 'Dadra & Nagar Haveli and Daman & Diu', 'Union Territory', 'Daman', 'West', 'Gujarati, Marathi, Varli, Konkani', 2, 4],
  ['DL', 'Delhi', 'Union Territory', 'New Delhi', 'North', 'Hindi, Punjabi, Urdu', 3, 3],
  ['JK', 'Jammu & Kashmir', 'Union Territory', 'Srinagar (summer), Jammu (winter)', 'North', 'Kashmiri, Dogri, Urdu, Gojri, Pahari', 3, 0],
  ['LA', 'Ladakh', 'Union Territory', 'Leh', 'North', 'Ladakhi (Bhoti), Purgi, Balti', 4, 0],
  ['LD', 'Lakshadweep', 'Union Territory', 'Kavaratti', 'Islands', 'Malayalam, Jeseri, Mahl', 1, 6],
  ['PY', 'Puducherry', 'Union Territory', 'Puducherry', 'South', 'Tamil, French, Telugu, Malayalam', 5, 6]
];
const STATES = STATES_RAW.map(s => ({ c: s[0], n: s[1], type: s[2], cap: s[3], reg: s[4], lang: s[5], x: s[6], y: s[7] }));
const STATE = Object.fromEntries(STATES.map(s => [s.c, s]));

/* ---------------------------------------------------------
   3. TRADITIONS DATABASE
   [name, category, state, districts/areas, period, status, description, tags]
   Category: D dance, M music, I instrument, F festival, A arts & crafts,
             O oral tradition, K traditional knowledge
   Period:   AN ancient, EM early medieval, MD medieval, CL colonial era, MO modern
   Status:   T flourishing, S steady, R revived, N nurture priority, V revival priority
   Tags:     UNESCO (Representative List element), GI (Geographical Indication)
   --------------------------------------------------------- */
const RAW = [
/* ===== Andhra Pradesh ===== */
['Dhimsa','D','AP','Alluri Sitharama Raju, Visakhapatnam','AN','T','Circle dance of the Porja, Kondh and Bagata communities of the Araku hills, danced in joyful linked rows to drums and flutes at festivals and weddings.'],
['Veeranatyam','D','AP','East Godavari, Konaseema','MD','S','The "dance of the brave", offered in Shiva temples by the Veeramusti community with fire-lit plates and tridents.'],
['Tappeta Gullu','D','AP','Srikakulam, Vizianagaram','MD','S','Energetic dance in which performers wear tappeta drums around the neck and invoke the village goddess for rain and prosperity.'],
['Butta Bommalu','D','AP','West Godavari','CL','S','The colourful "basket toys" dance, where artists in giant light masks delight crowds at festivals and processions.'],
['Burra Katha','O','AP','Guntur, Krishna, East Godavari','CL','N','Narrative ballad led by a storyteller with a tambura and two companions on drums, cherished for sharing history and social awareness.'],
['Tholu Bommalata','A','AP','Sri Sathya Sai (Nimmalakunta)','AN','N','Translucent, vividly painted leather shadow puppets crafted by master families of Nimmalakunta for epic performances.','GI'],
['Kalamkari','A','AP','Tirupati (Srikalahasti), Krishna (Machilipatnam)','MD','T','Hand-painted and block-printed textiles in natural dyes; Srikalahasti pen-work narrates the epics while Machilipatnam prints carry flowing floral motifs.','GI'],
['Kondapalli Toys','A','AP','NTR (Kondapalli)','MD','S','Light toys carved from soft tella poniki wood and painted in bright colours, portraying village life, deities and animals.','GI'],
['Etikoppaka Toys','A','AP','Anakapalli (Etikoppaka)','MD','T','Lacquer-turned wooden toys coloured with dyes from seeds, bark and leaves — smooth, safe and eco-friendly.','GI'],
['Bobbili Veena','I','AP','Vizianagaram (Bobbili)','CL','S','Veena carved from a single block of jackfruit wood by artisans of Gollapalli, prized for its resonant tone.','GI'],
['Sankranti (Pedda Panduga)','F','AP','All districts','AN','T','Four-day harvest festival with Haridasu singers, decorated Gangireddu bulls, muggulu designs and family feasts.'],
['Araku Tribal Coffee Farming','K','AP','Alluri Sitharama Raju (Araku)','MO','T','Tribal farmers grow shade-grown Arabica with organic, forest-friendly practices, recognised with a GI tag in 2019.','GI'],

/* ===== Arunachal Pradesh ===== */
['Ponung','D','AR','East Siang, Siang, Upper Siang','AN','S','Adi women\'s circle dance led by a Miri singer before harvest, praying for a bountiful crop during Solung.'],
['Aji Lhamu','D','AR','Tawang, West Kameng','EM','S','Masked Monpa dance-drama narrating tales of goddesses and kings, performed during Losar and monastery festivals.'],
['Monpa Yak Dance','D','AR','Tawang, West Kameng','EM','S','Joyful pantomime celebrating the discovery of the yak, with dancers inside a colourful yak costume and a masked rider.'],
['Solung','F','AR','East Siang, Siang, Lower Dibang Valley','AN','T','Adi agricultural festival of September with songs, Ponung dances and prayers for crops and livestock.'],
['Losar of the Monpas','F','AR','Tawang, West Kameng','EM','T','Monpa new year welcomed with prayer flags, monastery rituals and warm family gatherings.'],
['Dree','F','AR','Lower Subansiri (Ziro)','AN','T','Apatani festival of July praying for a healthy harvest, with community feasts, songs and traditional games.'],
['Nyokum','F','AR','Papum Pare, Kra Daadi, Kurung Kumey','AN','T','Nyishi festival honouring the deities of earth and sky, celebrated each February by all communities together.'],
['Apatani Weaving','A','AR','Lower Subansiri','AN','S','Geometric textiles woven on backstrap looms by Apatani women, recognised with a GI tag.','GI'],
['Mon Shugu Paper','A','AR','Tawang','MD','R','Handmade paper from the bark of the shugu sheng tree, used for Buddhist scriptures and renewed through community training.'],
['Wancho Woodcarving','A','AR','Longding','AN','N','Expressive wooden figures and panels carved by Wancho artisans, reflecting community life and ancestral memory.'],
['Abang Oral Chants','O','AR','East Siang, Upper Siang','AN','N','Sacred narratives of the Adi recited by Miri priests, preserving the origin stories and genealogy of the Tani people.'],
['Apatani Rice-Fish Farming','K','AR','Lower Subansiri (Ziro)','AN','T','Wet-rice terraces where fish are raised alongside paddy, sustained by a community-managed irrigation network in the Ziro valley.'],

/* ===== Assam ===== */
['Bihu Dance','D','AS','Sivasagar, Dibrugarh, Jorhat, all districts','AN','T','Joyful dance of Rongali Bihu with swift hand movements, graceful sways and the call of the pepa horn welcoming spring.'],
['Bagurumba','D','AS','Kokrajhar, Chirang, Baksa, Udalguri','AN','T','The graceful "butterfly dance" of Bodo women in vibrant dokhona, celebrating nature during Bwisagu.'],
['Jhumur','D','AS','Tinsukia, Dibrugarh, Jorhat, Golaghat','CL','T','Dance of the tea garden communities, with women linking arms in rows to the madal and flute.'],
['Ojapali','D','AS','Darrang, Kamrup','MD','N','Chorus narrative performance where the lead Oja sings the epics while the Palis accompany with cymbals and gestures.'],
['Borgeet','M','AS','Majuli, Barpeta, Nagaon','MD','S','Devotional songs composed by Srimanta Sankaradeva and Madhavadeva in the 15th–16th centuries, sung in Sattras to classical ragas.'],
['Zikir and Zari','M','AS','Sivasagar','MD','S','Sufi devotional songs attributed to Ajan Fakir in the 17th century, spreading messages of harmony and unity.'],
['Pepa and Gogona','I','AS','All districts','AN','S','The buffalo-horn pepa and the bamboo jaw harp gogona give Bihu music its unmistakable festive sound.'],
['Rongali Bihu','F','AS','All districts','AN','T','Assamese new year in April celebrating spring and sowing, with Husori carol groups, feasts and cattle blessing.'],
['Ali-Aye-Ligang','F','AS','Dhemaji, Lakhimpur, Majuli','AN','T','Mising festival marking the start of sowing, with Gumrag dances and community feasts.'],
['Raas Mahotsav of Majuli','F','AS','Majuli','MD','T','Sattra-led theatrical celebration of Krishna\'s life, performed each November across Majuli island.'],
['Muga Silk','A','AS','Kamrup (Sualkuchi), Lakhimpur, Sivasagar','AN','T','Golden silk unique to Assam, woven into mekhela chador at Sualkuchi, the celebrated weaving village.','GI'],
['Majuli Mask Making','A','AS','Majuli','MD','T','Sattra artists shape bamboo, clay and cloth into expressive masks for Bhaona theatre.','GI'],
['Sarthebari Bell Metal','A','AS','Barpeta (Sarthebari)','MD','S','Bell-metal utensils, bota trays and sorai crafted by the traditional artisans of Sarthebari.'],
['Ankiya Naat and Bhaona','O','AS','Majuli, Barpeta, Nagaon','MD','T','One-act plays created by Sankaradeva and staged as Bhaona in Namghars, blending music, dance and storytelling.'],
['Burhi Aair Xadhu','O','AS','All districts','AN','S','"Grandmother\'s tales" of Assam, collected by Lakshminath Bezbaroa in 1911 and still loved by children.'],
['Ahom Buranji Chronicles','K','AS','Sivasagar, Charaideo','MD','S','Historical chronicles kept by the Ahom kingdom from the 13th century, a rich record of governance and society.'],

/* ===== Bihar ===== */
['Jat-Jatin','D','BR','Madhubani, Darbhanga, Saharsa','MD','N','Mithila couple dance-drama performed on moonlit monsoon nights, singing of love and the longing for rain.'],
['Jhijhiya','D','BR','Madhubani, Darbhanga, Sitamarhi','MD','S','Women dance with lamp-lit perforated pots on their heads during Navratri, praying for protection and well-being.'],
['Bidesia','O','BR','Saran, Bhojpur, Buxar','CL','R','Folk theatre shaped by Bhikhari Thakur (1887–1971), voicing the life of migrants with music, wit and warmth.'],
['Sohar and Kajri','M','BR','Bhojpur, Rohtas, Patna','MD','S','Sohar celebrates childbirth and Kajri welcomes the monsoon — life-cycle songs sung by women across Bhojpuri Bihar.'],
['Chhath Geet','M','BR','All districts','AN','T','Devotional songs sung by families on the ghats during Chhath Puja, carried lovingly across generations.'],
['Vidyapati Songs','M','BR','Madhubani, Darbhanga','MD','S','Maithili lyrics of the poet Vidyapati (14th–15th century), still central to weddings and festivals of Mithila.'],
['Chhath Puja','F','BR','All districts, Patna','AN','T','Four-day offering to the Sun and Chhathi Maiya at rivers and ponds, admired for its purity, discipline and community spirit.'],
['Sonepur Mela','F','BR','Saran (Sonepur)','AN','T','Month-long Kartik Purnima fair at the confluence of the Gandak and the Ganga, among Asia\'s oldest fairs.'],
['Sama-Chakeva','F','BR','Madhubani, Darbhanga','MD','S','Mithila festival celebrating the bond of brothers and sisters with clay figurines and songs.'],
['Madhubani Painting','A','BR','Madhubani, Darbhanga','AN','T','Mithila art of fine lines and natural colours, grown from wall and floor painting into celebrated works on paper and cloth.','GI'],
['Sikki Grass Craft','A','BR','Madhubani, Sitamarhi','MD','S','Golden sikki grass woven into boxes, toys and figurines by women artisans.','GI'],
['Manjusha Art','A','BR','Bhagalpur','MD','R','Scroll-style painting narrating the tale of Bihula and Bishahari, revived through training and GI recognition.','GI'],
['Sujani Embroidery','A','BR','Muzaffarpur','CL','S','Layered running-stitch quilts that tell stories of women\'s lives, nurtured by self-help groups.','GI'],
['Mithila Makhana','K','BR','Darbhanga, Madhubani, Purnia','AN','T','Traditional pond cultivation and popping of fox nuts, a knowledge system of the Mallah community.','GI'],

/* ===== Chhattisgarh ===== */
['Panthi','D','CG','Durg, Bemetara, Raipur','CL','T','Devotional dance of the Satnami community honouring Guru Ghasidas, rising to an exhilarating tempo.'],
['Raut Nacha','D','CG','Bilaspur, Raipur, Durg','MD','T','Yadav community dance after Diwali with sticks, dohas and colourful costumes; Bilaspur hosts a grand annual gathering.'],
['Suwa Nacha','D','CG','All districts','MD','S','Women dance in circles around a parrot figure in a basket, singing songs of love and harvest.'],
['Gaur Maria Dance','D','CG','Dantewada, Bijapur, Bastar','AN','S','Bison-horn headdress dance of the Dandami Maria, celebrating the strength and grace of the Indian bison.'],
['Karma Dance','D','CG','Surguja, Jashpur, Korba','AN','T','Dance around the Karam tree branch celebrating nature, fertility and friendship.'],
['Pandavani','O','CG','Durg, Raipur','MD','S','Solo narration of the Mahabharata with tambura and gesture, made world-famous by Padma Vibhushan Teejan Bai.'],
['Bastar Dussehra','F','CG','Bastar (Jagdalpur)','MD','T','A 75-day festival honouring goddess Danteshwari, with a giant wooden chariot drawn by tribal communities.'],
['Madai Festival','F','CG','Bastar, Kanker, Kondagaon','AN','T','Travelling tribal fairs of village deities and communities through the winter months.'],
['Bastar Dhokra','A','CG','Kondagaon, Bastar','AN','T','Lost-wax metal casting by the Ghadwa artisans, creating deities, animals and lamps.','GI'],
['Bastar Wrought Iron','A','CG','Kondagaon, Bastar','AN','S','Hand-forged iron figures of animals, lamps and deities made by Lohar artisans.','GI'],
['Kosa Silk','A','CG','Janjgir-Champa, Raigarh','MD','T','Rich tussar silk woven around Champa, admired for its natural golden sheen.'],
['Ghotul Tradition','K','CG','Narayanpur, Kondagaon','AN','N','Muria youth dormitory where young people learn songs, dances, crafts and community values.'],

/* ===== Goa ===== */
['Fugdi','D','GA','North Goa, South Goa','MD','S','Women\'s circle dance during Ganesh Chaturthi and Bhadrapada, with rhythmic breaths, claps and songs.'],
['Dhalo','D','GA','North Goa, South Goa','MD','S','Women\'s dance on moonlit winter nights, praying for the well-being of family and village.'],
['Dekhni','D','GA','South Goa','CL','S','Graceful song-dance blending Indian rhythm with Western melody, telling of a dancer and a ferryman.'],
['Mando','M','GA','South Goa (Salcete)','CL','N','Slow, romantic Konkani song-dance of the 19th century, kept glowing by the annual Mando festival.'],
['Ghumot','I','GA','North Goa, South Goa','MD','R','Earthen drum, now made with goatskin, celebrated as Goa\'s heritage instrument and heard at every festive gathering.'],
['Shigmo','F','GA','North Goa, South Goa','MD','T','Spring festival with Romta Mel processions, colourful floats and folk dances across Goa.'],
['Sao Joao','F','GA','North Goa (Siolim)','CL','T','Monsoon feast where youth leap into wells and streams wearing leaf crowns called kopel, celebrating joy and friendship.'],
['Bonderam','F','GA','North Goa (Divar Island)','CL','S','Flag festival of Divar island with colourful floats and music every August.'],
['Kunbi Weave','A','GA','South Goa','AN','R','Red-and-white checked saree of the Kunbi community, revived by designers and weavers.'],
['Tiatr','O','GA','North Goa, South Goa','CL','T','Konkani musical theatre first staged in 1892, blending drama with "kantaram" songs on social themes.'],
['Khazan Farming','K','GA','North Goa, South Goa','AN','N','Community-managed coastal fields where sluice gates balance salt water, fish and rice farming.'],
['Goan Feni','K','GA','North Goa, South Goa','CL','T','Traditional distillation of cashew feni in earthen pots, recognised with a GI tag.','GI'],

/* ===== Gujarat ===== */
['Garba','D','GJ','Ahmedabad, Vadodara, all districts','AN','T','Circular devotional dance around the garbo lamp during Navratri, inscribed on the UNESCO Representative List in 2023.','UNESCO'],
['Dandiya Raas','D','GJ','Rajkot, Vadodara, Ahmedabad','AN','T','Energetic stick dance linked to Krishna\'s raas, danced in pairs during Navratri.'],
['Tippani','D','GJ','Gir Somnath (Chorwad)','MD','N','Work dance of women beating floors with long wooden tippani sticks, turning labour into music.'],
['Siddi Dhamal','D','GJ','Gir Somnath (Jambur), Junagadh','MD','S','Afro-Indian Siddi dance with drums and shells, celebrating devotion to Bava Gor.'],
['Bhavai','O','GJ','Mehsana, Patan, Banaskantha','MD','N','Folk theatre attributed to Asait Thakar (14th century), with satirical episodes called veshas.'],
['Dayro','M','GJ','Rajkot, Bhavnagar, Kutch','MD','T','Evening gathering of folk songs, bhajans and tales, beloved across Saurashtra.'],
['Jodiya Pawa','I','GJ','Kutch','MD','N','Double flute of the herders of Kutch, producing a continuous drone with a flowing melody.'],
['Rann Utsav','F','GJ','Kutch','MO','T','Winter festival on the white desert of Kutch showcasing folk music, crafts and hospitality.'],
['Tarnetar Mela','F','GJ','Surendranagar','AN','T','Fair at the Trinetreshwar temple famed for embroidered umbrellas and the folk dances of Saurashtra.'],
['Patan Patola','A','GJ','Patan','EM','S','Double-ikat silk woven by the Salvi families with mathematical precision, identical on both sides.','GI'],
['Rogan Art','A','GJ','Kutch (Nirona)','MD','R','Painting with thickened castor oil drawn by a metal stylus, lovingly carried forward by the Khatri family of Nirona.'],
['Ajrakh Print','A','GJ','Kutch (Ajrakhpur)','AN','T','Resist-dyed block print in indigo and madder, carried forward by the Khatri artisans of Ajrakhpur.','GI'],
['Kutch Embroidery','A','GJ','Kutch','MD','T','Mirror work in many community styles — Rabari, Ahir, Soof, Mutwa — stitched with pride.','GI'],
['Pithora Painting','A','GJ','Chhota Udepur','AN','S','Ritual wall paintings of the Rathwa community featuring horses and deities, painted as blessings.'],
['Mata ni Pachedi','A','GJ','Ahmedabad','MD','S','Painted and printed shrine cloths of the Mother Goddess made by the Devipujak community.','GI'],
['Vav Stepwell Wisdom','K','GJ','Patan, Ahmedabad','EM','S','Ornate stepwells such as Rani ki Vav (11th century, UNESCO World Heritage 2014) reflect deep water-conservation knowledge.'],
['Maldhari Pastoralism','K','GJ','Kutch (Banni), Gir Somnath','AN','S','Herding communities caring for the Banni grasslands and Gir forest with indigenous cattle, buffalo and Kharai camels.'],

/* ===== Haryana ===== */
['Phag Dance','D','HR','Rohtak, Jhajjar, Bhiwani','MD','S','Spring dance of farming families in Phalgun, celebrated in colourful attire after the fields turn golden.'],
['Loor','D','HR','Kaithal, Jind','MD','N','Girls\' dance of spring with question-and-answer songs, performed in the Bangar region.'],
['Khoria','D','HR','Rohtak, Jhajjar','MD','S','Women\'s dance performed during weddings while the baraat is away, full of humour and song.'],
['Saang','O','HR','Rohtak, Sonipat','CL','R','Open-air musical theatre shaped by Pandit Lakhmi Chand, fondly called the "Kalidas of Haryana".'],
['Ragini','M','HR','All districts','CL','T','Folk song form presenting stories in poetic verse, popular in lively rural competitions.'],
['Been and Nagada','I','HR','All districts','MD','N','The reed been and the nagada drum form the pulse of Haryanvi folk celebrations.'],
['Surajkund Crafts Mela','F','HR','Faridabad','MO','T','International crafts fair held every February since 1987, celebrating artisans from every state.'],
['Haryali Teej','F','HR','All districts','AN','T','Monsoon festival of swings, songs and sweets, celebrated with joyful state-level melas.'],
['Haryana Phulkari','A','HR','Hisar, Rohtak','MD','S','Bright floral embroidery on cotton shawls, a heritage shared with Punjab.','GI'],
['Panipat Handloom','A','HR','Panipat','CL','T','Handwoven durries and furnishings from Panipat, one of India\'s great handloom hubs.'],
['Johad Water Tradition','K','HR','Rohtak, Jhajjar','AN','N','Village ponds and earthen check-dams that recharge groundwater and sustain cattle.'],
['Hariana Cattle and Murrah Buffalo','K','HR','Hisar, Rohtak, Jind','AN','S','Traditional rearing of indigenous breeds prized worldwide for strength and milk.'],

/* ===== Himachal Pradesh ===== */
['Kullu Nati','D','HP','Kullu, Mandi, Shimla','AN','T','Graceful slow-step group dance; a mass performance at Kullu Dussehra entered the Guinness World Records in 2015.'],
['Gaddi Dance','D','HP','Chamba, Kangra','AN','S','Dance of the Gaddi shepherds celebrating seasons and migration, performed in the iconic Gaddi dress.'],
['Kayang','D','HP','Kinnaur','AN','S','Kinnauri circle dance in traditional woollens, moving to the rhythm of drums during festivals.'],
['Shan Dance','D','HP','Lahaul & Spiti','EM','S','Dance of Lahaul celebrating the new harvest and Buddhist festivals.'],
['Jhoori and Laman','M','HP','Mandi, Shimla, Kullu','MD','S','Romantic question-and-answer songs of the hills, sung in fields and high pastures.'],
['Karnal and Ransingha','I','HP','Kullu, Mandi, Shimla','AN','S','Long brass trumpets heralding the processions of village deities across Himachal.'],
['Kullu Dussehra','F','HP','Kullu (Dhalpur)','MD','T','Week-long gathering of village deities around Raghunath ji at Dhalpur maidan, a tradition dating to the 17th century.'],
['Minjar Mela','F','HP','Chamba','MD','T','Chamba\'s harvest fair, marked by silk minjar tassels, processions and folk music.'],
['Chamba Rumal','A','HP','Chamba','MD','R','Double-sided embroidery that paints miniatures in silk thread, revived by women artisans.','GI'],
['Kullu and Kinnauri Shawls','A','HP','Kullu, Kinnaur','MD','T','Geometric woollen shawls woven on pit and frame looms.','GI'],
['Kangra Painting','A','HP','Kangra','CL','S','Lyrical miniature paintings of Krishna and nature, flourishing since the 18th century.','GI'],
['Kath-Kuni Architecture','K','HP','Kullu, Mandi, Shimla','AN','N','Alternating layers of wood and stone that make homes resilient to earthquakes and snow.'],
['Kuhl Irrigation','K','HP','Kangra, Mandi','MD','S','Community-managed mountain channels distributing glacial water under a village kohli.'],

/* ===== Jharkhand ===== */
['Seraikela Chhau','D','JH','Seraikela Kharsawan','MD','T','Masked martial dance of lyrical grace, part of the Chhau tradition inscribed by UNESCO in 2010.','UNESCO'],
['Paika Dance','D','JH','Khunti, Ranchi, Gumla','MD','S','Martial dance with swords and shields celebrating the valour of Munda warriors.'],
['Jhumair','D','JH','Ranchi, Khunti, Gumla','AN','T','Joyful harvest dance of the Nagpuri region, danced in linked rows.'],
['Santhal Dance','D','JH','Dumka, Pakur, Godda','AN','T','Graceful rows of Santhal women dancing to drums and flutes at Sohrai and Baha festivals.'],
['Banam','I','JH','Dumka, Sahibganj','AN','N','Carved wooden fiddle of the Santhals, often shaped with human figures.'],
['Mandar and Nagara','I','JH','All districts','AN','T','The double-headed mandar and the kettle-drum nagara power every akhra dance.'],
['Sarhul','F','JH','Ranchi, Gumla, Lohardaga','AN','T','Spring festival honouring the sal tree and nature with sal-flower offerings and dances.'],
['Karma Festival','F','JH','All districts','AN','T','Celebration of the Karam tree, brotherhood and prosperity with night-long dances.'],
['Sohrai and Khovar Painting','A','JH','Hazaribagh','AN','S','Mud-colour mural art painted by women for harvest and marriage, recognised with a GI tag in 2020.','GI'],
['Paitkar Painting','A','JH','East Singhbhum (Amadubi)','MD','V','Scroll paintings narrating life and afterlife, treasured by a small circle of artists in Amadubi.'],
['Santhali Oral Literature and Ol Chiki','O','JH','Dumka, East Singhbhum','CL','T','Rich Santhali oral heritage that found its own script, Ol Chiki, created by Pandit Raghunath Murmu in 1925.'],
['Akhra Tradition','O','JH','All districts','AN','N','The village dance ground where elders pass on songs, stories and customs to young people.'],
['Sarna Sacred Groves','K','JH','All districts','AN','S','Sacred sal groves protected by communities, preserving biodiversity and faith.'],

/* ===== Karnataka ===== */
['Yakshagana','D','KA','Udupi, Dakshina Kannada, Uttara Kannada','MD','T','Night-long dance-theatre with grand costumes, bhagavata singing and chande drums, loved across coastal Karnataka.'],
['Dollu Kunitha','D','KA','Shivamogga, Chitradurga','MD','T','Powerful drum dance of the Kuruba community with heavy dollu drums and acrobatic formations.'],
['Kamsale','D','KA','Mysuru, Chamarajanagar, Mandya','MD','S','Devotees of Male Mahadeshwara dance with bronze cymbals in intricate rhythmic patterns.'],
['Veeragase','D','KA','Mysuru, Chitradurga','MD','S','Vigorous dance recounting the legend of Veerabhadra, performed during Dasara.'],
['Huli Vesha','D','KA','Udupi, Dakshina Kannada','CL','T','Tiger-painted dancers electrify Dasara and Krishna Janmashtami processions.'],
['Bhuta Kola','F','KA','Dakshina Kannada, Udupi','AN','T','Ritual performance of Tulu Nadu honouring spirit deities, with elaborate costumes and oral paddanas.'],
['Kambala','F','KA','Dakshina Kannada, Udupi','AN','T','Buffalo race through slushy paddy fields celebrating the harvest season.'],
['Mysuru Dasara','F','KA','Mysuru','MD','T','Grand state festival tracing to the Vijayanagara era, with the Jamboo Savari procession and the illuminated palace.'],
['Channapatna Toys','A','KA','Bengaluru South (Channapatna)','CL','T','Lacquered wooden toys shaped on lathes, a safe and colourful craft.','GI'],
['Bidriware','A','KA','Bidar','MD','S','Blackened zinc alloy inlaid with silver, a craft from the Bahmani era.','GI'],
['Mysore Silk','A','KA','Mysuru','CL','T','Pure silk sarees with gold zari, woven at the Mysuru factory since 1912.','GI'],
['Ilkal Sarees','A','KA','Bagalkot (Ilkal)','MD','S','Cotton-silk sarees with the distinctive tope teni technique of joining the border.','GI'],
['Togalu Gombeyata','O','KA','Ballari, Chitradurga','MD','V','Leather shadow puppetry narrating the epics with vivid painted figures.'],
['Siri Paddana','O','KA','Dakshina Kannada, Udupi','MD','S','Tulu oral epic of Siri, sung by women during paddy planting and at the Siri Jatre.'],
['Devarakadu Sacred Groves','K','KA','Kodagu, Shivamogga','AN','S','Community-protected sacred forests that conserve springs and rare species.'],

/* ===== Kerala ===== */
['Theyyam','D','KL','Kannur, Kasaragod','AN','T','Ritual dance-worship in which performers become deities, with breathtaking costumes and face painting.'],
['Mudiyettu','D','KL','Ernakulam, Thrissur, Kottayam','MD','S','Ritual dance-drama of Goddess Kali\'s victory over Darika, inscribed by UNESCO in 2010.','UNESCO'],
['Koodiyattam','D','KL','Thrissur, Ernakulam','AN','S','Sanskrit theatre of Kerala with a continuous history of over a thousand years, inscribed by UNESCO in 2008.','UNESCO'],
['Thiruvathirakali','D','KL','All districts','MD','T','Graceful women\'s circle dance on Thiruvathira in the month of Dhanu, celebrating harmony in family life.'],
['Oppana','D','KL','Malappuram, Kozhikode','MD','T','Mappila bridal song-dance with rhythmic clapping, performed by women at weddings.'],
['Margamkali','D','KL','Kottayam, Pathanamthitta','MD','S','Saint Thomas Christian circle dance around a lamp, admired for its spiritual charm.'],
['Pulikali','D','KL','Thrissur','CL','T','Tiger-painted street dance performed on the fourth day of Onam in Thrissur.'],
['Padayani','F','KL','Pathanamthitta, Alappuzha','AN','S','Temple ritual art with towering painted areca-sheath masks called kolams, drums and songs.'],
['Panchavadyam','I','KL','Thrissur, Palakkad','MD','T','Five-instrument temple ensemble of timila, maddalam, ilathalam, idakka and kombu.'],
['Chenda','I','KL','All districts','AN','T','Cylindrical drum that powers Chenda melam, Kathakali and Theyyam.'],
['Vadakkan Pattukal','O','KL','Kozhikode, Kannur','MD','S','Northern ballads celebrating heroes such as Thacholi Othenan and Unniyarcha.'],
['Onam','F','KL','All districts','AN','T','Harvest festival welcoming King Mahabali with pookalam, sadya, boat races and games.'],
['Thrissur Pooram','F','KL','Thrissur','CL','T','Temple festival begun by Sakthan Thampuran in the late 18th century, famed for caparisoned elephants and percussion.'],
['Aranmula Kannadi','A','KL','Pathanamthitta (Aranmula)','MD','S','Metal-alloy mirror made by a treasured family formula of the Aranmula artisans.','GI'],
['Kerala Mural Painting','A','KL','Thrissur, Ernakulam','EM','T','Temple and palace murals in natural pigments, taught today at Guruvayur\'s mural institute.'],
['Kalaripayattu','K','KL','Kannur, Kozhikode, Thiruvananthapuram','EM','T','Ancient martial art integrating combat, marma healing and body conditioning.'],
['Pokkali Rice Farming','K','KL','Ernakulam, Alappuzha','AN','N','Salt-tolerant rice grown in rotation with prawns in coastal wetlands.','GI'],

/* ===== Madhya Pradesh ===== */
['Matki Dance','D','MP','Ujjain, Indore, Dewas','MD','S','Malwa women dance balancing earthen pots on their heads at weddings and festivals.'],
['Rai Dance','D','MP','Sagar, Chhatarpur, Tikamgarh','MD','S','Bundelkhand\'s dazzling night dance to the mridang, celebrating harvest and festivities.'],
['Badhai Dance','D','MP','Sagar, Damoh','MD','S','Joyful dance performed at childbirth and weddings in gratitude to the gods.'],
['Gond Karma and Saila','D','MP','Dindori, Mandla, Balaghat','AN','T','Gond communities dance Karma and the stick-dance Saila to the mandar at festivals.'],
['Alha Gayan','O','MP','Chhatarpur, Panna, Sagar','MD','S','Heroic ballad of Alha and Udal sung during the monsoon, based on Jagnik\'s 12th-century epic.'],
['Nirgun Bhajans of Malwa','M','MP','Dewas, Ujjain, Indore','MD','T','Kabir\'s nirgun songs sung by Malwa\'s village bhajan groups, led by artists such as Padma Shri Prahlad Tipaniya.'],
['Bhagoria Haat','F','MP','Jhabua, Alirajpur, Dhar','AN','T','Colourful Bhil and Bhilala market festival before Holi, filled with music and dance.'],
['Lokrang','F','MP','Bhopal','MO','T','Annual Republic Day season festival in Bhopal showcasing folk and tribal arts from across India.'],
['Gond Painting','A','MP','Dindori (Patangarh), Mandla','AN','T','Dot-and-line paintings of nature and myth, carried to the world by Jangarh Singh Shyam.','GI'],
['Bhil Art','A','MP','Jhabua, Alirajpur','AN','T','Dotted paintings of village life and ritual, championed by Padma Shri Bhuri Bai.'],
['Chanderi Saree','A','MP','Ashoknagar (Chanderi)','MD','T','Sheer cotton-silk sarees with golden buttis, woven since the medieval era.','GI'],
['Maheshwari Saree','A','MP','Khargone (Maheshwar)','CL','T','Handloom sarees revived by Rani Ahilyabai Holkar in the 18th century.','GI'],
['Bagh Print','A','MP','Dhar (Bagh)','MD','S','Hand-block printing with natural red and black dyes by the Khatri community.','GI'],
['Baiga Forest Knowledge','K','MP','Dindori, Mandla, Balaghat','AN','N','The Baiga community\'s deep knowledge of forest foods, medicinal plants and indigenous seeds.'],
['Mahua Traditions','K','MP','Mandla, Dindori, Jhabua','AN','S','Mahua flowers and seeds support nutrition, medicine and livelihoods of forest communities.'],

/* ===== Maharashtra ===== */
['Lavani','D','MH','Pune, Satara, Solapur','CL','T','Dynamic song-dance to the dholki, flourishing since the Peshwa era and celebrated on stage today.'],
['Koli Dance','D','MH','Mumbai, Raigad, Ratnagiri','MD','T','Fisherfolk dance depicting rowing boats and rolling waves, performed with joyful songs.'],
['Dhangari Gaja','D','MH','Solapur, Satara, Sangli','MD','S','Dance of the Dhangar shepherds with colourful handkerchiefs, praising Biruba.'],
['Tarpa Dance','D','MH','Palghar, Nashik','AN','S','Warli community circle dance to the tarpa, a wind instrument made of dried gourd.'],
['Tamasha','O','MH','Pune, Ahilyanagar, Solapur','CL','N','Travelling folk theatre of songs, humour and Lavani, carried by troupes across villages.'],
['Powada','O','MH','All districts','MD','T','Heroic ballads celebrating Chhatrapati Shivaji Maharaj and valiant figures of history.'],
['Abhang','M','MH','Solapur (Pandharpur), Pune (Dehu, Alandi)','MD','T','Devotional verses of Sant Dnyaneshwar, Namdev and Tukaram, sung by the Varkaris.'],
['Bharud','O','MH','Chhatrapati Sambhajinagar, Beed','MD','S','Allegorical songs of Sant Eknath that teach wisdom through humour.'],
['Gondhal','M','MH','Kolhapur, Beed, Dharashiv','MD','S','Ritual performance praising goddess Tulja Bhavani with the sambal drum.'],
['Pandharpur Wari','F','MH','Pune, Solapur','MD','T','Centuries-old walking pilgrimage of lakhs of Varkaris to Pandharpur for Ashadhi Ekadashi.'],
['Ganeshotsav','F','MH','All districts','CL','T','Public Ganesh festival popularised by Lokmanya Tilak in 1893, uniting communities in celebration.'],
['Warli Painting','A','MH','Palghar, Thane','AN','T','White rice-paste drawings of circles and triangles portraying harvest and community life.','GI'],
['Paithani','A','MH','Chhatrapati Sambhajinagar (Paithan), Nashik (Yeola)','AN','T','Silk sarees with peacock and lotus motifs, a weaving heritage traced to the Satavahana era.','GI'],
['Kolhapuri Chappal','A','MH','Kolhapur, Sangli','MD','T','Handcrafted vegetable-tanned leather sandals, a GI craft shared with Karnataka.','GI'],
['Owi Grindmill Songs','O','MH','All districts','AN','N','Women\'s songs sung at the grindstone; over one lakh have been documented by the Grindmill Songs Project.'],
['Phad Irrigation','K','MH','Nashik, Dhule','MD','N','Community-managed canal and crop-rotation system of the Tapi basin.'],
['Mumbai Dabbawalas','K','MH','Mumbai','CL','T','Lunch-box delivery network running since 1890, admired worldwide for its precision.'],

/* ===== Manipur ===== */
['Pung Cholom','D','MN','Imphal West, Imphal East','MD','T','Drum dance in which performers leap and spin while playing the pung, integral to Sankirtana.'],
['Thabal Chongba','D','MN','All valley districts','AN','T','Moonlight dance of Yaoshang in which young people hold hands in circles.'],
['Manipuri Sankirtana','M','MN','Imphal West, Imphal East, Bishnupur','MD','T','Ritual singing, drumming and dancing of Manipur, inscribed by UNESCO in 2013.','UNESCO'],
['Pena','I','MN','Imphal West, Thoubal','AN','N','Single-string fiddle accompanying ballads; Pena players are cherished tradition bearers.'],
['Lai Haraoba','F','MN','Imphal West, Imphal East, Bishnupur','AN','T','Ritual festival of the Umang Lai deities, re-enacting creation through Meitei dance and song.'],
['Yaoshang','F','MN','All valley districts','MD','T','Five-day spring festival with Thabal Chongba dances, sports and community feasts.'],
['Ningol Chakouba','F','MN','All districts','MD','T','Festival honouring married daughters, who are invited home for a family feast.'],
['Khamba Thoibi','O','MN','Bishnupur (Moirang)','EM','S','Epic love story of Moirang, performed as dance and narrated through Pena ballads.'],
['Moirang Phee','A','MN','Bishnupur','MD','T','Handwoven fabric with temple-like border motifs.','GI'],
['Longpi Pottery','A','MN','Ukhrul (Longpi)','AN','S','Black pottery of the Tangkhul Nagas made without a wheel from serpentine stone and clay.'],
['Thang-Ta','K','MN','Imphal West, Imphal East','EM','R','Meitei martial art of sword and spear, taught in revived schools across Manipur.'],
['Sagol Kangjei','K','MN','Imphal West','AN','T','Manipuri polo played on native ponies; the Imphal polo ground is among the oldest in the world.'],
['Chak-hao Black Rice','K','MN','Imphal West, Thoubal','AN','T','Aromatic black rice cultivated through indigenous practices, recognised with a GI tag.','GI'],

/* ===== Meghalaya ===== */
['Shad Suk Mynsiem','D','ML','East Khasi Hills','AN','T','Khasi thanksgiving dance each April, with women in silk and gold dancing inside circles of men.'],
['Wangala','F','ML','West Garo Hills, East Garo Hills','AN','T','Garo "hundred drums" harvest festival honouring Saljong, the Sun god.'],
['Behdienkhlam','F','ML','West Jaintia Hills (Jowai)','AN','T','Pnar festival for health and well-being, with decorated rath floats and community games.'],
['Nongkrem','F','ML','East Khasi Hills (Smit)','AN','T','Khasi harvest thanksgiving hosted by the Syiem of Hima Khyrim.'],
['Duitara','I','ML','East Khasi Hills, West Khasi Hills','AN','N','Stringed instrument accompanying Khasi songs and stories.'],
['Garo Dama','I','ML','West Garo Hills, East Garo Hills','AN','S','Long drum that anchors the Wangala celebrations.'],
['Jingrwai Iawbei','O','ML','East Khasi Hills (Kongthong)','AN','T','Unique melodic tunes given as names to children in Kongthong, the "whistling village".'],
['Living Root Bridges','K','ML','East Khasi Hills, West Jaintia Hills','AN','T','Bridges grown from rubber-fig roots by Khasi and Jaintia communities, on UNESCO\'s Tentative List since 2022.'],
['Mawphlang Sacred Forest','K','ML','East Khasi Hills (Mawphlang)','AN','T','The Law Kyntang sacred grove, conserved for generations with rich biodiversity.'],
['Eri Silk','A','ML','Ri-Bhoi','AN','T','"Peace silk" woven from eri cocoons, warm and eco-friendly.'],
['Garo Dakmanda Weave','A','ML','West Garo Hills, East Garo Hills','AN','S','Traditional woven wrap of Garo women with vibrant patterns.'],
['Khasi Matrilineal Heritage','K','ML','East Khasi Hills, West Jaintia Hills','AN','T','Lineage passes through the mother, with the youngest daughter as custodian of ancestral property.'],

/* ===== Mizoram ===== */
['Cheraw','D','MZ','All districts','AN','T','Iconic bamboo dance in which dancers step nimbly between clapping bamboo poles.'],
['Khuallam','D','MZ','All districts','AN','S','Dance of the guests, performed at the Khuangchawi celebration.'],
['Chheih Lam','D','MZ','All districts','CL','T','Joyful dance of celebration performed after a day\'s work, with lively songs.'],
['Chapchar Kut','F','MZ','All districts','AN','T','Spring festival after jhum clearing, with Cheraw and grand cultural displays.'],
['Mim Kut','F','MZ','All districts','AN','S','Maize harvest festival remembering loved ones with offerings and songs.'],
['Khuang','I','MZ','All districts','AN','T','Traditional drum that accompanies Mizo songs and dances.'],
['Mizo Puan Weaving','A','MZ','Aizawl, Lunglei','AN','T','Handwoven puans such as Puanchei and Ngotekherh, several recognised with GI tags.','GI'],
['Mizo Hla','O','MZ','All districts','AN','S','Traditional songs and chants recording history, love and the seasons.'],
['Tlawmngaihna','K','MZ','All districts','AN','T','Mizo code of selfless service and community help, visible in everyday life.'],

/* ===== Nagaland ===== */
['Chang Lo','D','NL','Tuensang','AN','S','Victory dance of the Chang Nagas performed in warrior attire during Poang Lum.'],
['Zeliang Dance','D','NL','Peren','AN','T','Graceful dance of the Zeliang people with harmonious chants and hopping steps.'],
['Naga Folk Songs','M','NL','Mokokchung, Kohima','AN','T','Polyphonic songs recording migration, work and love, sung in rich harmony.'],
['Log Drum','I','NL','Mon, Tuensang','AN','S','Huge carved log drums used to announce gatherings and festivals.'],
['Tati','I','NL','Mokokchung, Zunheboto','AN','N','Single-string instrument of the Ao and Sumi that accompanies songs.'],
['Hornbill Festival','F','NL','Kohima (Kisama)','MO','T','The "festival of festivals", held every December since 2000 and uniting all Naga tribes.'],
['Moatsu','F','NL','Mokokchung','AN','T','Ao festival after sowing, with songs, feasts and friendly games.'],
['Sekrenyi','F','NL','Kohima, Phek','AN','T','Angami festival of purification and renewal each February.'],
['Naga Shawls','A','NL','Phek, Kohima, Mokokchung','AN','T','Tribe-specific woven shawls carrying symbols of honour and identity; the Chakhesang shawl is GI-recognised.','GI'],
['Morung Institution','K','NL','All districts','AN','N','Traditional youth dormitory that taught crafts, history and community values.'],
['Zabo Farming','K','NL','Phek (Kikruma)','AN','S','Integrated system combining forest, water harvesting, rice and fish farming.'],
['Naga King Chilli','K','NL','All districts','AN','T','Traditional cultivation of the fiery Naga mircha, recognised with a GI tag in 2008.','GI'],

/* ===== Odisha ===== */
['Gotipua','D','OD','Puri (Raghurajpur)','MD','S','Acrobatic devotional dance by young boys, an important forerunner of Odissi.'],
['Mayurbhanj Chhau','D','OD','Mayurbhanj','MD','T','Unmasked Chhau style of martial vigour, part of the UNESCO inscription of 2010.','UNESCO'],
['Dalkhai','D','OD','Sambalpur, Bargarh, Balangir','MD','T','Western Odisha women\'s dance during Dussehra to the dhol and nisan.'],
['Ghumura','D','OD','Kalahandi','MD','T','Dance with the ghumura pot-drum tied at the chest, once a dance of warriors.'],
['Danda Nacha','D','OD','Ganjam','MD','S','Ritual dance of devotion to Shiva held in Chaitra, with acrobatic feats.'],
['Pala','O','OD','Ganjam, Puri, Cuttack','CL','S','Musical storytelling by a lead singer and chorus with cymbals, rendering epic tales.'],
['Daskathia','O','OD','Ganjam','MD','N','Two-person ballad narration with wooden kathia clappers.'],
['Mardala','I','OD','Puri, Khordha','MD','S','Barrel drum of Odissi music and temple rituals.'],
['Rath Yatra','F','OD','Puri','EM','T','Chariot festival of Lord Jagannath drawing millions to Puri every year.'],
['Dhanu Jatra','F','OD','Bargarh','MO','T','Open-air theatre festival begun in 1947–48 in which the whole town becomes Mathura.'],
['Nuakhai','F','OD','Sambalpur, Bargarh, Balangir','AN','T','Western Odisha festival of new rice, offered first to the deity and shared with family.'],
['Bali Jatra','F','OD','Cuttack','MD','T','Maritime fair commemorating ancient voyages to Bali and Southeast Asia.'],
['Pattachitra','A','OD','Puri (Raghurajpur)','EM','T','Cloth scroll paintings of Jagannath and the epics in natural colours.','GI'],
['Sambalpuri Ikat','A','OD','Bargarh, Sambalpur, Subarnapur','MD','T','Tie-and-dye bandha textiles with conch, wheel and flower motifs.','GI'],
['Pipli Applique','A','OD','Puri (Pipli)','MD','T','Colourful applique canopies and umbrellas for temple festivals.','GI'],
['Cuttack Tarakasi','A','OD','Cuttack','MD','S','Silver filigree crafted into ornaments and figures, recognised with a GI tag in 2024.','GI'],
['Saura Idital Painting','A','OD','Rayagada, Gajapati','AN','S','Ritual wall art of the Saura community with stick-figure iconography.'],
['Paika Akhada','K','OD','Khordha, Puri','MD','R','Traditional martial training of the Paika warriors, revived in village akhadas.'],

/* ===== Punjab ===== */
['Bhangra','D','PB','All districts','MD','T','High-energy harvest dance to the dhol, now celebrated across the world.'],
['Giddha','D','PB','All districts','MD','T','Women\'s dance of claps and witty boliyan, overflowing with joy.'],
['Jhumar','D','PB','Sangrur, Bathinda','MD','S','Graceful circular dance with slow rhythms and elegant hand movements.'],
['Jindua and Luddi','D','PB','Amritsar, Gurdaspur','MD','S','Couple and victory dances celebrating happy occasions.'],
['Kissa Tradition','O','PB','All districts','CL','S','Verse romances such as Waris Shah\'s Heer (1766), sung and recited across Punjab.'],
['Dhadi Vaar','M','PB','Amritsar, Ludhiana','MD','T','Ballads of valour sung with the dhadd drum and sarangi.'],
['Tumbi and Algoza','I','PB','All districts','MD','T','The single-string tumbi and twin algoza flutes shape the Punjabi folk sound.'],
['Baisakhi','F','PB','All districts','AN','T','Harvest festival and foundation day of the Khalsa (1699), celebrated with Bhangra and fairs.'],
['Lohri','F','PB','All districts','AN','T','Winter bonfire festival with songs of Dulla Bhatti and shared sweets.'],
['Hola Mohalla','F','PB','Rupnagar (Anandpur Sahib)','MD','T','Festival of martial displays begun by Guru Gobind Singh in 1701.'],
['Phulkari','A','PB','Patiala, Amritsar, Bathinda','MD','T','Silken floral embroidery on khaddar, a symbol of Punjabi celebration.','GI'],
['Thathera of Jandiala Guru','A','PB','Amritsar (Jandiala Guru)','MD','R','Brass and copper utensil-making inscribed by UNESCO in 2014.','UNESCO'],
['Gatka','K','PB','All districts','MD','T','Sikh martial art with sticks and swords, taught in akhadas and schools.'],
['Langar Tradition','K','PB','All districts','MD','T','Community kitchen of equality founded by Guru Nanak Dev, serving everyone alike.'],

/* ===== Rajasthan ===== */
['Ghoomar','D','RJ','Jaipur, Jodhpur, Udaipur','MD','T','Graceful twirling dance of women in flowing ghagras at festivals and weddings.'],
['Kalbelia','D','RJ','Jodhpur, Ajmer, Pali','MD','T','Serpentine dance of the Kalbelia community, inscribed by UNESCO in 2010 and carried worldwide by Padma Shri Gulabo Sapera.','UNESCO'],
['Chari Dance','D','RJ','Ajmer (Kishangarh)','MD','S','Women dance balancing brass pots with lighted lamps on their heads.'],
['Bhavai Dance','D','RJ','Udaipur, Chittorgarh','MD','S','Breathtaking dance balancing a tower of pots while moving on glass or a sword\'s edge.'],
['Terah Taali','D','RJ','Pali, Jaisalmer','MD','N','Kamad women play thirteen manjiras tied to their bodies while seated.'],
['Manganiyar and Langa Music','M','RJ','Jaisalmer, Barmer','MD','T','Hereditary musicians of the Thar singing ballads and Sufi verses with kamaicha and sindhi sarangi.'],
['Maand','M','RJ','Jodhpur, Udaipur, Bikaner','MD','S','Refined Rajasthani vocal style, immortalised by Allah Jilai Bai\'s "Kesariya Balam".'],
['Kamaicha','I','RJ','Jaisalmer, Barmer','MD','N','Bowed lute with a resonant goatskin belly, played by Manganiyar masters.'],
['Ravanhatta','I','RJ','Udaipur, Jaisalmer','AN','N','Ancient bowed instrument of bamboo and coconut shell played by Bhopa singers.'],
['Pushkar Fair','F','RJ','Ajmer (Pushkar)','AN','T','Camel and cattle fair at Kartik Purnima with folk music, dance and competitions.'],
['Gangaur','F','RJ','Jaipur, Udaipur','MD','T','Festival of goddess Gauri celebrated by women with processions and songs.'],
['Baneshwar Mela','F','RJ','Dungarpur','AN','T','Tribal fair of the Bhils at the confluence of the Som and Mahi rivers.'],
['Phad Painting','O','RJ','Bhilwara (Shahpura)','MD','R','Scroll paintings of Pabuji and Devnarayan narrated by Bhopa singers, renewed by the Joshi family of painters.'],
['Kathputli','O','RJ','Nagaur, Jaipur','MD','N','String puppetry recounting legends such as that of Amar Singh Rathore.'],
['Blue Pottery','A','RJ','Jaipur','MD','R','Quartz-based glazed pottery revived in the 20th century by Kripal Singh Shekhawat.','GI'],
['Bagru and Sanganeri Prints','A','RJ','Jaipur','MD','T','Hand-block prints in natural dyes by the Chhipa communities.','GI'],
['Kota Doria','A','RJ','Kota, Baran','CL','T','Airy chequered sarees woven of cotton and silk.','GI'],
['Bishnoi Conservation Ethic','K','RJ','Jodhpur, Bikaner','MD','T','Principles of Guru Jambheshwar (1485) that protect trees and wildlife, honoured at Khejarli (1730).'],
['Tanka and Kund Harvesting','K','RJ','Jaisalmer, Barmer, Churu','AN','S','Underground rainwater tanks that have sustained desert households for centuries.'],

/* ===== Sikkim ===== */
['Singhi Chham','D','SK','Gangtok, Mangan','MD','S','Snow lion dance honouring Khangchendzonga, the guardian deity of Sikkim.'],
['Tamang Selo','D','SK','Namchi, Gyalshing','MD','T','Lively Tamang dance-song to the damphu drum.'],
['Maruni','D','SK','All districts','MD','T','Dance of the Tihar festival performed in colourful costumes and jewellery.'],
['Damphu','I','SK','All districts','AN','T','Circular frame drum of the Tamang community.'],
['Pang Lhabsol','F','SK','Gangtok','MD','T','Festival honouring Mount Khangchendzonga and the brotherhood of the Lepcha and Bhutia peoples.'],
['Losoong','F','SK','All districts','AN','T','Harvest and new-year festival of the Bhutia and Lepcha communities.'],
['Saga Dawa','F','SK','Gangtok, Namchi','EM','T','Buddhist festival marking the Buddha\'s birth, enlightenment and Parinirvana.'],
['Tendong Lho Rum Faat','F','SK','Namchi','AN','T','Lepcha festival honouring Mount Tendong, which saved their ancestors from a great flood.'],
['Sikkimese Thangka','A','SK','Gangtok, Mangan','EM','T','Buddhist scroll painting taught at monasteries and art institutes.'],
['Lepcha Oral Lore','O','SK','Mangan (Dzongu)','AN','N','Songs and stories of the Lepcha of Dzongu, their cherished Mayel Lyang homeland.'],
['Large Cardamom Agroforestry','K','SK','All districts','CL','T','Cardamom grown under shade trees; Sikkim became India\'s first fully organic state in 2016.','GI'],

/* ===== Tamil Nadu ===== */
['Karagattam','D','TN','Thanjavur, Tiruchirappalli, Madurai','AN','T','Dancers balance decorated pots on their heads, honouring the rain goddess Mariamman.'],
['Kavadi Attam','D','TN','Dindigul (Palani), Madurai','AN','T','Devotional dance carrying ornate kavadi arches for Lord Murugan.'],
['Oyilattam','D','TN','Madurai, Tirunelveli','MD','S','The "dance of beauty", performed with handkerchiefs by rows of men.'],
['Poikkal Kuthirai','D','TN','Thanjavur, Tiruchirappalli','MD','N','Dummy-horse dance performed on wooden stilts.'],
['Kummi','D','TN','All districts','AN','T','Women\'s clapping dance at festivals and temple celebrations.'],
['Therukoothu','O','TN','Tiruvannamalai, Villupuram, Kanchipuram','MD','S','Street theatre enacting Mahabharata episodes through the night.'],
['Villu Paatu','O','TN','Kanyakumari, Tirunelveli','MD','N','Bow-song storytelling using a large musical bow.'],
['Parai','I','TN','All districts','AN','R','Frame drum reclaimed as a proud symbol of celebration and community art.'],
['Nadaswaram and Thavil','I','TN','Thanjavur','MD','T','Auspicious double-reed and drum ensemble of temples and weddings; the Narasinganpettai nadaswaram is GI-recognised.','GI'],
['Pongal and Jallikattu','F','TN','All districts, Madurai (Alanganallur)','AN','T','Harvest festival honouring the Sun and cattle, with the traditional bull-embracing sport.'],
['Karthigai Deepam','F','TN','Tiruvannamalai','AN','T','Festival of lights, with the Maha Deepam lit atop Annamalai hill.'],
['Tanjore Painting','A','TN','Thanjavur','CL','T','Gold-foiled panel paintings that flourished under the Maratha court.','GI'],
['Kanchipuram Silk','A','TN','Kanchipuram','MD','T','Heavy silk sarees with temple borders and the korvai weaving technique.','GI'],
['Swamimalai Bronzes','A','TN','Thanjavur (Swamimalai)','EM','T','Lost-wax bronze icons in the Chola tradition.','GI'],
['Toda Embroidery','A','TN','Nilgiris','AN','S','Red-and-black embroidery called pukhoor, made by Toda women.','GI'],
['Silambam','K','TN','All districts','AN','T','Staff-based martial art referenced in Sangam literature.'],
['Siddha Medicine','K','TN','All districts','AN','T','Traditional medical system attributed to the eighteen Siddhars.'],
['Kolam','K','TN','All districts','AN','T','Daily rice-flour threshold drawings expressing geometry and care for all beings.'],
['Eri Tank System','K','TN','Kanchipuram, Ramanathapuram','EM','S','Chains of irrigation tanks built since the Pallava and Chola eras.'],

/* ===== Telangana ===== */
['Perini Shivatandavam','D','TS','Hanumakonda, Warangal','EM','R','Warrior dance of the Kakatiya era, revived by Nataraja Ramakrishna.'],
['Gussadi','D','TS','Adilabad, Komaram Bheem Asifabad','AN','T','Raj Gond dance with peacock-feather headgear during the Dandari festival.'],
['Bathukamma','F','TS','All districts','MD','T','Floral festival in which women stack flowers into cones and sing in circles.'],
['Bonalu','F','TS','Hyderabad, Secunderabad','CL','T','Festival of offerings to goddess Mahakali in the month of Ashada.'],
['Sammakka Saralamma Jatara','F','TS','Mulugu (Medaram)','MD','T','Biennial tribal festival, among the largest gatherings in India.'],
['Nagoba Jatara','F','TS','Adilabad (Keslapur)','AN','T','Mesram Gond festival honouring the serpent deity Nagoba.'],
['Oggu Katha','O','TS','Warangal, Karimnagar','MD','S','Story-singing of the Yadava community with the small oggu drum.'],
['Chindu Yakshaganam','O','TS','Nizamabad','MD','N','Folk theatre of the Chindu community, rich in music and mythology.'],
['Kinnera','I','TS','Nagarkurnool','AN','V','Multi-fret stringed instrument of the Dakkali, celebrated by Padma Shri (2022) Darshanam Mogilaiah.'],
['Pochampally Ikat','A','TS','Yadadri Bhuvanagiri (Pochampally)','MD','T','Geometric tie-and-dye weaving; Pochampally was named a Best Tourism Village by the UN World Tourism Organization in 2021.','GI'],
['Cheriyal Scrolls','A','TS','Siddipet (Cheriyal)','MD','S','Narrative scroll paintings that accompany storytellers.','GI'],
['Nirmal Toys and Paintings','A','TS','Nirmal','MD','S','Light ponki-wood toys and paintings with golden hues.','GI'],
['Karimnagar Silver Filigree','A','TS','Karimnagar','CL','S','Intricate silver wirework ornaments and artefacts.','GI'],
['Kakatiya Tank Wisdom','K','TS','Warangal, Khammam','EM','S','Cascading tank systems of the Kakatiya dynasty, restored under Mission Kakatiya.'],

/* ===== Tripura ===== */
['Hojagiri','D','TR','Dhalai, South Tripura','AN','T','Reang women balance pots and lamps while dancing on earthen pitchers.'],
['Garia Dance','D','TR','West Tripura, Khowai','AN','T','Dance celebrating Garia Puja and the hope of a good harvest.'],
['Lebang Boomani','D','TR','All districts','AN','S','Harvest dance playfully mimicking the catching of lebang insects in the fields.'],
['Bizu Dance','D','TR','North Tripura, Dhalai','AN','T','Chakma new-year dance of spring.'],
['Sumui and Kham','I','TR','All districts','AN','S','Bamboo flute and drum of Tripuri music.'],
['Kharchi Puja','F','TR','West Tripura (Agartala)','MD','T','Festival of the fourteen deities held every July in Old Agartala.'],
['Garia Puja','F','TR','All districts','AN','T','Tripuri festival praying for prosperity and harvest.'],
['Unakoti Ashokastami Mela','F','TR','Unakoti','EM','T','Fair at Unakoti\'s rock-cut sculptures of the 8th–9th centuries.'],
['Risa Weaving','A','TR','All districts','AN','T','Handwoven cloth of Tripuri women, now a symbol of state identity.'],
['Tripura Bamboo and Cane','A','TR','All districts','AN','T','Fine bamboo products and furniture crafted across Tripura.'],
['Kokborok Oral Tales','O','TR','All districts','AN','S','Folktales and songs of the Tripuri people in the Kokborok language.'],
['Tripura Queen Pineapple','K','TR','All districts','CL','T','Sweet pineapple grown through traditional practices, recognised with a GI tag.','GI'],

/* ===== Uttar Pradesh ===== */
['Charkula','D','UP','Mathura (Braj)','MD','S','Women dance balancing a tiered lamp wheel to celebrate Radha\'s birth.'],
['Raslila','D','UP','Mathura (Vrindavan)','MD','T','Devotional dance-drama of Krishna and Radha performed by the troupes of Braj.'],
['Nautanki','O','UP','Kanpur Nagar, Lucknow, Hathras','CL','R','Operatic folk theatre with nagada drums, verse and melodrama.'],
['Ramlila of Ramnagar','O','UP','Varanasi (Ramnagar)','MD','T','Month-long enactment of the Ramayana; the Ramlila tradition was inscribed by UNESCO in 2008.','UNESCO'],
['Kajri and Chaiti','M','UP','Mirzapur, Varanasi','MD','T','Seasonal songs of the monsoon and spring from eastern Uttar Pradesh.'],
['Birha','M','UP','Varanasi, Ghazipur, Ballia','CL','S','Bhojpuri folk song genre, popular at gatherings and competitions.'],
['Shehnai of Banaras','I','UP','Varanasi','MD','T','Auspicious reed instrument, carried to the world stage by Bharat Ratna Ustad Bismillah Khan.'],
['Kumbh Mela','F','UP','Prayagraj','AN','T','The world\'s largest peaceful gathering of pilgrims, inscribed by UNESCO in 2017.','UNESCO'],
['Lathmar Holi','F','UP','Mathura (Barsana, Nandgaon)','MD','T','Playful Holi in which the women of Barsana greet the men of Nandgaon with sticks.'],
['Dev Deepawali','F','UP','Varanasi','AN','T','The ghats of Varanasi glow with lakhs of diyas on Kartik Purnima.'],
['Chikankari','A','UP','Lucknow','MD','T','Delicate white embroidery that flourished under Mughal patronage.','GI'],
['Banarasi Silk','A','UP','Varanasi','MD','T','Brocade sarees woven with gold and silver zari.','GI'],
['Moradabad Brass','A','UP','Moradabad','CL','T','Engraved brassware from India\'s "Brass City".','GI'],
['Firozabad Glass','A','UP','Firozabad','MD','T','Glass bangles and art glass from the "City of Bangles".','GI'],
['Bhadohi Carpets','A','UP','Bhadohi','MD','T','Hand-knotted carpets from India\'s carpet belt.','GI'],
['Nizamabad Black Pottery','A','UP','Azamgarh (Nizamabad)','MD','S','Lustrous black clay pottery with silver etching.','GI'],
['Kannauj Attar','K','UP','Kannauj','AN','S','Deg-bhapka copper distillation of natural perfumes, including the earthy mitti attar.','GI'],
['Dastangoi','O','UP','Lucknow','MD','R','Urdu art of epic storytelling, revived in 2005 and loved by new audiences.'],

/* ===== Uttarakhand ===== */
['Chholiya','D','UK','Almora, Pithoragarh, Bageshwar','EM','S','Sword dance of Kumaoni wedding processions.'],
['Barada Nati','D','UK','Dehradun (Jaunsar-Bawar)','AN','T','Group dance of Jaunsar-Bawar performed at festivals.'],
['Pandav Nritya','D','UK','Rudraprayag, Chamoli','MD','T','Dance-drama of the Pandavas performed in Garhwal villages.'],
['Jagar','O','UK','All districts','AN','S','Ritual singing invoking local deities, led by a jagariya.'],
['Dhol-Damau','I','UK','All districts','AN','N','Sacred drums of the Auji musicians, heard at every ceremony.'],
['Hudka','I','UK','Almora, Pithoragarh','AN','S','Hourglass drum accompanying ballads and field songs.'],
['Ramman','F','UK','Chamoli (Saloor-Dungra)','MD','T','Religious festival and ritual theatre, inscribed by UNESCO in 2009.','UNESCO'],
['Nanda Devi Raj Jat','F','UK','Chamoli','MD','T','Himalayan pilgrimage held about every twelve years to escort goddess Nanda.'],
['Harela','F','UK','Almora, Nainital, all districts','AN','T','Green festival of monsoon sowing, now also a joyful tree-planting celebration.'],
['Phool Dei','F','UK','All districts','AN','T','Spring festival when children place flowers on every doorstep.'],
['Aipan','A','UK','Almora, Nainital','AN','T','Ritual floor and wall art in red and white, recognised with a GI tag.','GI'],
['Ringal Craft','A','UK','Chamoli, Bageshwar','AN','S','Baskets and mats woven from dwarf bamboo.','GI'],
['Naula Springs','K','UK','Almora, Pithoragarh','AN','N','Stone-built spring shrines that protect drinking water.'],
['Baranaja','K','UK','Tehri Garhwal','AN','N','Twelve-grain mixed cropping for food and nutrition security.'],
['Chipko Legacy','K','UK','Chamoli','MO','T','Community forest-protection movement of 1973, led by village women.'],

/* ===== West Bengal ===== */
['Purulia Chhau','D','WB','Purulia','MD','T','Masked Chhau with acrobatic vigour, part of the UNESCO inscription of 2010.','UNESCO'],
['Gambhira','D','WB','Malda','MD','S','Masked dance and song honouring Shiva, often with lively social satire.'],
['Raibenshe','D','WB','Birbhum, Purba Bardhaman','MD','R','Martial dance revived by Gurusaday Dutt in the 1930s.'],
['Baul Songs','M','WB','Birbhum, Nadia','MD','T','Mystic minstrels singing of the divine within, with ektara and dubki.'],
['Bhatiali and Bhawaiya','M','WB','Cooch Behar, Jalpaiguri','MD','S','River songs of boatmen and folk songs of North Bengal.'],
['Ektara and Dotara','I','WB','Birbhum, Cooch Behar','MD','T','Plucked string instruments at the heart of Bengal\'s folk music.'],
['Dhak','I','WB','All districts','AN','T','Large drum that heralds Durga Puja.'],
['Durga Puja','F','WB','Kolkata, all districts','MD','T','Festival of art and community inscribed by UNESCO in 2021.','UNESCO'],
['Poush Mela','F','WB','Birbhum (Santiniketan)','CL','T','Winter fair begun at Santiniketan in 1894, celebrating Bauls and crafts.'],
['Gangasagar Mela','F','WB','South 24 Parganas','AN','T','Pilgrimage at the Ganga–Bay of Bengal confluence on Makar Sankranti.'],
['Bengal Patachitra','A','WB','Paschim Medinipur (Pingla)','AN','T','Scroll paintings sung aloud by Patua artists.','GI'],
['Bankura Terracotta Horse','A','WB','Bankura (Panchmura)','MD','T','The iconic long-necked terracotta horse of Panchmura.','GI'],
['Nakshi Kantha','A','WB','Birbhum, Murshidabad','MD','T','Running-stitch embroidered quilts that tell stories.','GI'],
['Baluchari Saree','A','WB','Bankura (Bishnupur), Murshidabad','CL','R','Silk sarees with mythological narrative pallus.','GI'],
['Purulia Chhau Masks','A','WB','Purulia (Charida)','CL','T','Papier-mache masks crafted in Charida village.','GI'],
['Pater Gaan and Jatra','O','WB','All districts','MD','S','Sung scroll narration and travelling folk theatre of Bengal.'],
['East Kolkata Wetlands','K','WB','Kolkata, South 24 Parganas, North 24 Parganas','MO','S','Traditional wastewater-fed fisheries and farming, a Ramsar site since 2002.'],
['Darjeeling Tea','K','WB','Darjeeling','CL','T','India\'s first GI product (2004), grown on Himalayan slopes.','GI'],

/* ===== Andaman & Nicobar Islands ===== */
['Nicobarese Dance','D','AN','Nicobar','AN','S','Group dances by the sea during the festivals of the Nicobarese community.'],
['Ossuary Feast','F','AN','Nicobar','AN','S','Community feast honouring ancestors with dances, songs and sharing.'],
['Great Andamanese Languages','O','AN','South Andaman (Strait Island)','AN','V','Among the world\'s oldest language families, now being documented with the community to preserve words and songs.'],
['Nicobarese Canoe Building','K','AN','Nicobar','AN','N','Outrigger canoe making with deep knowledge of wood, winds and tides.'],
['Island Ecological Knowledge','K','AN','South Andaman, Little Andaman','AN','N','Indigenous knowledge of the sea helped communities such as the Onge move to safety during the 2004 tsunami.'],
['Shell and Cane Craft','A','AN','South Andaman','MO','T','Crafts of shells, cane and bamboo by island artisans.'],

/* ===== Chandigarh ===== */
['Rock Garden of Nek Chand','A','CH','Chandigarh','MO','T','Sculpture garden created from recycled materials by Nek Chand, begun in 1957.'],
['Punjabi Folk Dance Culture','D','CH','Chandigarh','MO','T','Colleges and cultural centres sustain vibrant Bhangra and Giddha competitions.'],
['Chandigarh Carnival','F','CH','Chandigarh','MO','T','Annual cultural carnival with folk performances and parades.'],
['Teej in Chandigarh','F','CH','Chandigarh','AN','T','Monsoon festival of swings, mehndi and songs celebrated by women.'],

/* ===== Dadra & Nagar Haveli and Daman & Diu ===== */
['Tarpa Dance of Dadra','D','DN','Dadra and Nagar Haveli','AN','T','Warli, Kokna and Kolcha communities dance to the tarpa horn.'],
['Bhavada','D','DN','Dadra and Nagar Haveli','AN','S','Masked tribal dance-drama performed during festivals.'],
['Dhodia Dance','D','DN','Dadra and Nagar Haveli','AN','S','Dance of the Dhodia community at weddings and harvest.'],
['Portuguese-Heritage Folk Dances','D','DN','Daman, Diu','CL','S','Vira and Mando-style dances cherished by local communities.'],
['Tarpa Festival','F','DN','Dadra and Nagar Haveli (Silvassa)','MO','T','Celebration of tribal music, dance and crafts.'],
['Warli and Bamboo Crafts','A','DN','Dadra and Nagar Haveli','AN','T','Tribal wall art and bamboo products.'],

/* ===== Delhi ===== */
['Qawwali of Nizamuddin','M','DL','South East Delhi (Nizamuddin)','MD','T','Sufi devotional singing tracing to Amir Khusrau in the 13th–14th centuries.'],
['Phool Walon ki Sair','F','DL','South Delhi (Mehrauli)','CL','T','Festival of flower-bearers symbolising communal harmony, dating to 1812 and revived in 1961.'],
['Kathputli Colony Artists','A','DL','West Delhi (Shadipur)','MO','S','Home to generations of puppeteers, magicians and folk performers.'],
['Delhi Zardozi','A','DL','Central Delhi (Old Delhi)','MD','T','Metallic-thread embroidery on silk and velvet.'],
['Unani Medicine','K','DL','Central Delhi, South East Delhi','MD','T','Traditional Greco-Arabic system of medicine, nurtured by institutions in Delhi.'],
['Old Delhi Storytelling Walks','O','DL','Central Delhi (Old Delhi)','MO','T','Community storytellers sharing the living histories of Shahjahanabad.'],

/* ===== Jammu & Kashmir ===== */
['Rouf','D','JK','Srinagar, Baramulla, Anantnag','MD','T','Women\'s dance in facing rows during Eid and spring.'],
['Kud','D','JK','Udhampur, Ramban, Doda','AN','S','Night ritual dance honouring village deities in the Jammu hills.'],
['Dumhal','D','JK','Kupwara, Baramulla','MD','N','Dance of Wattal men with tall conical caps and a sacred banner.'],
['Bhand Pather','O','JK','Anantnag, Baramulla','MD','N','Satirical folk theatre blending acting, music and dance.'],
['Sufiana Kalam','M','JK','Srinagar','MD','N','Classical Sufi music of Kashmir with santoor and saz.'],
['Ladishah','O','JK','All districts','CL','N','Humorous ballads commenting on social life.'],
['Santoor','I','JK','Srinagar','AN','T','Hammered string instrument taken to classical stages by Pandit Shivkumar Sharma.'],
['Mela Kheer Bhawani','F','JK','Ganderbal (Tulmulla)','MD','T','Festival at the spring shrine of Mata Kheer Bhawani.'],
['Pashmina','A','JK','Srinagar','MD','T','Hand-spun cashmere from Changthangi goats woven into shawls.','GI'],
['Kani Shawl','A','JK','Srinagar, Budgam (Kanihama)','MD','S','Tapestry shawls woven with small wooden sticks called kanis.','GI'],
['Kashmir Papier-mache','A','JK','Srinagar','MD','T','Painted papier-mache boxes and ornaments.','GI'],
['Walnut Wood Carving','A','JK','Srinagar','MD','S','Intricate furniture carved from walnut wood.','GI'],
['Basohli Painting','A','JK','Kathua (Basohli)','MD','R','Pahari miniatures in bold colours, recognised with a GI tag in 2023.','GI'],
['Kashmir Saffron','K','JK','Pulwama (Pampore), Budgam','AN','T','Saffron grown on karewa lands, recognised with a GI tag in 2020.','GI'],
['Kangri','K','JK','All districts','MD','T','Wicker-covered fire pot that keeps families warm through winter.'],

/* ===== Ladakh ===== */
['Cham Dance','D','LA','Leh (Hemis)','EM','T','Masked monastic dance celebrating the triumph of good over evil.'],
['Jabro','D','LA','Leh (Changthang)','AN','S','Dance of the nomadic Changpa, performed at Losar.'],
['Shondol','D','LA','Leh','MD','R','Royal dance once performed for the Namgyal kings, now proudly staged at festivals.'],
['Buddhist Chanting of Ladakh','M','LA','Leh, Kargil','AN','T','Recitation of sacred Buddhist texts, inscribed by UNESCO in 2012.','UNESCO'],
['Daman and Surna','I','LA','Leh, Kargil','AN','S','Drum and shawm played by hereditary Mon and Beda musicians.'],
['Hemis Tsechu','F','LA','Leh (Hemis)','MD','T','Festival honouring Guru Padmasambhava at Hemis monastery.'],
['Ladakhi Losar','F','LA','Leh, Kargil','AN','T','Ladakhi new year with lamps, feasts and ritual performances.'],
['Epic of King Gesar','O','LA','Leh, Kargil','EM','N','Epic sung by bards about the hero-king Gesar of Ling.'],
['Changthangi Pashmina','A','LA','Leh (Changthang)','AN','T','Fine fibre from Changthangi goats reared by nomadic herders.'],
['Sowa-Rigpa','K','LA','Leh, Kargil','AN','T','Himalayan medical system practised by amchis, recognised by the Government of India in 2010.'],
['Artificial Glaciers','K','LA','Leh','MO','T','Community innovations such as ice stupas, building on traditional water harvesting.'],

/* ===== Lakshadweep ===== */
['Lakshadweep Kolkali','D','LD','Lakshadweep (Kavaratti, Andrott)','MD','T','Stick dance of island men to rhythmic songs.'],
['Parichakali','D','LD','Lakshadweep (Kavaratti, Agatti)','MD','S','Shield-and-sword dance of the islands.'],
['Lava Dance','D','LD','Lakshadweep (Minicoy)','MD','T','Minicoy\'s festive dance with drums and songs.'],
['Pole-and-Line Tuna Fishing','K','LD','Lakshadweep (Minicoy, Agatti)','MD','T','Sustainable traditional fishing admired around the world.'],
['Odam Boat Building','K','LD','Lakshadweep (Kavaratti, Minicoy)','MD','N','Traditional wooden sailing boats built by island craftsmen.'],
['Mahl Language Songs','O','LD','Lakshadweep (Minicoy)','MD','S','Minicoy\'s Mahl language and its oral songs.'],
['Island Coir Craft','A','LD','Lakshadweep','CL','T','Coconut-fibre crafts supporting island livelihoods.'],

/* ===== Puducherry ===== */
['Garadi Dance','D','PY','Puducherry','MD','S','Dance of monkey warriors celebrating Rama\'s victory.'],
['Masi Magam','F','PY','Puducherry (Vaithikuppam)','MD','T','Sea-bathing festival in which temple deities are carried to the shore.'],
['Villianur Terracotta','A','PY','Puducherry (Villianur)','MD','T','Terracotta figures and votive horses shaped by the potters of Villianur.'],
['Puducherry Handmade Paper','A','PY','Puducherry','MO','T','Handmade paper crafted in the town since the mid-20th century.'],
['Kattumaram Fishing','K','PY','Puducherry, Karaikal','AN','S','Log-raft fishing — the word catamaran comes from the Tamil kattumaram.'],
['Puducherry Therukoothu','O','PY','Puducherry, Karaikal','MD','S','Street theatre enacting the epics during temple festivals.']
];

/* ---------------------------------------------------------
   3b. EXPANDED STATE-WISE RECORDS
   --------------------------------------------------------- */
RAW.push(
/* ===== Andhra Pradesh ===== */
['Kolatam','D','AP','All districts','MD','T','Stick dance in joyful circles, with pairs striking painted sticks to songs at festivals and village fairs.'],
['Lambadi Dance','D','AP','Sri Sathya Sai, Kurnool','MD','S','Banjara women dance in mirror-worked costumes and jingling ornaments, portraying sowing and harvest.'],
['Harikatha','O','AP','East Godavari, Guntur, Krishna','CL','S','Devotional storytelling that blends music, dance and narration, shaped into an art by Adibhatla Narayana Dasu.'],
['Ugadi','F','AP','All districts','AN','T','Telugu new year welcomed with ugadi pachadi, whose six tastes symbolise the many flavours of life.'],
['Mangalagiri Handloom','A','AP','Guntur (Mangalagiri)','MD','T','Crisp cotton sarees and fabrics with nizam borders, woven on pit looms.','GI'],
['Uppada Jamdani','A','AP','Kakinada (Uppada)','CL','T','Feather-light silk sarees with intricate jamdani motifs woven by coastal weavers.','GI'],
['Venkatagiri Sarees','A','AP','Tirupati (Venkatagiri)','CL','T','Fine cotton sarees with delicate jamdani-style motifs, once patronised by the Venkatagiri rulers.','GI'],
['Durgi Stone Craft','A','AP','Palnadu (Durgi)','MD','N','Soft-stone sculptures in the graceful style of Nagarjunakonda, carved by the artisans of Durgi.'],

/* ===== Arunachal Pradesh ===== */
['Popir Dance','D','AR','West Siang, Lower Siang','AN','T','Galo women dance in white attire during Mopin, praying for a rich harvest and well-being.'],
['Mopin','F','AR','West Siang, Lower Siang, Leparada','AN','T','Galo festival of prosperity each April, with Popir dances and blessings of rice-flour paste.'],
['Reh','F','AR','Dibang Valley, Lower Dibang Valley','AN','T','Idu Mishmi festival of February, with priestly rituals, songs and generous community feasts.'],
['Si-Donyi','F','AR','Upper Subansiri','AN','T','Tagin festival honouring Si, the earth, and Donyi, the sun, for prosperity and harmony.'],
['Mishmi Weaving','A','AR','Lower Dibang Valley, Anjaw','AN','S','Bold geometric textiles woven by Mishmi women on loin looms.'],
['Arunachal Bamboo and Cane','A','AR','All districts','AN','T','Hats, baskets, bags and household items skilfully woven from bamboo and cane.'],
['Donyi-Polo Traditions','K','AR','Siang, Papum Pare, West Siang','AN','T','Indigenous faith revering the Sun and Moon, guiding ethics, ecology and community life.'],

/* ===== Assam ===== */
['Deodhani','D','AS','Kamrup, Darrang','MD','N','Energetic dance honouring goddess Manasa, performed with swords and shields.'],
['Bhortal Nritya','D','AS','Barpeta','MO','T','Spectacular cymbal dance developed by Narahari Burha Bhakat, performed by large synchronised groups.'],
['Goalparia Lokgeet','M','AS','Goalpara, Dhubri','MD','T','Soulful folk songs of western Assam, carried to wide audiences by Pratima Barua Pandey.'],
['Bihu Dhol','I','AS','All districts','AN','T','Double-headed drum played with a stick and palm, the heartbeat of every Bihu celebration.'],
['Me-Dam-Me-Phi','F','AS','Sivasagar, Charaideo','MD','T','Ahom festival of ancestor remembrance, observed with prayers and feasts every 31 January.'],
['Ambubachi Mela','F','AS','Kamrup Metropolitan (Kamakhya)','MD','T','Annual June festival at Kamakhya temple drawing devotees from across India.'],
['Asharikandi Terracotta','A','AS','Dhubri (Asharikandi)','MD','S','Terracotta figurines such as the beloved Hatima doll, crafted by potter families of Asharikandi.'],
['Jaapi','A','AS','Nalbari, Kamrup','MD','T','Cone-shaped bamboo and palm-leaf hat, a proud symbol of Assamese hospitality.'],
['Sattriya Manuscript Painting','A','AS','Majuli','MD','R','Illustrated manuscripts painted on sanchi bark in the Sattras, recognised with a GI tag in 2024.','GI'],

/* ===== Bihar ===== */
['Domkach','D','BR','Bhojpur, Saran, Madhubani','MD','S','Playful women\'s dance-drama performed at weddings, overflowing with song and humour.'],
['Shravani Mela','F','BR','Bhagalpur (Sultanganj)','MD','T','Kanwariyas carry holy Ganga water from Sultanganj to Deoghar through the month of Shravan.'],
['Rajgir Mahotsav','F','BR','Nalanda (Rajgir)','MO','T','Festival of music, dance and crafts held in the historic town of Rajgir.'],
['Bhagalpuri Silk','A','BR','Bhagalpur','AN','T','Tussar silk woven in Bhagalpur, India\'s celebrated "Silk City".','GI'],
['Tikuli Art','A','BR','Patna','MD','R','Painted decorative art on hardboard, renewed from the old craft of glass bindi-making.'],
['Shahi Litchi','K','BR','Muzaffarpur','CL','T','Aromatic litchi grown through traditional orchard knowledge, recognised with a GI tag.','GI'],
['Magahi Paan','K','BR','Nawada, Gaya, Nalanda','MD','S','Traditional betel-leaf cultivation of the Magadh region, recognised with a GI tag.','GI'],

/* ===== Chhattisgarh ===== */
['Saila Dance','D','CG','Surguja, Bilaspur','AN','T','Stick dance of young men after the harvest, moving in rhythmic, interlocking circles.'],
['Bharthari','O','CG','Raipur, Durg','MD','N','Sung narrative of King Bharthari, celebrated through artists such as Surujbai Khande.'],
['Hareli','F','CG','All districts','AN','T','First festival of the farming year, honouring tools, cattle and the green fields.'],
['Goncha Festival','F','CG','Bastar (Jagdalpur)','MD','T','Chariot festival of Jagdalpur, famous for playful bamboo tupki guns firing wild berries.'],
['Tumba Craft','A','CG','Bastar, Kondagaon','AN','S','Dried bottle-gourd shells carved into lamps, containers and décor.'],
['Chhattisgarh Mandar','I','CG','All districts','AN','T','Barrel drum that leads the rhythm of Karma, Saila and Suwa dances.'],

/* ===== Goa ===== */
['Goff Dance','D','GA','South Goa (Canacona)','MD','S','Braid dance of Shigmo in which dancers weave coloured ropes into beautiful patterns.'],
['Goa Carnival','F','GA','North Goa, South Goa','CL','T','Joyous pre-Lent street festival with colourful floats, music and King Momo.'],
['Zatra','F','GA','North Goa, South Goa','MD','T','Temple festivals with processions of deities in decorated palanquins and chariots.'],
['Goan Azulejos','A','GA','North Goa','CL','S','Hand-painted blue-and-white tiles adorning Goan homes, churches and streets.'],
['Goan Terracotta','A','GA','North Goa (Bicholim)','AN','S','Clay pottery and figurines shaped by traditional potters for daily life and festivals.'],

/* ===== Gujarat ===== */
['Padhar Dance','D','GJ','Ahmedabad (Nal Sarovar)','MD','N','Dance of the Padhar community around Nal Sarovar, depicting rowing and life on the water.'],
['Hudo','D','GJ','Surendranagar (Tarnetar)','MD','S','Bharwad shepherds\' clapping dance in pairs, a highlight of the Tarnetar fair.'],
['Dangi Nritya','D','GJ','Dang','AN','S','Tribal dance of the Dang forests performed in linked lines to the pavri horn.'],
['Uttarayan','F','GJ','Ahmedabad, all districts','MD','T','Kite festival of Makar Sankranti that fills the skies with colour and rooftops with joy.'],
['Bhavnath Mela','F','GJ','Junagadh','MD','T','Mahashivratri fair at the foot of Girnar, alive with devotion, music and gatherings.'],
['Sankheda Furniture','A','GJ','Chhota Udepur (Sankheda)','CL','T','Lacquered teakwood furniture with painted motifs in warm, glowing colours.','GI'],
['Tangaliya Weave','A','GJ','Surendranagar','MD','R','Dotted-weave shawls of the Dangasia community, revived through training and GI recognition.','GI'],

/* ===== Haryana ===== */
['Dhamal Dance','D','HR','Gurugram, Mahendragarh','MD','S','Ahir men dance with the daf under the moonlit skies of Phalgun.'],
['Haryanvi Ghoomar','D','HR','Hisar, Bhiwani','MD','S','Girls\' circular dance at Holi and Gangaur with songs and rhythmic clapping.'],
['International Gita Mahotsav','F','HR','Kurukshetra','MO','T','Festival honouring the Bhagavad Gita at Brahma Sarovar, with crafts, music and aarti.'],
['Haryanvi Pottery','A','HR','Jhajjar, Rohtak','AN','S','Earthen pots, matkas and toys shaped by village potters.'],
['Chaupal Tradition','K','HR','All districts','MD','S','The village chaupal where elders gather to share wisdom and settle matters together.'],

/* ===== Himachal Pradesh ===== */
['Lavi Fair','F','HP','Shimla (Rampur)','CL','T','Historic trade fair of Rampur Bushahr for wool, horses and mountain crafts.'],
['Mandi Shivratri','F','HP','Mandi','MD','T','Week-long festival where hundreds of village deities gather in the "Varanasi of the hills".'],
['Phulaich','F','HP','Kinnaur','AN','S','Kinnauri festival of flowers remembering loved ones and celebrating the high meadows.'],
['Kangra Tea','K','HP','Kangra','CL','S','Tea grown in the Kangra valley since the 19th century, recognised with a GI tag.','GI'],
['Chamba Chappal','A','HP','Chamba','MD','S','Embroidered leather footwear crafted by the artisans of Chamba.'],

/* ===== Jharkhand ===== */
['Tusu Parab','F','JH','Ranchi, East Singhbhum, Saraikela Kharsawan','AN','T','Winter harvest festival with Tusu songs and decorated chaudal carried to the river.'],
['Sohrai Festival','F','JH','Hazaribagh, Dumka','AN','T','Harvest festival honouring cattle, with freshly painted walls and joyful songs.'],
['Jadopatia Painting','A','JH','Dumka','AN','N','Scroll paintings of the Santhal storytellers, unrolled panel by panel as tales are sung.'],
['Jharkhand Tussar Silk','A','JH','Godda, Dumka','AN','T','Wild tussar silk reared in forests and woven into warm golden fabric.'],
['Ho Oral Heritage','O','JH','West Singhbhum','AN','S','Songs and lore of the Ho people, who also write in their own Warang Citi script.'],

/* ===== Karnataka ===== */
['Pooja Kunitha','D','KA','Bengaluru Rural, Mandya','MD','S','Dancers balance an ornate wooden frame on their heads in honour of the goddess.'],
['Suggi Kunitha','D','KA','Uttara Kannada','MD','S','Harvest dance of the Halakki Vokkaliga community with colourful headgear.'],
['Bengaluru Karaga','F','KA','Bengaluru Urban','MD','T','Night-long festival where the Karaga is carried through old Bengaluru by the Thigala community.'],
['Huttari','F','KA','Kodagu','AN','T','Kodava harvest festival marked by cutting the first paddy under the full moon.'],
['Mysore Painting','A','KA','Mysuru','CL','S','Delicate paintings with gesso relief and gold leaf.','GI'],
['Navalgund Durries','A','KA','Dharwad (Navalgund)','MD','S','Handwoven cotton durries with bright geometric motifs.','GI'],
['Ganjifa Cards','A','KA','Mysuru','MD','V','Round hand-painted playing cards with mythological themes, treasured by a few master painters.'],

/* ===== Kerala ===== */
['Kolkali','D','KL','Kannur, Malappuram','MD','S','Stick dance of men moving in circles with crisp, rhythmic clashes.'],
['Mappila Pattu','M','KL','Malappuram, Kozhikode','MD','T','Melodious songs of the Mappila community in the Arabi-Malayalam tradition.'],
['Vanchipattu','M','KL','Alappuzha, Pathanamthitta','MD','T','Boat songs sung in chorus by rowers, setting the rhythm of the snake boats.'],
['Nehru Trophy Boat Race','F','KL','Alappuzha','MO','T','Thrilling snake-boat race on Punnamada Lake, held since 1952.'],
['Balaramapuram Handloom','A','KL','Thiruvananthapuram','CL','T','Fine cotton weaves with golden kasavu borders.','GI'],
['Kerala Coir','A','KL','Alappuzha','CL','T','Coconut-fibre mats and products from Kerala\'s coir capital.'],
['Ashtavaidya Ayurveda','K','KL','Thrissur, Malappuram','EM','T','Hereditary physician families preserving and practising classical Ayurveda.'],

/* ===== Madhya Pradesh ===== */
['Bundeli Phaag','M','MP','Chhatarpur, Tikamgarh','MD','S','Spring Holi songs of Bundelkhand, sung with dhol and nagadiya.'],
['Nimar Gangaur','F','MP','Khargone, Khandwa','MD','T','Women worship Gauri with songs and dances across the Nimar region.'],
['Simhastha Kumbh','F','MP','Ujjain','AN','T','Grand Kumbh gathering on the Shipra, held about every twelve years.'],
['Indore Leather Toys','A','MP','Indore','CL','S','Stuffed leather animal toys crafted by Indore\'s artisans.','GI'],
['Betul Bell Metal','A','MP','Betul','AN','S','Dhokra-style metal casting of deities and animals by Bharewa artisans.'],
['Baiga Painting','A','MP','Dindori','AN','T','Bold patterned art of the Baiga, celebrated through Padma Shri Jodhaiya Bai Baiga.'],

/* ===== Maharashtra ===== */
['Lezim','D','MH','Pune, Satara, all districts','MD','T','Energetic dance with jingling lezim instruments, leading festive processions.'],
['Dhol-Tasha','I','MH','Pune','CL','T','Large drum and snare ensembles that thunder joyfully through Ganeshotsav.'],
['Sambal','I','MH','Kolhapur, Beed','MD','S','Twin drum played with curved sticks in the Gondhal ritual.'],
['Gudi Padwa','F','MH','All districts','AN','T','Marathi new year marked by raising the gudi and colourful shobha yatras.'],
['Pola','F','MH','Nagpur, Amravati, Wardha','AN','T','Festival thanking the bullocks after the sowing season, with decorations and processions.'],
['Solapur Chaddar','A','MH','Solapur','CL','T','Durable jacquard cotton bedsheets from Solapur\'s looms.','GI'],
['Himroo Weave','A','MH','Chhatrapati Sambhajinagar','MD','N','Cotton-silk brocade woven since the medieval era, cherished by a devoted weaving community.'],
['Kirtan Tradition','O','MH','All districts','MD','T','Devotional discourse blending storytelling, music and philosophy.'],

/* ===== Manipur ===== */
['Khamba Thoibi Dance','D','MN','Bishnupur (Moirang)','EM','S','Duet dance recreating the love of Khamba and Thoibi during Lai Haraoba.'],
['Cheiraoba','F','MN','All valley districts','AN','T','Manipuri new year, when families feast and climb hills for good fortune.'],
['Sangai Festival','F','MN','Imphal East, Imphal West','MO','T','Annual showcase of Manipur\'s culture, named after the state animal.'],
['Kauna Craft','A','MN','Bishnupur, Thoubal','AN','T','Mats, cushions and furniture woven from the kauna water reed.'],
['Shaphee Lanphee','A','MN','Imphal East','MD','S','Warrior shawl with embroidered motifs of honour.','GI'],

/* ===== Meghalaya ===== */
['Nongkrem Dance','D','ML','East Khasi Hills (Smit)','AN','T','Graceful harvest dance performed during the Nongkrem thanksgiving.'],
['Wangala Dance','D','ML','West Garo Hills, East Garo Hills','AN','T','Garo dancers move in rows to the beat of the dama during Wangala.'],
['Ksing and Tangmuri','I','ML','East Khasi Hills, West Khasi Hills','AN','S','Drum and pipe that accompany Khasi ceremonies and dances.'],
['Khasi Cane Craft','A','ML','East Khasi Hills','AN','T','Cane baskets such as the khoh, carried across the hills every day.'],
['Nartiang Monoliths','K','ML','West Jaintia Hills (Nartiang)','AN','S','Monolith traditions of the Jaintia people, seen in the grand stones of Nartiang.'],

/* ===== Mizoram ===== */
['Sarlamkai','D','MZ','All districts','AN','S','Dignified dance in bright attire, once performed to celebrate victory.'],
['Pawl Kut','F','MZ','All districts','AN','T','Harvest festival after the rice is gathered, with feasting and togetherness.'],
['Darkhuang','I','MZ','All districts','AN','S','Traditional gong that rings out at celebrations.'],
['Mizo Bamboo Craft','A','MZ','All districts','AN','T','Bamboo and cane household items, hats and baskets.'],
['Zawlbuk Heritage','K','MZ','All districts','AN','N','Traditional bachelors\' dormitory that trained youth in service, courage and discipline.'],

/* ===== Nagaland ===== */
['Tuluni','F','NL','Zunheboto','AN','T','Sumi festival of July celebrating a good harvest with feasting and songs.'],
['Aoleang','F','NL','Mon','AN','T','Konyak spring festival welcoming the new year with dances and prayers.'],
['Konyak Woodcarving','A','NL','Mon','AN','S','Carved figures and panels of the Konyak, rich in symbolism.'],
['Naga Beadwork','A','NL','All districts','AN','T','Colourful bead necklaces worn with pride as symbols of identity.'],
['Ao Folk Tales','O','NL','Mokokchung','AN','S','Oral lore of the Ao Nagas, told in homes and once in the morung.'],

/* ===== Odisha ===== */
['Ranappa','D','OD','Ganjam','MD','S','Stilt dance of Ganjam depicting Krishna\'s childhood with nimble steps.'],
['Raja Parba','F','OD','Cuttack, Puri, Khordha','AN','T','Three-day festival celebrating womanhood and the earth, with swings and pitha.'],
['Kotpad Handloom','A','OD','Koraput (Kotpad)','AN','S','Organic-dyed cotton weaves of the Mirgan community.','GI'],
['Konark Stone Carving','A','OD','Puri','EM','T','Stone sculpture in the tradition of the Sun Temple of Konark.','GI'],
['Chilika Fishing Knowledge','K','OD','Khordha, Puri, Ganjam','AN','S','Fishing communities\' deep knowledge of lagoon seasons, tides and fish.'],

/* ===== Punjab ===== */
['Sammi','D','PB','Sangrur, Faridkot','MD','N','Graceful women\'s dance with origins in the Sandal Bar region.'],
['Teeyan','F','PB','All districts','AN','T','Monsoon festival of women with swings, songs and Giddha.'],
['Maghi Mela','F','PB','Sri Muktsar Sahib','MD','T','Fair commemorating the Forty Liberated Ones, with devotion and community spirit.'],
['Chimta','I','PB','All districts','MD','T','Tongs with jingles that sparkle through folk and devotional music.'],
['Punjabi Jutti','A','PB','Patiala, Amritsar','MD','T','Embroidered leather footwear loved for festivals and weddings.'],
['Paranda','A','PB','Patiala','MD','S','Colourful tasselled braid ornaments made with silk thread.'],

/* ===== Rajasthan ===== */
['Gair Dance','D','RJ','Barmer, Bhilwara','MD','T','Bhil men dance with sticks in wide circles during Holi.'],
['Kachchhi Ghodi','D','RJ','Shekhawati (Jhunjhunu, Sikar)','MD','S','Dance with dummy horses recounting tales of valour.'],
['Jasnathi Fire Dance','D','RJ','Bikaner','MD','S','Jasnathi devotees dance on glowing embers to the beat of drums.'],
['Desert Festival','F','RJ','Jaisalmer','MO','T','Winter festival of music, dance and camel pageants on the golden dunes.'],
['Molela Terracotta','A','RJ','Rajsamand (Molela)','MD','S','Votive terracotta plaques of folk deities.','GI'],
['Pichhwai','A','RJ','Rajsamand (Nathdwara)','MD','T','Large devotional paintings of Shrinathji for temple backdrops.'],
['Thewa','A','RJ','Pratapgarh','MD','N','Gold filigree fused onto coloured glass by a handful of master families.'],
['Kawad Storytelling','O','RJ','Chittorgarh (Bassi)','MD','N','Portable painted wooden shrine opened panel by panel as stories unfold.'],

/* ===== Sikkim ===== */
['Chu Faat Dance','D','SK','Gangtok','AN','S','Lepcha dance honouring Khangchendzonga and its guardian peaks.'],
['Yak Chham','D','SK','Mangan, Gangtok','MD','S','Joyful dance celebrating the yak and the herders of the high mountains.'],
['Bumchu','F','SK','Gyalshing (Tashiding)','MD','T','Sacred water festival at Tashiding monastery, foretelling the year ahead.'],
['Lepcha Weaving','A','SK','Mangan','AN','S','Lepcha textiles woven on backstrap looms in vivid stripes.'],
['Choktse Tables','A','SK','Gangtok','MD','S','Carved and painted folding tables of Sikkimese homes.'],
['Temi Tea','K','SK','Namchi','MO','T','Tea from Sikkim\'s Temi garden, planted in 1969 on Himalayan slopes.'],

/* ===== Tamil Nadu ===== */
['Mayilattam','D','TN','Madurai, Tiruchirappalli','MD','S','Peacock dance in feathered costumes, honouring Lord Murugan.'],
['Devarattam','D','TN','Madurai, Theni','MD','N','Graceful dance of the Kambalathu Nayakkar community to the urumi drum.'],
['Urumi','I','TN','Madurai, Theni','MD','S','Hourglass drum that produces a distinctive, thrilling roar.'],
['Chithirai Festival','F','TN','Madurai','MD','T','Celebration of Meenakshi\'s celestial wedding and the arrival of Kallazhagar.'],
['Madurai Sungudi','A','TN','Madurai','MD','T','Tie-dyed cotton sarees with dotted patterns.','GI'],
['Thanjavur Dolls','A','TN','Thanjavur','CL','T','Bobble-headed dancing dolls that sway with every touch.','GI'],
['Chettinad Kottan','A','TN','Sivaganga','CL','S','Colourful palm-leaf baskets of the Chettinad region.','GI'],

/* ===== Telangana ===== */
['Lambadi Dance of Telangana','D','TS','Nalgonda, Mahabubnagar','MD','T','Banjara women dance in mirror-worked costumes at festivals and fairs.'],
['Dappu','I','TS','All districts','AN','R','Frame drum reclaimed as a proud symbol of celebration.'],
['Gadwal Saree','A','TS','Jogulamba Gadwal','CL','T','Cotton-bodied sarees with rich silk borders.','GI'],
['Pembarthi Brass','A','TS','Jangaon (Pembarthi)','EM','S','Sheet-metal brassware with fine repoussé work.','GI'],
['Adilabad Dokra','A','TS','Adilabad','AN','S','Lost-wax metal casting by the Ojha artisans.','GI'],

/* ===== Tripura ===== */
['Mamita Dance','D','TR','West Tripura','AN','T','Harvest dance of the Tripuri people, thanking nature for its gifts.'],
['Ker Puja','F','TR','West Tripura','MD','T','Festival for the protection and well-being of the land and its people.'],
['Pachra Weave','A','TR','All districts','AN','S','Tripuri skirts woven with bright patterns on backstrap looms.'],

/* ===== Uttar Pradesh ===== */
['Dhobiya Nritya','D','UP','Ghazipur, Varanasi','MD','N','Lively dance with a dummy horse and songs, popular at weddings in Purvanchal.'],
['Magh Mela','F','UP','Prayagraj','AN','T','Annual winter gathering of pilgrims at the Triveni Sangam.'],
['Lucknow Zardozi','A','UP','Lucknow','MD','T','Metal-thread embroidery on silk and velvet.','GI'],
['Khurja Pottery','A','UP','Bulandshahr (Khurja)','MD','T','Colourful glazed ceramics from Khurja.','GI'],
['Varanasi Wooden Toys','A','UP','Varanasi','MD','S','Lacquered wooden toys in cheerful colours.','GI'],
['Kalanamak Rice','K','UP','Siddharthnagar','AN','T','Aromatic rice long associated with the Buddha\'s land, recognised with a GI tag.','GI'],

/* ===== Uttarakhand ===== */
['Jhora','D','UK','Almora, Bageshwar','MD','T','Community circle dance at fairs, where everyone joins hands.'],
['Mangal Geet','M','UK','All districts','AN','S','Auspicious songs sung by women at weddings and ceremonies.'],
['Uttarayani Mela','F','UK','Bageshwar','MD','T','Fair at the confluence of the Saryu and Gomti on Makar Sankranti.'],
['Likhai Woodcarving','A','UK','Almora, Pithoragarh','MD','N','Carved doors and windows adorning traditional Kumaoni homes.'],
['Bhotiya Dann','A','UK','Pithoragarh, Chamoli','AN','S','Woollen rugs woven by Bhotiya weavers.','GI'],

/* ===== West Bengal ===== */
['Tusu Dance','D','WB','Purulia, Bankura','AN','T','Winter harvest dance with Tusu songs sung by women.'],
['Bengal Kirtan','M','WB','Nadia','MD','T','Devotional singing in the tradition of Sri Chaitanya.'],
['Rash Mela of Cooch Behar','F','WB','Cooch Behar','CL','T','Grand fair held since 1812, bringing together communities and crafts.'],
['Joydev Kenduli Mela','F','WB','Birbhum','MD','T','Winter gathering of Bauls honouring the poet Jayadeva.'],
['Bengal Dokra','A','WB','Bankura (Bikna)','AN','T','Lost-wax metal craft of the Dokra artisans.','GI'],
['Shantiniketan Leather','A','WB','Birbhum','MO','T','Embossed and batik-style leather goods.','GI'],
['Madur Kathi','A','WB','Paschim Medinipur','MD','T','Fine reed mats woven in Medinipur.','GI'],
['Kabigaan','O','WB','All districts','CL','N','Witty poetic duels sung between two poets and their troupes.'],

/* ===== Andaman & Nicobar Islands ===== */
['Island Tourism Festival','F','AN','South Andaman','MO','T','Winter festival showcasing island music, dance, crafts and cuisine.'],
['Jarawa Forest Knowledge','K','AN','South Andaman, North and Middle Andaman','AN','S','Deep knowledge of forest and sea that sustains the Jarawa way of life.'],
['Nicobarese Hut Architecture','K','AN','Nicobar','AN','S','Raised, beehive-shaped huts perfectly suited to the island climate.'],
['Karen Community Heritage','O','AN','North and Middle Andaman (Mayabunder)','CL','S','Songs, dances and crafts of the Karen settlers who arrived in the 1920s.'],

/* ===== Chandigarh ===== */
['Chandigarh Rose Festival','F','CH','Chandigarh','MO','T','Festival at the Zakir Hussain Rose Garden each February with music and folk performances.'],
['Kalagram Crafts','A','CH','Chandigarh','MO','T','Cultural complex of the North Zone Cultural Centre hosting craft fairs and folk shows.'],

/* ===== Dadra & Nagar Haveli and Daman & Diu ===== */
['Nariyal Purnima','F','DN','Daman, Diu','AN','T','Coconut offerings to the sea marking the start of the fishing season.'],
['Diu Festival','F','DN','Diu','MO','T','Beachside festival celebrating island music, dance and cuisine.'],
['Vanakbara Boat Building','K','DN','Diu (Vanakbara)','MD','S','Wooden fishing boats built by skilled craftsmen of Vanakbara.'],

/* ===== Delhi ===== */
['Qutub Festival','F','DL','South Delhi (Mehrauli)','MO','T','Music and dance festival against the backdrop of the Qutub Minar.'],
['Delhi Meenakari','A','DL','Central Delhi (Old Delhi)','MD','S','Colourful enamel work on metal jewellery and objects.'],
['Ramlila of Delhi','O','DL','All districts','MD','T','Ramlila staged across Delhi\'s neighbourhoods during Dussehra.'],

/* ===== Jammu & Kashmir ===== */
['Chakri','M','JK','All districts','MD','S','Lively folk music with tumbaknari, rabab and sarangi.'],
['Dogri Folk Songs','M','JK','Jammu, Kathua, Udhampur','MD','S','Songs in Dogri celebrating seasons, love and festivals.'],
['Jashn-e-Baharan','F','JK','Srinagar','MO','T','Spring festival at the tulip garden overlooking Dal Lake.'],
['Bahu Mela','F','JK','Jammu','MD','T','Navratri fair at the Bawe Wali Mata temple in Bahu Fort.'],
['Sozni Embroidery','A','JK','Srinagar','MD','T','Fine needle embroidery on shawls, as delicate as painting.'],
['Kashmiri Namda','A','JK','Srinagar, Baramulla','MD','R','Felted woollen rugs revived through skill-training programmes.'],

/* ===== Ladakh ===== */
['Sindhu Darshan','F','LA','Leh','MO','T','Festival on the banks of the Indus, held each June since 1997.'],
['Dosmoche','F','LA','Leh','MD','T','Festival of the scapegoat that sends away misfortune before the new year.'],
['Ladakhi Carpets','A','LA','Leh','MD','S','Hand-knotted woollen carpets with Buddhist motifs.'],
['Chiling Metal Craft','A','LA','Leh (Chiling)','MD','N','Copper and silver work by the metalsmiths of Chiling village.'],
['Balti Songs','M','LA','Kargil','MD','S','Folk songs in the Balti language, sung at gatherings and weddings.'],

/* ===== Lakshadweep ===== */
['Oppana of Lakshadweep','D','LD','Lakshadweep (Kavaratti, Andrott)','MD','T','Wedding song-dance of island women with rhythmic clapping.'],
['Bandiya Dance','D','LD','Lakshadweep (Minicoy)','MD','S','Minicoy women\'s dance with water pots, full of grace.'],

/* ===== Puducherry ===== */
['Karaikal Mangani Festival','F','PY','Karaikal','MD','T','Mango festival honouring the poet-saint Karaikal Ammaiyar.'],
['Franco-Tamil Architecture','K','PY','Puducherry','CL','S','Homes blending Tamil courtyards with French façades, preserved by the community.'],
['Puducherry Pongal','F','PY','Puducherry, Karaikal','AN','T','Harvest festival honouring the Sun and cattle with kolams and sweet pongal.']
);

/* ---------------------------------------------------------
   3c. DISTRICT-FOCUSED RECORDS (third expansion)
   --------------------------------------------------------- */
RAW.push(
/* Andhra Pradesh */
['Tirupati Gangamma Jatara','F','AP','Tirupati','MD','T','Week-long folk festival of goddess Gangamma, famous for devotees who take on joyful disguises.'],
['Budithi Bell Metal','A','AP','Srikakulam (Budithi)','MD','S','Bell-metal and brass utensils crafted by the artisans of Budithi village.','GI'],
['Ponduru Khadi','A','AP','Srikakulam (Ponduru)','CL','S','Exceptionally fine hand-spun khadi from Ponduru, admired by Mahatma Gandhi.'],
['Dharmavaram Silk','A','AP','Sri Sathya Sai (Dharmavaram)','CL','T','Rich silk sarees with broad zari borders and temple motifs.','GI'],
['Tirupati Laddu','K','AP','Tirupati','MD','T','Sacred sweet offering of Tirumala prepared by temple cooks, recognised with a GI tag.','GI'],
/* Arunachal Pradesh */
['Boori Boot','F','AR','Kra Daadi, Kurung Kumey, Papum Pare','AN','T','Nyishi festival of February celebrating unity and the arrival of spring.'],
['Chalo Loku','F','AR','Tirap, Changlang','AN','T','Nocte festival marking the harvest with dances, songs and feasts.'],
['Oriah','F','AR','Longding','AN','T','Wancho festival of spring with community feasting and dances.'],
['Sangken','F','AR','Namsai','MD','T','Tai Khamti water festival welcoming the new year by bathing Buddha images.'],
['Tamladu','F','AR','Lohit, Anjaw','AN','T','Digaru Mishmi festival praying for protection and prosperity.'],
/* Assam */
['Bwisagu','F','AS','Kokrajhar, Chirang, Baksa','AN','T','Bodo spring new year celebrated with Bagurumba dances and prayers to Bathou.'],
['Rongker','F','AS','Karbi Anglong, West Karbi Anglong','AN','T','Karbi community festival praying for the well-being of the village.'],
['Dehing Patkai Festival','F','AS','Tinsukia (Lekhapani)','MO','T','Festival celebrating the heritage, tea culture and forests of eastern Assam.'],
['Bushu Dima','F','AS','Dima Hasao','AN','T','Dimasa harvest festival with feasting, music and traditional dances.'],
['Kherai Puja','F','AS','Kokrajhar, Udalguri','AN','T','Bodo ritual festival with graceful Kherai dances.'],
['Bodo Dokhona Weaving','A','AS','Kokrajhar, Baksa, Udalguri','AN','T','Handwoven dokhona with vibrant agor motifs, recognised with a GI tag.','GI'],
/* Bihar */
['Pitrapaksha Mela','F','BR','Gaya','AN','T','Pilgrims gather in Gaya to honour their ancestors during the fortnight of Pitru Paksha.'],
['Bodh Mahotsav','F','BR','Gaya (Bodh Gaya)','MO','T','Festival celebrating Buddhist heritage at Bodh Gaya with music and dance.'],
['Silao Khaja','K','BR','Nalanda (Silao)','MD','T','Crisp, many-layered sweet of Silao, recognised with a GI tag.','GI'],
['Katarni Rice','K','BR','Bhagalpur, Banka','AN','S','Aromatic rice of the Bhagalpur region, recognised with a GI tag.','GI'],
['Purbi Songs','M','BR','Saran, Siwan','CL','S','Bhojpuri songs of longing for loved ones working in distant lands.'],
['Khatwa Applique','A','BR','Patna, Madhubani','MD','S','Colourful appliqué canopies and tents made by women artisans.'],
/* Chhattisgarh */
['Chhattisgarhi Nacha','O','CG','Durg, Rajnandgaon, Raipur','CL','S','Folk theatre of music, satire and dance that inspired Habib Tanvir\'s Naya Theatre.'],
['Rajim Kumbh Kalp','F','CG','Gariaband (Rajim)','MD','T','Magh Purnima fair at the confluence of rivers at Rajim.'],
['Chakradhar Samaroh','F','CG','Raigarh','MO','T','Music and dance festival honouring Raja Chakradhar Singh, patron of Kathak.'],
['Sirpur Mahotsav','F','CG','Mahasamund (Sirpur)','MO','T','Festival at the ancient site of Sirpur celebrating its layered heritage.'],
/* Goa */
['Ghodemodni','D','GA','North Goa (Bicholim, Pernem)','MD','S','Warrior horse dance of Shigmo performed with festive drumming.'],
['Dashavatari Theatre of Goa','O','GA','North Goa (Pernem)','MD','S','Night-long folk theatre of the ten avatars, shared with the Konkan coast.'],
['Kaalo','O','GA','North Goa, South Goa','MD','S','Temple folk drama performed at the close of the zatra season.'],
/* Gujarat */
['Kutchi Shawl','A','GJ','Kutch','MD','T','Handwoven woollen shawls of the Vankar weavers of Kutch.','GI'],
['Jamnagari Bandhani','A','GJ','Jamnagar','MD','T','Tie-dye textiles with fine dotted patterns.'],
['Surat Zari Craft','A','GJ','Surat','MD','S','Metallic zari threads made by Surat artisans for sarees and embroidery.','GI'],
['Lippan Kaam','A','GJ','Kutch','MD','T','Mud-and-mirror relief work that makes the walls of Kutch homes sparkle.'],
['Modhera Dance Festival','F','GJ','Mehsana (Modhera)','MO','T','Dance festival held against the Sun Temple of Modhera.'],
['Chitra-Vichitra Mela','F','GJ','Sabarkantha (Gunbhakhari)','MD','T','Tribal fair of the Bhil and Garasia communities after Holi.'],
/* Haryana */
['Pinjore Heritage Festival','F','HR','Panchkula (Pinjore)','MO','T','Festival at the Yadavindra Gardens with folk and classical performances.'],
['Kapal Mochan Mela','F','HR','Yamunanagar','MD','T','Kartik Purnima fair at the sacred tanks of Kapal Mochan.'],
/* Himachal Pradesh */
['Renuka Ji Fair','F','HP','Sirmaur (Renuka)','MD','T','November fair at Renuka lake honouring Mother Renuka and Parshuram.'],
['Sujanpur Holi','F','HP','Hamirpur (Sujanpur Tira)','CL','T','Grand Holi fair of Sujanpur Tira, begun in the time of Raja Sansar Chand.'],
['Kinnauri Cap','A','HP','Kinnaur','AN','T','Woollen cap with a green velvet band, a proud symbol of Kinnauri identity.'],
['Himachali Dham','K','HP','Mandi, Kangra, Chamba','MD','T','Traditional community feast cooked by botis and served on leaf plates.'],
/* Jharkhand */
['Hul Diwas','F','JH','Sahibganj (Bhognadih)','CL','T','Remembrance of the 1855 Santhal Hul led by Sidhu and Kanhu Murmu.'],
['Deoghar Shravani Mela','F','JH','Deoghar','MD','T','Month-long pilgrimage of Kanwariyas to Baba Baidyanath Dham.'],
['Jitiya','F','JH','Palamu, Garhwa','AN','T','Mothers fast and pray for the well-being of their children.'],
['Birhor Rope Craft','A','JH','Hazaribagh, Giridih','AN','N','Rope and basket making from forest fibres by the Birhor community.'],
/* Karnataka */
['Hampi Utsav','F','KA','Vijayanagara (Hampi)','MO','T','Festival reviving the splendour of the Vijayanagara capital with music and dance.'],
['Bolak-aat','D','KA','Kodagu','MD','S','Kodava men\'s dance with chavari and swords by lamplight.'],
['Kinnal Craft','A','KA','Koppal (Kinnal)','MD','N','Light wooden toys and figures painted in bright colours.','GI'],
['Udupi Sarees','A','KA','Udupi','CL','S','Soft cotton sarees woven by the handloom cooperatives of Udupi.','GI'],
['Gombe Habba','F','KA','Mysuru, all districts','MD','T','Families arrange steps of dolls during Navaratri, sharing stories and sweets.'],
['Sandur Lambani Embroidery','A','KA','Ballari (Sandur)','MD','S','Mirror and cowrie embroidery of the Lambani community, recognised with a GI tag.','GI'],
/* Kerala */
['Chavittu Natakam','O','KL','Ernakulam, Thrissur','CL','S','Musical drama with stamping steps and grand costumes, performed by coastal communities.'],
['Poorakkali','D','KL','Kannur, Kasaragod','MD','S','Temple dance of men around a lamp during the Pooram festival of north Kerala.'],
['Arattupuzha Pooram','F','KL','Thrissur','MD','T','Grand gathering of temple deities at Arattupuzha.'],
['Kasavu Saree','A','KL','Thiruvananthapuram, Thrissur','CL','T','Off-white handloom saree with a golden kasavu border, the signature of Kerala.'],
['Payyannur Pavithra Mothiram','A','KL','Kannur (Payyannur)','MD','S','Sacred gold ring crafted by traditional goldsmiths.','GI'],
/* Madhya Pradesh */
['Khajuraho Dance Festival','F','MP','Chhatarpur (Khajuraho)','MO','T','Annual dance festival against the temples of Khajuraho, begun in 1975.'],
['Tansen Samaroh','F','MP','Gwalior','CL','T','Music festival honouring Tansen, held near his tomb in Gwalior.'],
['Jhabua Tribal Dolls','A','MP','Jhabua','AN','S','Colourful cloth dolls of Bhil couples made by tribal women.'],
['Malwi Maach','O','MP','Ujjain, Indore','CL','N','Folk theatre of Malwa staged on a raised platform with songs and dialogue.'],
/* Maharashtra */
['Dashavatar','O','MH','Sindhudurg','MD','S','Night-long folk theatre of the ten incarnations of Vishnu, staged in Konkan villages.'],
['Chitrakathi','O','MH','Sindhudurg (Pinguli)','MD','V','Painted picture storytelling and puppetry of the Thakar community of Pinguli.'],
['Sawantwadi Lacquerware','A','MH','Sindhudurg (Sawantwadi)','MD','S','Lacquered wooden toys, fruits and ganjifa cards from Sawantwadi.'],
['Dandar','O','MH','Bhandara, Gondia, Chandrapur','CL','N','Folk theatre of Vidarbha performed after the harvest.'],
['Ratnagiri Alphonso','K','MH','Ratnagiri, Sindhudurg','CL','T','Konkan mango orchards tended with traditional knowledge, recognised with a GI tag.','GI'],
['Nashik Kumbh','F','MH','Nashik (Trimbakeshwar)','AN','T','Simhastha Kumbh held at Nashik and Trimbakeshwar about every twelve years.'],
/* Manipur */
['Heikru Hidongba','F','MN','Imphal East','MD','T','Ritual boat race held in the moat of Bijoy Govinda.'],
['Lui-Ngai-Ni','F','MN','Senapati, Ukhrul, Tamenglong','MO','T','Seed-sowing festival of the Naga communities of Manipur.'],
['Kut Festival','F','MN','Churachandpur','AN','T','Post-harvest festival of the Kuki-Chin-Mizo communities.'],
['Wangkhei Phee','A','MN','Imphal East','MD','T','Fine, transparent cotton fabric woven in Wangkhei.','GI'],
/* Meghalaya */
['Seng Kut Snem','F','ML','East Khasi Hills','MO','T','Annual celebration of Khasi faith and heritage each November.'],
['Doregata Dance','D','ML','West Garo Hills','AN','S','Playful Garo dance in which women try to tip off the men\'s turbans.'],
['Chad Sukra','F','ML','West Jaintia Hills','AN','T','Pnar sowing festival with prayers for a good harvest.'],
/* Mizoram */
['Thalfavang Kut','F','MZ','All districts','AN','T','Festival marking the end of the weeding season with songs and games.'],
['Chawnglaizawn','D','MZ','Lawngtlai','AN','S','Dance of the Lai community performed in joyful circles.'],
['Solakia','D','MZ','Lawngtlai, Saiha','AN','S','Dance of the Mara and Lai communities with gongs and drums.'],
/* Nagaland */
['Naknyulem','F','NL','Longleng','AN','T','Phom festival in July celebrating harmony and prosperity.'],
['Ngada','F','NL','Tseminyu','AN','T','Rengma thanksgiving festival after the harvest.'],
['Metemneo','F','NL','Kiphire','AN','T','Yimkhiung festival of harvest and thanksgiving.'],
['Tokhu Emong','F','NL','Wokha','AN','T','Lotha harvest festival of November, a time of sharing and reconciliation.'],
/* Odisha */
['Chaiti Ghoda','D','OD','Puri, Ganjam','MD','S','Horse dance of fishing communities during the month of Chaitra.'],
['Baunsa Rani','D','OD','Sambalpur, Bargarh','CL','S','Acrobatic dance on bamboo poles performed by girls of western Odisha.'],
['Sital Sasthi','F','OD','Sambalpur','MD','T','Festival celebrating the divine marriage of Shiva and Parvati.'],
['Ganjam Kewda','K','OD','Ganjam','AN','S','Kewda flower cultivation and distillation for fragrance, recognised with a GI tag.','GI'],
['Berhampur Patta','A','OD','Ganjam (Berhampur)','MD','S','Silk sarees with temple borders woven in Berhampur.','GI'],
['Odisha Rasagola','K','OD','Cuttack, Puri','MD','T','Temple sweet tradition of Odisha, recognised with a GI tag in 2019.','GI'],
/* Punjab */
['Jugni','M','PB','All districts','CL','T','Folk song form carrying wisdom and wit, sung by generations of Punjabi singers.'],
['Kila Raipur Rural Games','F','PB','Ludhiana (Kila Raipur)','CL','T','Rural sports festival begun in 1933, celebrating strength and skill.'],
['Harballabh Sangeet Sammelan','F','PB','Jalandhar','CL','T','Music festival held since 1875 at Devi Talab Mandir.'],
['Bagh Embroidery','A','PB','Patiala','CL','S','Dense Phulkari that covers the whole cloth like a blooming garden.'],
/* Rajasthan */
['Teja Ji Mela','F','RJ','Nagaur (Kharnal)','MD','T','Fair honouring the folk deity Teja Ji, protector of cattle.'],
['Ramdevra Fair','F','RJ','Jaisalmer (Ramdevra)','MD','T','Fair of Baba Ramdev drawing pilgrims from all communities.'],
['Nagaur Cattle Fair','F','RJ','Nagaur','MD','T','Great livestock fair with camel races and folk music.'],
['Bikaneri Bhujia','K','RJ','Bikaner','CL','T','Crunchy snack made to traditional recipes, recognised with a GI tag.','GI'],
['Makrana Marble Craft','A','RJ','Didwana-Kuchaman (Makrana)','MD','T','Marble carving from the quarries that supplied the Taj Mahal.','GI'],
/* Sikkim */
['Sakewa','F','SK','Soreng, Gyalshing','AN','T','Kirat Rai festival worshipping mother earth with the Sakela dance.'],
['Kagyed Chaam','D','SK','Gangtok (Rumtek)','MD','T','Masked monastic dance performed before the new year.'],
/* Tamil Nadu */
['Thyagaraja Aradhana','F','TN','Thanjavur (Thiruvaiyaru)','CL','T','Music festival where musicians sing Thyagaraja\'s Pancharatna kritis together.'],
['Bommai Kolu','F','TN','All districts','MD','T','Navaratri display of dolls arranged on steps in homes and temples.'],
['Kovai Kora Cotton','A','TN','Coimbatore','CL','S','Cotton sarees woven around Coimbatore.','GI'],
['Pattamadai Pai','A','TN','Tirunelveli (Pattamadai)','MD','V','Silky-fine korai grass mats woven by master weavers.','GI'],
['Chettinad Architecture','K','TN','Sivaganga, Pudukkottai','CL','S','Grand mansions with Athangudi tiles, teak pillars and open courtyards.'],
['Athangudi Tiles','A','TN','Sivaganga (Athangudi)','CL','S','Handmade cement tiles in vibrant patterns.'],
/* Telangana */
['Peddagattu Jatara','F','TS','Suryapet','MD','T','Biennial Yadava festival of Lord Lingamanthula Swamy.'],
['Komuravelli Mallanna Jatara','F','TS','Siddipet','MD','T','Festival of Mallanna with oggu katha and colourful rituals.'],
['Narayanpet Handloom','A','TS','Narayanpet','CL','S','Cotton and silk sarees with temple borders.','GI'],
['Hyderabadi Haleem','K','TS','Hyderabad','CL','T','Slow-cooked Ramzan dish, the first meat preparation in India with a GI tag.','GI'],
/* Tripura */
['Neermahal Festival','F','TR','Sepahijala (Melaghar)','MO','T','Boat races and cultural shows at the lake palace of Neermahal.'],
['Jampui Orange Festival','F','TR','North Tripura (Jampui Hills)','MO','T','Festival celebrating the orange harvest of the Jampui hills.'],
/* Uttar Pradesh */
['Sanjhi','A','UP','Mathura (Vrindavan)','MD','S','Paper stencil art for temple floors, cut with fine scissors.'],
['Ayodhya Deepotsav','F','UP','Ayodhya','MO','T','Grand festival of lamps on the banks of the Saryu at Diwali.'],
['Bateshwar Fair','F','UP','Agra (Bateshwar)','MD','T','Ancient livestock and pilgrimage fair on the Yamuna.'],
['Pilkhuwa Hand Block Print','A','UP','Hapur (Pilkhuwa)','MD','S','Hand-block printed textiles.','GI'],
['Gorakhpur Terracotta','A','UP','Gorakhpur','MD','T','Hand-crafted terracotta horses and elephants.','GI'],
['Saharanpur Woodcraft','A','UP','Saharanpur','MD','T','Intricately carved wooden furniture and décor.','GI'],
/* Uttarakhand */
['Kumaoni Holi','M','UK','Almora, Nainital','CL','T','Baithki and khadi Holi songs sung for weeks across Kumaon.'],
['Uttarkashi Magh Mela','F','UK','Uttarkashi','MD','T','Winter fair with trade and folk performances.'],
['Bissu','F','UK','Dehradun (Chakrata)','AN','T','Spring festival of Jaunsar with dances and traditional archery games.'],
['Pichhoda','A','UK','Almora, Nainital','CL','T','Saffron-and-red ceremonial veil worn by Kumaoni women.'],
['Munsiyari Rajma','K','UK','Pithoragarh (Munsiyari)','AN','S','High-altitude beans grown by traditional methods.','GI'],
/* West Bengal */
['Bishnupur Terracotta Temples','A','WB','Bankura (Bishnupur)','MD','S','Terracotta temple art of the Malla kings, rich with epic scenes.'],
['Bhadu','F','WB','Purulia, Bankura','CL','S','Monsoon festival of songs honouring Bhadu.'],
['Gajan','F','WB','All districts','MD','T','Chaitra festival for Shiva with processions of devotees.'],
['Banglar Rasogolla','K','WB','Kolkata','CL','T','Soft, syrupy sweet recognised with a GI tag in 2017.','GI'],
['Joynagar Moa','K','WB','South 24 Parganas (Joynagar)','CL','S','Winter sweet of puffed rice and date-palm jaggery.','GI'],
['Krishnanagar Clay Dolls','A','WB','Nadia (Krishnanagar)','CL','T','Lifelike clay figures made by the potters of Ghurni.'],
['Kumartuli Idol Making','A','WB','Kolkata (Kumartuli)','CL','T','Clay idols crafted for Durga Puja in Kolkata\'s potters\' quarter.'],
/* Union Territories */
['Wazwan','K','JK','Srinagar, all districts','MD','T','Multi-course feast cooked by master chefs called wazas.'],
['Pheran','A','JK','All districts','MD','T','Loose woollen gown worn through Kashmir\'s winters.'],
['Shikara Craft','K','JK','Srinagar','MD','T','Graceful wooden boats of Dal Lake built by traditional boatmakers.'],
['Jhiri Mela','F','JK','Jammu (Jhiri)','CL','T','Kartik Purnima fair honouring Baba Jitto.'],
['Thiksey Gustor','F','LA','Leh (Thiksey)','MD','T','Monastery festival with masked cham dances.'],
['Sufi Basant','F','DL','South East Delhi (Nizamuddin)','MD','T','Spring festival at Nizamuddin Dargah that traces to Amir Khusrau\'s time.'],
['Mahe Temple Festivals','F','PY','Mahe','MD','T','Temple festivals of Mahe with Theyyam performances and processions.'],
['Yanam People\'s Festival','F','PY','Yanam','MO','T','Annual cultural festival celebrating the people and arts of Yanam.']
);

/* Search hints: sharper image searches for short or ambiguous names */
const HINTS = {
  'Pena': 'Pena instrument Manipur', 'Tati': 'Tati instrument Naga', 'Parai': 'Parai drum', 'Dhak': 'Dhak drum Durga Puja',
  'Chenda': 'Chenda melam', 'Kolam': 'Kolam rangoli', 'Kangri': 'Kangri Kashmir fire pot', 'Khuang': 'Khuang Mizo drum',
  'Log Drum': 'Naga log drum', 'Onam': 'Onam pookalam', 'Lohri': 'Lohri bonfire', 'Pola': 'Pola festival bullock',
  'Harela': 'Harela Uttarakhand', 'Jaapi': 'Japi hat Assam', 'Risa Weaving': 'Risa Tripura', 'Mahua Traditions': 'Mahua flowers',
  'Tanka and Kund Harvesting': 'Kund rainwater harvesting Rajasthan', 'Langar Tradition': 'Langar Golden Temple kitchen',
  'Kath-Kuni Architecture': 'Kath Kuni architecture', 'Naula Springs': 'Naula spring Uttarakhand', 'Kuhl Irrigation': 'Kuhl irrigation Kangra',
  'Morung Institution': 'Morung Naga', 'Ghotul Tradition': 'Ghotul Muria', 'Dhol-Damau': 'Dhol Damau', 'Been and Nagada': 'Been instrument snake charmer',
  'Owi Grindmill Songs': 'grinding stone Maharashtra women', 'Chaupal Tradition': 'Chaupal Haryana village',
  'Hariana Cattle and Murrah Buffalo': 'Murrah buffalo', 'Pheran': 'Pheran Kashmir', 'Wazwan': 'Wazwan Kashmir',
  'Gajan': 'Gajan festival', 'Bhadu': 'Bhadu festival Bengal', 'Sanjhi': 'Sanjhi art', 'Kaalo': 'Kalo Goa folk drama',
  'Jitiya': 'Jitiya festival', 'Tlawmngaihna': 'Mizo people', 'Kolkali': 'Kolkali dance', 'Oriah': 'Wancho people',
  'Jugni': 'Punjabi folk singer', 'Ngada': 'Rengma Naga', 'Sakewa': 'Sakela dance'
};

/* ---------------------------------------------------------
   3d. DISTRICT REGISTER — all districts of every state and UT
   (compiled from official lists; reorganisations continue over time)
   --------------------------------------------------------- */
const DISTRICTS = {
  AP: ['Alluri Sitharama Raju','Anakapalli','Anantapur','Annamayya','Bapatla','Chittoor','Dr. B.R. Ambedkar Konaseema','East Godavari','Eluru','Guntur','Kakinada','Krishna','Kurnool','Nandyal','NTR','Palnadu','Parvathipuram Manyam','Prakasam','Sri Potti Sriramulu Nellore','Sri Sathya Sai','Srikakulam','Tirupati','Visakhapatnam','Vizianagaram','West Godavari','YSR Kadapa'],
  AR: ['Anjaw','Bichom','Changlang','Dibang Valley','East Kameng','East Siang','Kamle','Keyi Panyor','Kra Daadi','Kurung Kumey','Leparada','Lohit','Longding','Lower Dibang Valley','Lower Siang','Lower Subansiri','Namsai','Pakke-Kessang','Papum Pare','Shi Yomi','Siang','Tawang','Tirap','Upper Siang','Upper Subansiri','West Kameng','West Siang'],
  AS: ['Bajali','Baksa','Barpeta','Biswanath','Bongaigaon','Cachar','Charaideo','Chirang','Darrang','Dhemaji','Dhubri','Dibrugarh','Dima Hasao','Goalpara','Golaghat','Hailakandi','Hojai','Jorhat','Kamrup','Kamrup Metropolitan','Karbi Anglong','Kokrajhar','Lakhimpur','Majuli','Morigaon','Nagaon','Nalbari','Sivasagar','Sonitpur','South Salmara-Mankachar','Sribhumi','Tamulpur','Tinsukia','Udalguri','West Karbi Anglong'],
  BR: ['Araria','Arwal','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran','Gaya','Gopalganj','Jamui','Jehanabad','Kaimur','Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura','Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur','Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan','Supaul','Vaishali','West Champaran'],
  CG: ['Balod','Baloda Bazar','Balrampur','Bastar','Bemetara','Bijapur','Bilaspur','Dantewada','Dhamtari','Durg','Gariaband','Gaurela-Pendra-Marwahi','Janjgir-Champa','Jashpur','Kabirdham','Kanker','Khairagarh-Chhuikhadan-Gandai','Kondagaon','Korba','Koriya','Mahasamund','Manendragarh-Chirmiri-Bharatpur','Mohla-Manpur-Ambagarh Chowki','Mungeli','Narayanpur','Raigarh','Raipur','Rajnandgaon','Sakti','Sarangarh-Bilaigarh','Sukma','Surajpur','Surguja'],
  GA: ['North Goa','South Goa'],
  GJ: ['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udepur','Dahod','Dang','Devbhoomi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad','Vav-Tharad'],
  HR: ['Ambala','Bhiwani','Charkhi Dadri','Faridabad','Fatehabad','Gurugram','Hisar','Jhajjar','Jind','Kaithal','Karnal','Kurukshetra','Mahendragarh','Nuh','Palwal','Panchkula','Panipat','Rewari','Rohtak','Sirsa','Sonipat','Yamunanagar'],
  HP: ['Bilaspur','Chamba','Hamirpur','Kangra','Kinnaur','Kullu','Lahaul & Spiti','Mandi','Shimla','Sirmaur','Solan','Una'],
  JH: ['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','East Singhbhum','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahibganj','Seraikela Kharsawan','Simdega','West Singhbhum'],
  KA: ['Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru South','Bengaluru Urban','Bidar','Chamarajanagar','Chikkaballapur','Chikkamagaluru','Chitradurga','Dakshina Kannada','Davanagere','Dharwad','Gadag','Hassan','Haveri','Kalaburagi','Kodagu','Kolar','Koppal','Mandya','Mysuru','Raichur','Shivamogga','Tumakuru','Udupi','Uttara Kannada','Vijayanagara','Vijayapura','Yadgir'],
  KL: ['Alappuzha','Ernakulam','Idukki','Kannur','Kasaragod','Kollam','Kottayam','Kozhikode','Malappuram','Palakkad','Pathanamthitta','Thiruvananthapuram','Thrissur','Wayanad'],
  MP: ['Agar Malwa','Alirajpur','Anuppur','Ashoknagar','Balaghat','Barwani','Betul','Bhind','Bhopal','Burhanpur','Chhatarpur','Chhindwara','Damoh','Datia','Dewas','Dhar','Dindori','Guna','Gwalior','Harda','Indore','Jabalpur','Jhabua','Katni','Khandwa','Khargone','Maihar','Mandla','Mandsaur','Mauganj','Morena','Narmadapuram','Narsinghpur','Neemuch','Niwari','Pandhurna','Panna','Raisen','Rajgarh','Ratlam','Rewa','Sagar','Satna','Sehore','Seoni','Shahdol','Shajapur','Sheopur','Shivpuri','Sidhi','Singrauli','Tikamgarh','Ujjain','Umaria','Vidisha'],
  MH: ['Ahilyanagar','Akola','Amravati','Beed','Bhandara','Buldhana','Chandrapur','Chhatrapati Sambhajinagar','Dharashiv','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar','Nashik','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'],
  MN: ['Bishnupur','Chandel','Churachandpur','Imphal East','Imphal West','Jiribam','Kakching','Kamjong','Kangpokpi','Noney','Pherzawl','Senapati','Tamenglong','Tengnoupal','Thoubal','Ukhrul'],
  ML: ['East Garo Hills','East Jaintia Hills','East Khasi Hills','Eastern West Khasi Hills','North Garo Hills','Ri-Bhoi','South Garo Hills','South West Garo Hills','South West Khasi Hills','West Garo Hills','West Jaintia Hills','West Khasi Hills'],
  MZ: ['Aizawl','Champhai','Hnahthial','Khawzawl','Kolasib','Lawngtlai','Lunglei','Mamit','Saiha','Saitual','Serchhip'],
  NL: ['Chumoukedima','Dimapur','Kiphire','Kohima','Longleng','Meluri','Mokokchung','Mon','Niuland','Noklak','Peren','Phek','Shamator','Tseminyu','Tuensang','Wokha','Zunheboto'],
  OD: ['Angul','Balangir','Balasore','Bargarh','Bhadrak','Boudh','Cuttack','Deogarh','Dhenkanal','Gajapati','Ganjam','Jagatsinghpur','Jajpur','Jharsuguda','Kalahandi','Kandhamal','Kendrapara','Kendujhar','Khordha','Koraput','Malkangiri','Mayurbhanj','Nabarangpur','Nayagarh','Nuapada','Puri','Rayagada','Sambalpur','Subarnapur','Sundargarh'],
  PB: ['Amritsar','Barnala','Bathinda','Faridkot','Fatehgarh Sahib','Fazilka','Ferozepur','Gurdaspur','Hoshiarpur','Jalandhar','Kapurthala','Ludhiana','Malerkotla','Mansa','Moga','Pathankot','Patiala','Rupnagar','Sahibzada Ajit Singh Nagar','Sangrur','Shaheed Bhagat Singh Nagar','Sri Muktsar Sahib','Tarn Taran'],
  RJ: ['Ajmer','Alwar','Balotra','Banswara','Baran','Barmer','Beawar','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh','Churu','Dausa','Deeg','Dholpur','Didwana-Kuchaman','Dungarpur','Hanumangarh','Jaipur','Jaisalmer','Jalore','Jhalawar','Jhunjhunu','Jodhpur','Karauli','Khairthal-Tijara','Kota','Kotputli-Behror','Nagaur','Pali','Phalodi','Pratapgarh','Rajsamand','Salumbar','Sawai Madhopur','Sikar','Sirohi','Sri Ganganagar','Tonk','Udaipur'],
  SK: ['Gangtok','Gyalshing','Mangan','Namchi','Pakyong','Soreng'],
  TN: ['Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'],
  TS: ['Adilabad','Bhadradri Kothagudem','Hanumakonda','Hyderabad','Jagtial','Jangaon','Jayashankar Bhupalpally','Jogulamba Gadwal','Kamareddy','Karimnagar','Khammam','Komaram Bheem Asifabad','Mahabubabad','Mahabubnagar','Mancherial','Medak','Medchal-Malkajgiri','Mulugu','Nagarkurnool','Nalgonda','Narayanpet','Nirmal','Nizamabad','Peddapalli','Rajanna Sircilla','Rangareddy','Sangareddy','Siddipet','Suryapet','Vikarabad','Wanaparthy','Warangal','Yadadri Bhuvanagiri'],
  TR: ['Dhalai','Gomati','Khowai','North Tripura','Sepahijala','South Tripura','Unakoti','West Tripura'],
  UP: ['Agra','Aligarh','Ambedkar Nagar','Amethi','Amroha','Auraiya','Ayodhya','Azamgarh','Baghpat','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bhadohi','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Farrukhabad','Fatehpur','Firozabad','Gautam Buddh Nagar','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur','Jhansi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kushinagar','Lakhimpur Kheri','Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Prayagraj','Raebareli','Rampur','Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar','Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'],
  UK: ['Almora','Bageshwar','Chamoli','Champawat','Dehradun','Haridwar','Nainital','Pauri Garhwal','Pithoragarh','Rudraprayag','Tehri Garhwal','Udham Singh Nagar','Uttarkashi'],
  WB: ['Alipurduar','Bankura','Birbhum','Cooch Behar','Dakshin Dinajpur','Darjeeling','Hooghly','Howrah','Jalpaiguri','Jhargram','Kalimpong','Kolkata','Malda','Murshidabad','Nadia','North 24 Parganas','Paschim Bardhaman','Paschim Medinipur','Purba Bardhaman','Purba Medinipur','Purulia','South 24 Parganas','Uttar Dinajpur'],
  AN: ['Nicobar','North and Middle Andaman','South Andaman'],
  CH: ['Chandigarh'],
  DN: ['Dadra and Nagar Haveli','Daman','Diu'],
  DL: ['Central Delhi','East Delhi','New Delhi','North Delhi','North East Delhi','North West Delhi','Shahdara','South Delhi','South East Delhi','South West Delhi','West Delhi'],
  JK: ['Anantnag','Bandipora','Baramulla','Budgam','Doda','Ganderbal','Jammu','Kathua','Kishtwar','Kulgam','Kupwara','Poonch','Pulwama','Rajouri','Ramban','Reasi','Samba','Shopian','Srinagar','Udhampur'],
  LA: ['Kargil','Leh'],
  LD: ['Lakshadweep'],
  PY: ['Karaikal','Mahe','Puducherry','Yanam']
};
const DISTRICT_TOTAL = Object.values(DISTRICTS).reduce((s, l) => s + l.length, 0);

/* ---------------------------------------------------------
   4. CHRONOLOGY — from prehistory to 2026
   [when, era, text]
   --------------------------------------------------------- */
const TIMELINE = [
  ['c. 10,000 BCE', 'Prehistory', 'Rock shelters of Bhimbetka (Madhya Pradesh) depict group dances, drummers and hunts — among the earliest images of Indian performance. World Heritage since 2003.'],
  ['c. 2500 BCE', 'Harappan', 'The bronze "Dancing Girl" of Mohenjo-daro and seals with musical motifs show a flourishing culture of art and craft.'],
  ['c. 1500–500 BCE', 'Vedic', 'Vedic hymns are composed and preserved through precise oral transmission; Vedic chanting was inscribed by UNESCO in 2008.'],
  ['c. 300 BCE–300 CE', 'Sangam', 'Tamil Sangam poetry describes kuravai circle dances, parai drums, harvest festivals and village life.'],
  ['c. 200 BCE–200 CE', 'Classical', 'Bharata\'s Natyashastra distinguishes the refined (margi) and the regional (desi), recognising folk practice as a source of art.'],
  ['2nd c. BCE–6th c. CE', 'Classical', 'Ajanta murals portray musicians, dancers and festivities with extraordinary detail.'],
  ['c. 5th–6th c. CE', 'Classical', 'The Tamil epic Silappatikaram records the kuravai koothu dance and songs of cowherd communities.'],
  ['c. 9th c. CE', 'Early Medieval', 'Matanga\'s Brihaddeshi becomes one of the first treatises devoted to regional (desi) music.'],
  ['12th c.', 'Early Medieval', 'Jayadeva\'s Gita Govinda inspires folk and temple arts across eastern India; Jagnik\'s Alha Khand gives Bundelkhand its heroic ballad.'],
  ['13th–14th c.', 'Medieval', 'Sant Dnyaneshwar inspires the Varkari tradition; Amir Khusrau shapes Qawwali; Vidyapati writes Maithili songs still sung today.'],
  ['15th–16th c.', 'Medieval', 'The Bhakti era: Kabir, Guru Nanak Dev, Mirabai and Srimanta Sankaradeva create songs, theatre and communities of devotion. Guru Jambheshwar founds the Bishnoi path (1485).'],
  ['16th–17th c.', 'Medieval', 'Tulsidas\'s Ramcharitmanas nurtures the Ramlila; Sant Tukaram\'s abhangs and Sant Eknath\'s bharuds enrich Marathi folk culture.'],
  ['1699', 'Medieval', 'The Khalsa is founded on Baisakhi at Anandpur Sahib; Hola Mohalla follows in 1701.'],
  ['1766', 'Colonial Era', 'Waris Shah completes Heer, the most beloved of Punjabi kissas.'],
  ['1812', 'Colonial Era', 'Phool Walon ki Sair begins in Mehrauli, Delhi, as a festival of harmony.'],
  ['1892–1894', 'Colonial Era', 'Konkani Tiatr is first staged (1892), public Ganeshotsav is popularised by Lokmanya Tilak (1893), and Poush Mela begins at Santiniketan (1894).'],
  ['1894–1928', 'Colonial Era', 'George Grierson\'s Linguistic Survey of India documents the languages and dialects of the subcontinent.'],
  ['1911', 'Colonial Era', 'Lakshminath Bezbaroa publishes Burhi Aair Xadhu, a treasury of Assamese folktales.'],
  ['1925', 'Colonial Era', 'Pandit Raghunath Murmu creates the Ol Chiki script for Santhali.'],
  ['1930s', 'Colonial Era', 'Gurusaday Dutt revives Bengal\'s folk dances such as Raibenshe; Verrier Elwin begins ethnographic work in central India.'],
  ['1952', 'Modern India', 'Sangeet Natak Akademi is established; the All India Handicrafts Board is set up with Kamaladevi Chattopadhyay at its helm.'],
  ['1954', 'Modern India', 'Lalit Kala Akademi and Sahitya Akademi are founded, and the Padma awards begin honouring artists.'],
  ['1964', 'Modern India', 'The Crafts Council of India is founded to support craftspeople.'],
  ['1973', 'Modern India', 'Village women of Chamoli launch the Chipko movement, drawing on traditional forest ethics.'],
  ['1985–1987', 'Modern India', 'Seven Zonal Cultural Centres are created, the People of India project begins, and IGNCA is established (1987). Surajkund Crafts Mela starts (1987).'],
  ['1999–2004', 'Modern India', 'The Geographical Indications of Goods Act is passed (1999, in force 2003); Darjeeling Tea becomes India\'s first GI (2004).'],
  ['2001', 'Modern India', 'The Traditional Knowledge Digital Library is launched to protect India\'s traditional knowledge.'],
  ['2003–2005', 'Modern India', 'UNESCO adopts the Convention for the Safeguarding of the Intangible Cultural Heritage (2003); India ratifies it in 2005.'],
  ['2008–2010', 'Modern India', 'Koodiyattam, Vedic chanting and Ramlila (2008), Ramman (2009), and Mudiyettu, Kalbelia and Chhau (2010) join the UNESCO Representative List.'],
  ['2012–2017', 'Modern India', 'Buddhist chanting of Ladakh (2012), Sankirtana (2013), Thathera craft (2014), Yoga and Nawrouz (2016) and Kumbh Mela (2017) are inscribed.'],
  ['2017', 'Modern India', 'The National Mission on Cultural Mapping is launched to map India\'s cultural wealth village by village.'],
  ['2021', 'Modern India', 'Durga Puja in Kolkata is inscribed by UNESCO; Pochampally is named a Best Tourism Village.'],
  ['2023', 'Modern India', 'Garba of Gujarat is inscribed by UNESCO; the Mera Gaon Meri Dharohar portal begins documenting village heritage nationwide.'],
  ['2024', 'Modern India', 'India hosts the World Heritage Committee in New Delhi; the Moidams of Charaideo, the Ahom mound-burials of Assam, are inscribed as World Heritage.'],
  ['2025', 'Modern India', 'Deepavali is inscribed on the UNESCO Representative List during the Intergovernmental Committee session hosted in New Delhi.'],
  ['2026', 'Modern India', 'Lokdhara brings India\'s folk traditions together in one open digital database for students, researchers and society.']
];
const ERA_COLORS = { 'Prehistory': '#9791bd', 'Harappan': '#c9a36b', 'Vedic': '#f2b705', 'Sangam': '#ff7a59', 'Classical': '#e8487a', 'Early Medieval': '#ff7a59', 'Medieval': '#e8487a', 'Colonial Era': '#8d86ff', 'Modern India': '#00d8c8' };

/* ---------------------------------------------------------
   5. UNESCO REPRESENTATIVE LIST — elements from India
   [year, element, where]
   --------------------------------------------------------- */
const UNESCO = [
  [2008, 'Koodiyattam, Sanskrit theatre', 'Kerala'],
  [2008, 'Tradition of Vedic chanting', 'Pan-India'],
  [2008, 'Ramlila, the traditional performance of the Ramayana', 'North India'],
  [2009, 'Ramman, religious festival and ritual theatre', 'Uttarakhand'],
  [2010, 'Mudiyettu, ritual theatre and dance drama', 'Kerala'],
  [2010, 'Kalbelia folk songs and dances', 'Rajasthan'],
  [2010, 'Chhau dance', 'Jharkhand, Odisha, West Bengal'],
  [2012, 'Buddhist chanting of Ladakh', 'Ladakh'],
  [2013, 'Sankirtana, ritual singing, drumming and dancing', 'Manipur'],
  [2014, 'Traditional brass and copper craft of the Thatheras of Jandiala Guru', 'Punjab'],
  [2016, 'Yoga', 'Pan-India'],
  [2016, 'Nawrouz (multinational)', 'Pan-India'],
  [2017, 'Kumbh Mela', 'Uttar Pradesh, Uttarakhand, Madhya Pradesh, Maharashtra'],
  [2021, 'Durga Puja in Kolkata', 'West Bengal'],
  [2023, 'Garba of Gujarat', 'Gujarat'],
  [2025, 'Deepavali', 'Pan-India']
];

/* ---------------------------------------------------------
   6. TRADITION BEARERS HONOURED BY THE NATION
   [name, tradition, state, honour]
   --------------------------------------------------------- */
const MASTERS = [
  ['Teejan Bai', 'Pandavani', 'CG', 'Padma Shri 1988, Padma Bhushan 2003, Padma Vibhushan 2019'],
  ['Sita Devi', 'Madhubani painting', 'BR', 'Padma Shri 1981'],
  ['Ganga Devi', 'Madhubani painting', 'BR', 'Padma Shri 1984'],
  ['Kamaladevi Chattopadhyay', 'Craft revival pioneer', 'KA', 'Padma Bhushan 1955, Padma Vibhushan 1987'],
  ['Prahlad Singh Tipaniya', 'Kabir nirgun bhajans', 'MP', 'Padma Shri 2011'],
  ['Gulabo Sapera', 'Kalbelia dance', 'RJ', 'Padma Shri 2016'],
  ['Anwar Khan Manganiyar', 'Manganiyar folk music', 'RJ', 'Padma Shri 2020'],
  ['Rahibai Soma Popere', 'Indigenous seed conservation', 'MH', 'Padma Shri 2020'],
  ['Bhuri Bai', 'Bhil painting', 'MP', 'Padma Shri 2021'],
  ['Dulari Devi', 'Madhubani painting', 'BR', 'Padma Shri 2021'],
  ['Tulsi Gowda', 'Forest and seed knowledge', 'KA', 'Padma Shri 2021'],
  ['Durga Bai Vyam', 'Gond painting', 'MP', 'Padma Shri 2022'],
  ['Darshanam Mogilaiah', 'Kinnera', 'TS', 'Padma Shri 2022'],
  ['Sakini Ramachandraiah', 'Koya oral tradition', 'TS', 'Padma Shri 2022'],
  ['Jodhaiya Bai Baiga', 'Baiga painting', 'MP', 'Padma Shri 2023'],
  ['Hirabai Lobi', 'Siddi community upliftment', 'GJ', 'Padma Shri 2023']
];

/* ---------------------------------------------------------
   7. NATIONAL REFERENCE FIGURES
   --------------------------------------------------------- */
const FACTS = [
  ['28 + 8', 'States and union territories, each with its own living traditions', 'Government of India, 2026'],
  ['6,40,867', 'Villages — every one a potential chapter of Lokdhara', 'Census of India 2011'],
  ['22', 'Languages in the Eighth Schedule of the Constitution', 'Constitution of India'],
  ['19,500+', 'Mother tongues returned, rationalised to 1,369', 'Census of India 2011'],
  ['4,635', 'Communities documented by the People of India project', 'Anthropological Survey of India'],
  ['16', 'Indian elements on the UNESCO Representative List', 'UNESCO, 2025'],
  ['600+', 'Registered Geographical Indications', 'GI Registry, India'],
  ['7', 'Zonal Cultural Centres promoting regional arts since 1985–86', 'Ministry of Culture']
];

/* ---------------------------------------------------------
   8. MULTILINGUAL INTERFACE
   --------------------------------------------------------- */
const I18N = {
  en: {
    brand: 'Lokdhara', brand_sub: 'Folk Heritage of India',
    nav_home: 'Home', nav_about: 'About', nav_db: 'Cultural Database', nav_map: 'India Map', nav_stats: 'Statistics', nav_survey: 'Field Survey', nav_archive: 'Digital Archive', nav_compare: 'Compare', nav_research: 'Research & Reports', nav_sources: 'Sources', nav_contact: 'Contact / Contribute', nav_more: 'More',
    bn_db: 'Database', bn_map: 'Map', bn_stats: 'Stats',
    hero_kicker: 'A digital database of India\'s living folk heritage, 2026',
    hero_title: 'The living stream of India\'s folk heritage',
    hero_sub: 'Dances, songs, instruments, festivals, crafts, stories and wisdom from every state and union territory — documented with care, shared with pride, and passed on with joy.',
    cta_explore: 'Explore the database', cta_map: 'Open India map',
    k_trad: 'Traditions documented', k_states: 'States & UTs', k_dist: 'Districts mapped', k_unesco: 'UNESCO elements', k_gi: 'GI-recognised entries',
    cat_D: 'Folk Dances', cat_M: 'Folk Music', cat_I: 'Folk Instruments', cat_F: 'Folk Festivals', cat_A: 'Folk Arts & Crafts', cat_O: 'Oral Traditions', cat_K: 'Traditional Knowledge',
    st_T: 'Flourishing', st_S: 'Steady & Living', st_R: 'Revived & Rising', st_N: 'Nurture Priority', st_V: 'Revival Priority',
    pe_AN: 'Ancient', pe_EM: 'Early Medieval', pe_MD: 'Medieval', pe_CL: 'Colonial Era', pe_MO: 'Modern India',
    search_ph: 'Search traditions, states, districts…',
    all: 'All', saved: 'Saved', listen: 'Listen', stop: 'Stop', save: 'Save', unsave: 'Saved', share: 'Share', close: 'Close', related: 'Related traditions', load_more: 'Load more',
    tod: 'Tradition of the day', cats_title: 'Seven streams of heritage',
    about_title: 'About the project', about_lead: 'Lokdhara is a digital database that documents, preserves and promotes India\'s ancient folk traditions — bringing dances, music, instruments, festivals, crafts, oral traditions and traditional knowledge together on one open, structured platform.',
    vision_t: 'Vision', mission_t: 'Mission', objectives_t: 'Objectives',
    db_title: 'Cultural database', map_title: 'India cultural map', map_hint: 'Select a state, then a district, to discover its traditions.',
    stats_title: 'Statistics & insights', survey_title: 'Field survey', archive_title: 'Digital archive', compare_title: 'Compare', research_title: 'Research & reports', sources_title: 'Sources & references', contact_title: 'Contact & contribute',
    motto: 'Preserve our culture. Celebrate our roots. Carry it forward.',
    results: 'traditions', state: 'State', district: 'District', period: 'Period', status: 'Status', category: 'Category', translate_all: 'Translate full page', on_map: 'View on map'
  },
  hi: {
    brand: 'लोकधारा', brand_sub: 'लोक विरासत की धारा',
    nav_home: 'होम', nav_about: 'परिचय', nav_db: 'सांस्कृतिक डेटाबेस', nav_map: 'भारत मानचित्र', nav_stats: 'आँकड़े', nav_survey: 'क्षेत्र सर्वेक्षण', nav_archive: 'डिजिटल अभिलेखागार', nav_compare: 'तुलना', nav_research: 'शोध एवं रिपोर्ट', nav_sources: 'स्रोत', nav_contact: 'संपर्क / योगदान', nav_more: 'और',
    bn_db: 'डेटाबेस', bn_map: 'मानचित्र', bn_stats: 'आँकड़े',
    hero_kicker: 'भारत की जीवंत लोक विरासत का डिजिटल डेटाबेस, 2026',
    hero_title: 'भारत की लोक विरासत की जीवंत धारा',
    hero_sub: 'हर राज्य और केंद्र शासित प्रदेश के नृत्य, गीत, वाद्य, उत्सव, शिल्प, कथाएँ और ज्ञान — स्नेह से संजोए, गर्व से साझा किए और आनंद से आगे बढ़ाए गए।',
    cta_explore: 'डेटाबेस देखें', cta_map: 'भारत मानचित्र खोलें',
    k_trad: 'प्रलेखित परंपराएँ', k_states: 'राज्य एवं केंद्र शासित प्रदेश', k_dist: 'मानचित्रित ज़िले', k_unesco: 'यूनेस्को धरोहर तत्व', k_gi: 'जीआई मान्यता प्राप्त प्रविष्टियाँ',
    cat_D: 'लोक नृत्य', cat_M: 'लोक संगीत', cat_I: 'लोक वाद्य', cat_F: 'लोक उत्सव', cat_A: 'लोक कला एवं शिल्प', cat_O: 'मौखिक परंपराएँ', cat_K: 'पारंपरिक ज्ञान',
    st_T: 'फलती-फूलती', st_S: 'स्थिर एवं जीवंत', st_R: 'पुनर्जीवित एवं उभरती', st_N: 'संवर्धन प्राथमिकता', st_V: 'पुनरुद्धार प्राथमिकता',
    pe_AN: 'प्राचीन', pe_EM: 'प्रारंभिक मध्यकाल', pe_MD: 'मध्यकाल', pe_CL: 'औपनिवेशिक काल', pe_MO: 'आधुनिक भारत',
    search_ph: 'परंपराएँ, राज्य, ज़िले खोजें…',
    all: 'सभी', saved: 'सहेजे गए', listen: 'सुनें', stop: 'रोकें', save: 'सहेजें', unsave: 'सहेजा गया', share: 'साझा करें', close: 'बंद करें', related: 'संबंधित परंपराएँ', load_more: 'और देखें',
    tod: 'आज की परंपरा', cats_title: 'विरासत की सात धाराएँ',
    about_title: 'परियोजना के बारे में', about_lead: 'लोकधारा एक डिजिटल डेटाबेस है जो भारत की प्राचीन लोक परंपराओं का प्रलेखन, संरक्षण और प्रचार करता है — नृत्य, संगीत, वाद्य, उत्सव, शिल्प, मौखिक परंपराएँ और पारंपरिक ज्ञान एक खुले, सुव्यवस्थित मंच पर।',
    vision_t: 'दृष्टि', mission_t: 'लक्ष्य', objectives_t: 'उद्देश्य',
    db_title: 'सांस्कृतिक डेटाबेस', map_title: 'भारत सांस्कृतिक मानचित्र', map_hint: 'राज्य चुनें, फिर ज़िला चुनें और उसकी परंपराएँ जानें।',
    stats_title: 'आँकड़े एवं अंतर्दृष्टि', survey_title: 'क्षेत्र सर्वेक्षण', archive_title: 'डिजिटल अभिलेखागार', compare_title: 'तुलना करें', research_title: 'शोध एवं रिपोर्ट', sources_title: 'स्रोत एवं संदर्भ', contact_title: 'संपर्क एवं योगदान',
    motto: 'अपनी संस्कृति सहेजें। अपनी जड़ों का उत्सव मनाएँ। इसे आगे बढ़ाएँ।',
    results: 'परंपराएँ', state: 'राज्य', district: 'ज़िला', period: 'काल', status: 'स्थिति', category: 'श्रेणी', translate_all: 'पूरा पृष्ठ अनुवाद करें', on_map: 'मानचित्र पर देखें'
  },
  mr: {
    brand: 'लोकधारा', brand_sub: 'लोकवारशाची धारा',
    nav_home: 'मुख्यपृष्ठ', nav_about: 'प्रकल्पाविषयी', nav_db: 'सांस्कृतिक डेटाबेस', nav_map: 'भारत नकाशा', nav_stats: 'आकडेवारी', nav_survey: 'क्षेत्र सर्वेक्षण', nav_archive: 'डिजिटल संग्रह', nav_compare: 'तुलना', nav_research: 'संशोधन व अहवाल', nav_sources: 'स्रोत', nav_contact: 'संपर्क / योगदान', nav_more: 'अधिक',
    bn_db: 'डेटाबेस', bn_map: 'नकाशा', bn_stats: 'आकडेवारी',
    hero_kicker: 'भारताच्या जिवंत लोकवारशाचा डिजिटल डेटाबेस, 2026',
    hero_title: 'भारताच्या लोकवारशाची जिवंत धारा',
    hero_sub: 'प्रत्येक राज्य व केंद्रशासित प्रदेशातील नृत्य, गीते, वाद्ये, उत्सव, हस्तकला, कथा आणि ज्ञान — जिव्हाळ्याने जपलेले, अभिमानाने सामायिक केलेले आणि आनंदाने पुढे नेलेले.',
    cta_explore: 'डेटाबेस पाहा', cta_map: 'भारत नकाशा उघडा',
    k_trad: 'नोंदवलेल्या परंपरा', k_states: 'राज्ये व केंद्रशासित प्रदेश', k_dist: 'नकाशावरील जिल्हे', k_unesco: 'युनेस्को वारसा घटक', k_gi: 'जीआय मान्यताप्राप्त नोंदी',
    cat_D: 'लोकनृत्य', cat_M: 'लोकसंगीत', cat_I: 'लोकवाद्ये', cat_F: 'लोकउत्सव', cat_A: 'लोककला व हस्तकला', cat_O: 'मौखिक परंपरा', cat_K: 'पारंपरिक ज्ञान',
    st_T: 'बहरलेली', st_S: 'स्थिर व जिवंत', st_R: 'पुनरुज्जीवित व उदयोन्मुख', st_N: 'संवर्धन प्राधान्य', st_V: 'पुनरुज्जीवन प्राधान्य',
    pe_AN: 'प्राचीन', pe_EM: 'पूर्व-मध्ययुगीन', pe_MD: 'मध्ययुगीन', pe_CL: 'वसाहतकालीन', pe_MO: 'आधुनिक भारत',
    search_ph: 'परंपरा, राज्ये, जिल्हे शोधा…',
    all: 'सर्व', saved: 'जतन केलेले', listen: 'ऐका', stop: 'थांबवा', save: 'जतन करा', unsave: 'जतन केले', share: 'शेअर करा', close: 'बंद करा', related: 'संबंधित परंपरा', load_more: 'आणखी पाहा',
    tod: 'आजची परंपरा', cats_title: 'वारशाच्या सात धारा',
    about_title: 'प्रकल्पाविषयी', about_lead: 'लोकधारा हा भारताच्या प्राचीन लोकपरंपरांचे दस्तऐवजीकरण, जतन आणि प्रसार करणारा डिजिटल डेटाबेस आहे — नृत्य, संगीत, वाद्ये, उत्सव, हस्तकला, मौखिक परंपरा आणि पारंपरिक ज्ञान एकाच खुल्या, सुव्यवस्थित व्यासपीठावर.',
    vision_t: 'दृष्टी', mission_t: 'ध्येय', objectives_t: 'उद्दिष्टे',
    db_title: 'सांस्कृतिक डेटाबेस', map_title: 'भारत सांस्कृतिक नकाशा', map_hint: 'राज्य निवडा, नंतर जिल्हा निवडा आणि तेथील परंपरा जाणून घ्या.',
    stats_title: 'आकडेवारी व निरीक्षणे', survey_title: 'क्षेत्र सर्वेक्षण', archive_title: 'डिजिटल संग्रह', compare_title: 'तुलना करा', research_title: 'संशोधन व अहवाल', sources_title: 'स्रोत व संदर्भ', contact_title: 'संपर्क व योगदान',
    motto: 'आपली संस्कृती जपूया. आपल्या मुळांचा उत्सव करूया. ती पुढे नेऊया.',
    results: 'परंपरा', state: 'राज्य', district: 'जिल्हा', period: 'कालखंड', status: 'स्थिती', category: 'वर्ग', translate_all: 'संपूर्ण पान अनुवादित करा', on_map: 'नकाशावर पाहा'
  },
  bn: {
    brand: 'লোকধারা', brand_sub: 'লোক ঐতিহ্যের ধারা',
    nav_home: 'হোম', nav_about: 'প্রকল্প পরিচিতি', nav_db: 'সাংস্কৃতিক ডেটাবেস', nav_map: 'ভারতের মানচিত্র', nav_stats: 'পরিসংখ্যান', nav_survey: 'মাঠ সমীক্ষা', nav_archive: 'ডিজিটাল আর্কাইভ', nav_compare: 'তুলনা', nav_research: 'গবেষণা ও প্রতিবেদন', nav_sources: 'সূত্র', nav_contact: 'যোগাযোগ / অবদান', nav_more: 'আরও',
    bn_db: 'ডেটাবেস', bn_map: 'মানচিত্র', bn_stats: 'পরিসংখ্যান',
    hero_kicker: 'ভারতের জীবন্ত লোক ঐতিহ্যের ডিজিটাল ডেটাবেস, ২০২৬',
    hero_title: 'ভারতের লোক ঐতিহ্যের জীবন্ত ধারা',
    hero_sub: 'প্রতিটি রাজ্য ও কেন্দ্রশাসিত অঞ্চলের নৃত্য, গান, বাদ্যযন্ত্র, উৎসব, কারুশিল্প, কাহিনি ও জ্ঞান — যত্নে নথিভুক্ত, গর্বে ভাগ করা এবং আনন্দে এগিয়ে নেওয়া।',
    cta_explore: 'ডেটাবেস দেখুন', cta_map: 'মানচিত্র খুলুন',
    k_trad: 'নথিভুক্ত ঐতিহ্য', k_states: 'রাজ্য ও কেন্দ্রশাসিত অঞ্চল', k_dist: 'মানচিত্রিত জেলা', k_unesco: 'ইউনেস্কো ঐতিহ্য উপাদান', k_gi: 'জিআই স্বীকৃত এন্ট্রি',
    cat_D: 'লোকনৃত্য', cat_M: 'লোকসংগীত', cat_I: 'লোকবাদ্য', cat_F: 'লোক উৎসব', cat_A: 'লোকশিল্প ও কারুশিল্প', cat_O: 'মৌখিক ঐতিহ্য', cat_K: 'প্রথাগত জ্ঞান',
    st_T: 'সমৃদ্ধ', st_S: 'স্থিতিশীল ও জীবন্ত', st_R: 'পুনরুজ্জীবিত ও উদীয়মান', st_N: 'লালন অগ্রাধিকার', st_V: 'পুনরুজ্জীবন অগ্রাধিকার',
    pe_AN: 'প্রাচীন', pe_EM: 'আদি মধ্যযুগ', pe_MD: 'মধ্যযুগ', pe_CL: 'ঔপনিবেশিক যুগ', pe_MO: 'আধুনিক ভারত',
    search_ph: 'ঐতিহ্য, রাজ্য, জেলা খুঁজুন…',
    all: 'সব', saved: 'সংরক্ষিত', listen: 'শুনুন', stop: 'থামান', save: 'সংরক্ষণ', unsave: 'সংরক্ষিত', share: 'শেয়ার', close: 'বন্ধ', related: 'সম্পর্কিত ঐতিহ্য', load_more: 'আরও দেখুন',
    tod: 'আজকের ঐতিহ্য', cats_title: 'ঐতিহ্যের সাত ধারা',
    about_title: 'প্রকল্প পরিচিতি', about_lead: 'লোকধারা একটি ডিজিটাল ডেটাবেস, যা ভারতের প্রাচীন লোক ঐতিহ্যকে নথিভুক্ত, সংরক্ষণ ও প্রচার করে — নৃত্য, সংগীত, বাদ্যযন্ত্র, উৎসব, কারুশিল্প, মৌখিক ঐতিহ্য ও প্রথাগত জ্ঞান একটি উন্মুক্ত, সুবিন্যস্ত মঞ্চে।',
    vision_t: 'দৃষ্টিভঙ্গি', mission_t: 'লক্ষ্য', objectives_t: 'উদ্দেশ্য',
    db_title: 'সাংস্কৃতিক ডেটাবেস', map_title: 'ভারতের সাংস্কৃতিক মানচিত্র', map_hint: 'একটি রাজ্য, তারপর একটি জেলা বেছে নিয়ে তার ঐতিহ্য আবিষ্কার করুন।',
    stats_title: 'পরিসংখ্যান ও অন্তর্দৃষ্টি', survey_title: 'মাঠ সমীক্ষা', archive_title: 'ডিজিটাল আর্কাইভ', compare_title: 'তুলনা', research_title: 'গবেষণা ও প্রতিবেদন', sources_title: 'সূত্র ও তথ্যসূত্র', contact_title: 'যোগাযোগ ও অবদান',
    motto: 'আমাদের সংস্কৃতি রক্ষা করি। শিকড়কে উদযাপন করি। এগিয়ে নিয়ে যাই।',
    results: 'ঐতিহ্য', state: 'রাজ্য', district: 'জেলা', period: 'যুগ', status: 'অবস্থা', category: 'বিভাগ', translate_all: 'সম্পূর্ণ পাতা অনুবাদ', on_map: 'মানচিত্রে দেখুন'
  },
  ta: {
    brand: 'லோக்தாரா', brand_sub: 'நாட்டுப்புற மரபின் நீரோட்டம்',
    nav_home: 'முகப்பு', nav_about: 'திட்டம் பற்றி', nav_db: 'பண்பாட்டுத் தரவுத்தளம்', nav_map: 'இந்திய வரைபடம்', nav_stats: 'புள்ளிவிவரங்கள்', nav_survey: 'களஆய்வு', nav_archive: 'எண்ணிம ஆவணக்காப்பகம்', nav_compare: 'ஒப்பீடு', nav_research: 'ஆய்வுகள் & அறிக்கைகள்', nav_sources: 'ஆதாரங்கள்', nav_contact: 'தொடர்பு / பங்களிப்பு', nav_more: 'மேலும்',
    bn_db: 'தரவுத்தளம்', bn_map: 'வரைபடம்', bn_stats: 'புள்ளிவிவரம்',
    hero_kicker: 'இந்தியாவின் உயிர்ப்புள்ள நாட்டுப்புற மரபின் எண்ணிமத் தரவுத்தளம், 2026',
    hero_title: 'இந்திய நாட்டுப்புற மரபின் உயிர்ப்புள்ள நீரோட்டம்',
    hero_sub: 'ஒவ்வொரு மாநிலம் மற்றும் யூனியன் பிரதேசத்தின் நடனங்கள், பாடல்கள், இசைக்கருவிகள், திருவிழாக்கள், கைவினைகள், கதைகள் மற்றும் அறிவு — அன்புடன் பதிவுசெய்து, பெருமையுடன் பகிர்ந்து, மகிழ்ச்சியுடன் அடுத்த தலைமுறைக்கு.',
    cta_explore: 'தரவுத்தளத்தை ஆராயுங்கள்', cta_map: 'வரைபடத்தைத் திறக்கவும்',
    k_trad: 'பதிவான மரபுகள்', k_states: 'மாநிலங்கள் & யூனியன் பிரதேசங்கள்', k_dist: 'வரைபடமாக்கப்பட்ட மாவட்டங்கள்', k_unesco: 'யுனெஸ்கோ மரபுக் கூறுகள்', k_gi: 'புவிசார் குறியீடு பெற்றவை',
    cat_D: 'நாட்டுப்புற நடனங்கள்', cat_M: 'நாட்டுப்புற இசை', cat_I: 'நாட்டுப்புற இசைக்கருவிகள்', cat_F: 'நாட்டுப்புற திருவிழாக்கள்', cat_A: 'நாட்டுப்புறக் கலை & கைவினை', cat_O: 'வாய்மொழி மரபுகள்', cat_K: 'பாரம்பரிய அறிவு',
    st_T: 'செழித்தோங்குவது', st_S: 'நிலையானது & உயிர்ப்புள்ளது', st_R: 'புத்துயிர் பெற்று எழுவது', st_N: 'பேணுதல் முன்னுரிமை', st_V: 'புத்துயிர் முன்னுரிமை',
    pe_AN: 'பண்டைய காலம்', pe_EM: 'முற்கால இடைக்காலம்', pe_MD: 'இடைக்காலம்', pe_CL: 'காலனித்துவ காலம்', pe_MO: 'நவீன இந்தியா',
    search_ph: 'மரபுகள், மாநிலங்கள், மாவட்டங்களைத் தேடுங்கள்…',
    all: 'அனைத்தும்', saved: 'சேமித்தவை', listen: 'கேளுங்கள்', stop: 'நிறுத்து', save: 'சேமி', unsave: 'சேமிக்கப்பட்டது', share: 'பகிர்', close: 'மூடு', related: 'தொடர்புடைய மரபுகள்', load_more: 'மேலும் காண்க',
    tod: 'இன்றைய மரபு', cats_title: 'மரபின் ஏழு நீரோட்டங்கள்',
    about_title: 'திட்டம் பற்றி', about_lead: 'லோக்தாரா என்பது இந்தியாவின் பழமையான நாட்டுப்புற மரபுகளை ஆவணப்படுத்தி, பாதுகாத்து, மேம்படுத்தும் எண்ணிமத் தரவுத்தளம் — நடனம், இசை, இசைக்கருவிகள், திருவிழாக்கள், கைவினைகள், வாய்மொழி மரபுகள், பாரம்பரிய அறிவு அனைத்தும் ஒரே திறந்த, ஒழுங்கமைந்த தளத்தில்.',
    vision_t: 'தொலைநோக்கு', mission_t: 'பணி இலக்கு', objectives_t: 'நோக்கங்கள்',
    db_title: 'பண்பாட்டுத் தரவுத்தளம்', map_title: 'இந்தியப் பண்பாட்டு வரைபடம்', map_hint: 'ஒரு மாநிலத்தையும் பின்னர் மாவட்டத்தையும் தேர்ந்தெடுத்து அதன் மரபுகளைக் கண்டறியுங்கள்.',
    stats_title: 'புள்ளிவிவரங்கள் & நுண்ணறிவு', survey_title: 'களஆய்வு', archive_title: 'எண்ணிம ஆவணக்காப்பகம்', compare_title: 'ஒப்பிடுக', research_title: 'ஆய்வுகள் & அறிக்கைகள்', sources_title: 'ஆதாரங்கள் & குறிப்புகள்', contact_title: 'தொடர்பு & பங்களிப்பு',
    motto: 'நம் பண்பாட்டைக் காப்போம். நம் வேர்களைக் கொண்டாடுவோம். அதை முன்னெடுப்போம்.',
    results: 'மரபுகள்', state: 'மாநிலம்', district: 'மாவட்டம்', period: 'காலம்', status: 'நிலை', category: 'வகை', translate_all: 'முழுப் பக்கத்தையும் மொழிபெயர்', on_map: 'வரைபடத்தில் காண்க'
  },
  te: {
    brand: 'లోక్‌ధార', brand_sub: 'జానపద వారసత్వ ధార',
    nav_home: 'హోమ్', nav_about: 'ప్రాజెక్ట్ గురించి', nav_db: 'సాంస్కృతిక డేటాబేస్', nav_map: 'భారత పటం', nav_stats: 'గణాంకాలు', nav_survey: 'క్షేత్ర సర్వే', nav_archive: 'డిజిటల్ ఆర్కైవ్', nav_compare: 'పోలిక', nav_research: 'పరిశోధన & నివేదికలు', nav_sources: 'మూలాలు', nav_contact: 'సంప్రదింపు / సహకారం', nav_more: 'మరిన్ని',
    bn_db: 'డేటాబేస్', bn_map: 'పటం', bn_stats: 'గణాంకాలు',
    hero_kicker: 'భారతదేశపు సజీవ జానపద వారసత్వ డిజిటల్ డేటాబేస్, 2026',
    hero_title: 'భారత జానపద వారసత్వపు సజీవ ధార',
    hero_sub: 'ప్రతి రాష్ట్రం, కేంద్రపాలిత ప్రాంతంలోని నృత్యాలు, పాటలు, వాయిద్యాలు, పండుగలు, హస్తకళలు, కథలు మరియు జ్ఞానం — శ్రద్ధగా నమోదు చేసి, గర్వంగా పంచుకుని, ఆనందంగా ముందుకు తీసుకెళ్తున్నాం.',
    cta_explore: 'డేటాబేస్ అన్వేషించండి', cta_map: 'భారత పటం తెరవండి',
    k_trad: 'నమోదైన సంప్రదాయాలు', k_states: 'రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాలు', k_dist: 'పటంలోని జిల్లాలు', k_unesco: 'యునెస్కో వారసత్వ అంశాలు', k_gi: 'జీఐ గుర్తింపు పొందినవి',
    cat_D: 'జానపద నృత్యాలు', cat_M: 'జానపద సంగీతం', cat_I: 'జానపద వాయిద్యాలు', cat_F: 'జానపద పండుగలు', cat_A: 'జానపద కళలు & హస్తకళలు', cat_O: 'మౌఖిక సంప్రదాయాలు', cat_K: 'సాంప్రదాయ జ్ఞానం',
    st_T: 'వర్ధిల్లుతున్నది', st_S: 'స్థిరమైనది & సజీవమైనది', st_R: 'పునరుజ్జీవితమై ఎదుగుతున్నది', st_N: 'పోషణ ప్రాధాన్యం', st_V: 'పునరుజ్జీవన ప్రాధాన్యం',
    pe_AN: 'ప్రాచీన కాలం', pe_EM: 'తొలి మధ్యయుగం', pe_MD: 'మధ్యయుగం', pe_CL: 'వలస పాలన కాలం', pe_MO: 'ఆధునిక భారతం',
    search_ph: 'సంప్రదాయాలు, రాష్ట్రాలు, జిల్లాలు వెతకండి…',
    all: 'అన్నీ', saved: 'భద్రపరిచినవి', listen: 'వినండి', stop: 'ఆపండి', save: 'భద్రపరచు', unsave: 'భద్రపరిచారు', share: 'పంచుకోండి', close: 'మూసివేయి', related: 'సంబంధిత సంప్రదాయాలు', load_more: 'మరిన్ని చూడండి',
    tod: 'నేటి సంప్రదాయం', cats_title: 'వారసత్వపు ఏడు ధారలు',
    about_title: 'ప్రాజెక్ట్ గురించి', about_lead: 'లోక్‌ధార భారతదేశపు ప్రాచీన జానపద సంప్రదాయాలను నమోదు చేసి, సంరక్షించి, ప్రోత్సహించే డిజిటల్ డేటాబేస్ — నృత్యం, సంగీతం, వాయిద్యాలు, పండుగలు, హస్తకళలు, మౌఖిక సంప్రదాయాలు, సాంప్రదాయ జ్ఞానం అన్నీ ఒకే బహిరంగ, వ్యవస్థీకృత వేదికపై.',
    vision_t: 'దార్శనికత', mission_t: 'లక్ష్యం', objectives_t: 'ఉద్దేశాలు',
    db_title: 'సాంస్కృతిక డేటాబేస్', map_title: 'భారత సాంస్కృతిక పటం', map_hint: 'ఒక రాష్ట్రాన్ని, ఆపై జిల్లాను ఎంచుకుని అక్కడి సంప్రదాయాలను తెలుసుకోండి.',
    stats_title: 'గణాంకాలు & అంతర్దృష్టులు', survey_title: 'క్షేత్ర సర్వే', archive_title: 'డిజిటల్ ఆర్కైవ్', compare_title: 'పోల్చండి', research_title: 'పరిశోధన & నివేదికలు', sources_title: 'మూలాలు & ఆధారాలు', contact_title: 'సంప్రదింపు & సహకారం',
    motto: 'మన సంస్కృతిని కాపాడుకుందాం. మన మూలాలను వేడుక చేసుకుందాం. ముందుకు తీసుకెళ్దాం.',
    results: 'సంప్రదాయాలు', state: 'రాష్ట్రం', district: 'జిల్లా', period: 'కాలం', status: 'స్థితి', category: 'వర్గం', translate_all: 'పూర్తి పేజీని అనువదించు', on_map: 'పటంలో చూడండి'
  }
};

/* =========================================================
   9. BUILD THE DATABASE
   ========================================================= */
function splitTop(str) {
  const out = []; let depth = 0, cur = '';
  for (const ch of String(str)) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}
function parseDistricts(str) {
  return splitTop(str).map(s => s.trim()).filter(Boolean).map(s => {
    const m = s.match(/^(.+?)\s*\((.+)\)$/);
    return m ? { d: m[1].trim(), loc: m[2].trim() } : { d: s, loc: '' };
  });
}
const DB = RAW.map((r, i) => ({
  id: i + 1,
  name: r[0], cat: r[1], st: r[2], area: r[3], per: r[4], sta: r[5], desc: r[6],
  tags: (r[7] || '').split(' ').filter(Boolean),
  districts: parseDistricts(r[3]),
  acc: 'LKD-2026-' + String(i + 1).padStart(4, '0')
}));
const BY_ID = Object.fromEntries(DB.map(t => [t.id, t]));
const isStatewide = d => /^all\b/i.test(d);

/* =========================================================
   10. UTILITIES
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('lokdhara:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('lokdhara:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
};
const countBy = (arr, fn) => arr.reduce((m, x) => { const k = fn(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const fmt = n => Number(n).toLocaleString('en-IN');
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2600);
}
function download(name, text, type = 'text/plain') {
  const blob = new Blob([text], { type: type + ';charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
}
function toCSV(rows) {
  return rows.map(r => r.map(v => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(',')).join('\n');
}
function vitality(list) {
  if (!list.length) return 0;
  return Math.round(list.reduce((s, t) => s + STATUS[t.sta].score, 0) / list.length);
}

/* =========================================================
   11. MULTILINGUAL ENGINE
   ========================================================= */
let LANG = store.get('lang', 'en');
if (!I18N[LANG]) LANG = 'en';
const t = k => (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k;
const catName = c => t('cat_' + c);
const staName = s => t('st_' + s);
const perName = p => t('pe_' + p);
const LOCALE = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN' };

function applyI18n() {
  document.documentElement.lang = LANG;
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('#langSel').value = LANG;
}
function setLang(l) {
  LANG = I18N[l] ? l : 'en';
  store.set('lang', LANG);
  applyI18n();
  fillSelects();
  route();
}

/* Full-page translation into 20+ Indian languages (loads Google Translate on request) */
function loadFullTranslate() {
  if (window.google && window.google.translate) { toast('Choose a language from the translate menu in the footer'); $('#gt').scrollIntoView({ behavior: 'smooth' }); return; }
  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,mai,sa,ne,sd,doi,gom,mni-Mtei,bho,en',
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'gt');
    $('#gt').scrollIntoView({ behavior: 'smooth' });
  };
  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.onerror = () => toast('Full-page translation needs an internet connection');
  document.body.appendChild(s);
  toast('Loading translation for 20+ Indian languages…');
}

/* =========================================================
   12. IMAGE ENGINE — real photographs for every record
   Images are searched live on Wikimedia Commons and Wikipedia,
   cached on the device, and always shown with a credit line.
   ========================================================= */
const CAT_WORD = { D: 'folk dance', M: 'folk music', I: 'musical instrument', F: 'festival', A: 'handicraft', O: 'folk theatre', K: 'traditional' };
const IMG_BAD = /\b(map|maps|locator|logo|flag|emblem|seal|coat of arms|stamp|icon|signature|chart|diagram|graph|svg|screenshot|poster|banner|cover|election)\b/i;
const IMG_CACHE_KEY = 'img:v2';
let IMG_CACHE = store.get(IMG_CACHE_KEY, {});
let imgSaveT;
const imgKey = tr => tr.st + '|' + tr.name;
function saveImgCache() { clearTimeout(imgSaveT); imgSaveT = setTimeout(() => store.set(IMG_CACHE_KEY, IMG_CACHE), 600); }
const stripHTML = s => { const d = document.createElement('div'); d.innerHTML = String(s || ''); return d.textContent.replace(/\s+/g, ' ').trim().slice(0, 120); };

async function commonsSearch(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', origin: '*', generator: 'search', gsrsearch: 'filetype:bitmap ' + q,
    gsrnamespace: '6', gsrlimit: '10', prop: 'imageinfo', iiprop: 'url|mime|extmetadata', iiurlwidth: '900',
    iiextmetadatafilter: 'Artist|LicenseShortName|ObjectName'
  });
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  const pages = Object.values((j.query && j.query.pages) || {}).sort((a, b) => a.index - b.index);
  for (const p of pages) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii || !ii.thumburl || !/image\/(jpeg|png|webp)/.test(ii.mime || '') || IMG_BAD.test(p.title)) continue;
    const md = ii.extmetadata || {};
    return {
      src: ii.thumburl, page: ii.descriptionurl,
      title: p.title.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' '),
      artist: stripHTML(md.Artist && md.Artist.value) || 'Unknown photographer',
      license: stripHTML(md.LicenseShortName && md.LicenseShortName.value) || 'See source page',
      source: 'Wikimedia Commons'
    };
  }
  return null;
}
async function wikiSearch(q) {
  const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', origin: '*', generator: 'search', gsrsearch: q, gsrlimit: '6',
    prop: 'pageimages|info', piprop: 'thumbnail|name', pithumbsize: '900', inprop: 'url'
  });
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  const pages = Object.values((j.query && j.query.pages) || {}).sort((a, b) => a.index - b.index);
  for (const p of pages) {
    if (!p.thumbnail || !p.pageimage || IMG_BAD.test(p.pageimage) || /\.svg$/i.test(p.pageimage)) continue;
    return {
      src: p.thumbnail.source, page: 'https://en.wikipedia.org/wiki/File:' + encodeURIComponent(p.pageimage),
      title: p.pageimage.replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' '),
      artist: 'See file page', license: 'See file page', source: 'Wikipedia — ' + p.title, article: p.fullurl
    };
  }
  return null;
}
let NET_FAIL = 0;
async function resolveImage(tr) {
  if (!navigator.onLine || NET_FAIL > 8) return null;
  const st = STATE[tr.st].n.replace(/&/g, 'and');
  const base = HINTS[tr.name] || tr.name;
  const twoWords = base.trim().split(/\s+/).length > 1;
  const tries = [
    () => commonsSearch(`${base} ${st}`),
    () => commonsSearch(`${base} ${CAT_WORD[tr.cat]}`),
    () => twoWords ? commonsSearch(base) : null,
    () => wikiSearch(`${base} ${st}`),
    () => wikiSearch(`${base} ${CAT_WORD[tr.cat]} India`),
    () => commonsSearch(`${CAT_WORD[tr.cat]} ${st}`).then(r => r && Object.assign(r, { rep: true }))
  ];
  for (const f of tries) {
    try { const r = await f(); if (r) return r; } catch (e) { NET_FAIL++; return null; }
  }
  return null;
}
/* Small queue so the Wikimedia APIs are called politely */
const IMGQ = []; let imgActive = 0;
function enqueue(fn) { return new Promise(res => { IMGQ.push({ fn, res }); pumpQ(); }); }
function pumpQ() {
  while (imgActive < 4 && IMGQ.length) {
    const { fn, res } = IMGQ.shift();
    imgActive++;
    fn().catch(() => null).then(v => { imgActive--; res(v); pumpQ(); });
  }
}
const inflight = new Map();
function getImage(tr) {
  const k = imgKey(tr);
  if (IMG_CACHE[k]) return Promise.resolve(IMG_CACHE[k]);
  if (inflight.has(k)) return inflight.get(k);
  const p = enqueue(() => resolveImage(tr)).then(info => {
    inflight.delete(k);
    if (info) { IMG_CACHE[k] = info; saveImgCache(); NET_FAIL = 0; }
    return info;
  });
  inflight.set(k, p);
  return p;
}
function creditHTML(info, short) {
  if (!info) return '<span class="muted">Image reference loads with the photograph.</span>';
  const lic = esc(info.license);
  if (short) return `📷 ${esc(info.artist)} · ${lic}`;
  return `<a href="${esc(info.page)}" target="_blank" rel="noopener">${esc(info.title)}</a> — ${esc(info.artist)}, ${lic}, via ${esc(info.source)}${info.rep ? ' <em>(representative image of this stream in the state)</em>' : ''}`;
}
function mediaHTML(tr, cls = '') {
  const cached = IMG_CACHE[imgKey(tr)];
  return `<div class="media ${cls}" data-img="${tr.id}" style="--c:${CATS[tr.cat].color}">${cached ? imgTag(tr, cached) : `<span class="media-ph">${CATS[tr.cat].icon}<small>Loading photograph…</small></span>`}</div>`;
}
function imgTag(tr, info) {
  return `<img src="${esc(info.src)}" alt="${esc(tr.name)}, ${esc(STATE[tr.st].n)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="media-credit" title="${esc(info.title)} — ${esc(info.artist)}, ${esc(info.license)}">${creditHTML(info, true)}</span>`;
}
const imgObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { imgObserver.unobserve(e.target); hydrateMedia(e.target); } }), { rootMargin: '400px' })
  : null;
function observeMedia(root = document) {
  $$('.media[data-img]', root).forEach(el => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    const img = el.querySelector('img');
    if (img) { bindImgError(el, img); return; }
    imgObserver ? imgObserver.observe(el) : hydrateMedia(el);
  });
  $$('[data-ref]', root).forEach(el => { const tr = BY_ID[el.dataset.ref]; if (tr && IMG_CACHE[imgKey(tr)]) el.innerHTML = creditHTML(IMG_CACHE[imgKey(tr)]); });
}
function bindImgError(el, img) {
  img.addEventListener('error', () => {
    const tr = BY_ID[el.dataset.img];
    delete IMG_CACHE[imgKey(tr)]; saveImgCache();
    el.innerHTML = `<span class="media-ph">${CATS[tr.cat].icon}<small>Loading photograph…</small></span>`;
    if (!el.dataset.retried) { el.dataset.retried = '1'; hydrateMedia(el); } else offlineMedia(el, tr);
  }, { once: true });
}
function offlineMedia(el, tr) {
  el.innerHTML = `<span class="media-ph">${CATS[tr.cat].icon}<small>Photograph appears when connected to the internet</small></span>`;
}
async function hydrateMedia(el) {
  const tr = BY_ID[el.dataset.img];
  if (!tr) return;
  const info = await getImage(tr);
  if (!info) { offlineMedia(el, tr); return; }
  el.innerHTML = imgTag(tr, info);
  bindImgError(el, el.querySelector('img'));
  $$(`[data-ref="${tr.id}"]`).forEach(r => { r.innerHTML = creditHTML(info); });
}

/* =========================================================
   13. SHARED UI BUILDERS
   ========================================================= */
let SAVED = new Set(store.get('saved', []));
function toggleSave(id) {
  SAVED.has(id) ? SAVED.delete(id) : SAVED.add(id);
  store.set('saved', [...SAVED]);
  return SAVED.has(id);
}
function badgesHTML(tr) {
  let b = `<span class="badge">${esc(perName(tr.per))}</span>`;
  if (tr.tags.includes('UNESCO')) b += '<span class="badge unesco">UNESCO</span>';
  if (tr.tags.includes('GI')) b += '<span class="badge gi">GI</span>';
  return b;
}
function cardHTML(tr) {
  const st = STATE[tr.st];
  return `<article class="tcard" data-id="${tr.id}" tabindex="0" role="button" style="--c:${CATS[tr.cat].color}" aria-label="${esc(tr.name)}, ${esc(st.n)}">
    <div class="tcard-art">${mediaHTML(tr)}${SAVED.has(tr.id) ? '<span class="save-mark" aria-label="Saved">★</span>' : ''}</div>
    <div class="tcard-body">
      <div class="tmeta"><span class="chip" style="--c:${CATS[tr.cat].color}">${CATS[tr.cat].icon} ${esc(catName(tr.cat))}</span><span class="status-dot" style="--sc:${STATUS[tr.sta].color}">${esc(staName(tr.sta))}</span></div>
      <h3>${esc(tr.name)}</h3>
      <p class="loc">${esc(st.n)} — ${esc(tr.area)}</p>
      <p class="desc">${esc(tr.desc)}</p>
      <div class="badges">${badgesHTML(tr)}</div>
    </div>
  </article>`;
}
function optionList(sel, items, allLabel) {
  sel.innerHTML = (allLabel ? `<option value="all">${esc(allLabel)}</option>` : '') + items.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
}
const stateOptions = () => STATES.slice().sort((a, b) => a.n.localeCompare(b.n)).map(s => [s.c, s.n]);

function fillSelects() {
  const keep = id => { const el = $(id); return el ? el.value : 'all'; };
  const v1 = keep('#fState'), v2 = keep('#fPeriod'), v3 = keep('#fStatus');
  optionList($('#fState'), stateOptions(), t('all'));
  optionList($('#fPeriod'), Object.keys(PERIODS).map(k => [k, `${perName(k)} (${PERIODS[k].range})`]), t('all'));
  optionList($('#fStatus'), Object.keys(STATUS).map(k => [k, staName(k)]), t('all'));
  $('#fState').value = v1 || 'all'; $('#fPeriod').value = v2 || 'all'; $('#fStatus').value = v3 || 'all';

  const a1 = keep('#arCat'), a2 = keep('#arState'), a3 = keep('#arType');
  optionList($('#arCat'), Object.keys(CATS).map(k => [k, catName(k)]), t('all'));
  optionList($('#arState'), stateOptions(), t('all'));
  optionList($('#arType'), Object.entries(MEDIA).map(([k, v]) => [k, v.label]), t('all'));
  $('#arCat').value = a1 || 'all'; $('#arState').value = a2 || 'all'; $('#arType').value = a3 || 'all';

  const mm = keep('#mapMode');
  optionList($('#mapMode'), [['all', 'All traditions'], ...Object.keys(CATS).map(k => [k, catName(k)]), ['vit', 'Heritage Vitality Index']]);
  $('#mapMode').value = mm && mm !== 'all' ? mm : 'all';

  const sv = $('#svState').value;
  optionList($('#svState'), stateOptions());
  if (sv) $('#svState').value = sv;
  optionList($('#svCat'), Object.keys(CATS).map(k => [k, catName(k)]));
  optionList($('#svPeriod'), Object.keys(PERIODS).map(k => [k, `${perName(k)} (${PERIODS[k].range})`]));
  optionList($('#svStatus'), Object.keys(STATUS).map(k => [k, staName(k)]));
  optionList($('#ctState'), stateOptions(), '—');
}

/* =========================================================
   14. ROUTER
   ========================================================= */
const PAGES = ['home', 'about', 'database', 'map', 'stats', 'survey', 'archive', 'compare', 'research', 'sources', 'contact'];
const TITLES = { home: 'nav_home', about: 'nav_about', database: 'nav_db', map: 'nav_map', stats: 'nav_stats', survey: 'nav_survey', archive: 'nav_archive', compare: 'nav_compare', research: 'nav_research', sources: 'nav_sources', contact: 'nav_contact' };
let CURRENT = '';
let PREV_HASH = '#home';

function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || 'home';
  let [p, arg] = h.split('/');
  if (p === 't') {
    const id = Number(arg);
    if (!CURRENT) showPage('database');
    if (BY_ID[id]) openDetail(id);
    return;
  }
  if (!PAGES.includes(p)) p = 'home';
  PREV_HASH = location.hash || '#home';
  showPage(p, arg);
}
function showPage(p, arg) {
  const changed = p !== CURRENT;
  CURRENT = p;
  $$('.page').forEach(s => s.classList.toggle('active', s.dataset.page === p));
  $$('[data-route]').forEach(a => a.classList.toggle('active', a.dataset.route === p));
  $$('.bottomnav [data-route]').forEach(a => a.setAttribute('aria-current', a.dataset.route === p ? 'page' : 'false'));
  const r = RENDER[p];
  if (r) r(arg);
  document.title = (p === 'home' ? '' : t(TITLES[p]) + ' — ') + 'Lokdhara — India\'s Living Folk Heritage Database';
  if (changed) window.scrollTo(0, 0);
  closeDrawer();
  $('#navPop').classList.remove('open');
}
const RENDER = {};

/* =========================================================
   15. HOME
   ========================================================= */
function uniqueDistricts(list = DB) {
  const set = new Set();
  list.forEach(tr => tr.districts.forEach(d => { if (!isStatewide(d.d)) set.add(tr.st + ':' + d.d); }));
  return set;
}
RENDER.home = function () {
  const figs = [
    [DB.length, t('k_trad')],
    [STATES.length, t('k_states')],
    [DISTRICT_TOTAL, t('k_dist')],
    [UNESCO.length, t('k_unesco')]
  ];
  $('#heroFigures').innerHTML = figs.map(([n, l]) => `<div><dt>${esc(l)}</dt><dd>${fmt(n)}</dd></div>`).join('');
  const heroPicks = ['Garba', 'Theyyam', 'Kalbelia', 'Durga Puja', 'Purulia Chhau', 'Madhubani Painting'].map(n => DB.find(x => x.name === n)).filter(Boolean);
  $('#heroMosaic').innerHTML = heroPicks.map((tr, i) => `<a class="mosaic-tile m${i + 1}" href="#t/${tr.id}">${mediaHTML(tr)}<span class="mosaic-label">${esc(tr.name)}<small>${esc(STATE[tr.st].n)}</small></span></a>`).join('');

  const day = Math.floor(Date.now() / 86400000);
  const tod = DB[day % DB.length];
  const st = STATE[tod.st];
  $('#todBlock').innerHTML = `<div class="tod-art">${mediaHTML(tod)}</div>
    <div><small>${esc(t('tod'))}</small><h2>${esc(tod.name)}</h2>
    <p>${esc(tod.desc)}</p>
    <p class="muted">${esc(catName(tod.cat))}, ${esc(st.n)} — ${esc(tod.area)}</p>
    <button class="btn ghost small" data-open="${tod.id}">Read the full record</button></div>`;

  const counts = countBy(DB, x => x.cat);
  const blurbs = { D: 'Movement that celebrates harvests, faith and togetherness', M: 'Songs of work, love, seasons and devotion', I: 'Drums, strings and winds crafted from nature', F: 'Gatherings that mark the rhythm of the year', A: 'Weaves, paintings, metal, clay and wood', O: 'Epics, ballads, theatre and storytelling', K: 'Wisdom of water, forests, farming and healing' };
  $('#streamGrid').innerHTML = Object.keys(CATS).map(c => `<a class="stream" href="#database/${c}" style="--c:${CATS[c].color}">
    <span class="ico">${CATS[c].icon}</span><b>${esc(catName(c))}</b><small>${esc(blurbs[c])}</small><span class="n">${counts[c] || 0}</span></a>`).join('');

  $('#homeThread').innerHTML = TIMELINE.map(([w, , txt]) => `<li><b>${esc(w)}</b><span>${esc(txt)}</span></li>`).join('');

  $('#unescoStrip').innerHTML = UNESCO.map(([y, n, where]) => `<div class="u-item"><em>${y}</em><b>${esc(n)}</b><span>${esc(where)}</span></div>`).join('');

  const regCounts = countBy(DB, x => STATE[x.st].reg);
  $('#regionBlock').innerHTML = `<h2>Heritage across India's regions</h2>
    <p class="lede">From the Himalaya to the islands, every region contributes its own colours. Select a region to view its states on the map.</p>
    <div class="region-row">${REGIONS.map(r => {
      const sts = STATES.filter(s => s.reg === r);
      const dn = sts.reduce((s, x) => s + (DISTRICTS[x.c] || []).length, 0);
      return `<a class="region-card" href="#map/${sts[0].c}"><b>${regCounts[r] || 0}</b>${esc(r)}<br><small class="muted">${sts.length} states &amp; UTs, ${dn} districts</small></a>`;
    }).join('')}</div>`;
  observeMedia($('[data-page=home]'));
};

function animateCounts(root) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('[data-count]', root).forEach(el => {
    const end = Number(el.dataset.count), t0 = performance.now(), dur = 1200;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* =========================================================
   16. ABOUT
   ========================================================= */
RENDER.about = function () {
  $('#statusLegend').innerHTML = Object.entries(STATUS).map(([k, s]) => `<div><i style="background:${s.color}"></i><b>${esc(staName(k))}</b><span>${esc(s.note)}</span></div>`).join('');
};

/* =========================================================
   17. CULTURAL DATABASE
   ========================================================= */
const DBV = { cat: 'all', page: 1, per: 24, view: 'cards' };
function dbFiltered() {
  const q = norm($('#dbSearch').value.trim());
  const fs = $('#fState').value, fp = $('#fPeriod').value, fst = $('#fStatus').value;
  const onlySaved = $('#fSaved').checked, onlyU = $('#fUnesco').checked, onlyG = $('#fGI').checked;
  let list = DB.filter(tr =>
    (DBV.cat === 'all' || tr.cat === DBV.cat) &&
    (fs === 'all' || tr.st === fs) &&
    (fp === 'all' || tr.per === fp) &&
    (fst === 'all' || tr.sta === fst) &&
    (!onlySaved || SAVED.has(tr.id)) &&
    (!onlyU || tr.tags.includes('UNESCO')) &&
    (!onlyG || tr.tags.includes('GI')) &&
    (!q || norm(tr.name + ' ' + tr.desc + ' ' + tr.area + ' ' + STATE[tr.st].n + ' ' + CATS[tr.cat].en).includes(q))
  );
  const sort = $('#fSort').value;
  const cmp = {
    name: (a, b) => a.name.localeCompare(b.name),
    state: (a, b) => STATE[a.st].n.localeCompare(STATE[b.st].n) || a.name.localeCompare(b.name),
    period: (a, b) => PERIODS[a.per].order - PERIODS[b.per].order || a.name.localeCompare(b.name),
    status: (a, b) => STATUS[a.sta].order - STATUS[b.sta].order || a.name.localeCompare(b.name)
  }[sort];
  return list.sort(cmp);
}
function renderDbTabs() {
  const counts = countBy(DB, x => x.cat);
  $('#catTabs').innerHTML = [['all', '✨', t('all'), DB.length], ...Object.keys(CATS).map(c => [c, CATS[c].icon, catName(c), counts[c] || 0])]
    .map(([k, i, l, n]) => `<button class="cat-tab ${DBV.cat === k ? 'active' : ''}" role="tab" aria-selected="${DBV.cat === k}" data-cat="${k}">${i} ${esc(l)} <small>${n}</small></button>`).join('');
}
function renderDbGrid() {
  const list = dbFiltered();
  const shown = list.slice(0, DBV.page * DBV.per);
  $('#dbCount').textContent = `${fmt(list.length)} ${t('results')}`;
  $('#dbGrid').innerHTML = shown.length ? shown.map(cardHTML).join('') :
    `<div class="empty"><p><b>No traditions match these filters yet.</b></p><p>Try a broader search, clear a filter, or add this tradition through the Field Survey.</p><button class="btn small ghost" id="dbReset">Clear all filters</button></div>`;
  $('#dbMore').hidden = shown.length >= list.length;
  const tableView = DBV.view === 'table';
  $('#dbGrid').hidden = tableView;
  $('#dbTableWrap').hidden = !tableView;
  if (tableView) {
    $('#dbTable').innerHTML = `<thead><tr><th>Image</th><th>Tradition</th><th>${esc(t('category'))}</th><th>${esc(t('state'))} / ${esc(t('district'))}</th><th>${esc(t('period'))}</th><th>${esc(t('status'))}</th><th>Image reference</th></tr></thead><tbody>${shown.map(tr => `<tr data-id="${tr.id}">
      <td class="thumb">${mediaHTML(tr, 'mini')}</td><td><b>${esc(tr.name)}</b><br><small class="muted">${tr.acc}</small></td><td>${CATS[tr.cat].icon} ${esc(catName(tr.cat))}</td>
      <td>${esc(STATE[tr.st].n)}<br><small class="muted">${esc(tr.area)}</small></td><td>${esc(perName(tr.per))}</td><td>${esc(staName(tr.sta))}</td>
      <td class="ref" data-ref="${tr.id}">${creditHTML(IMG_CACHE[imgKey(tr)])}</td></tr>`).join('')}</tbody>`;
    observeMedia($('#dbTableWrap'));
  } else observeMedia($('#dbGrid'));
}
RENDER.database = function (arg) {
  if (arg && (CATS[arg] || arg === 'all')) DBV.cat = arg;
  DBV.page = 1;
  renderDbTabs();
  renderDbGrid();
};
function resetDbFilters() {
  $('#dbSearch').value = '';
  ['#fState', '#fPeriod', '#fStatus'].forEach(s => { $(s).value = 'all'; });
  ['#fSaved', '#fUnesco', '#fGI'].forEach(s => { $(s).checked = false; });
  DBV.cat = 'all'; DBV.page = 1;
  renderDbTabs(); renderDbGrid();
}
function exportDb(kind) {
  const list = dbFiltered();
  if (kind === 'json') {
    download('lokdhara-database.json', JSON.stringify(list.map(x => ({
      accession: x.acc, name: x.name, category: CATS[x.cat].en, state: STATE[x.st].n, districts: x.area,
      period: PERIODS[x.per].en, status: STATUS[x.sta].en, description: x.desc, recognition: x.tags,
      image: IMG_CACHE[imgKey(x)] || null
    })), null, 2), 'application/json');
  } else {
    download('lokdhara-database.csv', toCSV([['Accession', 'Name', 'Category', 'State/UT', 'Districts', 'Period', 'Status', 'Recognition', 'Description', 'Image URL', 'Image reference'],
      ...list.map(x => { const im = IMG_CACHE[imgKey(x)]; return [x.acc, x.name, CATS[x.cat].en, STATE[x.st].n, x.area, PERIODS[x.per].en, STATUS[x.sta].en, x.tags.join(' '), x.desc, im ? im.src : '', im ? `${im.title} — ${im.artist}, ${im.license}, ${im.source}, ${im.page}` : '']; })]), 'text/csv');
  }
  toast(`Exported ${list.length} records`);
}

/* =========================================================
   18. DETAIL DIALOG
   ========================================================= */
let speaking = false;
function openDetail(id) {
  const tr = BY_ID[id];
  if (!tr) return;
  const st = STATE[tr.st];
  const rel = DB.filter(x => x.id !== id && (x.st === tr.st || x.cat === tr.cat))
    .sort((a, b) => (b.st === tr.st && b.cat === tr.cat) - (a.st === tr.st && a.cat === tr.cat) || (b.st === tr.st) - (a.st === tr.st))
    .slice(0, 8);
  const dlg = $('#detail');
  dlg.innerHTML = `<div class="d-art">${mediaHTML(tr, 'wide')}<button class="d-close" data-close aria-label="${esc(t('close'))}">✕</button></div>
  <p class="d-credit" data-ref="${tr.id}">${creditHTML(IMG_CACHE[imgKey(tr)])}</p>
  <div class="d-body">
    <div class="tmeta"><span class="chip" style="--c:${CATS[tr.cat].color}">${CATS[tr.cat].icon} ${esc(catName(tr.cat))}</span><span class="status-dot" style="--sc:${STATUS[tr.sta].color}">${esc(staName(tr.sta))}</span>${badgesHTML(tr)}</div>
    <h2 id="dTitle">${esc(tr.name)}</h2>
    <p>${esc(tr.desc)}</p>
    <dl class="d-grid">
      <div><dt>${esc(t('state'))}</dt><dd>${esc(st.n)}</dd></div>
      <div><dt>${esc(t('district'))}</dt><dd>${esc(tr.area)}</dd></div>
      <div><dt>${esc(t('period'))}</dt><dd>${esc(perName(tr.per))} <small class="muted">(${PERIODS[tr.per].range})</small></dd></div>
      <div><dt>${esc(t('status'))}</dt><dd>${esc(staName(tr.sta))}</dd></div>
      <div><dt>Region</dt><dd>${esc(st.reg)}</dd></div>
      <div><dt>Languages of the region</dt><dd>${esc(st.lang)}</dd></div>
      <div><dt>Accession number</dt><dd>${tr.acc}</dd></div>
    </dl>
    <p class="muted">${esc(STATUS[tr.sta].note)}</p>
    <div class="d-actions">
      <button class="btn primary small" data-act="listen">🔊 ${esc(t('listen'))}</button>
      <button class="btn ghost small" data-act="save">${SAVED.has(id) ? '★ ' + esc(t('unsave')) : '☆ ' + esc(t('save'))}</button>
      <button class="btn ghost small" data-act="share">↗ ${esc(t('share'))}</button>
      <button class="btn ghost small" data-act="map">🗺️ ${esc(t('on_map'))}</button>
      <button class="btn ghost small" data-act="art">📷 Image source</button>
    </div>
    <h3>${esc(t('related'))}</h3>
    <div class="d-related">${rel.map(r => `<button data-open="${r.id}">${CATS[r.cat].icon} ${esc(r.name)}</button>`).join('')}</div>
  </div>`;
  dlg.dataset.id = id;
  if (!dlg.open) dlg.showModal();
  observeMedia(dlg);
  dlg.scrollTop = 0;
  if (location.hash !== '#t/' + id) history.replaceState(null, '', '#t/' + id);
}
function closeDetail() {
  const dlg = $('#detail');
  stopSpeech();
  if (dlg.open) dlg.close();
}
function stopSpeech() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  speaking = false;
}
function speak(text, btn) {
  if (!('speechSynthesis' in window)) { toast('Audio narration is not supported in this browser'); return; }
  if (speaking) { stopSpeech(); if (btn) btn.innerHTML = '🔊 ' + esc(t('listen')); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN';
  u.rate = 0.95;
  u.onend = () => { speaking = false; if (btn) btn.innerHTML = '🔊 ' + esc(t('listen')); };
  speechSynthesis.speak(u);
  speaking = true;
  if (btn) btn.innerHTML = '⏹ ' + esc(t('stop'));
}
function detailAction(act, btn) {
  const id = Number($('#detail').dataset.id), tr = BY_ID[id];
  if (!tr) return;
  if (act === 'listen') speak(`${tr.name}. ${CATS[tr.cat].en} of ${STATE[tr.st].n}. ${tr.desc}`, btn);
  if (act === 'save') {
    const on = toggleSave(id);
    btn.innerHTML = on ? '★ ' + esc(t('unsave')) : '☆ ' + esc(t('save'));
    toast(on ? 'Saved to your collection' : 'Removed from your collection');
    if (CURRENT === 'database') renderDbGrid();
  }
  if (act === 'share') {
    const url = location.origin + location.pathname + '#t/' + id;
    if (navigator.share) navigator.share({ title: tr.name + ' — Lokdhara', text: tr.desc, url }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Link copied'), () => toast(url));
    else toast(url);
  }
  if (act === 'map') { closeDetail(); location.hash = 'map/' + tr.st; }
  if (act === 'art') {
    const im = IMG_CACHE[imgKey(tr)];
    if (im) window.open(im.page, '_blank', 'noopener'); else toast('The photograph is still loading — please try again in a moment');
  }
}

/* =========================================================
   19. COMMAND PALETTE SEARCH
   ========================================================= */
let palIndex = 0;
function openPalette() {
  const p = $('#palette');
  if (!p.open) p.showModal();
  $('#palInput').value = '';
  renderPalette('');
  setTimeout(() => $('#palInput').focus(), 20);
}
function palItems(q) {
  q = norm(q.trim());
  if (!q) {
    return [
      ...PAGES.map(p => ({ icon: '↪', title: t(TITLES[p]), sub: 'Go to page', go: '#' + p })),
    ].slice(0, 11);
  }
  const states = STATES.filter(s => norm(s.n).includes(q) || s.c.toLowerCase() === q)
    .map(s => ({ icon: '🗺️', title: s.n, sub: `${s.type} — ${DB.filter(x => x.st === s.c).length} traditions`, go: '#map/' + s.c }));
  const trads = DB.map(tr => {
    const n = norm(tr.name);
    let score = n.startsWith(q) ? 3 : n.includes(q) ? 2 : norm(tr.area + ' ' + tr.desc).includes(q) ? 1 : 0;
    return { tr, score };
  }).filter(x => x.score).sort((a, b) => b.score - a.score || a.tr.name.localeCompare(b.tr.name)).slice(0, 14)
    .map(({ tr }) => ({ icon: CATS[tr.cat].icon, title: tr.name, sub: `${catName(tr.cat)}, ${STATE[tr.st].n}`, open: tr.id }));
  return [...states, ...trads];
}
function renderPalette(q) {
  const items = palItems(q);
  palIndex = 0;
  $('#palResults').innerHTML = items.length ? items.map((it, i) =>
    `<li role="option" aria-selected="${i === 0}" data-i="${i}" ${it.go ? `data-go="${it.go}"` : ''} ${it.open ? `data-open="${it.open}"` : ''}><span class="pi">${it.icon}</span><div>${esc(it.title)}<small>${esc(it.sub)}</small></div></li>`).join('')
    : '<li class="pal-empty">No matches yet — try another spelling or a state name.</li>';
}
function palMove(d) {
  const lis = $$('#palResults li[data-i]');
  if (!lis.length) return;
  palIndex = (palIndex + d + lis.length) % lis.length;
  lis.forEach((li, i) => li.setAttribute('aria-selected', i === palIndex));
  lis[palIndex].scrollIntoView({ block: 'nearest' });
}
function palChoose(li) {
  if (!li) return;
  $('#palette').close();
  if (li.dataset.go) location.hash = li.dataset.go.slice(1);
  else if (li.dataset.open) location.hash = 't/' + li.dataset.open;
}

/* =========================================================
   20. INDIA MAP (tile cartogram → state → district → tradition)
   ========================================================= */
const MAPV = { st: null, dist: null };
const TILE = 64, GAPX = 6;
function mixColor(a, b, p) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * p).toString(16).padStart(2, '0')).join('');
}
function mapValue(code, mode) {
  const list = DB.filter(x => x.st === code);
  if (mode === 'vit') return vitality(list);
  if (mode === 'all') return list.length;
  return list.filter(x => x.cat === mode).length;
}
function renderMap() {
  const mode = $('#mapMode').value || 'all';
  const vals = STATES.map(s => mapValue(s.c, mode));
  const max = Math.max(1, ...vals), min = Math.min(...vals);
  const hi = mode === 'all' || mode === 'vit' ? (mode === 'vit' ? '#2fd67b' : '#00d8c8') : CATS[mode].color;
  const day = document.documentElement.dataset.theme === 'day';
  const lo = day ? '#d9ecea' : '#12293c';
  const minX = Math.min(...STATES.map(s => s.x)), maxX = Math.max(...STATES.map(s => s.x)), maxY = Math.max(...STATES.map(s => s.y));
  const W = (maxX - minX + 1) * (TILE + GAPX), H = (maxY + 1) * (TILE + GAPX);
  const svg = $('#indiaMap');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = STATES.map((s, i) => {
    const v = vals[i];
    const p = max === min ? 1 : (v - min) / (max - min);
    const fill = v ? mixColor(lo, hi, 0.18 + 0.82 * p) : lo;
    const x = (s.x - minX) * (TILE + GAPX), y = s.y * (TILE + GAPX);
    const txt = day || p > 0.5 ? '#06121c' : '#eefbff';
    return `<g class="tile ${MAPV.st === s.c ? 'sel' : ''}" data-st="${s.c}" tabindex="0" role="button" aria-label="${esc(s.n)}: ${v}${mode === 'vit' ? ' vitality' : ' traditions'}">
      <title>${esc(s.n)} — ${v}${mode === 'vit' ? ' vitality index' : ' traditions'}</title>
      <rect x="${x}" y="${y}" width="${TILE}" height="${TILE}" rx="14" fill="${fill}"/>
      <text class="tc" x="${x + TILE / 2}" y="${y + 30}" text-anchor="middle" fill="${txt}">${s.c}</text>
      <text class="tn" x="${x + TILE / 2}" y="${y + 48}" text-anchor="middle" fill="${txt}">${v}</text></g>`;
  }).join('');
  $('#mapScale').innerHTML = `<span>${min}</span><i style="background:linear-gradient(90deg, ${mixColor(lo, hi, .18)}, ${hi})"></i><span>${max}</span>`;
}
function districtMatches(label, official) {
  const a = norm(label), b = norm(official);
  return a === b || b.startsWith(a + ' ') || a.startsWith(b + ' ');
}
function renderMapPanel() {
  const panel = $('#mapPanel');
  if (!MAPV.st) {
    const top = STATES.map(s => [s, DB.filter(x => x.st === s.c).length]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    panel.innerHTML = `<div class="panel-empty"><h2>Begin your journey</h2>
      <ol><li>Tap any state or union territory tile.</li><li>Pick any of its ${DISTRICT_TOTAL} districts to narrow the list.</li><li>Open a tradition to see its photograph, read, listen and share.</li></ol>
      <h3>Richest collections so far</h3>
      <ul class="mini-list">${top.map(([s, n]) => `<li><button data-st="${s.c}"><span>🗺️</span><span>${esc(s.n)}<small>${n} traditions, ${(DISTRICTS[s.c] || []).length} districts</small></span></button></li>`).join('')}</ul></div>`;
    return;
  }
  const s = STATE[MAPV.st];
  const list = DB.filter(x => x.st === s.c);
  const official = DISTRICTS[s.c] || [];
  const statewide = list.filter(tr => tr.districts.some(d => isStatewide(d.d)));
  const direct = d => list.filter(tr => tr.districts.some(x => !isStatewide(x.d) && districtMatches(x.d, d)));
  const areas = [...new Set(list.flatMap(tr => tr.districts.map(x => x.d)).filter(d => !isStatewide(d) && !official.some(o => districtMatches(d, o))))].sort();
  const withRecords = official.filter(d => direct(d).length).length;
  let shown = list, note = '';
  if (MAPV.dist) {
    const isArea = areas.includes(MAPV.dist);
    const own = isArea ? list.filter(tr => tr.districts.some(x => x.d === MAPV.dist)) : direct(MAPV.dist);
    shown = [...own, ...statewide.filter(x => !own.includes(x))];
    note = own.length
      ? `<p class="panel-note"><b>${own.length}</b> tradition${own.length > 1 ? 's' : ''} rooted in ${esc(MAPV.dist)}, plus ${statewide.length} celebrated across ${esc(s.n)}.</p>`
      : `<p class="panel-note">${esc(MAPV.dist)} shares in the ${statewide.length} statewide traditions of ${esc(s.n)} listed below. Its own local traditions are being gathered — add one through the <a href="#survey">Field Survey</a>.</p>`;
  }
  const cc = countBy(list, x => x.cat);
  panel.innerHTML = `<h2>${esc(s.n)}</h2>
    <dl class="panel-meta"><dt>Type</dt><dd>${s.type}</dd><dt>Capital</dt><dd>${esc(s.cap)}</dd><dt>Region</dt><dd>${s.reg}</dd><dt>Languages</dt><dd>${esc(s.lang)}</dd><dt>Districts</dt><dd>${official.length} (${withRecords} with district-specific records)</dd><dt>Vitality index</dt><dd><b>${vitality(list)}</b> / 100</dd></dl>
    <div class="hbars">${Object.keys(CATS).map(c => `<div class="hbar"><span class="lbl">${CATS[c].icon} ${esc(catName(c))}</span><span class="track"><span class="fill" style="width:${pct(cc[c] || 0, Math.max(...Object.values(cc)))}%;--bc:${CATS[c].color}"></span></span><span class="val">${cc[c] || 0}</span></div>`).join('')}</div>
    <h3 style="margin-top:1.2rem">${esc(t('district'))} <small class="muted">(${official.length})</small></h3>
    <div class="dist-chips"><button class="${!MAPV.dist ? 'active' : ''}" data-dist="">${esc(t('all'))} <small>${list.length}</small></button>${official.map(d => { const n = direct(d).length; return `<button class="${MAPV.dist === d ? 'active' : ''} ${n ? 'has' : 'shared'}" data-dist="${esc(d)}">${esc(d)} <small>${n || '·'}</small></button>`; }).join('')}</div>
    ${areas.length ? `<h3>Cultural areas</h3><div class="dist-chips">${areas.map(d => `<button class="${MAPV.dist === d ? 'active' : ''} has" data-dist="${esc(d)}">${esc(d)}</button>`).join('')}</div>` : ''}
    ${note}
    <ul class="mini-list">${shown.map(tr => `<li><button data-open="${tr.id}">${mediaHTML(tr, 'mini')}<span>${esc(tr.name)}<small>${esc(catName(tr.cat))} — ${esc(tr.area)}</small></span></button></li>`).join('')}</ul>
    <div class="form-actions"><a class="btn small ghost" href="#compare" data-cmp-state="${s.c}">Compare this state</a></div>`;
  observeMedia(panel);
}
RENDER.map = function (arg) {
  if (arg && STATE[arg]) { if (MAPV.st !== arg) MAPV.dist = null; MAPV.st = arg; }
  renderMap();
  renderMapPanel();
};
function selectState(code) {
  MAPV.st = code; MAPV.dist = null;
  history.replaceState(null, '', '#map/' + code);
  renderMap(); renderMapPanel();
  if (innerWidth < 960) $('#mapPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================================================
   21. CHART HELPERS
   ========================================================= */
function hbars(items, opts = {}) {
  const max = Math.max(1, ...items.map(i => i.v));
  return `<div class="hbars">${items.map(i => `<div class="hbar ${i.link ? 'link' : ''}" ${i.link ? `data-link="${i.link}" role="link" tabindex="0"` : ''}>
    <span class="lbl" title="${esc(i.l)}">${esc(i.l)}</span><span class="track"><span class="fill" style="width:${pct(i.v, max)}%;--bc:${i.c || 'var(--haldi)'}"></span></span><span class="val">${opts.suffix ? i.v + opts.suffix : i.v}</span></div>`).join('')}</div>`;
}
function donut(items, centerLabel) {
  const total = items.reduce((s, i) => s + i.v, 0) || 1;
  let acc = 0;
  const segs = items.map(i => {
    const len = i.v / total * 100;
    const s = `<circle r="15.915" cx="21" cy="21" fill="none" stroke="${i.c}" stroke-width="5.2" stroke-dasharray="${len.toFixed(2)} ${(100 - len).toFixed(2)}" stroke-dashoffset="${(25 - acc).toFixed(2)}"/>`;
    acc += len;
    return s;
  }).join('');
  return `<div class="donut-wrap"><svg class="donut" viewBox="0 0 42 42" role="img" aria-label="${esc(centerLabel)}">${segs}
    <text x="21" y="21" text-anchor="middle" font-size="7">${total}</text><text x="21" y="26.5" text-anchor="middle" font-size="2.6" style="font-family:var(--f-body);fill:var(--ink-3)">${esc(centerLabel)}</text></svg>
    <ul class="legend">${items.map(i => `<li><i style="background:${i.c}"></i>${esc(i.l)}<span>${i.v} (${pct(i.v, total)}%)</span></li>`).join('')}</ul></div>`;
}
function columns(items) {
  const max = Math.max(1, ...items.map(i => i.v));
  return `<div class="cols">${items.map(i => `<div class="col"><b>${i.v}</b><div class="bar" style="height:${Math.max(4, i.v / max * 200)}px;--bc:${i.c}"></div><small>${esc(i.l)}<br>${esc(i.sub || '')}</small></div>`).join('')}</div>`;
}
function radar(series, axes) {
  const W = 360, C = 180, R = 130, n = axes.length;
  const max = Math.max(1, ...series.flatMap(s => s.values));
  const pt = (i, v) => { const a = -Math.PI / 2 + i / n * Math.PI * 2; return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v]; };
  let grid = '';
  for (let k = 1; k <= 4; k++) grid += `<polygon points="${axes.map((_, i) => pt(i, k / 4).join(',')).join(' ')}" fill="none" stroke="var(--line-2)"/>`;
  const spokes = axes.map((a, i) => { const [x, y] = pt(i, 1); const [lx, ly] = pt(i, 1.2); return `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" stroke="var(--line)"/><text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle">${esc(a)}</text>`; }).join('');
  const polys = series.map(s => `<polygon points="${s.values.map((v, i) => pt(i, v / max).join(',')).join(' ')}" fill="${s.color}" fill-opacity=".18" stroke="${s.color}" stroke-width="2.4"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${W}" role="img" aria-label="Radar comparison">${grid}${spokes}${polys}</svg>
    <ul class="legend" style="flex-direction:row;flex-wrap:wrap;gap:.8rem;margin-top:.6rem">${series.map(s => `<li><i style="background:${s.color}"></i>${esc(s.name)}</li>`).join('')}</ul>`;
}

/* =========================================================
   22. STATISTICS
   ========================================================= */
let STAT_TAB = 'state';
RENDER.stats = function () {
  const giCount = DB.filter(x => x.tags.includes('GI')).length;
  const healthy = DB.filter(x => ['T', 'S', 'R'].includes(x.sta)).length;
  const kpis = [
    [DB.length, t('k_trad')], [STATES.length, t('k_states')], [DISTRICT_TOTAL, t('k_dist')], [uniqueDistricts().size, 'Places with specific records'],
    [UNESCO.length, t('k_unesco')], [giCount, t('k_gi')], [pct(healthy, DB.length) + '%', 'Flourishing, steady or revived'], [vitality(DB), 'National vitality index']
  ];
  $('#kpiRow').innerHTML = kpis.map(([v, l]) => `<div class="kpi"><b>${v}</b><span>${esc(l)}</span></div>`).join('');
  $$('#statTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === STAT_TAB));
  renderStatTab();
  renderInsights();
  $('#nationalFacts').innerHTML = FACTS.map(([v, l, s]) => `<div class="fact"><b>${v}</b><span>${esc(l)}</span><small>${esc(s)}</small></div>`).join('');
};
function renderStatTab() {
  const body = $('#statBody');
  if (STAT_TAB === 'state') {
    const catSel = body.dataset.cat || 'all', sortSel = body.dataset.sort || 'count';
    let items = STATES.map(s => {
      const list = DB.filter(x => x.st === s.c && (catSel === 'all' || x.cat === catSel));
      return { l: s.n, v: sortSel === 'vit' ? vitality(DB.filter(x => x.st === s.c)) : list.length, c: catSel === 'all' ? 'var(--peacock)' : CATS[catSel].color, link: 'map/' + s.c };
    });
    items.sort((a, b) => b.v - a.v || a.l.localeCompare(b.l));
    body.innerHTML = `<div class="toolbar">
      <label class="field"><span>${esc(t('category'))}</span><select id="stCat">${[['all', t('all')], ...Object.keys(CATS).map(k => [k, catName(k)])].map(([v, l]) => `<option value="${v}" ${v === catSel ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
      <label class="field"><span>Measure</span><select id="stSort"><option value="count" ${sortSel === 'count' ? 'selected' : ''}>Number of traditions</option><option value="vit" ${sortSel === 'vit' ? 'selected' : ''}>Vitality index</option></select></label></div>
      <h3>${sortSel === 'vit' ? 'Heritage Vitality Index by state and UT' : 'Traditions documented per state and UT'}</h3>
      ${hbars(items)}
      <p class="muted" style="margin-top:1rem;font-size:.88rem">Select a bar to open that state on the map.</p>`;
  }
  if (STAT_TAB === 'category') {
    const cc = countBy(DB, x => x.cat);
    const items = Object.keys(CATS).map(c => ({ l: catName(c), v: cc[c] || 0, c: CATS[c].color }));
    const giBy = Object.keys(CATS).map(c => ({ l: catName(c), v: DB.filter(x => x.cat === c && x.tags.length).length, c: CATS[c].color }));
    body.innerHTML = `<div class="chart-cols"><div><h3>Share of each heritage stream</h3>${donut(items, 'traditions')}</div>
      <div><h3>Entries with UNESCO or GI recognition</h3>${hbars(giBy)}
      <h3 style="margin-top:1.4rem">Vitality index by stream</h3>${hbars(Object.keys(CATS).map(c => ({ l: catName(c), v: vitality(DB.filter(x => x.cat === c)), c: CATS[c].color })))}</div></div>`;
  }
  if (STAT_TAB === 'period') {
    const pc = countBy(DB, x => x.per);
    const items = Object.keys(PERIODS).map(p => ({ l: perName(p), sub: PERIODS[p].range, v: pc[p] || 0, c: PERIODS[p].color }));
    const stacked = Object.keys(PERIODS).map(p => {
      const list = DB.filter(x => x.per === p), cc = countBy(list, x => x.cat);
      return `<div class="hbar"><span class="lbl">${esc(perName(p))}</span><span class="track" style="display:flex">${Object.keys(CATS).map(c => `<span style="width:${pct(cc[c] || 0, list.length)}%;background:${CATS[c].color};height:100%" title="${esc(catName(c))}: ${cc[c] || 0}"></span>`).join('')}</span><span class="val">${list.length}</span></div>`;
    }).join('');
    body.innerHTML = `<h3>When did these traditions begin?</h3>${columns(items)}
      <h3 style="margin-top:1.6rem">Heritage streams within each period</h3><div class="hbars">${stacked}</div>
      <ul class="legend" style="flex-direction:row;flex-wrap:wrap;gap:.8rem;margin-top:.8rem">${Object.keys(CATS).map(c => `<li><i style="background:${CATS[c].color}"></i>${esc(catName(c))}</li>`).join('')}</ul>
      <p class="muted" style="margin-top:1rem;font-size:.88rem">Periods mark the earliest widely accepted origins. Many ancient traditions continue to evolve joyfully today.</p>`;
  }
  if (STAT_TAB === 'status') {
    const sc = countBy(DB, x => x.sta);
    const items = Object.keys(STATUS).map(s => ({ l: staName(s), v: sc[s] || 0, c: STATUS[s].color }));
    const byReg = REGIONS.map(r => ({ l: r, v: vitality(DB.filter(x => STATE[x.st].reg === r)), c: 'var(--peacock)' }));
    const priority = DB.filter(x => x.sta === 'V' || x.sta === 'N').sort((a, b) => STATUS[b.sta].order - STATUS[a.sta].order);
    body.innerHTML = `<div class="chart-cols"><div><h3>Vitality of documented traditions</h3>${donut(items, 'traditions')}</div>
      <div><h3>Vitality index by region</h3>${hbars(byReg)}</div></div>
      <h3 style="margin-top:1.6rem">Traditions ready to flourish with care (${priority.length})</h3>
      <p class="muted">These treasures are loved by their communities and will grow stronger with recording, teaching and new audiences.</p>
      <div class="d-related">${priority.map(x => `<button data-open="${x.id}">${CATS[x.cat].icon} ${esc(x.name)} <small class="muted">${esc(STATE[x.st].n)}</small></button>`).join('')}</div>`;
  }
  if (STAT_TAB === 'heat') {
    const max = Math.max(...STATES.flatMap(s => Object.keys(CATS).map(c => DB.filter(x => x.st === s.c && x.cat === c).length)));
    const rows = STATES.slice().sort((a, b) => a.n.localeCompare(b.n)).map(s => `<tr><th><a href="#map/${s.c}">${esc(s.n)}</a></th>${Object.keys(CATS).map(c => {
      const v = DB.filter(x => x.st === s.c && x.cat === c).length;
      return `<td style="background:${v ? `color-mix(in srgb, ${CATS[c].color} ${20 + Math.round(v / max * 80)}%, transparent)` : 'transparent'};color:${v ? 'var(--ink)' : 'var(--ink-3)'}">${v || '·'}</td>`;
    }).join('')}</tr>`).join('');
    body.innerHTML = `<h3>State × stream heatmap</h3><p class="muted">Deeper colour means more documented traditions. Empty cells are open invitations for new field surveys.</p>
      <div class="heat-wrap"><table class="heat"><thead><tr><th>State / UT</th>${Object.keys(CATS).map(c => `<th class="cat" title="${esc(catName(c))}">${CATS[c].icon}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
}
function renderInsights() {
  const byState = STATES.map(s => ({ s, n: DB.filter(x => x.st === s.c).length, v: vitality(DB.filter(x => x.st === s.c)) }));
  const top = byState.slice().sort((a, b) => b.n - a.n)[0];
  const topV = byState.filter(x => x.n >= 8).sort((a, b) => b.v - a.v)[0];
  const cc = countBy(DB, x => x.cat);
  const topCat = Object.keys(cc).sort((a, b) => cc[b] - cc[a])[0];
  const anc = DB.filter(x => x.per === 'AN').length;
  const healthy = DB.filter(x => ['T', 'S', 'R'].includes(x.sta)).length;
  const revived = DB.filter(x => x.sta === 'R').length;
  const regionTop = REGIONS.map(r => { const l = DB.filter(x => STATE[x.st].reg === r); const c = countBy(l, x => x.cat); const k = Object.keys(c).sort((a, b) => c[b] - c[a])[0]; return `${r}: ${k ? catName(k) : '—'}`; });
  $('#insightList').innerHTML = [
    `<b>${pct(healthy, DB.length)}%</b> of documented traditions are flourishing, steady or revived — a strong foundation for the future.`,
    `<b>${esc(top.s.n)}</b> holds the largest collection so far, with ${top.n} traditions.`,
    topV ? `<b>${esc(topV.s.n)}</b> shows the highest vitality index (${topV.v}) among states with eight or more entries.` : '',
    `<b>${esc(catName(topCat))}</b> is the largest stream, with ${cc[topCat]} entries, reflecting India's rich material culture.`,
    `<b>${anc}</b> traditions trace their roots to ancient times, proving remarkable continuity across millennia.`,
    `<b>${revived}</b> traditions have been revived and are rising again, showing that dedicated effort brings heritage back to strength.`,
    `Leading stream by region — ${regionTop.map(esc).join('; ')}.`
  ].filter(Boolean).map(s => `<li>${s}</li>`).join('');
}

/* =========================================================
   23. FIELD SURVEY
   ========================================================= */
let SURVEYS = store.get('surveys', []);
function renderSurveys() {
  $('#svList').innerHTML = SURVEYS.length ? SURVEYS.map((s, i) => `<div class="sv-item"><div><b>${esc(s.name)}</b><small>${esc(catName(s.cat))} — ${esc(s.district)}, ${esc(STATE[s.state] ? STATE[s.state].n : s.state)}</small><small>${esc(s.date)} by ${esc(s.surveyor)}</small></div><button data-del="${i}" aria-label="Delete entry">✕</button></div>`).join('')
    : '<p class="muted">Your saved entries will appear here. Each one is a new thread in the stream.</p>';
}
RENDER.survey = function () {
  const d = $('#surveyForm [name=date]');
  if (!d.value) d.value = new Date().toISOString().slice(0, 10);
  renderSurveys();
};
function exportSurveys(kind) {
  if (!SURVEYS.length) { toast('Save a survey entry first, then export'); return; }
  if (kind === 'json') download('lokdhara-field-surveys.json', JSON.stringify(SURVEYS, null, 2), 'application/json');
  else {
    const keys = ['date', 'surveyor', 'institution', 'state', 'district', 'village', 'geo', 'name', 'cat', 'period', 'status', 'community', 'count', 'transmission', 'occasion', 'desc', 'support'];
    download('lokdhara-field-surveys.csv', toCSV([keys, ...SURVEYS.map(s => keys.map(k => s[k]))]), 'text/csv');
  }
}

/* =========================================================
   24. DIGITAL ARCHIVE
   ========================================================= */
const MEDIA = {
  image: { label: 'Craft record', icon: '🖼️', cats: ['A'] },
  audio: { label: 'Audio record', icon: '🎧', cats: ['M', 'I'] },
  video: { label: 'Performance record', icon: '🎬', cats: ['D', 'F'] },
  text: { label: 'Manuscript & notes', icon: '📜', cats: ['O', 'K'] }
};
const mediaOf = tr => Object.keys(MEDIA).find(k => MEDIA[k].cats.includes(tr.cat));
const ARV = { page: 1, per: 24 };
function arFiltered() {
  const ty = $('#arType').value, c = $('#arCat').value, s = $('#arState').value, q = norm($('#arSearch').value.trim());
  return DB.filter(tr => (ty === 'all' || mediaOf(tr) === ty) && (c === 'all' || tr.cat === c) && (s === 'all' || tr.st === s) &&
    (!q || norm(tr.acc + ' ' + tr.name).includes(q)));
}
RENDER.archive = function () { ARV.page = 1; renderArchive(); };
function renderArchive() {
  const list = arFiltered(), shown = list.slice(0, ARV.page * ARV.per);
  $('#arCount').textContent = `${fmt(list.length)} archive records`;
  $('#arGrid').innerHTML = shown.length ? shown.map(tr => {
    const m = MEDIA[mediaOf(tr)];
    return `<article class="arc" data-id="${tr.id}" tabindex="0" role="button"><div class="arc-art">${mediaHTML(tr)}<span class="arc-type">${m.icon} ${m.label}</span></div>
      <div class="arc-body"><code>${tr.acc}</code><b>${esc(tr.name)}</b><small>${esc(STATE[tr.st].n)} — ${esc(perName(tr.per))}</small></div></article>`;
  }).join('') : '<div class="empty"><p><b>No records match.</b> Try a different type, category or state.</p></div>';
  $('#arMore').hidden = shown.length >= list.length;
  observeMedia($('#arGrid'));
}

/* =========================================================
   25. COMPARE
   ========================================================= */
const CMP_COLORS = ['#ffb627', '#00d8c8', '#ff3d8b'];
let CMP_MODE = 'states';
RENDER.compare = function (arg) {
  const opts = stateOptions();
  ['#cmpA', '#cmpB', '#cmpC'].forEach((id, i) => {
    const el = $(id), prev = el.value;
    optionList(el, opts, i === 2 ? '— none —' : null);
    el.value = prev || (i === 0 ? 'RJ' : i === 1 ? 'KL' : 'all');
  });
  if (arg && STATE[arg]) $('#cmpA').value = arg;
  $('#tradList').innerHTML = DB.map(tr => `<option value="${esc(tr.name)} (${esc(STATE[tr.st].n)})">`).join('');
  if (!$('#cmpT1').value) $('#cmpT1').value = 'Garba (Gujarat)';
  if (!$('#cmpT2').value) $('#cmpT2').value = 'Bihu Dance (Assam)';
  setCmpMode(CMP_MODE);
};
function setCmpMode(m) {
  CMP_MODE = m;
  $$('.seg [data-cmp]').forEach(b => b.classList.toggle('active', b.dataset.cmp === m));
  $('#cmpStates').hidden = m !== 'states';
  $('#cmpTrads').hidden = m !== 'traditions';
  m === 'states' ? renderCmpStates() : renderCmpTrads();
}
function renderCmpStates() {
  const codes = [$('#cmpA').value, $('#cmpB').value, $('#cmpC').value].filter(c => c && c !== 'all' && STATE[c]);
  const uniq = [...new Set(codes)];
  const data = uniq.map(c => {
    const list = DB.filter(x => x.st === c), cc = countBy(list, x => x.cat), pc = countBy(list, x => x.per);
    return { s: STATE[c], list, cc, pc };
  });
  $('#cmpRadar').innerHTML = radar(data.map((d, i) => ({ name: d.s.n, color: CMP_COLORS[i], values: Object.keys(CATS).map(c => d.cc[c] || 0) })), Object.keys(CATS).map(c => CATS[c].icon + ' ' + catName(c).split(' ').slice(-1)[0]));
  const rows = [
    ['Type', d => d.s.type], ['Capital', d => d.s.cap], ['Region', d => d.s.reg], ['Languages', d => d.s.lang],
    ['Traditions documented', d => d.list.length, true],
    ...Object.keys(CATS).map(c => [CATS[c].icon + ' ' + catName(c), d => d.cc[c] || 0, true]),
    ['Ancient-origin traditions', d => d.pc.AN || 0, true],
    ['UNESCO-recognised', d => d.list.filter(x => x.tags.includes('UNESCO')).length, true],
    ['GI-recognised', d => d.list.filter(x => x.tags.includes('GI')).length, true],
    ['Districts referenced', d => uniqueDistricts(d.list).size, true],
    ['Vitality index', d => vitality(d.list), true]
  ];
  $('#cmpTable').innerHTML = `<thead><tr><th></th>${data.map((d, i) => `<th style="color:${CMP_COLORS[i]}">${esc(d.s.n)}</th>`).join('')}</tr></thead><tbody>${rows.map(([l, fn, num]) => {
    const vals = data.map(fn), best = num ? Math.max(...vals) : null;
    return `<tr><th>${esc(l)}</th>${vals.map(v => `<td class="${num && data.length > 1 && v === best && v > 0 ? 'win' : ''}">${esc(v)}</td>`).join('')}</tr>`;
  }).join('')}</tbody>`;
}
function findTrad(v) {
  const n = norm(v.replace(/\s*\(.*\)\s*$/, '').trim());
  return DB.find(x => norm(x.name) === n) || DB.find(x => norm(x.name).includes(n));
}
function renderCmpTrads() {
  const a = findTrad($('#cmpT1').value || ''), b = findTrad($('#cmpT2').value || '');
  const card = tr => tr ? `<div class="cmp-card"><div class="d-art">${mediaHTML(tr, 'wide')}</div><div class="d-body">
      <div class="tmeta"><span class="chip" style="--c:${CATS[tr.cat].color}">${CATS[tr.cat].icon} ${esc(catName(tr.cat))}</span>${badgesHTML(tr)}</div>
      <h3 style="margin-top:.4rem">${esc(tr.name)}</h3><p>${esc(tr.desc)}</p>
      <dl class="d-grid"><div><dt>${esc(t('state'))}</dt><dd>${esc(STATE[tr.st].n)}</dd></div><div><dt>${esc(t('district'))}</dt><dd>${esc(tr.area)}</dd></div>
      <div><dt>${esc(t('period'))}</dt><dd>${esc(perName(tr.per))}</dd></div><div><dt>${esc(t('status'))}</dt><dd>${esc(staName(tr.sta))}</dd></div></dl>
      <button class="btn small ghost" data-open="${tr.id}">Open full record</button></div></div>`
    : '<div class="empty"><p>Type a tradition name and pick it from the suggestions.</p></div>';
  let common = '';
  if (a && b) {
    const shared = [];
    if (a.cat === b.cat) shared.push('the same heritage stream');
    if (a.st === b.st) shared.push('the same state');
    if (a.per === b.per) shared.push('the same period of origin');
    if (STATE[a.st].reg === STATE[b.st].reg) shared.push('the same cultural region');
    common = `<p class="lede" style="grid-column:1/-1">${shared.length ? `These traditions share ${shared.join(', ')} — a lovely example of how India's heritage connects across communities.` : 'These traditions come from different streams, regions and eras — together they show the wonderful breadth of India\'s heritage.'}</p>`;
  }
  $('#cmpTradOut').innerHTML = card(a) + card(b) + common;
  observeMedia($('#cmpTradOut'));
}

/* =========================================================
   26. RESEARCH & REPORTS
   ========================================================= */
function buildReports() {
  const total = DB.length;
  const sc = countBy(DB, x => x.sta), cc = countBy(DB, x => x.cat), pc = countBy(DB, x => x.per);
  const healthy = (sc.T || 0) + (sc.S || 0) + (sc.R || 0);
  const byState = STATES.map(s => { const l = DB.filter(x => x.st === s.c); return { s, n: l.length, v: vitality(l), gi: l.filter(x => x.tags.includes('GI')).length, u: l.filter(x => x.tags.includes('UNESCO')).length }; });
  const topStates = byState.slice().sort((a, b) => b.n - a.n).slice(0, 8);
  const giList = DB.filter(x => x.tags.includes('GI'));
  const giByState = byState.filter(x => x.gi).sort((a, b) => b.gi - a.gi);
  const vitSorted = byState.slice().sort((a, b) => b.v - a.v || b.n - a.n);
  const regions = REGIONS.map(r => {
    const l = DB.filter(x => STATE[x.st].reg === r), c = countBy(l, x => x.cat);
    const lead = Object.keys(c).sort((a, b) => c[b] - c[a]);
    return { r, n: l.length, v: vitality(l), states: STATES.filter(s => s.reg === r).length, lead: lead.slice(0, 2).map(catName).join(' and ') };
  });
  const tbl = (head, rows) => `<div class="r-table-wrap"><table class="r-table"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const figs = arr => `<div class="report-figs">${arr.map(([v, l]) => `<div><b>${v}</b><span>${esc(l)}</span></div>`).join('')}</div>`;

  return [
    {
      id: 'state-2026', title: 'State of India\'s Folk Heritage 2026',
      sum: 'An evidence-based overview of the living traditions documented in Lokdhara, with national patterns and priorities.',
      html: `${figs([[total, 'traditions documented'], [STATES.length, 'states and UTs covered'], [pct(healthy, total) + '%', 'flourishing, steady or revived'], [vitality(DB), 'national vitality index'], [DISTRICT_TOTAL, 'districts in the register'], [giList.length, 'GI-recognised entries'], [UNESCO.length, 'UNESCO elements for India']])}
        <h3>Executive summary</h3>
        <p>India's folk heritage is vibrant, diverse and deeply rooted. Of the ${total} traditions in this edition, ${sc.T || 0} are flourishing, ${sc.S || 0} are steady and living, and ${sc.R || 0} have been revived and are rising again. Together they make up ${pct(healthy, total)}% of the collection — clear evidence that communities across the country continue to value, practise and pass on their heritage with pride.</p>
        <p>A further ${sc.N || 0} traditions are marked as nurture priorities and ${sc.V || 0} as revival priorities. These are loved by their communities and offer the greatest returns for documentation, teaching and new audiences.</p>
        <h3>Findings by heritage stream</h3>
        <ul>${Object.keys(CATS).map(c => `<li><b>${esc(catName(c))}</b>: ${cc[c] || 0} entries (${pct(cc[c] || 0, total)}%), vitality index ${vitality(DB.filter(x => x.cat === c))}.</li>`).join('')}</ul>
        <h3>States with the largest collections</h3>
        ${tbl(['State / UT', 'Traditions', 'Vitality index', 'GI entries', 'UNESCO'], topStates.map(x => [esc(x.s.n), x.n, x.v, x.gi, x.u]))}
        <h3>Continuity across time</h3>
        <p>${pc.AN || 0} traditions trace their roots to ancient times, ${pc.EM || 0} to the early medieval period, ${pc.MD || 0} to the medieval era, ${pc.CL || 0} to the colonial era and ${pc.MO || 0} began after Independence. This spread shows a civilisation that keeps its oldest practices alive while constantly creating new ones.</p>`
    },
    {
      id: 'chronology', title: '12,000 Years of Living Tradition — A Chronology',
      sum: 'From the rock shelters of Bhimbetka to the digital archives of 2026, the story of India\'s folk culture in one continuous thread.',
      html: `<p>Folk traditions are rarely dated by a single event; they grow over centuries through communities, pilgrimages, courts and markets. The milestones below mark key moments of creation, recording and recognition.</p>
        <ol class="timeline">${TIMELINE.map(([w, era, txt]) => `<li style="--era:${ERA_COLORS[era] || 'var(--haldi)'}"><time>${esc(w)}</time><p><span class="era-tag">${esc(era)}</span>${esc(txt)}</p></li>`).join('')}</ol>`
    },
    {
      id: 'unesco', title: 'Global Recognition — India on the UNESCO Lists',
      sum: 'India\'s elements on the Representative List of the Intangible Cultural Heritage of Humanity, and what they teach us.',
      html: `${figs([[UNESCO.length, 'elements inscribed (2008–2025)'], ['2005', 'India ratified the 2003 Convention'], ['2025', 'Intergovernmental Committee hosted in New Delhi']])}
        ${tbl(['Year', 'Element', 'Region'], UNESCO.map(([y, n, w]) => [y, esc(n), esc(w)]))}
        <h3>What the inscriptions show</h3>
        <ul><li><b>Breadth.</b> Theatre, chanting, dance, craft, festival and wellness traditions are all represented.</li>
        <li><b>Community at the centre.</b> Each element is kept alive by practitioners, families and neighbourhoods rather than by institutions alone.</li>
        <li><b>A growing pipeline.</b> Many traditions in this database — from Theyyam to Bihu, Warli painting to living root bridges — are strong candidates for future national and international recognition.</li></ul>`
    },
    {
      id: 'gi', title: 'Geographical Indications — Protecting Craft Identity',
      sum: 'How GI tags protect the names, livelihoods and pride of craft and farming communities.',
      html: `${figs([['1999', 'GI of Goods Act passed'], ['2003', 'Act came into force'], ['2004', 'Darjeeling Tea, India\'s first GI'], ['600+', 'registered GIs nationwide'], [giList.length, 'GI entries in this database']])}
        <p>A Geographical Indication certifies that a product comes from a specific place and carries qualities owed to that origin. For artisans, it protects a heritage name from imitation, supports fair prices and builds consumer trust.</p>
        <h3>GI-recognised entries by state</h3>
        ${tbl(['State / UT', 'GI entries', 'Examples'], giByState.map(x => [esc(x.s.n), x.gi, esc(giList.filter(g => g.st === x.s.c).slice(0, 4).map(g => g.name).join(', '))]))}
        <h3>Opportunities</h3>
        <ul><li><b>Authorised users.</b> Registering more artisans as authorised users helps benefits reach every workshop.</li>
        <li><b>Consumer awareness.</b> GI logos on packaging and online listings help buyers choose authentic products.</li>
        <li><b>Youth enterprise.</b> Design training and e-commerce skills open new markets for the next generation of makers.</li></ul>`
    },
    {
      id: 'vitality', title: 'Heritage Vitality Index — Method and Results',
      sum: 'A simple, transparent score that summarises how strongly traditions are being practised and passed on.',
      html: `<h3>Method</h3>
        <p>Each tradition receives a score based on its vitality status: Flourishing 100, Steady &amp; Living 80, Revived &amp; Rising 75, Nurture Priority 55 and Revival Priority 35. A state's index is the average score of its traditions, from 0 to 100. The index celebrates strength while showing where extra care will have the biggest impact.</p>
        ${tbl(['Rank', 'State / UT', 'Vitality index', 'Traditions'], vitSorted.map((x, i) => [i + 1, esc(x.s.n), x.v, x.n]))}
        <p class="muted">The index reflects entries currently in Lokdhara. It will become more precise as field surveys add depth for every district.</p>`
    },
    {
      id: 'regions', title: 'Cultural Regions of India',
      sum: 'How landscape, language and livelihood shape the character of each region\'s heritage.',
      html: `${tbl(['Region', 'States & UTs', 'Traditions', 'Vitality index', 'Leading streams'], regions.map(x => [esc(x.r), x.states, x.n, x.v, esc(x.lead)]))}
        <h3>Regional portraits</h3>
        <ul><li><b>North.</b> Himalayan deity processions, Punjabi harvest energy and the shawls and carpets of the hills and plains.</li>
        <li><b>Central.</b> Gond and Bhil art, Bundeli ballads and forest knowledge of the Baiga and Maria communities.</li>
        <li><b>East.</b> Chhau, Baul and Madhubani, the scroll-singers of Bengal and Odisha, and the Sun worship of Chhath.</li>
        <li><b>North-East.</b> Community festivals, rice-fish farming, living root bridges and a remarkable weaving culture.</li>
        <li><b>West.</b> Garba, Lavani and desert music, alongside the richest textile traditions of India.</li>
        <li><b>South.</b> Ritual theatre such as Theyyam and Yakshagana, temple arts, bronze casting and ancient water tanks.</li>
        <li><b>Islands.</b> Seafaring knowledge, canoe building and some of the world's oldest languages.</li></ul>`
    },
    {
      id: 'bearers', title: 'Honouring the Tradition Bearers',
      sum: 'Masters whose lives carry India\'s folk heritage, recognised with the nation\'s highest civilian honours.',
      html: `<p>Behind every tradition stand people who practise, teach and renew it. National recognition of folk and tribal artists has grown steadily, inspiring young people to take up their community's art.</p>
        ${tbl(['Tradition bearer', 'Tradition', 'State', 'Honour'], MASTERS.map(([n, tr, s, h]) => [`<b>${esc(n)}</b>`, esc(tr), esc(STATE[s].n), esc(h)]))}
        <h3>Ways to honour tradition bearers</h3>
        <ul><li>Credit artists by name on every recording, image and publication.</li><li>Pay fair fees for performances, workshops and interviews.</li><li>Invite masters to schools and universities as visiting teachers.</li></ul>`
    },
    {
      id: 'method', title: 'Methodology — Cultural Mapping and Field Surveys',
      sum: 'The framework Lokdhara uses to document traditions accurately, ethically and consistently.',
      html: `<h3>Data model</h3>
        <p>Every record carries a name, heritage stream, state, districts and localities, period of origin, vitality status, description, recognition tags and an accession number. This structure allows analysis by state, category, period and status.</p>
        <h3>Survey process</h3>
        <ol><li><b>Scoping.</b> Identify traditions through village records, cultural mapping portals and conversations with elders.</li>
        <li><b>Free, prior and informed consent.</b> Explain the purpose, and document only what the community wishes to share.</li>
        <li><b>Recording.</b> Capture audio, photographs, video and notes, with the names of practitioners.</li>
        <li><b>Description.</b> Complete the standard survey form, including transmission methods and support needs.</li>
        <li><b>Validation.</b> Review the record with practitioners and correct it together.</li>
        <li><b>Archiving.</b> Assign an accession number and store master files in durable open formats.</li></ol>
        <h3>Recommended archival formats</h3>
        ${tbl(['Media', 'Master format', 'Access format'], [['Audio', 'WAV, 24-bit / 96 kHz', 'MP3 or AAC'], ['Images', 'TIFF, uncompressed', 'JPEG or WebP'], ['Video', 'Lossless or high-bitrate MOV/MKV', 'MP4 (H.264)'], ['Text', 'Unicode plain text or PDF/A', 'HTML']])}
        <h3>Preservation practice</h3>
        <ul><li>Keep three copies on two kinds of storage, with one stored off-site.</li><li>Record metadata in the local script as well as in English.</li><li>Review files every few years and migrate formats as technology changes.</li></ul>`
    },
    {
      id: 'roadmap', title: 'Roadmap 2026–2035 — Recommendations',
      sum: 'Practical, positive steps for communities, institutions and citizens to help every tradition flourish.',
      html: `<ol><li><b>District heritage registers.</b> Build a living register of traditions for every district, linked to village cultural mapping.</li>
        <li><b>Heritage in every classroom.</b> Include local dances, songs, crafts and stories in school activities and projects.</li>
        <li><b>Guru–shishya fellowships.</b> Support masters to teach young learners in revival-priority traditions.</li>
        <li><b>Artisan livelihoods.</b> Expand GI authorised users, design support and fair digital marketplaces.</li>
        <li><b>Festival and village tourism.</b> Encourage respectful, community-led tourism that shares income with tradition bearers.</li>
        <li><b>Language documentation.</b> Record oral literature in the mother tongues in which it lives.</li>
        <li><b>Open digital commons.</b> Publish records under open licences with clear credit to communities.</li>
        <li><b>Youth ambassadors.</b> Train students as field surveyors and digital storytellers for their own regions.</li>
        <li><b>Traditional knowledge for sustainability.</b> Apply water, farming and forest wisdom to today's climate challenges.</li>
        <li><b>Recognition pipeline.</b> Prepare strong national and international nominations for outstanding traditions.</li></ol>
        <p>Each step is achievable, affordable and rooted in what communities are already doing well. Together they can ensure that the stream of India's folk heritage keeps flowing for generations.</p>`
    }
  ];
}
let REPORTS = [];
RENDER.research = function (arg) {
  REPORTS = buildReports();
  $('#reportIndex').innerHTML = REPORTS.map((r, i) => `<a href="#research/${r.id}" data-rep="${r.id}">${i + 1}. ${esc(r.title)}</a>`).join('');
  $('#reports').innerHTML = REPORTS.map((r, i) => `<details class="report" id="rep-${r.id}" ${(arg ? arg === r.id : i === 0) ? 'open' : ''}>
    <summary><span class="rn">${i + 1}</span><div><h2>${esc(r.title)}</h2><p>${esc(r.sum)}</p></div><span class="chev">▾</span></summary>
    <div class="report-body">${r.html}
      <div class="report-actions"><button class="btn small ghost" data-print="${r.id}">Print report</button><button class="btn small ghost" data-dl="${r.id}">Download as text</button></div>
    </div></details>`).join('');
  if (arg && $('#rep-' + arg)) setTimeout(() => $('#rep-' + arg).scrollIntoView({ behavior: 'smooth' }), 60);
};
function reportText(id) {
  const r = REPORTS.find(x => x.id === id);
  const div = document.createElement('div');
  div.innerHTML = r.html.replace(/<\/(p|li|h3|tr|div)>/g, '\n').replace(/<\/t[dh]>/g, '\t');
  return `LOKDHARA — ${r.title}\n${r.sum}\n\n${div.textContent.replace(/\n{3,}/g, '\n\n').trim()}\n\nSource: Lokdhara Cultural Database, 2026`;
}

/* =========================================================
   27. CONTACT
   ========================================================= */
RENDER.contact = function () {};
const REFS = { page: 1, per: 40 };
function renderRefs() {
  const shown = DB.slice(0, REFS.page * REFS.per);
  const done = DB.filter(x => IMG_CACHE[imgKey(x)]).length;
  $('#refsStatus').textContent = `${done} of ${DB.length} image references loaded.`;
  $('#refsTable').innerHTML = `<thead><tr><th>Image</th><th>Tradition</th><th>${esc(t('state'))}</th><th>Reference</th></tr></thead><tbody>${shown.map(tr =>
    `<tr data-id="${tr.id}"><td class="thumb">${mediaHTML(tr, 'mini')}</td><td><b>${esc(tr.name)}</b><br><small class="muted">${tr.acc}</small></td><td>${esc(STATE[tr.st].n)}</td><td class="ref" data-ref="${tr.id}">${creditHTML(IMG_CACHE[imgKey(tr)])}</td></tr>`).join('')}</tbody>`;
  observeMedia($('#refsTable'));
}
RENDER.sources = function () { REFS.page = 1; renderRefs(); };
async function loadAllRefs() {
  const btn = $('#refsLoad');
  if (!navigator.onLine) { toast('Connect to the internet to load image references'); return; }
  btn.disabled = true;
  REFS.page = Math.ceil(DB.length / REFS.per);
  renderRefs();
  let done = 0;
  await Promise.all(DB.map(tr => getImage(tr).then(() => { done++; if (done % 10 === 0 || done === DB.length) $('#refsStatus').textContent = `Loading… ${done} of ${DB.length} checked.`; })));
  btn.disabled = false;
  renderRefs();
  toast('All image references loaded');
}
function exportRefs() {
  download('lokdhara-image-references.csv', toCSV([['Accession', 'Tradition', 'State/UT', 'Image title', 'Author', 'Licence', 'Source', 'Source page', 'Image URL'],
    ...DB.map(tr => { const im = IMG_CACHE[imgKey(tr)] || {}; return [tr.acc, tr.name, STATE[tr.st].n, im.title || '', im.artist || '', im.license || '', im.source || '', im.page || '', im.src || '']; })]), 'text/csv');
}

/* =========================================================
   28. DRAWER & NAV
   ========================================================= */
function openDrawer() {
  $('#drawer').classList.add('open');
  $('#drawerScrim').hidden = false;
  $('#menuBtn').setAttribute('aria-expanded', 'true');
  setTimeout(() => $('#drawerClose').focus(), 50);
}
function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#drawerScrim').hidden = true;
  $('#menuBtn').setAttribute('aria-expanded', 'false');
}
function setTheme(th) {
  document.documentElement.dataset.theme = th;
  store.set('theme', th);
  $('meta[name=theme-color]').setAttribute('content', th === 'day' ? '#f3faf9' : '#06121c');
  if (CURRENT === 'map') renderMap();
}

/* =========================================================
   29. EVENTS
   ========================================================= */
function bindEvents() {
  window.addEventListener('hashchange', route);
  $('#langSel').addEventListener('change', e => setLang(e.target.value));
  $('#themeBtn').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'day' ? 'night' : 'day'));
  $('#menuBtn').addEventListener('click', openDrawer);
  $('#bottomMore').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  $('#drawerScrim').addEventListener('click', closeDrawer);
  $('#navMore').addEventListener('click', e => {
    e.stopPropagation();
    const pop = $('#navPop'), open = !pop.classList.contains('open');
    pop.classList.toggle('open', open);
    $('#navMore').setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => { if (!e.target.closest('#navPop')) $('#navPop').classList.remove('open'); });
  $('#gtBtn').addEventListener('click', loadFullTranslate);
  $('#gtBtnDrawer').addEventListener('click', () => { closeDrawer(); loadFullTranslate(); });

  /* Global delegated clicks: cards, related chips, map lists */
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open && !open.closest('#palResults')) { e.preventDefault(); location.hash = 't/' + open.dataset.open; return; }
    if (e.target.closest('a[target=_blank]')) return;
    const card = e.target.closest('.tcard, .arc');
    if (card) { location.hash = 't/' + card.dataset.id; return; }
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest && e.target.closest('.tcard, .arc');
    if (card && e.target === card) { e.preventDefault(); location.hash = 't/' + card.dataset.id; }
  });

  /* Detail dialog */
  const dlg = $('#detail');
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-close]')) { closeDetail(); return; }
    const act = e.target.closest('[data-act]');
    if (act) detailAction(act.dataset.act, act);
  });
  dlg.addEventListener('close', () => {
    stopSpeech();
    if (location.hash.startsWith('#t/')) history.replaceState(null, '', PREV_HASH.startsWith('#t/') ? '#' + CURRENT : PREV_HASH);
  });

  /* Command palette */
  $('#searchBtn').addEventListener('click', openPalette);
  document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    else if (e.key === '/' && !typing && !$('#palette').open) { e.preventDefault(); openPalette(); }
  });
  $('#palInput').addEventListener('input', e => renderPalette(e.target.value));
  $('#palInput').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); palMove(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); palMove(-1); }
    if (e.key === 'Enter') { e.preventDefault(); palChoose($$('#palResults li[data-i]')[palIndex]); }
  });
  $('#palResults').addEventListener('click', e => palChoose(e.target.closest('li[data-i]')));
  $('#palette').addEventListener('click', e => { if (e.target === $('#palette')) $('#palette').close(); });

  /* Database */
  $('#catTabs').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    DBV.cat = b.dataset.cat; DBV.page = 1;
    history.replaceState(null, '', '#database/' + DBV.cat);
    renderDbTabs(); renderDbGrid();
  });
  let dbT;
  $('#dbSearch').addEventListener('input', () => { clearTimeout(dbT); dbT = setTimeout(() => { DBV.page = 1; renderDbGrid(); }, 160); });
  ['#fState', '#fPeriod', '#fStatus', '#fSort', '#fSaved', '#fUnesco', '#fGI'].forEach(s => $(s).addEventListener('change', () => { DBV.page = 1; renderDbGrid(); }));
  $('#dbMore').addEventListener('click', () => { DBV.page++; renderDbGrid(); });
  $('#dbGrid').addEventListener('click', e => { if (e.target.id === 'dbReset') resetDbFilters(); });
  $$('.db-actions [data-view]').forEach(b => b.addEventListener('click', () => {
    DBV.view = b.dataset.view;
    $$('.db-actions [data-view]').forEach(x => x.classList.toggle('active', x === b));
    renderDbGrid();
  }));
  $('#dbTableWrap').addEventListener('click', e => { if (e.target.closest('a')) return; const r = e.target.closest('tr[data-id]'); if (r) location.hash = 't/' + r.dataset.id; });
  $('#refsLoad').addEventListener('click', loadAllRefs);
  $('#refsCsv').addEventListener('click', exportRefs);
  $('#refsTable').addEventListener('click', e => { if (e.target.closest('a')) return; const r = e.target.closest('tr[data-id]'); if (r) location.hash = 't/' + r.dataset.id; });
  $('#exportCsv').addEventListener('click', () => exportDb('csv'));
  $('#exportJson').addEventListener('click', () => exportDb('json'));

  /* Map */
  const mapSvg = $('#indiaMap');
  mapSvg.addEventListener('click', e => { const g = e.target.closest('[data-st]'); if (g) selectState(g.dataset.st); });
  mapSvg.addEventListener('keydown', e => { const g = e.target.closest('[data-st]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectState(g.dataset.st); } });
  $('#mapMode').addEventListener('change', renderMap);
  $('#mapPanel').addEventListener('click', e => {
    const st = e.target.closest('[data-st]');
    if (st) { selectState(st.dataset.st); return; }
    const d = e.target.closest('[data-dist]');
    if (d) { MAPV.dist = d.dataset.dist || null; renderMapPanel(); return; }
    const c = e.target.closest('[data-cmp-state]');
    if (c) { e.preventDefault(); location.hash = 'compare/' + c.dataset.cmpState; }
  });

  /* Statistics */
  $('#statTabs').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    STAT_TAB = b.dataset.tab;
    $$('#statTabs button').forEach(x => x.classList.toggle('active', x === b));
    renderStatTab();
  });
  $('#statBody').addEventListener('change', e => {
    if (e.target.id === 'stCat') $('#statBody').dataset.cat = e.target.value;
    if (e.target.id === 'stSort') $('#statBody').dataset.sort = e.target.value;
    renderStatTab();
  });
  const goLink = e => { const l = e.target.closest('[data-link]'); if (l) location.hash = l.dataset.link; };
  $('#statBody').addEventListener('click', goLink);
  $('#statBody').addEventListener('keydown', e => { if (e.key === 'Enter') goLink(e); });

  /* Survey */
  $('#surveyForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) {
      const bad = f.querySelector(':invalid');
      $('#svMsg').textContent = 'Please complete the highlighted field: ' + (bad.closest('.field, .check')?.querySelector('span')?.textContent || bad.name).replace(' *', '') + '.';
      $('#svMsg').style.color = 'var(--sindoor)';
      bad.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(f).entries());
    data.savedAt = new Date().toISOString();
    SURVEYS.unshift(data);
    store.set('surveys', SURVEYS);
    renderSurveys();
    $('#svMsg').style.color = '';
    $('#svMsg').textContent = `Saved "${data.name}". Thank you for preserving a tradition of ${data.district}.`;
    const keep = { surveyor: data.surveyor, institution: data.institution, state: data.state };
    f.reset();
    Object.entries(keep).forEach(([k, v]) => { f.elements[k].value = v; });
    f.elements.date.value = new Date().toISOString().slice(0, 10);
  });
  $('#svList').addEventListener('click', e => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    SURVEYS.splice(Number(b.dataset.del), 1);
    store.set('surveys', SURVEYS);
    renderSurveys();
    toast('Entry removed');
  });
  $('#svCsv').addEventListener('click', () => exportSurveys('csv'));
  $('#svJson').addEventListener('click', () => exportSurveys('json'));
  $('#svLocate').addEventListener('click', () => {
    if (!navigator.geolocation) { toast('Location is not available on this device'); return; }
    toast('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      p => { $('#svGeo').value = p.coords.latitude.toFixed(5) + ', ' + p.coords.longitude.toFixed(5); toast('Location added'); },
      () => toast('Location permission was not given — you can type coordinates instead'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  /* Archive */
  ['#arType', '#arCat', '#arState'].forEach(s => $(s).addEventListener('change', () => { ARV.page = 1; renderArchive(); }));
  let arT;
  $('#arSearch').addEventListener('input', () => { clearTimeout(arT); arT = setTimeout(() => { ARV.page = 1; renderArchive(); }, 160); });
  $('#arMore').addEventListener('click', () => { ARV.page++; renderArchive(); });

  /* Compare */
  $$('.seg [data-cmp]').forEach(b => b.addEventListener('click', () => setCmpMode(b.dataset.cmp)));
  ['#cmpA', '#cmpB', '#cmpC'].forEach(s => $(s).addEventListener('change', renderCmpStates));
  ['#cmpT1', '#cmpT2'].forEach(s => $(s).addEventListener('change', renderCmpTrads));

  /* Research */
  $('#reports').addEventListener('click', e => {
    const p = e.target.closest('[data-print]'), d = e.target.closest('[data-dl]');
    if (p) {
      $$('#reports details').forEach(x => { x.dataset.wasOpen = x.open; x.open = x.id === 'rep-' + p.dataset.print; });
      window.print();
      $$('#reports details').forEach(x => { x.open = x.dataset.wasOpen === 'true'; });
    }
    if (d) download('lokdhara-' + d.dataset.dl + '.txt', reportText(d.dataset.dl));
  });
  $('#reportIndex').addEventListener('click', e => {
    const a = e.target.closest('[data-rep]');
    if (!a) return;
    e.preventDefault();
    const el = $('#rep-' + a.dataset.rep);
    el.open = true;
    el.scrollIntoView({ behavior: 'smooth' });
  });

  /* Contact */
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, msg = $('#ctMsg');
    if (!f.checkValidity()) {
      const bad = f.querySelector(':invalid');
      msg.style.color = 'var(--sindoor)';
      msg.textContent = bad.type === 'email' && bad.value ? 'Please enter a valid email address, such as name@example.com.' : 'Please complete the highlighted field.';
      bad.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(f).entries());
    const list = store.get('contributions', []);
    list.unshift({ ...data, at: new Date().toISOString() });
    store.set('contributions', list);
    const stn = STATE[data.state] ? STATE[data.state].n : '';
    const body = `Name: ${data.name}\nEmail: ${data.email}\nType: ${data.type}\nState/UT: ${stn}\n\n${data.msg}`;
    msg.style.color = '';
    msg.innerHTML = `Thank you, ${esc(data.name)}! Your contribution is saved. <a href="mailto:hello@lokdhara.org?subject=${encodeURIComponent('Lokdhara: ' + data.type)}&body=${encodeURIComponent(body)}">Send it by email</a> to share it with the team.`;
    f.reset();
  });

  /* Print: open everything in the active research page */
  window.addEventListener('beforeprint', () => { if (CURRENT === 'research' && !$$('#reports details').some(d => d.open)) $$('#reports details').forEach(d => { d.open = true; }); });
}

/* =========================================================
   30. INITIALISE
   ========================================================= */
function init() {
  setTheme(store.get('theme', matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night'));
  applyI18n();
  fillSelects();
  bindEvents();
  route();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();