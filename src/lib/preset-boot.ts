/** localStorage key for the demo color preset chosen in the style switcher. */
export const PRESET_KEY = "nordhaus:demo-preset";

/**
 * Inline script for <head> (demo only): applies a previewed preset before the
 * first paint, so the page doesn't flash the default colors.
 */
export const presetBootScript = `try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(PRESET_KEY)}));if(p)document.documentElement.dataset.preset=p}catch(e){}`;
