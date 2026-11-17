export type ChannelPartner = {
  id: string
  name: string
  enabled: boolean
}

export type ChannelService = {
  id: string
  name: string
  description: string
  partners: ChannelPartner[]
}
