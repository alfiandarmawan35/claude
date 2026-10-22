import React from 'react';
import {Composition} from 'remotion';
import {FPS, W, H} from './theme';
import {Intro, introFrames} from './Intro';
import {EpisodeVideo} from './Episode';
import {EPISODES, episodeFrames} from './data/episodes';
import {Showreel} from './showreel/Showreel';
import {SR_FPS, SR_FRAMES} from './showreel/beats';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Showreel" component={Showreel} durationInFrames={SR_FRAMES} fps={SR_FPS} width={W} height={H} />
    <Composition id="Perkenalan" component={Intro} durationInFrames={introFrames(FPS)} fps={FPS} width={W} height={H} />
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
