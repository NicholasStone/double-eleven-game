namespace ObstacleSettings {
  export enum Modality {
    TowShort,
    ShortUp,
    ShortDown,
    TowLong
  }

  export const ObstacleWidth = 50

  export const ObstacleHeight = Object.freeze({
    Long: 150,
    Short: 100
  })
}

export default ObstacleSettings
