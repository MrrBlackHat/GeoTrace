/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeotaggedSample } from '../src/types';

export const geotaggedDataset: GeotaggedSample[] = [
  {
    id: 'tokyo-shibuya',
    title: 'Neon Crossing, Shibuya, Tokyo',
    location: { lat: 35.6595, lng: 139.7005 },
    locationLabel: 'Tokyo, Japan',
    source: 'Flickr',
    description: 'Dense modern high-rise buildings covered in bright neon panels and massive LED screens. Thousands of pedestrians walking through giant diagonal crosswalks. Left-hand side traffic signs, compact white and yellow license plate vehicles, and asphalt roads.',
    terrain: 'Flat coastal plain surrounded by low rolling urban hills.',
    vegetation: 'Sparse street ginkgo trees with structured wire enclosures; manicured bonsai-like pines in small garden pockets.',
    architecture: 'High-density concrete and steel skyscrapers, modern glass facades, narrow alleys filled with wire telephone poles, bilingual Japanese/English signs.',
    climate: 'Temperate humid, bright sunny or foggy clean skies, moist atmosphere.'
  },
  {
    id: 'reykjavik-nordic',
    title: 'Volcanic Coastal Plain, Reykjavik',
    location: { lat: 64.1466, lng: -21.9426 },
    locationLabel: 'Reykjavik, Iceland',
    source: 'Mapillary',
    description: 'Rugged jagged basalt volcanic plains covered in dark green moss and purple lupine flowers. Coastal shoreline with deep blue glacial water. Low-rise colorful corrugated iron-clad buildings with minimalist Nordic A-frame roofs under a pale pastel sky.',
    terrain: 'Vast barren volcanic fields, jagged lava rocks, and dramatic ocean bays.',
    vegetation: 'Almost no tall trees; sparse dwarf birches, sprawling spongy arctic moss, and massive fields of vibrant purple lupines.',
    architecture: 'Minimalist low-rise Scandinavian buildings, brightly colored tin or metal clad walls, expansive double-paned glass windows, and concrete sea-walls.',
    climate: 'Subpolar maritime, cold overcast overcast sky, crisp extremely clear wind-swept air.'
  },
  {
    id: 'cairo-giza',
    title: 'Desert Edge near Giza Plateau, Cairo',
    location: { lat: 29.9792, lng: 31.1342 },
    locationLabel: 'Cairo, Egypt',
    source: 'Google Open Images',
    description: 'Vast rolling dry golden sand dunes meets dusty unpainted ochre sandy limestone brick apartment buildings with flat roofs. Distant sandstorms or dusty hazy skies. Vehicles covered in light beige dust navigating congested desert dirt roads.',
    terrain: 'Extremely flat Nile river basin abruptly transitioning into massive elevated sandy desert tables and dunes.',
    vegetation: 'Highly localized date palms in small clusters, rare thirsty weeds, and irrigated shrubs in dry clay pottery.',
    architecture: 'Incomplete brick block concrete buildings with exposed rebar on flat roofs, sandy sandstone and limestone coloring, flat Mediterranean design, arches.',
    climate: 'Arid desert, blisteringly hot and sunny, yellowish-grey dust haze hang on the horizon.'
  },
  {
    id: 'rio-ipanema',
    title: 'Sugarloaf Estuary, Rio de Janeiro',
    location: { lat: -22.9519, lng: -43.1658 },
    locationLabel: 'Rio de Janeiro, Brazil',
    source: 'Flickr',
    description: 'Massive sheer granite monolithic mountains (Sugarloaf and Corcovado) covered in deep green tropical foliage rising straight above wide white sand beaches. Curving mosaic stone promenades with black and white wavy patterns.',
    terrain: 'Spectacular jungle-covered granite mountains meets sweeping ocean bays and crescent sandy beaches.',
    vegetation: 'Lush Atlantic rainforest canopy, giant tropical ferns, exotic hibiscus, towering coconut palms, and sprawling sea grape vines.',
    architecture: 'High-density post-war modern tower blocks with wrap-around balconies, nestled adjacent to dramatic brick hill favelas with corrugated iron roofing.',
    climate: 'Tropical wet-and-dry, intense tropical sunshine, hazy humid sea mist, frequent passing convective clouds.'
  },
  {
    id: 'swiss-zermatt',
    title: 'Matterhorn Alpine Valley, Zermatt',
    location: { lat: 46.0207, lng: 7.7491 },
    locationLabel: 'Alpine Valleys, Switzerland',
    source: 'Custom',
    description: 'Jagged colossal steep snow-capped rock mountains (Matterhorn pinnacle) surrounding a deep green glacial river valley. Chalets constructed from dark timber boards with white wooden frames and heavy grey slate roofs.',
    terrain: 'Extreme dramatic alpine terrain with steep jagged peaks, active glacial moraines, and fast-flowing turquoise creeks.',
    vegetation: 'Dense alpine coniferous forests filled with tall dark spruces, larches, and green meadows sprinkled with white edelweiss wildflowers.',
    architecture: 'Traditional Swiss chalet timber framing, stone foundations, large wooden balconies filled with bright red geranium pansies.',
    climate: 'Alpine montane, snowy crisp air, dark blue sky contrasted by pure white cumulus clouds.'
  },
  {
    id: 'sydney-harbour',
    title: 'Port Jackson Sandstone Coast, Sydney',
    location: { lat: -33.8568, lng: 151.2153 },
    locationLabel: 'Sydney, Australia',
    source: 'Mapillary',
    description: 'Deep blue salt-water harbor bays indented by yellow-brown sandstone cliffs and green headlands. Distinct architecture of red-brick bungalows, wrap-around iron lace verandas, and iconic sails under high midday sunshine.',
    terrain: 'Eroded sandstone plateau cut by drowned coastal river valleys creating a highly segmented bay pattern.',
    vegetation: 'Gnarled gray-green eucalyptus gum trees, stringybarks, exotic tall palm plantings, and dry coastal scrub.',
    architecture: 'Spacious brick suburban homes with terracotta tiled roofs, modern glass skyscrapers on the harbor edge, and sandstone public buildings.',
    climate: 'Humid subtropical, temperate warmth, bright cloudless harsh UV skies, clear coastal breeze.'
  },
  {
    id: 'sahara-merzouga',
    title: 'Erg Chebbi Sand Dunes, Merzouga',
    location: { lat: 31.0979, lng: -4.0033 },
    locationLabel: 'Sahara Desert, Morocco',
    source: 'Custom',
    description: 'Massive towering, orange-red sand dunes forming wind-blown sharp ridges. Absolute lack of structures, except for occasional low nomadic tents made of heavy dark woven wool blankets, and camel caravan shadows.',
    terrain: 'Extremely dynamic sea of sand (erg) consisting of pure quartz sand grains towering over black gravel flats (reg).',
    vegetation: 'Nearly sterile; rare tough woody dry camel thorns, salt bushes, and extreme desert xerophytes.',
    architecture: 'Nomadic temporary wool tents, low earth-adobe brick bivouacs styled in reddish mud finishing.',
    climate: 'Hot hyper-arid desert, blazing sun, shimmering heat distortion, deep contrast between sunlit faces and dark shadows.'
  },
  {
    id: 'monument-valley',
    title: 'Sandstone Buttes, Monument Valley',
    location: { lat: 36.9980, lng: -110.0984 },
    locationLabel: 'Monument Valley, Utah, USA',
    source: 'Flickr',
    description: 'Giant isolated red sandstone buttes and mesas rising vertically from a vast, flat, orange-red dirt desert floor. Clear deep blue desert sky. Single-lane sand trails with sparse pickup truck dust plumes.',
    terrain: 'Eroded semi-desert plateau with colossal flat-topped buttes, red silt plains, and dry arroyos.',
    vegetation: 'Sparse low desert sagebrush, prickly pear cacti, tough desert bunchgrass, and rare gnarled desert junipers.',
    architecture: 'Rustic low wooden visitor cabins, simple Navajo wood-and-mud hogan structures blending into the red earth.',
    climate: 'Cold semi-arid, dry scorching heat in summer, freezing dry winters, extreme high atmospheric visibility.'
  },
  {
    id: 'amalfi-coast',
    title: 'Clifftop Cliffside Terraces, Amalfi',
    location: { lat: 40.6341, lng: 14.6027 },
    locationLabel: 'Amalfi Coast, Italy',
    source: 'Google Open Images',
    description: 'Brightly colored, pastel pink, yellow, and white stucco Mediterranean villas stacked on vertical mountain cliffs plunging into a deep azure sea. Narrow single-lane mountain roads winding with stone guardrails.',
    terrain: 'Precipitous limestone sea cliffs carved by deep ravines, overlooking the Tyrrhenian Sea.',
    vegetation: 'Elaborate hillside agricultural terraces overflowing with dark green lemon trees, silver olive groves, and tall stone pines.',
    architecture: 'Mediterranean clifftop stucco villas, arches, terracotta roof tiles, and domed stone churches adorned with ceramic tiles.',
    climate: 'Mediterranean maritime, mild warm air, humid salt breeze, deep blue sky reflecting on the sea surface.'
  },
  {
    id: 'serengeti-kopjes',
    title: 'Acacia Savanna Grasslands, Serengeti',
    location: { lat: -2.1540, lng: 34.6857 },
    locationLabel: 'Serengeti Plains, Tanzania',
    source: 'Flickr',
    description: 'Vast, endless flat sea of golden-brown dry grasses with isolated flat-topped acacia trees. Smooth, rounded granite boulders (kopjes) erupting from the soil. Migratory herds of wildebeest and zebras.',
    terrain: 'Vast high-altitude plains of volcanic soil occasionally broken by small granite mounds.',
    vegetation: 'Vibrant golden savannah grasses, scattered umbrella thorn acacia trees, and structural sausage trees.',
    architecture: 'Simple circular wood-and-mud traditional Maasai boma villages with thorny branch fences, blending perfectly into the savanna.',
    climate: 'Tropical savanna, warm dry air, immense skies with sparse wispy high-altitude cirrus clouds.'
  },
  {
    id: 'banff-lakes',
    title: 'Moraine Glacial Lake, Banff',
    location: { lat: 51.3217, lng: -116.1860 },
    locationLabel: 'Banff National Park, Alberta, Canada',
    source: 'Custom',
    description: 'Stunning bright turquoise-blue glacial lake surrounded by massive steep grey limestone mountains with jagged sharp peaks. Flanks are covered in dense dark green coniferous forests.',
    terrain: 'High mountain valley with massive active glacial deposits, limestone peaks, and steep landslides.',
    vegetation: 'Dense damp forests of tall lodgepole pine, Engelmann spruce, Douglas fir, and yellow autumn larch trees.',
    architecture: 'Log cabin styles with massive hand-peeled pine logs, stone chimneys, and heavy iron-pitched roofs.',
    climate: 'Subarctic montane, cold mountain breezes, crisp clean air, deep dark water shadows.'
  },
  {
    id: 'santorini-caldera',
    title: 'Oia Whitewashed Caldera, Santorini',
    location: { lat: 36.4618, lng: 25.3753 },
    locationLabel: 'Santorini Island, Greece',
    source: 'Google Open Images',
    description: 'Unbelievably vivid white cubic houses with bright cobalt blue half-dome roofs built directly on the cliffside of a dark red and black volcanic caldera facing the infinite Aegean sea.',
    terrain: 'Volcanic island caldera rim with steep cliff drops, black lava soils, and panoramic maritime views.',
    vegetation: 'Drought-resistant low vineyards growing in unique circular nests close to the soil, pink bougainvillea draping whitewashed walls.',
    architecture: 'Cycladic architecture, smooth plaster whitewashed curved corners, cave dwellings carved into volcanic ash, and blue wooden shutters.',
    climate: 'Mediterranean, breezy warm sunshine, dry atmosphere, strong winds sweeping salt spray.'
  },
  {
    id: 'manhattan-midtown',
    title: 'Concrete Canyons, Midtown Manhattan',
    location: { lat: 40.7580, lng: -73.9855 },
    locationLabel: 'New York City, USA',
    source: 'Flickr',
    description: 'Colossal steel, concrete, and glass skyscrapers block out the sky, forming deep street canyons. Yellow taxi cabs, massive electronic billboards, and steam rising from manhole grates on the dark asphalt streets.',
    terrain: 'Extremely flat reclaimed river island terrain under dense stone pavement.',
    vegetation: 'Deciduous street maples and plane trees in iron grates, and vast manicured lawns and elm canopies in Central Park.',
    architecture: 'Art Deco limestone, brick skyscrapers with setback levels, juxtaposed with soaring modern curtain-wall glass mega-structures.',
    climate: 'Humid continental, extreme contrasts of summer heat and biting winter corridors, highly shaded at street level.'
  },
  {
    id: 'kyoto-gion',
    title: 'Bamboo Grove and Temples, Kyoto',
    location: { lat: 35.0116, lng: 135.7681 },
    locationLabel: 'Kyoto, Japan',
    source: 'Mapillary',
    description: 'Immense towering stalks of bright green bamboo growing densely along curved stone paths. Traditional Japanese temples with dark weathered cedar wood, sliding paper shoji doors, and heavy grey clay tile roofs.',
    terrain: 'Flat river basin surrounded on three sides by dense forest-clad green mountains.',
    vegetation: 'Towering moso bamboo forests, bright red Japanese maples (momiji), weeping cherry trees, and thick, vibrant green velvet moss yard gardens.',
    architecture: 'Traditional weathered wooden post-and-beam construction, slate gray clay roof tiles (kawara), stone lanterns, wooden lattice facades.',
    climate: 'Temperate forest basin, deep autumn mists, humid summer or calm snowy winters.'
  },
  {
    id: 'cape-town-table',
    title: 'Table Mountain Peninsula, Cape Town',
    location: { lat: -33.9249, lng: 18.4241 },
    locationLabel: 'Cape Town, South Africa',
    source: 'Google Open Images',
    description: 'Massive flat-topped mountain (Table Mountain) rising vertically behind a modern oceanfront city. High-contrast shorelines where deep blue Atlantic and Indian ocean waves crash on granite boulders.',
    terrain: 'Dramatic peninsula defined by sheer flat-topped sandstone slabs overlooking sweeping ocean bays.',
    vegetation: 'Highly diverse and unique low shrub fynbos, silver tree proteas, and hardy coastal succulents.',
    architecture: 'Cape Dutch gabled houses alongside modern high-rise apartments with glass wind-shields, and colorful colonial cottages.',
    climate: 'Mediterranean maritime, strong wind gusts, rolling thick sea fog forming a tablecloth layer over the mountain.'
  }
];
