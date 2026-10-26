import React from 'react';
import {Composition} from 'remotion';
import {FPS, W, H} from './theme';
import {Intro, introFrames} from './Intro';
import {EpisodeVideo} from './Episode';
import {EPISODES, episodeFrames} from './data/episodes';
import {Showreel} from './showreel/Showreel';
import {SkitVideo, skitTimeline, SKIT_FPS} from './skit/Skit';
import {SKITS} from './skit/data';
import {Countdown} from './countdown/Countdown';
import {Arus} from './arus/Arus';
import {CountdownArus, CDA_FPS, CDA_FRAMES} from './arus/CountdownArus';
import {AR_FPS, AR_FRAMES} from './arus/beats';
import {CD_FPS, CD_FRAMES} from './countdown/timing';
import {SR_FPS, SR_FRAMES} from './showreel/beats';

export const RemotionRoot: React.FC = () => (
  <>
    {SKITS.map((s) => (
      <Composition key={s.id} id={s.id} component={SkitVideo} defaultProps={{id: s.id}} durationInFrames={skitTimeline(s).total} fps={SKIT_FPS} width={1080} height={1920} />
    ))}
    <Composition id="Countdown" component={Countdown} defaultProps={{tanggal: ''}} durationInFrames={CD_FRAMES} fps={CD_FPS} width={1920} height={1080} />
    <Composition id="Countdown-Vertikal" component={Countdown} defaultProps={{tanggal: ''}} durationInFrames={CD_FRAMES} fps={CD_FPS} width={1080} height={1920} />
    <Composition id="Countdown-Arus" component={CountdownArus} durationInFrames={CDA_FRAMES} fps={CDA_FPS} width={1920} height={1080} />
    <Composition id="Arus" component={Arus} durationInFrames={AR_FRAMES} fps={AR_FPS} width={1920} height={1080} />
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
