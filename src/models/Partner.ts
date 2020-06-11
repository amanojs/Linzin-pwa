export interface Partner {
  email: string
  pass: string
  idcard: string
  created_at: Date
}

export interface PartnerIn {
  email: string
  pass: string
  card_url: string
}
