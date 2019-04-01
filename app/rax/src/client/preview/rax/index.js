/* eslint-disable import/no-extraneous-dependencies */
import { render, createElement } from 'rax';
import { document } from 'global';
import addons from '@storybook/addons';
import { ClientApi, ConfigApi } from '@storybook/client-api';
import createChannel from '@storybook/channel-postmessage';
import Channel from '@storybook/channels';
import { toId } from '@storybook/router/utils';
import deprecate from 'util-deprecate';
import Events from '@storybook/core-events';
import PreviewApp from './components/Preview';
import StoryStore from '../../../client_api/story_store';

const rootElement = document ? document.getElementById('root') : null;
const isBrowser = typeof window !== 'undefined';
const deprecatedToId = deprecate(
  toId,
  `Passing name+kind to the SET_CURRENT_STORY event is deprecated, use a storyId instead`
);

export const getContext = () => {
  let channel = null;

  try {
    channel = addons.getChannel();
  } catch (e) {
    if (isBrowser) {
      channel = createChannel({ page: 'preview' });
    } else {
      channel = new Channel();
    }
    addons.setChannel(channel);
  }

  const storyStore = new StoryStore({ channel });
  const clientApi = new ClientApi({ storyStore });
  const { clearDecorators } = clientApi;
  const configApi = new ConfigApi({ clearDecorators, storyStore, channel, clientApi });

  return {
    configApi,
    storyStore,
    channel,
    clientApi,
  };
};

function makeSetCurrentStory(storyStore) {
  return ({ storyId: inputStoryId, name, kind }) => {
    let storyId = inputStoryId;
    // For backwards compatibility
    if (!storyId) {
      if (!name || !kind) {
        throw new Error('You should pass `storyId` into SET_CURRENT_STORY');
      }
      storyId = deprecatedToId(kind, name);
    }

    const data = storyStore.fromId(storyId);

    storyStore.setSelection(data);
    storyStore.setPath(storyId);
  };
}

export default function start(renderContent) {
  const context = getContext();
  const { clientApi, configApi, channel, storyStore } = context;
  const setCurrentStory = makeSetCurrentStory(storyStore);
  channel.on(Events.SET_CURRENT_STORY, setCurrentStory);

  render(<PreviewApp context={context} {...context} renderContent={renderContent} />, rootElement);

  return { context, clientApi, configApi };
}
