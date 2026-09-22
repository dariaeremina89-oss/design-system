/** Every semantic role uses the nearest nominal step satisfying all its contrast pairs. */
export function selectContrastStep(palette:Record<number,string>,preferred:number,pairs:readonly {color:string;minimum:number}[],contrast:(first:string,second:string)=>number,accept:(color:string)=>boolean=()=>true):number {
  const steps=Object.keys(palette).map(Number).sort((a,b)=>Math.abs(a-preferred)-Math.abs(b-preferred)||a-b);
  const step=steps.find(candidate=>accept(palette[candidate])&&pairs.every(pair=>contrast(palette[candidate],pair.color)>=pair.minimum));
  if(step===undefined) throw new Error('No palette step satisfies the contrast policy');
  return step;
}
export const PRIMARY_CONTRAST_POLICY={
  text:4.5,icon:3,disabled:3,
  onFill:900,onFillIcon:700,onSurface:500,onInverseSurface:500,disabledContent:600,
  inverseContent:{light:25,dark:900},
  inverseBackground:{light:[900,800,700],dark:[50,100,200]},
  secondaryBackground:{light:[25,50,100],dark:[900,800,700]},
} as const;
