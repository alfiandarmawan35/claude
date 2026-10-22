import React from 'react';
import {Composition} from 'remotion';
import {FPS, W, H} from './theme';
import {Intro, INTRO_FRAMES} from './Intro';
import {EpisodeVideo} from './Episode';
import {EPISODES, episodeFrames} from './data/episodes';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Perkenalan" component={Intro} durationInFrames={INTRO_FRAMES} fps={FPS} width={W} height={H} />
    {EPISODES.map((e) => (
      <Composition
        key={e.id}
        id={e.id}
        component={EpisodeVideo}
        defaultProps={{id: e.id}}
        durationInFrames={episodeFrames(e, FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
