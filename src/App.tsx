import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Skull, BookOpen, Sparkles, Copy, Check } from "lucide-react";
import { HISTORICAL_EVENTS } from "./data/events";
import { HistoricalEvent } from "./types";
import MapContainer from "./components/MapContainer";
import AudioPlayer from "./components/AudioPlayer";
import { TacticalBriefingVisual } from "./components/TacticalBriefingVisual";

// Helper function to return high-fidelity English art prompts for image generators (e.g. Nanobanana, Midjourney)
function getAIPromptForEvent(ev: HistoricalEvent): string {
  if (!ev) return "Stunning historical cinematic war art painting --ar 16:9 --v 6.0";
  const s = ev.song.toLowerCase();
  if (s.includes("sarajevo")) {
    return "Dramatic historical painting of the assassination of Archduke Franz Ferdinand in Sarajevo, 1914, detailed vintage uniforms, detailed background of the open carriage car on Sarajevo street, moody cinematic lighting, oily textures, detailed art by famous war artist --ar 16:9 --v 6.0";
  }
  if (s.includes("truce") || s.includes("christmas")) {
    return "Touching impressionistic painting of WWI soldiers German and British in uniform shaking hands in the middle of a muddy snowy trenches landscape on Christmas Eve, warm candles in background, peaceful atmosphere, cinematic lighting, dramatic --ar 16:9 --v 6.0";
  }
  if (s.includes("gallipoli")) {
    return "Historically accurate watercolor and brush painting, storming the rugged cliffs of Gallipoli 1915, ANZAC troops landing from rowing boats onto rocky shores under heavy fire, smoke, dramatic explosions, dark waves, oil painting style --ar 16:9 --v 6.0";
  }
  if (s.includes("attack of the dead men")) {
    return "Dark and eerie cinematic illustration of the Attack of the Dead Men at Osowiec Fortress, ghostly Russian soldiers wrapped in bloody bandages gasping, storming through toxic green chlorine gas with bayonets, German infantry retreating in terror, dark ambient --ar 16:9 --v 6.0";
  }
  if (s.includes("verdun")) {
    return "Apocalyptic battle scene of the Fields of Verdun, muddy battlefield torn apart by craters, charred trunks, bursting artillery fire under a menacing red smoke filled sky, trench warfare, dramatic digital art --ar 16:9 --v 6.0";
  }
  if (s.includes("dreadnought")) {
    return "Epic marine painting of HMS Dreadnought battleships crashing through rough North Sea waves in a majestic naval blockade, thick slate-gray smoke from high funnels, great naval guns firing, dramatic realistic ocean --ar 16:9 --v 6.0";
  }
  if (s.includes("ghost in the trenches")) {
    return "Muted color oil painting of Francis Pegahmagabow, the legendary WWI Ojibwe sniper, cloaked in mist, crawling silently through a desolate night-time muddy trench landscape in Flanders, holding his rifle, mysterious mood --ar 16:9 --v 6.0";
  }
  if (s.includes("unkillable soldier")) {
    return "Cinematic sketch concept art of Sir Adrian Carton de Wiart in military uniform with a black eyepatch, surviving a brutal explosions scene in WWI Somme, fearless expression, dust and debris in the air, intense battle action --ar 16:9 --v 6.0";
  }
  if (s.includes("seven pillars")) {
    return "Stunning cinematic wide shot of T.E. Lawrence (Lawrence of Arabia) riding a white camel at the head of a bedouin cavalry charge through the dunes of the red desert of Aqaba, blazing sun, cinematic lens flare, masterwork epic painting --ar 16:9 --v 6.0";
  }
  if (s.match(/price of a mile/i) || s.includes("mile")) {
    return "Bleak realistic depiction of the Battle of Passchendaele, WWI soldiers wading through thick knee-deep mud, broken wood planks, barbed wire, heavy rain, stormy dark skies, monumental war cemetery in background, melancholy --ar 16:9 --v 6.0";
  }
  if (s.includes("baron")) {
    return "Sleek retro poster of the Red Baron's Fokker Dr.I triplane flying through golden hour clouds over WWI Somme battlefields, paint strokes, highly detailed aeronautics, red paint reflection, dramatic sky --ar 16:9 --v 6.0";
  }
  if (s.includes("lost battalion")) {
    return "Gritty historical painting of the American Lost Battalion of the 77th Division surrounded in the dense, misty Argonnes forest, defending trenches on a steep slope, soldiers in helmets firing rifles, thick smoke --ar 16:9 --v 6.0";
  }
  if (s.includes("versailles")) {
    return "Intense historical oil painting of the signing of the Treaty of Versailles, 1919, inside the magnificent Hall of Mirrors, global delegates clustered in serious discussion, grand mirrors reflecting crystal chandeliers, solemn atmosphere --ar 16:9 --v 6.0";
  }
  if (s.includes("rise of evil")) {
    return "Dark atmospheric painting of Berlin in 1933, a massive military parade under totalitarian banners, grand classical architecture illuminated by torchlights, dark skies, ominous and impending sense of historic doom --ar 16:9 --v 6.0";
  }
  if (s.includes("40:1")) {
    return "Epic last stand battlefield scene of the Battle of Wizna, Polish soldiers defending concrete bunkers on a hill against a massive wall of German tanks and armored columns, dust cloud, explosions, high contrast --ar 16:9 --v 6.0";
  }
  if (s.includes("white death")) {
    return "Muted artistic photograph of Simo Häyhä (White Death), Finnish legendary sniper in complete white winter camo, hiding in deep snowy forest at -40C, rifle in hand with steel sights, freezing breath, mystical boreal light --ar 16:9 --v 6.0";
  }
  if (s.includes("ghost division")) {
    return "Veloce action painting of Erwin Rommel's Ghost Division Panzer tanks charging through dusty French countryside in 1940, blurred motion, military speed, combat advance, sunbeams through explosion clouds --ar 16:9 --v 6.0";
  }
  if (s.includes("resist and bite")) {
    return "Defiant stand of Belgian Chasseurs Ardennais forest infantry in dark green uniforms, barricading a path in the dense Ardennes forest, fighting German tanks, fierce combat, trees, moody foggy morning --ar 16:9 --v 6.0";
  }
  if (s.includes("exile")) {
    return "Thrilling aerial dogfight, RAF Hurricanes and Spitfires piloted by exiled Polish flyers of Escuadron 303, cutting through formation of German bombers over foggy London, engine fire, smoke trails, dramatic sky --ar 16:9 --v 6.0";
  }
  if (s.includes("bismarck")) {
    return "Colossal battleship Bismarck firing its heavy turrets into the misty North Atlantic sea, giant water plumes, naval smoke, realistic battle scene, dramatic lightning and stormy weather, epic proportion --ar 16:9 --v 6.0";
  }
  if (s.includes("lady") || s.includes("dark") || s.includes("sniper") || s.includes("rusa") || s.includes("death")) {
    return "Cinematic portrait of Lyudmila Pavlichenko (Lady Death), famous Soviet female sniper, in winter military uniform holding her scoped Mosin-Nagant rifle, looking determined on the snow-covered battlefield of Sevastopol --ar 16:9 --v 6.0";
  }
  if (s.includes("witches")) {
    return "Night-time scene of the Soviet female aviators 'Night Witches', flying wooden Polikarpov Po-2 biplanes quietly under the starry sky, gliding with engines cut off over searchlights in German lines, explosive flak in the air --ar 16:9 --v 6.0";
  }
  if (s.includes("stalingrad")) {
    return "Wintry urban ruin of Stalingrado, soldiers fighting house-to-house amidst snow and shattered factories, ruined walls, grey skies, intense close quarters battle scene, dark oil painting --ar 16:9 --v 6.0";
  }
  if (s.includes("panzerkampf")) {
    return "Titanic armored clash in the Battle of Kursk, dense rows of Tiger tanks clashing with Soviet T-34 tanks across open steppes under heavy artillery bombardment, muddy soil fly-ups, black smoke plumes --ar 16:9 --v 6.0";
  }
  if (s.includes("bullets fly") || s.includes("no bullets")) {
    return "Incredible aerial moment of a shattered, smoking American B-17 Flying Fortress bomber plane, being escorted closely through the clouds by an honorable German Messerschmitt Bf 109 fighter pilot, serene light --ar 16:9 --v 6.0";
  }
  if (s.includes("primo") || s.includes("victoria")) {
    return "Unforgettable wide-angle epic of D-Day land invasion: Higgins landing boats opening, Allied soldiers leaping into the cold waves of Normandy shores under beach obstacles and heavy fortification bunker fire, dramatic smoke --ar 16:9 --v 6.0";
  }
  if (s.includes("uprising")) {
    return "Heroic partisans of the Polish Home Army, wearing civilian clothes with white-and-red armbands, fighting inside the barricaded ruins of Warsaw in 1944, smoky alleys, shafts of light, fierce and brave resistance --ar 16:9 --v 6.0";
  }
  if (s.includes("screaming") || s.includes("eagles")) {
    return "American paratroopers of 101st Airborne ('Screaming Eagles') entrenched in foxholes in the frozen, dark pine forests of Bastogne, snow everywhere, holding defense under heavy winter siege, iconic heroics --ar 16:9 --v 6.0";
  }
  if (s.includes("hell and back") || s.includes("audie")) {
    return "Audie Murphy standing alone on a burning, exploding tank destroyer in the snowy Colmar pocket, firing a heavy caliber fifty machine gun against advancing enemy infantry, dramatic sparks, action snapshot --ar 16:9 --v 6.0";
  }
  if (s.includes("smoking") || s.includes("snakes")) {
    return "Three brave Brazilian infantry soldiers of the Smoking Snakes division, at the Battle of Montese in Italy, refusing to surrender, holding rifles, firing from rugged mountain foxholes against German troops --ar 16:9 --v 6.0";
  }
  if (s.includes("hearts") || s.includes("iron")) {
    return "Touching historical painting of German General Walther Wenck's forces securing a river crossing on the Elbe river, evacuating thousands of cold, terrified refugees in blankets, helping them board boats to escape --ar 16:9 --v 6.0";
  }
  if (s.includes("attero") || s.includes("dominatus")) {
    return "Soviet soldiers hoisting the red flag over the shell-blasted, smoky dome of the Reichstag building in Berlin in 1945, dust, victory, devastation underneath, high-contrast dark clouds --ar 16:9 --v 6.0";
  }
  if (s.includes("last battle") || s.includes("itter")) {
    return "Unique historical brotherhood moment: American soldiers and anti-nazi Wehrmacht soldiers firing rifles side-by-side from the stone ramparts of Castle Itter in Austria against advancing SS infantry, ancient castle background --ar 16:9 --v 6.0";
  }
  if (s.includes("hellfighters")) {
    return "Cinematic historical painting of the heroic African American Harlem Hellfighters of the 369th Infantry Regiment, wearing French Adrian helmets, defending muddy trenches of the Western Front in 1918 under heavy bombardment, grim determined expressions, smoky background, deep shadows, high contrast dramatic art --ar 16:9 --v 6.0";
  }
  if (s.includes("soldier of heaven") || s.includes("heaven")) {
    return "Aesthetic melancholy oil painting of WWI soldiers standing on a snowy mountain ledge in the Alps, surrounded by immense snow clouds, glowing sunlight breaking through winter mist, a sense of cold majesty, Marmolada White Friday tragedy, soft brush strokes, dramatic --ar 16:9 --v 6.0";
  }
  if (s.includes("stormtroopers")) {
    return "Dynamic and intense concept art of German Sturmtruppen stormtroopers charging through smoke and fire, equipped with submachine guns, grenade bags, and steel helmets, breaking through barbed wire fences of the Western Front, high action, cinematic war illustration --ar 16:9 --v 6.0";
  }
  if (s.includes("valley of death") || s.includes("doiran")) {
    return "Dramatic war painting of Bulgarian troops defending reinforced concrete fortifications in the mountains during the Battle of Doiran 1918, heavy British artillery explosions lighting up the night sky, green poison gas mist in valleys, grim historical realism --ar 16:9 --v 6.0";
  }
  if (s.includes("midway")) {
    return "Epic WWII naval aviation painting of the Battle of Midway, American Dauntless dive bombers screaming down from high clouds through thick anti-aircraft fire onto burning Japanese aircraft carriers on a bright blue Pacific ocean, giant water plumes, dramatic action masterpiece --ar 16:9 --v 6.0";
  }
  if (s.includes("inmate") || s.includes("4859")) {
    return "Solemn and high-contrast dramatic portrait of Witold Pilecki in prisoner stripes inside a barbed-wire enclosure of Auschwitz under a dark starry night, determined hero organizing the resistance, shafts of pale light, emotional and atmospheric cinematic art --ar 16:9 --v 6.0";
  }
  if (s.includes("saboteurs") || s.includes("telemark")) {
    return "Tense stealth painting of Norwegian commandos in white snow camo sneaking into the Vemork chemical plant nestled on high frozen cliffs in Telemark during winter, starry night sky, glowing plant lights reflecting on deep snow, high suspense --ar 16:9 --v 6.0";
  }
  if (s.includes("coat of arms")) {
    return "Heroic historic painting of Greek soldiers defending snowy mountain passes in the Pindus mountains, holding rifles and Greece flag, fighting against Mussolini's Italian invaders in 1940, majestic rugged landscape, dramatic sky, cinematic --ar 16:9 --v 6.0";
  }
  if (s.includes("race to the sea") || s.includes("yser")) {
    return "Dramatic historical painting of King Albert I of Belgium standing by flooded Flandes fields in the Battle of the Yser, massive floodwaters stopping the German advance under a gray stormy sky, sandbags, Belgian soldiers entrenched, masterpiece of historical art --ar 16:9 --v 6.0";
  }
  if (s.includes("defense of moscow") || s.includes("moscow")) {
    return "Monumental patriotic painting of the Soviet winter counteroffensive in the Battle of Moscow 1941, red army soldiers in white winter coats charging with bayonets in deep snow, red stars, majestic Moscow outline in the background under heavy snowfall, heroic and epic --ar 16:9 --v 6.0";
  }
  if (s.includes("talvisota") || s.includes("invierno")) {
    return "Fierce guerrilla combat painting of Finnish soldiers on skis, white snow camo, ambush of Soviet columns in deep snow-covered forests, freezing breath, exploding tanks, 'motti' tactical victory, dramatic cold winter lighting, high-contrast --ar 16:9 --v 6.0";
  }
  if (s.includes("wolfpack") || s.includes("atlantico")) {
    return "Moody maritime painting of a group of German U-boats submarine hulls glistening on the surface of a dark stormy Atlantic ocean at night, firing torpedoes towards a merchant convoy ships burning in the distance, dramatic waves, heavy sea spray --ar 16:9 --v 6.0";
  }
  if (s.includes("first soldier") || s.includes("albert")) {
    return "Cinematic realistic illustration of Albert Severin Roche, 'the first soldier of France', a short but extraordinarily brave French soldier in blue uniform, capturing a cluster of German soldiers single-handedly in the ruins of a trench under a cloudy sky, heroic action --ar 16:9 --v 6.0";
  }
  if (s.includes("future of warfare") || s.includes("warfare")) {
    return "Epic gritty illustration of the first British Mark I tank crawling slowly over a muddy, crater-filled Western Front battlefield in 1916, barbed wire tangles, black smoke pouring out, terrified soldiers watching from trenches, cinematic masterpiece --ar 16:9 --v 6.0";
  }
  if (s.includes("devil dogs") || s.includes("teufelhunde")) {
    return "Fierce combat concept art of the US Marines (Devil Dogs) charging through the splintered trees of Belleau Wood in 1918, wearing steel helmets, firing rifles, smoke and explosions around, high intensity, historical epic --ar 16:9 --v 6.0";
  }
  if (s.includes("82nd") || s.includes("alvin") || s.includes("york")) {
    return "Cinematic close-up painting of Sergeant Alvin York in his WWI American uniform, holding a Colt .45 pistol and a rifle, looking determined through dense forest mist in the Argonne, neutralising enemy positions, detailed realism --ar 16:9 --v 6.0";
  }
  if (s.includes("3 armies") || s.includes("törni") || s.includes("thorne")) {
    return "Dramatic historical portrait illustration of Lauri Törni (Larry Thorne) in winter soldier gear, displaying quiet confidence, set against a background showing three distinct military insignia and a cold pine forest, symbolic masterpiece --ar 16:9 --v 6.0";
  }
  if (s.includes("ballad of bull") || s.includes("bull allen") || s.includes("tambu")) {
    return "Emotional and heroic oil painting of Australian corporal Bull Allen carrying a wounded American soldier on his shoulders, walking through muddy, smoking jungle battlefield of Mount Tambu under heavy fire, dramatic sunlight beams, highly moving masterpiece --ar 16:9 --v 6.0";
  }
  if (s.includes("far from the fame") || s.includes("janoušek")) {
    return "Inspiring historical painting of Karel Janoušek in his blue Royal Air Force Marshal uniform, standing proudly in front of a Spitfire fighter plane hangar, dramatic clouds, elegant brush strokes, classic aviation portrait --ar 16:9 --v 6.0";
  }
  if (s.includes("union") || s.includes("monte cassino") || s.includes("benedict")) {
    return "Epic action concept art of Allied coalition soldiers (Polish, British, French) charging up the rocky, cratered slopes of Monte Cassino under intense shellfire, ruins of the Benedictine abbey high on top, dramatic sky, masterpiece --ar 16:9 --v 6.0";
  }
  if (s.includes("nuclear attack") || s.includes("hiroshima") || s.includes("nagasaki")) {
    return "Powerful and solemn artistic representation of the atomic era, showing a dark, dramatic silhouette of a heavy B-29 bomber high in the orange sky above distant glowing fire clouds, atmospheric, deep symbolic art representing history --ar 16:9 --v 6.0";
  }
  if (s.includes("wehrmacht") || s.includes("barbarossa")) {
    return "Atmospheric, dark dramatic military painting of a colossal column of armored Panzer tanks and German infantry advancing through dusty plains of Eastern Europe in 1941, huge dust clouds, low sun casting long shadows, imposing mechanical force --ar 16:9 --v 6.0";
  }
  if (s.includes("end of the war") || s.includes("armistice") || s.includes("compiègne")) {
    return "Poignant cinematic painting of the signing of the WWI Armistice inside an old dark wooden train carriage in the forest of Compiègne, shafts of morning mist light piercing the windows, French and German military officers looking solemn, peace at last --ar 16:9 --v 6.0";
  }
  if (s.includes("final solution") || s.includes("holocaust") || s.includes("auschwitz")) {
    return "Solemn, high-contrast, black and white artistic representation of remembrance, showing a quiet snow-covered railway track leading towards a dark historical silhouette of an old archway under a starry night, symbolic of memory and reflection --ar 16:9 --v 6.0";
  }
  if (s.includes("father") || s.includes("haber") || s.includes("chemical")) {
    return "Dramatic historical oil painting of Fritz Haber in his laboratory, surrounded by complex glassware, glowing amber light, and faint green vapors, depicting a deep scientific and moral struggle, highly detailed --ar 16:9 --v 6.0";
  }
  if (s.includes("angels calling") || s.includes("trincheras")) {
    return "Atmospheric dark painting of soldiers in muddy, rain-drenched Western Front trenches during WWI, heavy fog, orange shell fire lighting up the stormy sky, reflections in mud puddles, deep emotion --ar 16:9 --v 6.0";
  }
  if (s.includes("firestorm") || s.includes("bombing")) {
    return "Apocalyptic, intense military painting of WWII strategic bombing, a night sky filled with silhouettes of hundreds of heavy bombers, searchlight beams piercing dark clouds, glowing orange and red sea of fire below in the distance --ar 16:9 --v 6.0";
  }
  if (s.includes("1916") || s.includes("somme")) {
    return "Tragic, high-contrast cinematic portrait of young WWI British soldiers marching through misty green fields of the Somme in 1916, warm light filtering through early morning mist, realistic historical look --ar 16:9 --v 6.0";
  }
  if (s.includes("flanders fields") || s.includes("amapolas") || s.includes("mccrae")) {
    return "Poetic oil painting of a vast field of red poppies blooming under a warm evening sky, with rows of white wooden crosses of Flanders in the soft background, gentle breeze, beautiful and highly moving art --ar 16:9 --v 6.0";
  }
  if (s.includes("great war") || s.includes("passchendaele")) {
    return "Cinematic tragic masterpiece of a WWI battlefield at Passchendaele under a dark pouring rain, flooded muddy craters reflecting bursts of yellow-orange artillery explosions, desperate silhouettes of soldiers crossing wooden walkways through a desolate muddy wasteland, epic, somber, emotional oil painting --ar 16:9 --v 6.0";
  }
  if (s.includes("last dying breath") || s.includes("belgrado") || s.includes("gavrilovic")) {
    return "Heroic historical oil painting of Serbian soldiers defending Belgrade in 1915 under heavy artillery fire, Major Gavrilović shouting orders from a barricade, smoke and fire engulfing the river bank, emotional and dramatic wartime masterpiece --ar 16:9 --v 6.0";
  }
  return "Stunning historical cinematic war art painting --ar 16:9 --v 6.0";
}

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeEraTab, setActiveEraTab] = useState<"WWI" | "INTERWAR" | "WWII">("WWI");
  const [theme, setTheme] = useState<"dark" | "daylight">("dark");
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  
  const selectedEvent = HISTORICAL_EVENTS[selectedIndex];

  // Helper to determine Era of an event
  const getEraOfEvent = (ev: HistoricalEvent) => {
    if (ev.year >= 1914 && ev.year <= 1918) return "WWI";
    if (ev.year >= 1919 && ev.year <= 1938) return "INTERWAR";
    return "WWII";
  };

  // Sync active Era tab when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      const era = getEraOfEvent(selectedEvent);
      setActiveEraTab(era);
    }
  }, [selectedIndex, selectedEvent]);

  // Reset image error whenever selected event changes
  useEffect(() => {
    setImageError(false);
  }, [selectedIndex]);

  // Auto-advance narrative tour effect
  useEffect(() => {
    let interval: any = null;
    if (isTourPlaying) {
      interval = setInterval(() => {
        setSelectedIndex((prevIdx) => {
          // Wrap around of list
          return (prevIdx + 1) % HISTORICAL_EVENTS.length;
        });
      }, 14000); // 14 seconds per historical event
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTourPlaying]);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % HISTORICAL_EVENTS.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + HISTORICAL_EVENTS.length) % HISTORICAL_EVENTS.length);
  };

  const handleSelectEvent = (event: HistoricalEvent) => {
    const index = HISTORICAL_EVENTS.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  };  const isDaylight = theme === "daylight";

  // Primary High-Fidelity Tactical Layout
  return (
    <div className={`min-h-screen flex flex-col overflow-hidden select-none transition-all duration-300 ${
      isDaylight 
        ? "bg-[#eae3d2] text-neutral-800 font-typewriter" 
        : "bg-[#0a0a0b] text-slate-200 font-sans"
    }`}>
      
      {/* Top Banner Bar */}
      <header className={`px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shadow-md border-b transition-colors duration-300 ${
        isDaylight
          ? "bg-[#ebdcb9] border-amber-900/25 text-amber-950 font-typewriter"
          : "bg-[#0d0d0f] border-white/10 text-slate-200"
      }`}>
        <div className="flex items-center gap-4">
          {/* Spiked sophisticated rotated badge */}
          <div className={`w-8 h-8 flex items-center justify-center rotate-45 border shrink-0 transition-colors duration-300 ${
            isDaylight
              ? "bg-red-800 border-amber-950/20 text-white shadow-sm"
              : "bg-red-600 border-white/20 shadow-[0_0_12px_rgba(220,38,38,0.4)]"
          }`}>
            <span className={`-rotate-45 font-black text-xs ${isDaylight ? "font-typewriter" : "font-serif"}`}>S</span>
          </div>
          <div>
            <h1 className={`text-lg tracking-widest uppercase leading-tight ${
              isDaylight ? "font-typewriter font-bold text-amber-950" : "font-serif font-black text-white"
            }`}>
              SABATON: Chronicles of Conflict
            </h1>
            <span className={`text-[9px] uppercase tracking-widest font-bold block mt-0.5 ${
              isDaylight ? "text-red-900 font-typewriter" : "text-red-500 font-mono"
            }`}>
              Europa del Siglo XX a través del Heavy Metal
            </span>
          </div>
        </div>

        {/* Global Control & Stats indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* SECRETS / TACTICAL THEME TOGGLE BUTTON */}
          <button
            onClick={() => setTheme(isDaylight ? "dark" : "daylight")}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer outline-none shrink-0 font-bold ${
              isDaylight
                ? "bg-[#f5ebd6] border-amber-900/30 text-amber-950 hover:bg-[#efe6ce] shadow-sm font-typewriter"
                : "bg-red-950/25 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white"
            }`}
            title="Cambiar entre el modo de pantalla táctico nocturno y los documentos secretos diurnos"
          >
            {isDaylight ? (
              <>
                <Skull className="w-3.5 h-3.5 text-red-800 shrink-0" />
                <span>📡 VER PANTALLA TÁCTICA (NOCHE)</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>📂 DOCUMENTOS SECRETOS (DÍA)</span>
              </>
            )}
          </button>

          <div className={`px-3 py-1 border rounded-lg flex items-center gap-2 ${
            isDaylight ? "bg-[#f5ebd6] border-amber-900/20" : "bg-[#0a0a0b] border-white/10"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isDaylight ? "bg-red-800" : "bg-red-600"}`} />
            <span className={`font-bold uppercase tracking-tight text-[10px] ${isDaylight ? "text-amber-900/60" : "text-slate-500"}`}>Conflictos:</span>
            <span className={`font-bold ${isDaylight ? "text-amber-950" : "text-white"}`}>{HISTORICAL_EVENTS.length} Sitios</span>
          </div>

          <div className={`px-3 py-1 border rounded-lg flex items-center gap-2 ${
            isDaylight ? "bg-[#f5ebd6] border-amber-900/20" : "bg-[#0a0a0b] border-white/10"
          }`}>
            <span className={`font-bold uppercase tracking-tight text-[10px] ${isDaylight ? "text-amber-900/60" : "text-slate-500"}`}>Rango:</span>
            <span className={`font-bold ${isDaylight ? "text-amber-950" : "text-white"}`}>1914 — 1945</span>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden min-h-0">
        
        {/* Left Side: 3D Map + Segmented Timeline Board */}
        <section className="flex-1 flex flex-col gap-4 min-h-0">
          
          {/* Map display */}
          <div className={`flex-1 relative min-h-[350px] lg:min-h-0 rounded-2xl overflow-hidden flex flex-col shadow-inner ${
            isDaylight ? "bg-[#efe6ce] border-2 border-amber-900/20" : "bg-[#0d0d0f] border border-white/10"
          }`}>
            
            {/* Custom map controller container */}
            <MapContainer
              events={HISTORICAL_EVENTS}
              selectedEvent={selectedEvent}
              onSelectEvent={handleSelectEvent}
              theme={theme}
            />
          </div>

          {/* Command Campaign & Era-Segmented Tactical Timeline Board */}
          <div className={`p-4 rounded-xl flex flex-col gap-4 shrink-0 relative overflow-hidden transition-all duration-300 ${
            isDaylight 
              ? "bg-[#f4efe6] border-2 border-amber-900/20 shadow-md font-typewriter text-neutral-800" 
              : "bg-[#0b0b0d] border border-white/10 shadow-lg text-slate-200"
          }`}>
            
            {/* Top row of Campaign Board: Era tabs & Tour control */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-amber-900/10">
              
              {/* Campaign Era Tabs */}
              <div className={`flex flex-wrap gap-1.5 p-1.5 rounded-xl border ${
                isDaylight ? "bg-[#e6dcc4] border-amber-900/20" : "bg-black/40 border-white/5"
              }`}>
                {[
                  { id: "WWI", label: "I FRENTE: LA GRAN GUERRA", period: "1914—1918", count: HISTORICAL_EVENTS.filter(e => getEraOfEvent(e) === "WWI").length },
                  { id: "INTERWAR", label: "II FRENTE: ENTREGUERRAS", period: "1919—1933", count: HISTORICAL_EVENTS.filter(e => getEraOfEvent(e) === "INTERWAR").length },
                  { id: "WWII", label: "III FRENTE: SEGUNDA GUERRA", period: "1939—1945", count: HISTORICAL_EVENTS.filter(e => getEraOfEvent(e) === "WWII").length },
                ].map((tab) => {
                  const isCurrentEra = activeEraTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveEraTab(tab.id as "WWI" | "INTERWAR" | "WWII")}
                      className={`px-3 py-1.5 rounded-lg flex flex-col items-start gap-0.5 transition-all outline-none cursor-pointer text-left ${
                        isCurrentEra
                          ? (isDaylight 
                              ? "bg-red-800/10 border-red-700/40 text-red-800 font-bold border-2" 
                              : "bg-red-600/15 border-red-500/20 text-red-500 font-bold border")
                          : (isDaylight
                              ? "border border-transparent text-amber-900/70 hover:text-amber-950 font-bold"
                              : "border border-transparent text-slate-400 hover:text-white")
                      }`}
                    >
                      <span className={`text-[9px] uppercase tracking-widest font-extrabold ${isDaylight ? "font-typewriter" : "font-serif"}`}>{tab.label}</span>
                      <span className={`text-[10px] opacity-80 flex items-center gap-1 ${isDaylight ? "font-typewriter" : "font-mono"}`}>
                        {tab.period} <span className={isDaylight ? "text-amber-900/50" : "text-slate-500"}>[{tab.count} misiones]</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Autoplay & Control Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setIsTourPlaying(!isTourPlaying)}
                  className={`px-3.5 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-lg border flex items-center gap-2 transition-all shrink-0 cursor-pointer outline-none ${
                    isTourPlaying
                      ? (isDaylight
                          ? "bg-red-800/20 border-red-700/40 text-red-800 hover:bg-red-800 hover:text-white animate-pulse"
                          : "bg-red-600/20 border-red-500/40 text-red-500 hover:bg-red-600 hover:text-white")
                      : (isDaylight
                          ? "bg-[#e6dcc4] border-amber-900/30 text-amber-950 hover:bg-[#ebdcb9] font-typewriter"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white font-mono")
                  }`}
                  title="Avanza de forma automática para un viaje sonoro táctico de 14 segundos"
                >
                  {isTourPlaying ? (
                    <>
                      <Pause className={`w-3 h-3 ${isDaylight ? "fill-red-800 text-red-800" : "fill-red-500 text-red-500"}`} />
                      <span>PAUSAR TOUR</span>
                    </>
                  ) : (
                    <>
                      <Play className={`w-3 h-3 ${isDaylight ? "fill-amber-950 text-amber-950" : "fill-slate-400 text-slate-400"} translate-x-0.5`} />
                      <span>TOUR AUTOPLAY</span>
                    </>
                  )}
                </button>

                <div className={`flex items-center gap-1.5 p-1 rounded-lg border ${
                  isDaylight ? "bg-[#e6dcc4] border-amber-900/20" : "bg-black/40 border-white/5"
                }`}>
                  <button
                    onClick={handlePrev}
                    className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                      isDaylight
                        ? "border-amber-900/10 bg-[#f4efe6]/85 text-amber-950 hover:bg-[#efe6ce]"
                        : "border-white/5 bg-black/60 text-slate-300 hover:text-white hover:border-white/20 active:scale-95"
                    }`}
                    title="Misión Anterior"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                      isDaylight
                        ? "border-amber-900/10 bg-[#f4efe6]/85 text-amber-950 hover:bg-[#efe6ce]"
                        : "border-white/5 bg-black/60 text-slate-300 hover:text-white hover:border-white/20 active:scale-95"
                    }`}
                    title="Siguiente Misión"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Campaign Events Node Grid: wraps cleanly, fully adjustable, never overflows or hides elements! */}
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
                {HISTORICAL_EVENTS.map((ev, i) => {
                  const era = getEraOfEvent(ev);
                  if (era !== activeEraTab) return null;
                  const isActive = ev.id === selectedEvent.id;
                  
                  return (
                    <button
                      key={ev.id}
                      onClick={() => {
                        setSelectedIndex(i);
                      }}
                      className={`px-2.5 py-2 rounded-lg text-left transition-all border shrink-0 cursor-pointer flex flex-col justify-between gap-1 group ${
                        isActive
                          ? (isDaylight
                              ? "bg-[#ebdcb9] border-red-700/65 text-neutral-900 font-bold shadow-inner ring-1 ring-red-700/30 scale-102"
                              : "bg-red-600/25 border-red-500/80 text-white font-bold scale-102 shadow-[inset_0_1px_4px_rgba(239,68,68,0.2),0_0_12px_rgba(220,38,38,0.25)] ring-1 ring-red-500/30")
                          : (isDaylight
                              ? "bg-[#fcfaf2] border-amber-900/15 text-neutral-600 hover:text-neutral-900 hover:bg-[#e6dcc4]"
                              : "bg-[#09090b] border-white/5 text-slate-400 hover:text-white hover:border-white/20 hover:bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]")
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] ${
                          isActive 
                            ? (isDaylight ? "text-red-800 font-bold" : "text-red-400") 
                            : (isDaylight ? "text-amber-900/55" : "text-slate-500 group-hover:text-slate-300")
                        } ${isDaylight ? "font-typewriter" : "font-mono"}`}>
                          E-{i + 1 < 10 ? `0${i + 1}` : i + 1}
                        </span>
                        <span className={`text-[9.5px] leading-none tracking-tight ${
                          isActive 
                            ? (isDaylight ? "bg-red-800/10 text-red-800 px-1 py-0.5 rounded" : "bg-red-500/30 text-red-300 px-1 py-0.5 rounded") 
                            : (isDaylight ? "text-neutral-500" : "text-slate-400 font-medium")
                        } ${isDaylight ? "font-typewriter" : "font-mono"}`}>
                          {ev.year}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold leading-tight line-clamp-1 w-full uppercase tracking-wide ${isDaylight ? "font-typewriter text-neutral-800" : "font-sans"}`}>
                        {ev.song}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </section>

        {/* Right Side: Active Event Details & Music Controls */}
        <section className="w-full lg:w-[440px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-none">
          
          {/* Active Event Information detail card */}
          <div className={`border rounded-2xl p-4 md:p-5 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden ${
            isDaylight
              ? "bg-[#fcfaf2] border-2 border-amber-900/20 text-neutral-900 shadow-[5px_5px_20px_rgba(100,80,50,0.12)] font-typewriter"
              : "bg-[#0d0d0f] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.65)] text-slate-200"
          }`}>
            
            {/* INK WATERMARK FOR DAYLIGHT RETRO ARCHIVE MODE */}
            {isDaylight && (
              <div className="absolute top-[35%] left-[-15%] right-0 text-[40px] font-bold uppercase tracking-[0.2em] text-red-800/5 rotate-[-20deg] pointer-events-none select-none text-center">
                SECRET CLASSIFIED
              </div>
            )}
            
            {/* Top Row: Year flag & Title */}
            <div className={`flex flex-col gap-3 pb-3 border-b ${isDaylight ? "border-amber-900/15" : "border-white/10"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`px-3.5 py-1 text-xs font-extrabold uppercase rounded ${
                  isDaylight
                    ? "bg-red-800 text-white shadow-sm font-typewriter border border-red-900"
                    : "bg-red-600 text-white shadow-[0_2px_8px_rgba(220,38,38,0.4)] font-serif"
                }`}>
                  Año {selectedEvent.year}
                </span>

                {/* Wikipedia Link Button */}
                <a
                  href={selectedEvent.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    isDaylight
                      ? "bg-[#f5ebd6] hover:bg-[#ebdcb9] border border-amber-900/20 hover:border-red-800 text-amber-950 font-typewriter"
                      : "bg-[#0a0a0b] hover:bg-black border border-white/5 hover:border-red-500/30 text-slate-300 hover:text-white font-mono shadow-inner"
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isDaylight ? "text-red-800" : "text-red-500"}`} />
                  <span>Wikipedia ↗</span>
                </a>
              </div>

              <div>
                <h2 className={`text-lg md:text-xl uppercase tracking-wider leading-tight ${
                  isDaylight ? "font-typewriter font-bold text-neutral-900" : "font-serif font-black text-white"
                }`}>
                  {selectedEvent.title}
                </h2>
                <span className={`text-[10px] uppercase tracking-wider block mt-1 font-bold ${
                  isDaylight ? "text-red-900 font-typewriter" : "text-red-500 font-mono"
                }`}>
                  Campañas: {selectedEvent.dateStr}
                </span>
              </div>
            </div>

            {/* Media/Narrative Stack */}
            <div className="flex flex-col gap-4">
              
              {/* Historical Tactical Visualisation HUD */}
              <div className={`w-full h-44 rounded-xl border overflow-hidden shrink-0 relative shadow-inner group flex items-center justify-center ${
                isDaylight ? "bg-[#e6dcc4] border-amber-900/20" : "bg-[#0a0a0b] border-white/10"
              }`}>
                <TacticalBriefingVisual
                  song={selectedEvent.song}
                  year={selectedEvent.year}
                  title={selectedEvent.title}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-1.5 pointer-events-none">
                  <span className={`text-[8px] uppercase tracking-widest font-bold ${isDaylight ? "text-red-600 font-typewriter" : "text-red-500/80 font-mono"}`}>MONITOR HU-79</span>
                </div>
              </div>

              {/* Narrative text block */}
              <p className={`text-xs md:text-sm leading-relaxed ${isDaylight ? "text-neutral-800 font-typewriter" : "text-slate-300 font-sans"}`}>
                {selectedEvent.description}
              </p>

              {/* Casualties crimson card */}
              <div className={`p-3 rounded-xl flex items-start gap-2.5 ${
                isDaylight
                  ? "bg-red-800/5 border border-red-800/30 shadow-[inset_0_1px_2px_rgba(153,27,27,0.03)]"
                  : "bg-red-950/20 border border-red-900/40 shadow-[inset_0_1px_3px_rgba(220,38,38,0.05)]"
              }`}>
                <Skull className={`w-5 h-5 shrink-0 mt-0.5 ${isDaylight ? "text-red-800" : "text-red-500"}`} />
                <div>
                  <span className={`text-[10px] uppercase tracking-widest block font-bold ${
                    isDaylight ? "text-red-800 font-typewriter" : "text-red-500 font-mono"
                  }`}>Bajas en Combate Estimadas</span>
                  <p className={`text-xs mt-1 font-bold tracking-wide leading-tight ${
                    isDaylight ? "text-neutral-900 font-typewriter" : "text-white font-serif"
                  }`}>
                    {selectedEvent.casualties}
                  </p>
                </div>
              </div>

              {/* Leaders and Protagonists */}
              <div className="space-y-1.5">
                <span className={`text-[10px] uppercase tracking-widest block font-bold ${
                  isDaylight ? "text-amber-900/60 font-typewriter" : "text-slate-500 font-mono"
                }`}>Líderes y Protagonistas Clave:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.keyFigures.map((figure, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded border text-[10px] flex items-center gap-1.5 ${
                        isDaylight
                          ? "bg-[#ebdcb9]/40 border-amber-900/20 text-neutral-900 font-typewriter"
                          : "bg-[#0a0a0b] border-white/5 text-slate-300 font-sans"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isDaylight ? "bg-red-800" : "bg-red-600"}`} />
                      {figure}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generador de Prompts de Arte IA panel */}
              <div className={`p-3 rounded-xl relative overflow-hidden group border ${
                isDaylight
                  ? "bg-red-800/5 border-red-800/20 text-neutral-800"
                  : "bg-red-950/10 border-red-950/40"
              }`}>
                <div className="flex items-center justify-between pointer-events-none relative z-10">
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-3.5 h-3.5 animate-pulse ${isDaylight ? "text-red-800" : "text-red-500"}`} />
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${
                      isDaylight ? "text-amber-900/60 font-typewriter" : "text-slate-400 font-mono"
                    }`}>Arte Táctico IA Prompt</span>
                  </div>
                  <button
                    onClick={() => {
                      const promptText = getAIPromptForEvent(selectedEvent);
                      navigator.clipboard.writeText(promptText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`pointer-events-auto px-2.5 py-1 text-[9.5px] rounded-md border transition-all flex items-center gap-1 cursor-pointer ${
                      isDaylight
                        ? "bg-[#e6dcc4] hover:bg-[#ebdcb9] text-amber-950 border-amber-900/20 hover:border-red-800 font-typewriter"
                        : "bg-[#09090b] hover:bg-black text-slate-300 border-white/5 hover:border-red-500/50 font-mono"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>¡COPIADO!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPIAR</span>
                      </>
                    )}
                  </button>
                </div>
                <div className={`mt-2 text-xs p-2.5 rounded border select-all leading-normal relative z-10 transition-all max-h-24 overflow-y-auto ${
                  isDaylight
                    ? "bg-[#e6dcc4]/50 border-amber-900/15 text-neutral-800 font-typewriter hover:border-red-800/30"
                    : "bg-black/40 border-white/5 text-slate-300 font-mono hover:border-red-500/20"
                }`}>
                  {getAIPromptForEvent(selectedEvent)}
                </div>
              </div>

            </div>

          </div>

          {/* Media Player below Info Card */}
          <AudioPlayer
            song={selectedEvent.song}
            album={selectedEvent.album}
            autoPlay={isTourPlaying}
            theme={theme}
          />

        </section>

      </main>

    </div>
  );
}
