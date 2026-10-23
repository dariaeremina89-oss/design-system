import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Scrollbar } from './Scrollbar';

function Demo() {
  const viewportRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={viewportRef} data-testid="viewport" />
      <Scrollbar viewportRef={viewportRef} />
    </div>
  );
}

function setGeometry({ clientHeight, scrollHeight, trackHeight }: { clientHeight:number; scrollHeight:number; trackHeight:number }) {
  const viewport=screen.getByTestId('viewport');
  const track=screen.getByTestId('scrollbar');
  Object.defineProperties(viewport,{
    clientHeight:{configurable:true,value:clientHeight},
    scrollHeight:{configurable:true,value:scrollHeight},
  });
  Object.defineProperty(track,'clientHeight',{configurable:true,value:trackHeight});
}

describe('Scrollbar',()=>{
  it('appears only for overflow and maps native scrollTop to Thumb position',()=>{
    render(<Demo/>);
    setGeometry({clientHeight:100,scrollHeight:300,trackHeight:100});
    act(()=>window.dispatchEvent(new Event('resize')));
    const track=screen.getByTestId('scrollbar'),thumb=track.querySelector('.fdoc-scrollbar__thumb') as HTMLElement;
    expect(track).toHaveAttribute('data-visible','true');
    expect(thumb.style.height).toBe('32px');

    const viewport=screen.getByTestId('viewport');
    Object.defineProperty(viewport,'scrollTop',{configurable:true,writable:true,value:100});
    act(()=>viewport.dispatchEvent(new Event('scroll')));
    expect(thumb.style.transform).toBe('translateY(30px)');
  });

  it('stays inactive when the viewport does not overflow',()=>{
    render(<Demo/>);
    setGeometry({clientHeight:100,scrollHeight:100,trackHeight:100});
    act(()=>window.dispatchEvent(new Event('resize')));
    expect(screen.getByTestId('scrollbar')).not.toHaveAttribute('data-visible');
  });
});
