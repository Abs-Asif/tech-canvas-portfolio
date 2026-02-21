export const censorText = (text: string) => {
  if (!text) return text;
  let censored = text;
  const mappings: Record<string, string> = {
    'Fuck': 'F*ck',
    'Fucks': 'f*cks',
    'Fucling': 'F*cking',
    'Fucked': 'F*cked',
    'Kill': 'k*ll',
    'Killing': 'k*lling',
    'Killer': 'k*ller',
    'Killed': 'k*lled',
    'Suicide': 'S*icide',
    'Gaza': 'G*za',
    'Murder': 'M*rder',
    'Murdered': 'M*rdered',
    'Murderer': 'M*rderer',
    'Israel': 'Isr*el',
    'Israeli': 'Isr*eli',
    'Rape': 'r*pe',
    'Rapist': 'R*pist',
    'Raped': 'R*ped',
  };

  // Sort by length descending to match longer words first
  const sortedUnsafe = Object.keys(mappings).sort((a, b) => b.length - a.length);

  sortedUnsafe.forEach((unsafe) => {
    const regex = new RegExp(unsafe, 'gi');
    censored = censored.replace(regex, mappings[unsafe]);
  });
  return censored;
};
