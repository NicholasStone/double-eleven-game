namespace NumberSettings {
  /**
   * 画布大小
   */
  export const Width = 1024
  export const Height = 576

  /**
   * 摄像机偏移量
   */
  export const CameraOffsetX = Width * -0.4

  /**
   * 上下边界高度
   */
  export const BorderHeight = 30

  /**
   * 重力
   * 横向重力用于横向加速
   */
  export const GravityY = 1200
  export const GravityX = 1

  /**
   * 每跳一次增加的速度
   */
  export const GoUpVelocity = Height * -0.8

  /**
   * 障碍物设置
   * @ObstacleInterval {number} 障碍物间隔
   * @LootBoxInterval {number} 宝箱间隔（每n个障碍物）
   */
  export const ObstacleInterval = 160
  export const LootBoxInterval = 1
  export const DistanceBetweenObstacleAndLootBox = Width * 0.7
  export const UpperLootBoxPosition = Height * 0.25
  export const LowerLootBoxPosition = Height * 0.65

  /**
   * buff 数值设定
   */
  export const LessGravityDiff = 1
  export const MoreGravityDiff = 1
  export const LessUpperVelocity = GravityY * -0.1
  export const MoreUpperVelocity = GravityY * 0.1
}

export default NumberSettings