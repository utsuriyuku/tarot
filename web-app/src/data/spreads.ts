export type SpreadSlot = {
  id: string;
  label: string;
  hint: string;
  position: [number, number, number];
  rotationZ: number;
  scale: number;
};

export type SpreadPreset = {
  id: string;
  name: string;
  summary: string;
  slots: SpreadSlot[];
};

export const SPREAD_PRESETS: SpreadPreset[] = [
  {
    id: 'single',
    name: '单牌切片',
    summary: '只看本轮问题里最强烈的那一道牵引。',
    slots: [
      {
        id: 'core',
        label: '核心切片',
        hint: '这一张代表此刻最主要、最直接的信号。',
        position: [0, 0, 0],
        rotationZ: 0,
        scale: 1,
      },
    ],
  },
  {
    id: 'triad',
    name: '三相展开',
    summary: '将问题拆成外显、暗流与趋向三段。',
    slots: [
      {
        id: 'surface',
        label: '外显层',
        hint: '你已经能直接感知到的现象层。',
        position: [-2.8, 0.02, -0.1],
        rotationZ: -0.12,
        scale: 0.92,
      },
      {
        id: 'current',
        label: '暗流层',
        hint: '在表面之下真正推着事态移动的东西。',
        position: [0, 0.26, 0.18],
        rotationZ: 0,
        scale: 1,
      },
      {
        id: 'vector',
        label: '趋向层',
        hint: '如果保持当前状态，最容易坍缩出的下一步。',
        position: [2.8, 0.02, -0.1],
        rotationZ: 0.12,
        scale: 0.92,
      },
    ],
  },
  {
    id: 'fivefold',
    name: '五镜牌阵',
    summary: '把问题放进五个镜面里观察，得到更宽的横截面。',
    slots: [
      {
        id: 'threshold',
        label: '门槛',
        hint: '你进入这件事时最先撞上的阻力。',
        position: [-4.4, 0.24, -0.45],
        rotationZ: -0.18,
        scale: 0.8,
      },
      {
        id: 'pressure',
        label: '压力',
        hint: '正在把你推离原位的那股力。',
        position: [-2.15, -0.38, -0.1],
        rotationZ: -0.08,
        scale: 0.86,
      },
      {
        id: 'axis',
        label: '轴心',
        hint: '整组牌真正围绕着旋转的核心。',
        position: [0, 0.5, 0.24],
        rotationZ: 0,
        scale: 0.96,
      },
      {
        id: 'blindspot',
        label: '盲区',
        hint: '你目前最容易忽略的一块。',
        position: [2.15, -0.38, -0.1],
        rotationZ: 0.08,
        scale: 0.86,
      },
      {
        id: 'outcome',
        label: '落点',
        hint: '若维持当前轨迹，最可能出现的着陆面。',
        position: [4.4, 0.24, -0.45],
        rotationZ: 0.18,
        scale: 0.8,
      },
    ],
  },
];

export const DEFAULT_SPREAD_ID = SPREAD_PRESETS[0].id;

export function getSpreadById(id: string) {
  return SPREAD_PRESETS.find((spread) => spread.id === id) ?? SPREAD_PRESETS[0];
}