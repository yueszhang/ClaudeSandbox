import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDeck, joinDeck, viewFor, setVote, addIdea, setDone, deleteIdea } from '../lib/deck.js';
import { normalizeCode, formatCode } from '../lib/ids.js';

test('a new deck starts with the seeded ideas and one member', async () => {
  const { code, memberId } = await createDeck('Joey');
  const view = await viewFor(code, memberId);
  assert.equal(view.ideas.length, 32);
  assert.equal(view.ideas.filter((i) => i.done).length, 11);
  assert.equal(view.partner, null);
  assert.equal(view.you.name, 'Joey');
});

test('a partner joins, and a shared yes becomes a match', async () => {
  const a = await createDeck('Joey');
  const b = await joinDeck(a.code, 'Sam');

  await setVote(a.code, a.memberId, 'coney-island', 'yes');
  let viewA = await viewFor(a.code, a.memberId);
  assert.deepEqual(viewA.picks, ['coney-island'], 'unmatched yes sits in picks');
  assert.deepEqual(viewA.matches, []);

  await setVote(a.code, b.memberId, 'coney-island', 'yes');
  viewA = await viewFor(a.code, a.memberId);
  assert.deepEqual(viewA.matches, ['coney-island']);
  assert.deepEqual(viewA.picks, []);
  assert.equal(viewA.partner.name, 'Sam');
});

test('a partner vote never leaks before you have voted yourself', async () => {
  const a = await createDeck('Joey');
  const b = await joinDeck(a.code, 'Sam');
  await setVote(a.code, b.memberId, 'whitney', 'yes');
  await setVote(a.code, b.memberId, 'trivia', 'no');

  const view = await viewFor(a.code, a.memberId);
  const wire = JSON.stringify(view);
  assert.equal(view.votes.whitney, undefined, 'no vote of theirs on a card I have not decided');
  assert.equal(Object.keys(view.votes).length, 0);
  assert.ok(!wire.includes(b.memberId), 'their member id never crosses the wire');
});

test('a yes they said no to is indistinguishable from one they have not seen', async () => {
  const a = await createDeck('Joey');
  const b = await joinDeck(a.code, 'Sam');
  await setVote(a.code, a.memberId, 'whitney', 'yes');   // they never vote
  await setVote(a.code, a.memberId, 'spa', 'yes');
  await setVote(a.code, b.memberId, 'spa', 'no');        // they said no

  const view = await viewFor(a.code, a.memberId);
  assert.ok(view.picks.includes('whitney'));
  assert.equal(view.picks.includes('spa'), false, 'done ideas stay out of picks');
});

test('a third person cannot join, and a stranger cannot read', async () => {
  const a = await createDeck('Joey');
  await joinDeck(a.code, 'Sam');
  await assert.rejects(() => joinDeck(a.code, 'Someone'), /two people/);
  await assert.rejects(() => viewFor(a.code, 'f'.repeat(32)), /not yours/);
  await assert.rejects(() => viewFor('AAAAAAAA', a.memberId), /No deck/);
});

test('rejoining with a known key does not consume the second seat', async () => {
  const a = await createDeck('Joey');
  const again = await joinDeck(a.code, 'Joey', a.memberId);
  assert.equal(again.memberId, a.memberId);
  const b = await joinDeck(a.code, 'Sam');
  assert.notEqual(b.memberId, a.memberId);
});

test('ideas can be added, marked done, and only your own deleted', async () => {
  const a = await createDeck('Joey');
  const idea = await addIdea(a.code, a.memberId, {
    title: 'Sunset at Domino Park', weather: 'warm', hood: 'Williamsburg', when: 'night', cost: 1
  });
  assert.equal(idea.cost, 1);
  assert.equal(idea.addedBy, a.memberId);

  await setDone(a.code, a.memberId, idea.id, { at: Date.parse('2026-08-01'), note: 'windy' });
  let view = await viewFor(a.code, a.memberId);
  assert.equal(view.ideas.find((i) => i.id === idea.id).done.note, 'windy');

  await assert.rejects(() => deleteIdea(a.code, a.memberId, 'coney-island'), /starting deck/);
  await deleteIdea(a.code, a.memberId, idea.id);
  view = await viewFor(a.code, a.memberId);
  assert.equal(view.ideas.find((i) => i.id === idea.id), undefined);
});

test('a javascript: link is rejected, a bare domain is repaired', async () => {
  const a = await createDeck('Joey');
  const bad = await addIdea(a.code, a.memberId, { title: 'Bad', url: 'javascript:alert(1)' });
  assert.equal(bad.url, null);
  const good = await addIdea(a.code, a.memberId, { title: 'Good', url: 'maps.app.goo.gl/xyz' });
  assert.equal(good.url, 'https://maps.app.goo.gl/xyz');
});

test('codes normalize the way people type them', () => {
  assert.equal(normalizeCode('xkmr-4t2p'), 'XKMR4T2P');
  assert.equal(normalizeCode('XKMR 4T2P'), 'XKMR4T2P');
  assert.equal(normalizeCode('XKMR4T2'), null);
  assert.equal(normalizeCode('XKMR4T2O'), null, 'letters not in the alphabet are a typo, not a guess');
  assert.equal(formatCode('XKMR4T2P'), 'XKMR-4T2P');
});
