import test from 'node:test';
import assert from 'node:assert/strict';
import {clearEdgeBackground} from '../asset-renderer.js';
function picture(rows){return new Uint8ClampedArray(rows.flat(2));}
const white=[253,254,255,255],ink=[30,80,130,255];
test('edge-connected white becomes transparent without erasing enclosed white',()=>{
 const pixels=picture([[white,white,white,white,white],[white,ink,ink,ink,white],[white,ink,white,ink,white],[white,ink,ink,ink,white],[white,white,white,white,white]]);
 clearEdgeBackground(pixels,5,5);
 assert.equal(pixels[3],0);
 assert.equal(pixels[(2*5+2)*4+3],255);
 assert.deepEqual([...pixels.slice((1*5+1)*4,(1*5+1)*4+4)],ink);
});
test('coloured artwork touching the edge remains opaque',()=>{
 const pixels=picture([[ink,white],[ink,white]]);
 clearEdgeBackground(pixels,2,2);
 assert.equal(pixels[3],255);
 assert.equal(pixels[7],0);
 assert.equal(pixels[11],255);
});
test('transparent background can be traversed without changing coloured pixels',()=>{
 const pixels=picture([[[0,0,0,0],white],[[0,0,0,0],ink]]);
 clearEdgeBackground(pixels,2,2);
 assert.equal(pixels[7],0);
 assert.deepEqual([...pixels.slice(12,16)],ink);
});
