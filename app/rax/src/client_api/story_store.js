/* eslint-disable import/no-extraneous-dependencies */
import { StoryStore } from '@storybook/client-api';
import qs from 'qs';

class WeexStoryStore extends StoryStore {
  getIdOnPath = () => {
    const { id } = qs.parse(global.location.search, { ignoreQueryPrefix: true });
    console.log(id);
    return id;
  };
}

export default WeexStoryStore;
