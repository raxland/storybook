/* eslint-disable-next-line no-unused-vars */
import { createElement, render } from 'rax';
import { document } from 'global';
import { stripIndents } from 'common-tags';

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showError,
  // forceRender,
}) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Rax element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Rax element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  // render(element, rootElement);
  return element;
}
