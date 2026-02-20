import { describe, it, expect } from 'vitest';
import { censorText } from '../pages/BanglaGuardian';

describe('censorText', () => {
  it('should replace Fuck with F*ck', () => {
    expect(censorText('That is a Fuck')).toBe('That is a F*ck');
  });

  it('should replace lowercase fuck with F*ck (per mapping)', () => {
    expect(censorText('fuck this')).toBe('F*ck this');
  });

  it('should handle Fucks correctly', () => {
    expect(censorText('Many Fucks')).toBe('Many f*cks');
  });

  it('should handle Fucling correctly', () => {
    expect(censorText('Fucling behavior')).toBe('F*cking behavior');
  });

  it('should handle Israel and Israeli correctly', () => {
    expect(censorText('Israel and Israeli')).toBe('Isr*el and Isr*eli');
  });

  it('should handle Murder, Murdered, Murderer', () => {
    expect(censorText('Murder, Murdered, Murderer')).toBe('M*rder, M*rdered, M*rderer');
  });

  it('should handle Kill, Killing, Killer, Killed', () => {
    expect(censorText('Kill Killing Killer Killed')).toBe('k*ll k*lling k*ller k*lled');
  });

  it('should handle Suicide', () => {
    expect(censorText('Suicide is bad')).toBe('S*icide is bad');
  });

  it('should handle Gaza', () => {
    expect(censorText('Gaza strip')).toBe('G*za strip');
  });

  it('should handle Rape, Rapist, Raped', () => {
    expect(censorText('Rape Rapist Raped')).toBe('r*pe R*pist R*ped');
  });

  it('should return empty string for empty input', () => {
    expect(censorText('')).toBe('');
  });
});
