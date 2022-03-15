interface Overview {
  total: number
  owned: number
}

export interface RarityOverview {
  n: Overview
  r: Overview
  sr: Overview
  srp: Overview
  ssr: Overview
}

export const getOverviewCard = async (
  cardId: string
): Promise<RarityOverview> => {
  const def = {
    total: 0,
    owned: 0,
  }

  return {
    n: def,
    r: def,
    sr: def,
    srp: def,
    ssr: def,
  }
}
