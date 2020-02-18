import { HTML5Video, Log, Playback, Events } from "clappr";
import "whatwg-fetch";
import MSE from "@flussonic/flussonic-mse-player/dist/FlussonicMsePlayer.min";

const AUTO = -1;
let firstPlay = true;

export default class MSELD extends HTML5Video {
  get name() {
    return "mseld";
  }

  get levels() {
    return this._levels || [];
  }

  get currentLevel() {
    if (this._currentLevel === null || this._currentLevel === undefined)
      return AUTO;
    else return this._currentLevel; //0 is a valid level ID
  }

  set currentLevel(id) {
    this._currentLevel = id;
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_START);
    this.setTracks(id);
  }

  static get MSELD() {
    return MSELD;
  }

  constructor(...args) {
    super(...args);
    this.options.playback || (this.options.playback = this.options);

    this._startTimeUpdateTimer();
  }

  // hls like
  // каждые 100мс проверяет обновился ли видео тег
  _startTimeUpdateTimer() {
    this._timeUpdateTimer = setInterval(() => {
      this._onTimeUpdate();
    }, 100);
  }

  // hls like
  // проверяет время у плеера обновилось, если нет то ничего не делает
  // если да то Events.PLAYBACK_TIMEUPDATE
  // TODO: проверить нужно ли смотреть обновления общей длинны
  // как она меняется в видео теге
  _onTimeUpdate() {
    let update = { current: this.getCurrentTime(), total: this.getDuration() };
    let isSame =
      this._lastTimeUpdate && update.current === this._lastTimeUpdate.current;

    if (isSame) {
      return;
    }

    // hls wf?
    this._lastTimeUpdate = update;
    this.trigger(Events.PLAYBACK_TIMEUPDATE, update, this.name);
  }
  // показываем какие контролы есть
  _updateSettings() {
    this.settings.left = ["playstop"];
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE);
  }

  _onDurationChange() {
    let duration = this.getDuration();
    console.log("onDurationChange", duration, this._lastDuration);
    if (this._lastDuration === duration) {
      return;
    }
    this._lastDuration = duration;
    super._onDurationChange();
  }

  _stopTimeUpdateTimer() {
    clearInterval(this._timeUpdateTimer);
  }

  getPlaybackType() {
    return Playback.LIVE;
  }

  destroy() {
    if (this.MSE) {
      this.MSE.stop();
      this.MSE = void 0;
    }
    this._stopTimeUpdateTimer();
    super.destroy();
  }

  // ???
  resolveRedirect(src) {
    return fetch(src, { method: "OPTIONS" })
      .catch(e => src)
      .then(r => {
        return r.headers && r.headers.get("location")
          ? r.headers.get("location")
          : src;
      });
  }

  getStartTimeOffset() {
    return this.getCurrentTime();
  }

  play() {
    if (this._waitStatus) {
      return;
    }
    if (this.MSE) {
      return;
    }
    const givenUrl = this.options.src;
    this.resolveRedirect(givenUrl).then(url => {
      const wsURL = MSE.replaceHttpByWS(url);
      const newAutostart = this.options.autoplay && !this.options.mute;
      if (newAutostart) {
        this.el.autoplay = true;
        this.el.muted = false;
        this.el.volume = 1;
      }
      let onAutoplay = autoplayFunction => {
        this.autoplayFunction = autoplayFunction;
        if (firstPlay == false) {
          autoplayFunction();
        }
        firstPlay = false;
      };
      onAutoplay = onAutoplay.bind(this);
      this.MSE = new MSE(this.el, wsURL, {
        debug: this.options.debug,
        connectionRetries: 0,
        onError: err => {
          console.log("• ERRROR", err);
        },
        onAutoplay: onAutoplay,
        onMediaInfo: mediaInfo => {
          const { onMediaInfo } = this.options;
          // this.audio = undefined;
          if (onMediaInfo && typeof onMediaInfo === "function") {
            const streams = mediaInfo.streams || mediaInfo.tracks;
            if (streams && streams.length > 0) {
              this._levels = streams
                .filter(el => {
                  if (el.content && el.content === "audio") {
                    this.audio = el;
                  }
                  if (el.content && el.content === "video") {
                    return true;
                  }
                  return false;
                })
                .map((level, index) => {
                  return {
                    id: index,
                    level: level.size,
                    label: `${level.bitrate}Kbps`,
                    bitrate: level.bitrate,
                    track_id: level.track_id
                  };
                });
              this.trigger(Events.PLAYBACK_LEVELS_AVAILABLE, this._levels);
            }
            onMediaInfo(mediaInfo);
          }
        }
      });

      const playPromise = this.MSE.play();
      // TODO: this.MSE.play() can terminate without promise, it suck!!!
      if (playPromise) {
        playPromise.then(() => {
          this.trigger(Events.PLAYBACK_PLAY_INTENT);
          this._stopped = false;
        });
      }
    });
  }

  setTracks(id) {
    const realID = id === AUTO ? 0 : id;
    if (this.MSE) {
      let audioTrack;
      // if (this.audio.length > 0) {
      //   if (this.audio.length > 1) {
      //     var lowest = Number.POSITIVE_INFINITY;
      //     var highest = Number.NEGATIVE_INFINITY;
      //     var tmp;
      //     let lowestID, highestID;
      //     for (var i = this.audio.length - 1; i >= 0; i--) {
      //       tmp = this.audio[i].bitrate;
      //       if (tmp < lowest) {
      //         lowest = tmp;
      //         lowestID = this.audio[i].track_id;
      //       };
      //       if (tmp > highest) {
      //         highest = tmp;
      //         highestID = this.audio[i].track_id;
      //       }
      //     }

      //     if (this._levels[realID].bitrate >= 2500) {
      //       audioTrack = highestID;
      //     } else if (this._levels[realID].bitrate > 1000) {
      //       if (this.audio.length > 2) {
      //         this.audio.forEach(el => {
      //           if (el.track_id !== highestID && el.track_id !== lowestID) {
      //             audioTrack = el.track_id;
      //           }
      //         });
      //       } else {
      //         audioTrack = highestID;
      //       }
      //     } else {
      //       audioTrack = lowestID;
      //     }
      //   } else {
      //     audioTrack = this.audio[0].track_id;
      //   }
      // }
      if (this.audio && this.audio.track_id) {
        audioTrack = this.audio.track_id;
      }

      const selectedTracks = [];

      if (this._levels[realID]) {
        selectedTracks.push(this._levels[realID].track_id);
      }

      if (audioTrack !== undefined) {
        selectedTracks.push(audioTrack);
      }

      if (selectedTracks.length > 0) {
        this.MSE.setTracks(selectedTracks);
      }
    }
    this.trigger(Events.PLAYBACK_LEVEL_SWITCH_END);

    // return ([this._levels[realID].track_id, audioTrack]);
  }

  setWaitStatus(status) {
    this._waitStatus = status;
  }

  stop(status) {
    if (!this.MSE) {
      return;
    }
    this.MSE.stop().then(() => {
      super.stop();
      this.MSE = void 0;
    });
  }
}

MSELD.isSupported = function() {
  return MSE.isSupported();
};

MSELD.canPlay = function(resource, mimeType) {
  const streamType =
    resource.indexOf("mse_ld") != -1 ||
    mimeType == "application/x-flussonic-mse";
  return streamType && MSELD.isSupported();
};

MSELD.waitingAutoplay = function() {
  if (MSE.autoplayFunction) {
    console.log(MSE.autoplayFunction);
    return MSE.autoplayFunction;
  }
};
