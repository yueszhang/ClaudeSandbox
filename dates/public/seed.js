/**
 * The starting deck.
 *
 * Titles are as Joey wrote them. Anything after a dash in the original list
 * became the note. `hood` and `when` are filled only where they're not in
 * question — "Picnics" and "Spa" genuinely happen anywhere, so they stay null
 * and the card asks for them. Nothing here guesses at cost or a link.
 *
 * hood: neighborhood, or null when it varies
 * when: 'day' | 'night' | 'any'
 * cost: 1 | 2 | 3 | null
 * url:  string | null
 * done: true when it already happened before the app existed
 */
export const SEED = [
  // Warm — 70°F and up
  { id:'coney-island',           title:'Coney Island',                        note:'',                       weather:'warm', hood:'Coney Island, Brooklyn',  when:'day' },
  { id:'picnics',                title:'Picnics',                             note:'',                       weather:'warm', hood:null,                      when:'day',   done:true },
  { id:'breakneck-ridge',        title:'Breakneck Ridge',                     note:'',                       weather:'warm', hood:'Hudson Valley',           when:'day' },
  { id:'central-park-boats',     title:'Central Park boats',                  note:'',                       weather:'warm', hood:'Central Park, Manhattan', when:'day' },
  { id:'met-cloisters',          title:'The Met Cloisters',                   note:'',                       weather:'warm', hood:'Washington Heights',      when:'day' },
  { id:'walk-manhattan',         title:'Walk Manhattan island',               note:'',                       weather:'warm', hood:'Manhattan',               when:'day' },
  { id:'randalls-bikes',         title:"Randall's Island bikes",              note:'',                       weather:'warm', hood:"Randall's Island",        when:'day' },
  { id:'prospect-park-sky',      title:'Prospect Park with Sky',              note:'',                       weather:'warm', hood:'Prospect Park, Brooklyn', when:'day' },
  { id:'brooklyn-promenade-sky', title:'Brooklyn Promenade with Sky',         note:'',                       weather:'warm', hood:'Brooklyn Heights',        when:'day' },
  { id:'fort-greene-sky',        title:'Fort Greene with Sky',                note:'',                       weather:'warm', hood:'Fort Greene, Brooklyn',   when:'day' },

  // Cold — under 70°F
  { id:'ice-skating',            title:'Ice skating',                         note:'',                       weather:'cold', hood:null,                      when:'any' },
  { id:'thrifting',              title:'Thrifting day',                       note:'',                       weather:'cold', hood:null,                      when:'day' },
  { id:'spa',                    title:'Spa',                                 note:'',                       weather:'cold', hood:null,                      when:'any',   done:true },
  { id:'movie-theater',          title:'Movie theater',                       note:'',                       weather:'cold', hood:null,                      when:'any',   done:true },
  { id:'lottery-tickets',        title:'Lottery tickets',                     note:'',                       weather:'cold', hood:null,                      when:'any' },
  { id:'sports-game',            title:'Sports game',                         note:'',                       weather:'cold', hood:null,                      when:'night' },
  { id:'whitney',                title:'The Whitney',                         note:'',                       weather:'cold', hood:'Meatpacking, Manhattan',  when:'day' },
  { id:'comedy-cellar',          title:'Comedy Cellar',                       note:'Aoka matcha after',      weather:'cold', hood:'West Village, Manhattan', when:'night' },
  { id:'trivia',                 title:'Trivia',                              note:'',                       weather:'cold', hood:null,                      when:'night', done:true },
  { id:'jazz-club',              title:'Jazz club',                           note:'Smile',                  weather:'cold', hood:null,                      when:'night' },
  { id:'red-pavilion',           title:'Red Pavilion',                        note:'',                       weather:'cold', hood:'Bushwick, Brooklyn',      when:'night' },

  // Any weather
  { id:'pizza-tour',             title:'Pizza tour',                          note:'',                       weather:'any',  hood:null,                      when:'any',   done:true },
  { id:'taqueria-ramirez',       title:'Taqueria Ramirez',                    note:'',                       weather:'any',  hood:'Greenpoint, Brooklyn',    when:'any',   done:true },
  { id:'ev-bar-hopping',         title:'East Village bar hopping',            note:'Bahn Anh Em, Scmuck',    weather:'any',  hood:'East Village, Manhattan', when:'night' },
  { id:'seaport',                title:'Seaport',                             note:'Dead Rabbit, Old Mates', weather:'any',  hood:'Seaport, Manhattan',      when:'night' },
  { id:'hells-kitchen',          title:"Hell's Kitchen explore",              note:'',                       weather:'any',  hood:"Hell's Kitchen, Manhattan", when:'any', done:true },
  { id:'midtown-east-pizza',     title:'Midtown East pizzas and eclair cafe', note:'',                       weather:'any',  hood:'Midtown East, Manhattan', when:'day',   done:true },
  { id:'forma-pasta',            title:'Forma Pasta',                         note:'',                       weather:'any',  hood:'Greenpoint, Brooklyn',    when:'any' },
  { id:'mille-crepe',            title:'Mille crepe',                         note:'',                       weather:'any',  hood:null,                      when:'any' },
  { id:'astoria-1',              title:'Astoria date, part one',              note:'',                       weather:'any',  hood:'Astoria, Queens',         when:'any',   done:true },
  { id:'astoria-2',              title:'Astoria date, part two',              note:'',                       weather:'any',  hood:'Astoria, Queens',         when:'any',   done:true },
  { id:'bolivian-llama-party',   title:'Bolivian Llama Party',                note:'',                       weather:'any',  hood:null,                      when:'any',   done:true }
];
