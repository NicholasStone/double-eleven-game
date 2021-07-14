namespace NumberSettings {
  /**
   * 画布大小
   */
  export const Width = 1000
  export const Height = 560

  /**
   * 摄像机偏移量
   */
  export const CameraOffsetX = Width * -0.2

  /**
   * 上下边界高度
   */
  export const BorderHeight = 30

  /**
   * 重力
   * 横向重力用于横向加速
   */
  export const GravityY = Height * 2
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
  export const LootBoxInterval = 20
}

export default NumberSettings
