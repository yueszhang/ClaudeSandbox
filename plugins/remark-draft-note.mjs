import { visit } from 'unist-util-visit';

/** Recursively collect the text content of an mdast node. */
function textOf(node) {
  if (typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(textOf).join('');
}

/**
 * Turns any blockquote opening with "Draft note" into an <aside class="draft-note">.
 *
 * Draft notes mark places where a case study needs a detail only Joey can
 * supply. Rendering them as a loud callout — rather than a quiet comment —
 * means they cannot be shipped by accident. `npm run check:drafts` lists any
 * that remain.
 */
export function remarkDraftNote() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children?.[0];
      if (!first || first.type !== 'paragraph') return;
      if (!/^\s*Draft note\b/i.test(textOf(first))) return;

      node.data = {
        ...node.data,
        hName: 'aside',
        hProperties: { className: ['draft-note'], 'data-draft-note': 'true' },
      };
    });
  };
}
