namespace PlayerProperty {
  export enum State {
    Dead,
    Alive,
    Immortal,
  }

  export enum Buff {
    NONE,
    IMMORTAL,
    MORE_UPPER_VELOCITY,
    LESS_UPPER_VELOCITY,
    MOER_GRAVITY,
    LESS_GRAVITY
  }

  export enum Events {
    Dead = 'dead'
  }
}

export default PlayerProperty
