import { describe, it, expect } from 'vitest';
import { censorText } from '../lib/censor';

describe('censorText', () => {
  it('should replace Fuck with F*uck', () => {
    expect(censorText('That is a Fuck')).toBe('That is a F*uck');
  });

  it('should replace lowercase fuck with F*uck (per mapping)', () => {
    expect(censorText('fuck this')).toBe('F*uck this');
  });

  it('should handle Fucks correctly', () => {
    expect(censorText('Many Fucks')).toBe('Many f*ucks');
  });

  it('should handle Fucling correctly', () => {
    expect(censorText('Fucling behavior')).toBe('F*ucking behavior');
  });

  it('should handle Israel and Israeli correctly', () => {
    expect(censorText('Israel and Israeli')).toBe('Isr*ael and Isr*aeli');
  });

  it('should handle Murder, Murdered, Murderer', () => {
    expect(censorText('Murder, Murdered, Murderer')).toBe('Mu*rder, Mu*rdered, Mu*rderer');
  });

  it('should handle Kill, Killing, Killer, Killed', () => {
    expect(censorText('Kill Killing Killer Killed')).toBe('k*ill ki*lling ki*ller ki*lled');
  });

  it('should handle Suicide', () => {
    expect(censorText('Suicide is bad')).toBe('Su*icide is bad');
  });

  it('should handle Gaza', () => {
    expect(censorText('Gaza strip')).toBe('Ga*za strip');
  });

  it('should handle Rape, Rapist, Raped', () => {
    expect(censorText('Rape Rapist Raped')).toBe('ra*pe Ra*pist Ra*ped');
  });

  it('should return empty string for empty input', () => {
    expect(censorText('')).toBe('');
  });
});
