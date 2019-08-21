import { getArgsFromParent } from './../../src/shared/directives';

describe('shared directives', () => {
  it('getArgsFromParent: parentField is normal string path', () => {
    const parent = { id: 1 };
    const parentAccessorMap = '{ id: userId }';
    const resultArgs = { userId: 1 };

    expect(getArgsFromParent(parent, parentAccessorMap)).toEqual(resultArgs);
  });

  it('getArgsFromParent: set multiple mappings', () => {
    const parent = { id: 1, name: 'jack' };
    // mappings separate with semicolon
    const parentAccessorMap = '{ id: userId; name: userName }';
    const resultArgs = { userId: 1, userName: 'jack' };

    expect(getArgsFromParent(parent, parentAccessorMap)).toEqual(resultArgs);
  });

  it('getArgsFromParent: has empty mappings', () => {
    const parent = { id: 1 };
    const parentAccessorMap = '{ id: userId;;; }';
    const resultArgs = { userId: 1 };

    expect(getArgsFromParent(parent, parentAccessorMap)).toEqual(resultArgs);
  });

  it('getArgsFromParent: parentField is array path', () => {
    const parent = { id: 1, detail: { height: { 'lower.part': 100 } } };
    const parentAccessorMap = "{ id: userId; ['detail', 'height', 'lower.part']: lowerHeight }";
    const resultArgs = { userId: 1, lowerHeight: 100 };

    expect(getArgsFromParent(parent, parentAccessorMap)).toEqual(resultArgs);
  });

  it('getArgsFromParent: resultField is array path', () => {
    const parent = { lowerHeight: 100 };
    const parentAccessorMap = "{ id: userId; lowerHeight: ['detail', 'height', 'lower.part'] }";
    const resultArgs = { detail: { height: { 'lower.part': 100 } } };

    expect(getArgsFromParent(parent, parentAccessorMap)).toEqual(resultArgs);
  });
});
