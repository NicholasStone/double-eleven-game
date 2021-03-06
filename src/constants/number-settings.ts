namespace NumberSettings {
  /**
   * 画布大小
   */
  export const Width = 1024
  export const Height = 576

  /**
   * 摄像机偏移量
   */
  export const CameraOffsetX = 0

  /**
   * 上下边界高度
   */
  export const BorderHeight = 40

  /**
   * 重力
   * 横向重力用于横向加速
   */
  export const GravityY = 1200
  export const GravityX = 1

  /**
   * 每跳一次增加的速度
   * (由于纵坐标是从左上角到左下角的，所以此值应为负值)
   */
  export const GoUpVelocity = Height * -0.5

  /**
   * 初始横向速度
   */

  export const InitialXVelocity = 300

  /**
   * 障碍物设置
   * @ObstacleInterval {number} 障碍物间隔
   * @LootBoxInterval {number} 宝箱间隔（每n个障碍物）
   */
  export const TubeHeight = 600
  export const TubeWidth = 50
  export const ObstacleInterval = 220
  export const LootBoxInterval = 5
  export const DistanceBetweenObstacleAndLootBox = Width * 0.7
  export const UpperLootBoxPosition = Height * 0.15
  export const MiddleLootBoxPosition = Height * 0.5
  export const LowerLootBoxPosition = Height * 0.85
  export const ImmortalDuration = 10000

  /**
   * effects 数值设定
   */
  export const LessGravityDiff = GravityY * -0.3
  export const MoreGravityDiff = GravityY * 0.3
  export const LessUpperVelocity = Height * 0.2
  export const MoreUpperVelocity = Height * -0.2
  export const TubeSpaceBetween = Height * 0.7
}

export default NumberSettings
